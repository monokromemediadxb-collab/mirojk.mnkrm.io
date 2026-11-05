/* ==========================================================================
   PROJECT PAGE - fills the title from the link, e.g. /project/?p=Soho+House
   The value comes from the address bar, so it is treated as untrusted:
   it is length-limited and written with textContent (never as HTML).
   ========================================================================== */
const projectName = (new URLSearchParams(location.search).get('p') || '').slice(0, 80);
if (projectName) {
  document.getElementById('ptitle').textContent = projectName;
  document.title = projectName + ' | Monokrome Media';
}
