/* ======================================================
   HERO DOT GRID — interactive bubble effect
   ====================================================== */
(function () {
  const canvas = document.getElementById('heroDots');
  const ctx    = canvas.getContext('2d');
  const hero   = document.getElementById('home');

  const SPACING   = 28;   // grid spacing in px
  const BASE_R    = 1.5;  // dot radius
  const INFLUENCE = 90;   // repulsion radius in px
  const MAX_PUSH  = 32;   // max displacement in px
  const LERP      = 0.16; // spring speed (lower = more lag)
  const ALPHA     = 0.18; // dot opacity

  let mouse = { x: -9999, y: -9999 };
  let dots  = [];

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const cols = Math.ceil(canvas.width  / SPACING) + 1;
    const rows = Math.ceil(canvas.height / SPACING) + 1;
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        dots.push({
          bx: c * SPACING, by: r * SPACING, // home position
          x:  c * SPACING, y:  r * SPACING, // current position
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const dot of dots) {
      // Vector from cursor to this dot's home position
      const dx   = dot.bx - mouse.x;
      const dy   = dot.by - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let tx = dot.bx;
      let ty = dot.by;

      if (dist < INFLUENCE && dist > 0) {
        const t    = 1 - dist / INFLUENCE;
        const ease = t * t * (3 - 2 * t); // smoothstep falloff
        const push = ease * MAX_PUSH;
        tx = dot.bx + (dx / dist) * push;
        ty = dot.by + (dy / dist) * push;
      }

      // Spring toward target position
      dot.x += (tx - dot.x) * LERP;
      dot.y += (ty - dot.y) * LERP;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, BASE_R, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79,142,247,${ALPHA})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  hero.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ======================================================
   RESUME DROPDOWN
   ====================================================== */
(function () {
  const dropdown = document.getElementById('resumeDropdown');
  const btn      = document.getElementById('resumeBtn');
  const menu     = document.getElementById('resumeMenu');

  function open()  { menu.hidden = false; dropdown.classList.add('open');    btn.setAttribute('aria-expanded', 'true');  }
  function close() { menu.hidden = true;  dropdown.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', e => { e.stopPropagation(); menu.hidden ? open() : close(); });
  document.addEventListener('click', () => close());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ======================================================
   CURSOR GLOW
   ====================================================== */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left    = e.clientX + 'px';
  glow.style.top     = e.clientY + 'px';
  glow.style.opacity = '1';
});
window.addEventListener('mouseout', e => {
  if (!e.relatedTarget && !e.toElement) glow.style.opacity = '0';
});

/* ======================================================
   NAVBAR HIDE / SHOW ON SCROLL
   ====================================================== */
let lastScroll = 0;
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.style.top = (y > lastScroll && y > 80) ? '-80px' : '0';
  lastScroll = Math.max(y, 0);
}, { passive: true });

/* ======================================================
   HAMBURGER / MOBILE DRAWER
   ====================================================== */
(function () {
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('navDrawer');
  const scrim     = document.getElementById('navScrim');
  const closeBtn  = document.getElementById('drawerClose');

  function open() {
    drawer.hidden = false;
    scrim.hidden  = false;
    requestAnimationFrame(() => {
      drawer.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
  }

  function close() {
    drawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => {
      drawer.hidden = true;
      scrim.hidden  = true;
    }, 290);
  }

  hamburger.addEventListener('click', () =>
    hamburger.getAttribute('aria-expanded') === 'true' ? close() : open()
  );
  scrim.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  drawer.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ======================================================
   SECTION FADE-IN ON SCROLL
   ====================================================== */
const fadeSections = document.querySelectorAll('.fade-section');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
fadeSections.forEach(s => {
  // Sections already in the viewport on load should appear immediately
  const rect = s.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    s.classList.add('visible');
  } else {
    sectionObserver.observe(s);
  }
});

/* ======================================================
   EXPERIENCE TABS
   ====================================================== */
(function () {
  const tabs      = Array.from(document.querySelectorAll('.exp-tab'));
  const panels    = Array.from(document.querySelectorAll('.exp-panel'));
  const indicator = document.getElementById('expIndicator');

  function activate(tab) {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    panels.forEach(p => {
      p.dataset.active = String(p.id === tab.getAttribute('aria-controls'));
    });

    if (indicator && window.getComputedStyle(indicator).display !== 'none') {
      const rect      = tab.getBoundingClientRect();
      const parentTop = tab.parentElement.getBoundingClientRect().top;
      indicator.style.height    = rect.height + 'px';
      indicator.style.transform = `translateY(${rect.top - parentTop}px)`;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', e => {
      const i = tabs.indexOf(tab);
      if (e.key === 'ArrowDown')  { e.preventDefault(); tabs[(i + 1) % tabs.length].focus(); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); tabs[(i - 1 + tabs.length) % tabs.length].focus(); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(tab); }
    });
  });

  const initialTab = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
  window.addEventListener('load',   () => { if (initialTab) activate(initialTab); });
  window.addEventListener('resize', () => {
    const active = tabs.find(t => t.getAttribute('aria-selected') === 'true');
    if (active) activate(active);
  });
})();

/* ======================================================
   CONTACT FORM → MAILTO
   ====================================================== */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const msg  = document.getElementById('contactMessage').value.trim();
  if (!name || !msg) {
    alert('Please fill in both your name and a message.');
    return;
  }
  window.location.href =
    `mailto:ammaralinyc@gmail.com?subject=${encodeURIComponent('Message from ' + name)}&body=${encodeURIComponent(msg)}`;
});

/* ======================================================
   PHOTO GALLERY MODAL
   ====================================================== */
(function () {
  const modal    = document.getElementById('photoModal');
  const openBtn  = document.getElementById('openGallery');
  const closeBtn = document.getElementById('photoClose');
  const slides   = Array.from(document.querySelectorAll('.slide'));
  let idx = 0;

  function show(n) {
    idx = ((n % slides.length) + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  }

  openBtn.addEventListener('click', e => {
    e.preventDefault();
    modal.hidden = false;
    show(0);
  });
  closeBtn.addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });
  document.querySelector('.slide-prev').addEventListener('click', () => show(idx - 1));
  document.querySelector('.slide-next').addEventListener('click', () => show(idx + 1));
  window.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'ArrowLeft')  show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'Escape')     modal.hidden = true;
  });
})();
