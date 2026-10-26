/* ==========================================================================
   SERVICES PAGE - hover or click a service to swap the colour panel
   ========================================================================== */
const items  = [...document.querySelectorAll('.svc-item')];
const panels = [...document.querySelectorAll('.svc-panel')];
const stage  = document.querySelector('.svc-stage');
const list   = document.querySelector('.svc-list');

function showService(i) {
  items.forEach((b, n)  => b.classList.toggle('active', n === i));
  panels.forEach((p, n) => p.classList.toggle('show', n === i));
  stage.dataset.c = i;          // colour rules in css/style.css, section 11
  list.dataset.c  = i;
}

items.forEach((button, i) => {
  button.addEventListener('mouseenter', () => showService(i));
  button.addEventListener('click',      () => showService(i));
});

showService(0);
