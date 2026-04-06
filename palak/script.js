// script.js
// Handles scroll reveal, hero animation, and micro-interactions

document.addEventListener('DOMContentLoaded', () => {
  // Animate journal-photo images sliding in
  const entries = document.querySelectorAll('.journal-entry');
  const observer = new window.IntersectionObserver((entriesList) => {
    entriesList.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector('.journal-photo');
        if (img) {
          img.classList.add('visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  entries.forEach(section => observer.observe(section));

  // Button micro animation
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      btn.classList.remove('pressed');
      void btn.offsetWidth; // trigger reflow
      btn.classList.add('pressed');
      setTimeout(() => btn.classList.remove('pressed'), 180);
    });
  });

  Luxury pen SVG cursor with hover/click animation
  let penCursor = null;
  if (window.matchMedia('(pointer: fine)').matches) {
    penCursor = document.createElement('img');
    penCursor.src = 'icons8-fountain-pen-48.png';
    penCursor.style.position = 'fixed';
    penCursor.style.width = '28px';
    penCursor.style.height = '64px';
    penCursor.style.pointerEvents = 'none';
    penCursor.style.zIndex = '99999';
    penCursor.style.transition = 'transform 0.18s cubic-bezier(.4,0,.2,1)';
    penCursor.style.transform = 'rotate(-12deg)';
    document.body.appendChild(penCursor);
    document.body.style.cursor = 'none';
    document.addEventListener('mousemove', e => {
      penCursor.style.left = (e.clientX - 12) + 'px';
      penCursor.style.top = (e.clientY - 8) + 'px';
    });
    document.addEventListener('mousedown', () => {
      penCursor.style.transform = 'rotate(-8deg) scale(0.97)';
    });
    document.addEventListener('mouseup', () => {
      penCursor.style.transform = 'rotate(-12deg) scale(1)';
    });
    document.addEventListener('mouseover', () => {
      penCursor.style.opacity = '1';
    });
    document.addEventListener('mouseout', () => {
      penCursor.style.opacity = '0';
    });
  }
});
