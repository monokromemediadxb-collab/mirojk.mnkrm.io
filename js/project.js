// Fills the project title from ?p=Project+Name
const p = new URLSearchParams(location.search).get('p');
if (p) {
  document.getElementById('ptitle').textContent = p;
  document.title = p + ' | Monokrome Media';
}
