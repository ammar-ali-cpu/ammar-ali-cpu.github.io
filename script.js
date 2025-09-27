
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