/* ==========================================================================
   CLOUDFLARE PAGES FUNCTION  ->  POST /api/contact
   --------------------------------------------------------------------------
   The contact form posts here (never straight to Google). This function:
     1. Only accepts requests that come from your own website.
     2. Only accepts JSON, and rejects oversized or malformed submissions.
     3. Quietly drops bots that fill the hidden "website" field.
     4. Checks the Cloudflare Turnstile token with Cloudflare (server side).
     5. Cleans and length-limits every field (only known fields are kept).
     6. Forwards the clean data to your private Google Apps Script, which
        writes it into your Google Sheet.
   Every response carries security headers (the _headers file does not apply
   to Functions, so they are set here).

   Secrets (set in Cloudflare: Pages project > Settings > Variables and
   Secrets, click "Encrypt"). They never appear in the website code:
     TURNSTILE_SECRET   Turnstile widget secret key
     APPS_SCRIPT_URL    the Apps Script web app URL (ends in /exec)
     SHEET_TOKEN        long random password shared with the Apps Script
   ========================================================================== */

// Only these websites may submit the form.
const ALLOWED_ORIGINS = [
  'https://mnkrm.com',
  'https://www.mnkrm.com',
];

// Must match the <option> values in contact/index.html.
const SERVICES = [
  'Event Media',
  'Social Content',
  'Corporate Media',
  'Commercial Production',
  'Drone & Aerial',
];

const MAX_BODY_BYTES = 8000;

const SECURITY_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'Cross-Origin-Resource-Policy': 'same-origin',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: SECURITY_HEADERS });

// Strip control characters (blocks header / line-break injection), trim, limit length.
const clean = (value, max) =>
  String(value ?? '').replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, ' ').trim().slice(0, max);

export async function onRequestPost({ request, env }) {
  // Fail closed if the server is not fully configured.
  if (!env.TURNSTILE_SECRET || !env.APPS_SCRIPT_URL || !env.SHEET_TOKEN) {
    return json({ ok: false, error: 'server' }, 500);
  }

  /* 1. Must come from our own website */
  const origin = request.headers.get('Origin');
  if (!ALLOWED_ORIGINS.includes(origin)) return json({ ok: false, error: 'forbidden' }, 403);

  /* 2. JSON only, with size limits */
  const type = request.headers.get('Content-Type') || '';
  if (!type.toLowerCase().startsWith('application/json')) {
    return json({ ok: false, error: 'bad_request' }, 415);
  }

  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > MAX_BODY_BYTES) return json({ ok: false, error: 'too_large' }, 413);

  let body;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, error: 'too_large' }, 413);
    body = JSON.parse(text);
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  /* 3. Honeypot: real visitors never see or fill this field */
  if (body.website) return json({ ok: true });          // pretend success, store nothing

  /* 4. Validate and clean the fields (anything not listed here is ignored) */
  const entry = {
    name:    clean(body.name, 100),
    email:   clean(body.email, 150),
    phone:   clean(body.phone, 40),
    service: clean(body.service, 60),
    message: clean(body.message, 2000),
  };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(entry.email);
  if (!entry.name || !emailOk || !entry.message || !SERVICES.includes(entry.service)) {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  /* 5. Turnstile: proves a human completed the challenge (checked by Cloudflare) */
  const token = clean(body.token, 2048);
  if (!token) return json({ ok: false, error: 'captcha' }, 400);

  let verdict;
  try {
    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP') || '',
      }),
      signal: AbortSignal.timeout(5000),
    });
    verdict = await check.json();
  } catch {
    return json({ ok: false, error: 'captcha' }, 502);   // fail closed
  }
  if (verdict.success !== true) return json({ ok: false, error: 'captcha' }, 400);

  /* 6. Hand the clean data to the private Google Apps Script */
  try {
    const res = await fetch(env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ token: env.SHEET_TOKEN, ...entry }),
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });
    const result = await res.json();
    if (result.ok !== true) throw new Error('sheet rejected');
  } catch {
    return json({ ok: false, error: 'server' }, 502);
  }

  return json({ ok: true });
}

// Anything other than POST is refused.
export const onRequest = () => json({ ok: false, error: 'method' }, 405);
