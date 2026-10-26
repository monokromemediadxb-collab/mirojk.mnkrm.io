// Filter buttons + load more
const cards = [...document.querySelectorAll('.card--work')];
const buttons = [...document.querySelectorAll('#filters .pill')];
const more = document.getElementById('loadMore');

function applyFilter(cat) {
  buttons.forEach(b => b.classList.toggle('active', b.dataset.filter === cat));
  cards.forEach(c => c.classList.toggle('filtered-out', cat !== 'All' && c.dataset.cat !== cat));
  if (cat !== 'All') cards.forEach(c => c.classList.remove('hidden-card'));
}
buttons.forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.filter)));
more.addEventListener('click', () => { cards.forEach(c => c.classList.remove('hidden-card')); more.style.display = 'none'; });

const preset = new URLSearchParams(location.search).get('f');
if (preset) applyFilter(preset);
