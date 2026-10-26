/* ==========================================================================
   COMMON - runs on every page
   Scroll-reveal: any element with data-reveal="left|right|up" animates in
   when it enters the screen (styles live in css/style.css, section 6).
   ========================================================================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
