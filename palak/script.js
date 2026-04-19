// script.js
// Handles scroll reveal, hero animation, and micro-interactions

// Sticky Tab Navigation for Journal Right Edge
document.addEventListener('DOMContentLoaded', function () {
  // Get all sticky tab elements
  const tabs = document.querySelectorAll('.sticky-tab');
  tabs.forEach(tab => {
    // Click scroll to target section
    tab.addEventListener('click', function (e) {
      const target = document.querySelector(tab.getAttribute('data-target'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        tab.blur();
      }
    });
    // Keyboard accessibility for sticky tabs
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tab.click();
      }
    });
    // Focus/active state for accessibility
    tab.addEventListener('focus', function () {
      tab.classList.add('focus-visible');
    });
    tab.addEventListener('blur', function () {
      tab.classList.remove('focus-visible');
    });
  });
});

// Animate journal-photo images sliding in as they enter the viewport
document.addEventListener('DOMContentLoaded', () => {
  // Get all journal entry elements
  const entries = document.querySelectorAll('.journal-entry');
  // Create an IntersectionObserver to watch for entries entering the viewport
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

 /* Luxury pen SVG cursor with hover/click animation
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
  }*/
});
