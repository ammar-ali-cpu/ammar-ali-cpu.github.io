
// // For glow effect around the cursor
// const glow = document.querySelector('.cursor-glow');
// document.addEventListener('mousemove', (e) => {
//   glow.style.left = e.pageX + 'px';
//   glow.style.top = e.pageY + 'px';
// });

const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});



// For nav bar
let lastScrollTop = 0;
const navbar = document.querySelector('.top-nav');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if(scrollTop > lastScrollTop){
        // Scrolling down
        navbar.style.top = '-100px'; // hide navbar
    } else {
        // Scrolling up
        navbar.style.top = '0'; // show navbar
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // for Mobile or negative scrolling
});


// For mobile drawer menu
(function () {
    const nav = document.querySelector('.top-nav');
    const btn = nav.querySelector('.hamburger');
    const drawer = nav.querySelector('.mobile-drawer');
    const scrim = nav.querySelector('.scrim');
    const closeBtn = nav.querySelector('.drawer-close');

    function openMenu() {
      // 1) unhide so it can animate from its initial transform
      drawer.hidden = false;
      scrim.hidden = false;

      // 2) wait one frame, then apply the "open" class to trigger transition
      requestAnimationFrame(() => {
        nav.classList.add('menu-open');
        btn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      });
    }

    function closeMenu() {
      // remove the open class to start the slide-out
      nav.classList.remove('menu-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      // Hiding will now be handled by 'transitionend'
    }

    // Hide after the transform transition finishes
    drawer.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform' && !nav.classList.contains('menu-open')) {
        drawer.hidden = true;
        scrim.hidden = true;
      }
    });

    btn.addEventListener('click', () =>
      btn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu()
    );
    scrim.addEventListener('click', closeMenu);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    drawer.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
  })();



  // For experience tabs
  (function(){
  const root = document.querySelector('#experience');
  if (!root) return;
  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
  const indicator = root.querySelector('#exp-indicator');

  function activate(tab){
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    panels.forEach(p => p.dataset.active = (p.id === tab.getAttribute('aria-controls')));

    // move the indicator (desktop layout only)
    if (indicator && window.getComputedStyle(indicator).display !== 'none') {
      const rect = tab.getBoundingClientRect();
      const parentTop = tab.parentElement.getBoundingClientRect().top;
      indicator.style.height = rect.height + 'px';
      indicator.style.transform = `translateY(${rect.top - parentTop}px)`;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', e => {
      const i = tabs.indexOf(tab);
      if (e.key === 'ArrowDown'){ e.preventDefault(); tabs[(i+1)%tabs.length].focus(); }
      if (e.key === 'ArrowUp'){ e.preventDefault(); tabs[(i-1+tabs.length)%tabs.length].focus(); }
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activate(tab); }
    });
  });

  window.addEventListener('load', () => {
    const current = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
    if (current) activate(current);
  });
  window.addEventListener('resize', () => {
    const current = tabs.find(t => t.getAttribute('aria-selected') === 'true');
    if (current) activate(current);
  });
})();