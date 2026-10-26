/* ==========================================================================
   PROJECT PAGE - fills the title from the link, e.g. project.html?p=Soho+House
   ========================================================================== */
const projectName = new URLSearchParams(location.search).get('p');
if (projectName) {
  document.getElementById('ptitle').textContent = projectName;
  document.title = projectName + ' | Monokrome Media';
}
