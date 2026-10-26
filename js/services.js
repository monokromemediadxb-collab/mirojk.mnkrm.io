// Hover or click a service to swap the panel
const items = [...document.querySelectorAll('.svc-item')];
const panels = [...document.querySelectorAll('.svc-panel')];
function show(i) {
  items.forEach((b, n) => b.classList.toggle('active', n === i));
  panels.forEach((p, n) => p.classList.toggle('show', n === i));
}
items.forEach((b, i) => {
  b.addEventListener('mouseenter', () => show(i));
  b.addEventListener('click', () => show(i));
});
