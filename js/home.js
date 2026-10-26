/* ==========================================================================
   HOME PAGE
   1. Rotating headline words
   2. Cinema dim + carousel movement on scroll
   3. Hero "scroll down" bubble + auto-scroll
   ========================================================================== */


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
      el.textContent = words[index];
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


/* 3. HERO "SCROLL DOWN" BUBBLE + AUTO-SCROLL
   The bubble trails the cursor. Clicking the hero, or scrolling down once
   while at the top, jumps to the next section.
   -------------------------------------------------------------------------- */
const hero   = document.getElementById('hero');
const bubble = document.getElementById('scrollBtn');
const nextSection = document.getElementById('break');

const goNext = () => nextSection.scrollIntoView({ behavior: 'smooth' });

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

let wheelLock = false;
addEventListener('wheel', e => {
  if (scrollY < 10 && e.deltaY > 0) {
    e.preventDefault();                                 // stop normal scroll fighting the smooth jump
    if (!wheelLock) {
      wheelLock = true;
      goNext();
      setTimeout(() => (wheelLock = false), 1400);
    }
  }
}, { passive: false });
