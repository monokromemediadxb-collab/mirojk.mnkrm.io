/* ==========================================================================
   WORK PAGE - category filters + "Load more"
   Each card has data-cat="Film | Photography | Social | VFX | Aerial".
   A link like work.html?f=Aerial opens the page pre-filtered.
   ========================================================================== */
const cards   = [...document.querySelectorAll('.card--work')];
const buttons = [...document.querySelectorAll('#filters .pill')];
const loadMore = document.getElementById('loadMore');

function applyFilter(category) {
  buttons.forEach(b => b.classList.toggle('active', b.dataset.filter === category));
  cards.forEach(card =>
    card.classList.toggle('filtered-out', category !== 'All' && card.dataset.cat !== category));

  if (category !== 'All') cards.forEach(card => card.classList.remove('hidden-card'));
}

buttons.forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.filter)));

loadMore.addEventListener('click', () => {
  cards.forEach(card => card.classList.remove('hidden-card'));
  loadMore.style.display = 'none';
});

const preset = new URLSearchParams(location.search).get('f');
if (preset) applyFilter(preset);
