/* ==========================================================================
   HOME PAGE
   0. Smooth-scroll helper
   1. Rotating headline words
   2. Cinema dim + carousel movement on scroll
   3. Hero "scroll down" bubble
   4. Mouse-wheel / trackpad section snapping
   (Touch swipes, keyboard and scrollbar snapping are pure CSS:
    see css/style.css, section 8-0)
   ========================================================================== */


/* 0. SMOOTH-SCROLL HELPER
   Browsers can stall a smooth scroll while CSS snapping is on, so snapping is
   switched off for the length of the animation and restored when it lands.
   -------------------------------------------------------------------------- */
let snapRestore;
function smoothTo(top) {
  const root = document.documentElement;
  root.style.scrollSnapType = 'none';
  scrollTo({ top, behavior: 'smooth' });

  clearTimeout(snapRestore);
  snapRestore = setTimeout(() => (root.style.scrollSnapType = ''), 900);
}


/* 1. ROTATING HEADLINE WORDS (click a word to lock it)
   -------------------------------------------------------------------------- */
const rotating = [
  { el: document.getElementById('verb'), words: ['BREAK', 'BEND', 'REDEFINE', 'PUSH'] },
  { el: document.getElementById('noun'), words: ['LIMITS', 'RULES', 'BOUNDARIES'] },
  { el: document.getElementById('poss'), words: ['POSSIBILITY', 'IMAGINATION', 'VISION'] },
];

rotating.forEach(({ el, words }) => {
  let index = 0;

  el.addEventListener('click', () => el.classList.toggle('locked'));

  setInterval(() => {
    if (el.classList.contains('locked')) return;

    el.style.opacity = 0;                               // fade out
    setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];                    // textContent: never parsed as HTML
      el.style.opacity = 1;                             // fade in
    }, 350);
  }, 2600);
});


/* 2. CINEMA DIM + CAROUSEL MOVEMENT ON SCROLL
   -------------------------------------------------------------------------- */
const workSection = document.getElementById('work');
const dimOverlay  = document.getElementById('dim');
const track       = document.getElementById('track');
const titles      = document.querySelectorAll('#work .title');

function onScroll() {
  const rect     = workSection.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / innerHeight));

  dimOverlay.style.opacity = (1 - progress) * 0.8;                    // lights fade up
  titles.forEach(t => t.classList.toggle('in', progress > 0.5));      // text fades in
  track.style.transform =
    `rotateY(${(rect.top / innerHeight) * 8}deg) translateX(${rect.top * 0.08}px)`;
}

addEventListener('scroll', onScroll);
onScroll();


/* 3. HERO "SCROLL DOWN" BUBBLE
   The bubble trails the cursor (desktop only). Clicking the hero jumps to
   the next section.
   -------------------------------------------------------------------------- */
const hero   = document.getElementById('hero');
const bubble = document.getElementById('scrollBtn');
const nextSection = document.getElementById('break');

const goNext = () => smoothTo(Math.round(nextSection.getBoundingClientRect().top + scrollY));

let overNav = false;                                    // hide bubble over the nav
let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
let bubbleX = mouseX,        bubbleY = mouseY;

addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

document.querySelectorAll('nav, .brand').forEach(el => {
  el.addEventListener('mouseenter', () => (overNav = true));
  el.addEventListener('mouseleave', () => (overNav = false));
});

function followCursor() {
  bubbleX += (mouseX - bubbleX) * 0.15;                 // easing = trailing feel
  bubbleY += (mouseY - bubbleY) * 0.15;
  bubble.style.transform = `translate(${bubbleX - 42}px, ${bubbleY - 42}px)`;
  bubble.classList.toggle('visible', scrollY < innerHeight * 0.6 && !overNav);
  requestAnimationFrame(followCursor);
}
followCursor();

hero.addEventListener('click', goNext);


/* 4. MOUSE-WHEEL / TRACKPAD SECTION SNAPPING
   CSS snapping handles touch screens and keyboards. Desktop wheels and
   trackpads are less predictable, so this moves exactly one step per gesture:
   hero -> break -> carousel -> what -> footer, and back up the same way.
   Sections taller than the screen get two steps (their top, then their bottom)
   so nothing is ever skipped.
   -------------------------------------------------------------------------- */
const snapSections = [...document.querySelectorAll('.snap-start')];

function snapPoints() {
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  const points = [];

  snapSections.forEach(el => {
    const top = Math.round(el.getBoundingClientRect().top + scrollY);
    points.push(top);
    if (el.offsetHeight > innerHeight + 4) points.push(top + el.offsetHeight - innerHeight);
  });

  points.push(maxScroll);                               // bottom of the page (footer)
  return [...new Set(points.map(p => Math.min(p, maxScroll)))].sort((a, b) => a - b);
}

let lastWheel = 0;
let snapping  = false;

addEventListener('wheel', e => {
  if (e.ctrlKey || Math.abs(e.deltaY) < 4) return;      // ignore pinch-zoom and tiny nudges

  const now        = performance.now();
  const newGesture = now - lastWheel > 120;             // a pause means a new swipe/tick
  lastWheel = now;

  e.preventDefault();
  if (snapping || !newGesture) return;

  const points = snapPoints();
  const down   = e.deltaY > 0;
  const target = down
    ? points.find(p => p > scrollY + 3)
    : [...points].reverse().find(p => p < scrollY - 3);

  if (target === undefined) return;

  snapping = true;
  smoothTo(target);
  setTimeout(() => (snapping = false), 800);
}, { passive: false });
