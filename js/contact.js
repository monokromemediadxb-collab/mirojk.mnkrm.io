/* ==========================================================================
   CONTACT PAGE - opens the visitor's email app with the brief filled in
   (a static site has no server, so this uses a mailto: link)
   ========================================================================== */
document.getElementById('brief').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);

  const body = [
    `Name: ${f.get('name')}`,
    `Email: ${f.get('email')}`,
    `Phone: ${f.get('phone')}`,
    `Service: ${f.get('service')}`,
    '',
    f.get('brief'),
  ].join('\n');

  const subject = 'Project enquiry: ' + f.get('service');
  location.href = `mailto:hello@monokrome.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
