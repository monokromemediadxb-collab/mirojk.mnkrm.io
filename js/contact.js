// Opens the visitor's email app with the brief filled in
document.getElementById('brief').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `Name: ${f.get('name')}\nEmail: ${f.get('email')}\nPhone: ${f.get('phone')}\nService: ${f.get('service')}\n\n${f.get('brief')}`;
  location.href = `mailto:hello@monokrome.com?subject=${encodeURIComponent('Project enquiry: ' + f.get('service'))}&body=${encodeURIComponent(body)}`;
});
