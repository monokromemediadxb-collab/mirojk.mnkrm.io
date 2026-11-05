MONOKROME SITE
==============
Upload EVERYTHING in this folder (index.html, the page folders, css/, js/, images/, CNAME) to the repo root.

CLEAN URLS
  Every page lives in its own folder (about/index.html, work/index.html ...),
  so the address bar shows mnkrm.com/about/ with no ".html".
  The home page is just mnkrm.com.
  All links and asset paths start with "/", so they work from any page.

PREVIEWING ON YOUR COMPUTER
  Because paths start with "/", double-clicking the files will not load the
  styling. Run a tiny local server from this folder instead:
      python3 -m http.server 8000
  then open http://localhost:8000

FINDING PLACEHOLDERS
  Search the project for "PLACEHOLDER" (VS Code: Cmd+Shift+F).
  Each grey box has a numbered comment above it saying what image belongs there
  and what to replace it with, e.g.
      <img class="cover-img" src="/images/YOUR-FILE.jpg" alt="">
  Logo boxes are marked "LOGO PLACEHOLDER".

HOME PAGE SNAPPING
  Controlled by class="snap-page" on <html> in index.html, CSS section 8-0
  and js/home.js section 4. Delete the class to turn snapping off.
