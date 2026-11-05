/* ==========================================================================
   CONTACT PAGE - sends the brief to /api/contact (see functions/api/contact.js)
   The form never talks to Google directly. The server checks it first.
   Messages are shown with textContent, so nothing is ever parsed as HTML.
   ========================================================================== */
const form    = document.getElementById('brief');
const status  = document.getElementById('formStatus');
const sendBtn = document.getElementById('sendBtn');

const messages = {
  ok:      'Thank you. Your brief has been sent and we will be in touch soon.',
  captcha: 'Please complete the security check and try again.',
  invalid: 'Please check your details and try again.',
  server:  'Something went wrong on our side. Please email hello@monokrome.com instead.',
  network: 'Could not connect. Please check your internet or email hello@monokrome.com.',
};

function show(type, text) {
  status.className = 'form-status form-status--' + type;
  status.textContent = text;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const f = new FormData(form);

  const payload = {
    name:    f.get('name'),
    email:   f.get('email'),
    phone:   f.get('phone'),
    service: f.get('service'),
    message: f.get('brief'),
    website: f.get('website'),                     // hidden honeypot, should be empty
    token:   f.get('cf-turnstile-response'),       // added by the Turnstile widget
  };

  if (!payload.token) return show('error', messages.captcha);

  sendBtn.disabled = true;
  show('pending', 'Sending...');

  try {
    const res  = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.ok) {
      form.reset();
      show('success', messages.ok);
    } else {
      show('error', messages[data.error] || messages.server);
    }
  } catch {
    show('error', messages.network);
  }

  if (window.turnstile) turnstile.reset();         // tokens work once only
  sendBtn.disabled = false;
});
