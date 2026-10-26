// Rotating headline words; click a word to lock it
const rotating = [
  { el: document.getElementById('verb'), words: ['BREAK', 'BEND', 'REDEFINE', 'PUSH'] },
  { el: document.getElementById('noun'), words: ['LIMITS', 'RULES', 'BOUNDARIES'] },
  { el: document.getElementById('poss'), words: ['POSSIBILITY', 'IMAGINATION', 'VISION'] },
];
rotating.forEach(({ el, words }) => {
  let i = 0;
  el.addEventListener('click', () => el.classList.toggle('locked'));
  setInterval(() => {
    if (el.classList.contains('locked')) return;
    el.style.opacity = 0;
    setTimeout(() => { i = (i + 1) % words.length; el.textContent = words[i]; el.style.opacity = 1; }, 350);
  }, 2600);
});

// Cinema dimming + carousel movement on scroll
const work = document.getElementById('work');
const dim = document.getElementById('dim');
const track = document.getElementById('track');
const titles = document.querySelectorAll('#work .title');
function onScroll() {
  const rect = work.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / innerHeight));
  dim.style.opacity = (1 - progress) * 0.8;
  titles.forEach(t => t.classList.toggle('in', progress > 0.5));
  track.style.transform = `rotateY(${(rect.top / innerHeight) * 8}deg) translateX(${rect.top * 0.08}px)`;
}
addEventListener('scroll', onScroll);
onScroll();

// Hero: cursor-following "scroll down" bubble; click or wheel goes to the next section
const hero = document.getElementById('hero');
const bubble = document.getElementById('scrollBtn');
const next = document.getElementById('break');
const goNext = () => next.scrollIntoView({ behavior: 'smooth' });
let overNav = false;
let x = innerWidth / 2, y = innerHeight / 2, bx = x, by = y;
addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
document.querySelectorAll('nav, .brand').forEach(el => {
  el.addEventListener('mouseenter', () => (overNav = true));
  el.addEventListener('mouseleave', () => (overNav = false));
});
function follow() {
  bx += (x - bx) * 0.15; by += (y - by) * 0.15;
  bubble.style.transform = `translate(${bx - 42}px, ${by - 42}px)`;
  bubble.classList.toggle('visible', scrollY < innerHeight * 0.6 && !overNav);
  requestAnimationFrame(follow);
}
follow();
hero.addEventListener('click', goNext);
let heroLock = false;
addEventListener('wheel', e => {
  if (e.deltaY > 0 && scrollY < 10 && !heroLock) { heroLock = true; goNext(); setTimeout(() => (heroLock = false), 1200); }
}, { passive: true });
