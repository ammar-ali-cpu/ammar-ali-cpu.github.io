
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