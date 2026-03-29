// Helper to generate random star box-shadows with Van Gogh colors
function generateStarBoxShadow(count) {
  let shadows = [];
  const colors = ['#ffffff', '#f4e04d', '#7ee7ff', '#a5d8ff']; // White, Gold, Cyan, Soft Blue

  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const color = colors[Math.floor(Math.random() * colors.length)];
    // x y blur color
    shadows.push(`${x}vw ${y}vh 0px ${color}`);
  }
  return shadows.join(', ');
}

window.addEventListener('load', function () {
  // Generate dynamic stars for "enchanting" density
  const stars1 = document.getElementById('stars');
  const stars2 = document.getElementById('stars2');
  const stars3 = document.getElementById('stars3');

  // Use box-shadow to create multiple instances of the star shape from a single element
  if (stars1) stars1.style.boxShadow = generateStarBoxShadow(500); // Small
  if (stars2) stars2.style.boxShadow = generateStarBoxShadow(200); // Medium
  if (stars3) stars3.style.boxShadow = generateStarBoxShadow(100); // Large

  // Persistent Background Stars (Floating Sparks)
  createFloatingStars();
  createSmallPlanets();
  createNebulas();
  startShootingStars();
  initConstellations();
  initStarParallax();

  // Mark page as loaded for animations
  document.body.classList.add('loaded');
});

// Helper to create larger floating background stars
// Helper to create larger floating background stars with DISTINCT placement & SCROLL VISUALS
function createFloatingStars() {
  const container = document.getElementById('star-background');
  if (!container) return;

  const colors = ['#ffffff', '#f4e04d', '#7ee7ff', '#c2b3ff']; // White, Gold, Cyan, Soft Purple

  // Calculate grid based on full page height
  const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

  // Force container to match full page height
  container.style.height = `${pageHeight}px`;

  // We want roughly 1 row every ~150px of height for good density
  const rowHeight = 150;
  const rows = Math.ceil(pageHeight / rowHeight);
  const cols = 6; // slightly wider spread

  const stepX = 100 / cols;
  const stepY = 100 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > 0.8) continue; // Skip 20%


      // 1. WRAPPER for Parallax Position
      const wrapper = document.createElement('div');
      wrapper.classList.add('star-wrapper');

      // Random Position
      const x = (c * stepX) + (Math.random() * (stepX - 10)) + 5;
      const y = (r * stepY) + (Math.random() * (stepY - 10)) + 5;

      // Random Size
      const size = Math.random() * 8 + 4;

      wrapper.style.left = `${x}%`;
      wrapper.style.top = `${y}%`;
      wrapper.style.width = `${size}px`;
      wrapper.style.height = `${size}px`;

      // Assign Random Parallax Speeds (Scatter effect)
      // Range: -0.5 to 0.5 for Y, -0.3 to 0.3 for X
      const speedY = (Math.random() - 0.5) * 0.8;
      const speedX = (Math.random() - 0.5) * 0.4;

      wrapper.dataset.speedY = speedY;
      wrapper.dataset.speedX = speedX;

      // 2. INNER STAR for Visuals & Local Float Animation
      const star = document.createElement('div');
      star.classList.add('floating-star');
      const color = colors[Math.floor(Math.random() * colors.length)];
      star.style.backgroundColor = color;

      // Animation timings
      const floatDuration = Math.random() * 20 + 20;
      const pulseDuration = Math.random() * 4 + 2;
      const delay = Math.random() * 5;

      star.style.animation = `floatAround ${floatDuration}s infinite linear ${delay}s, pulseGlow ${pulseDuration}s infinite alternate ease-in-out ${delay}s`;

      wrapper.appendChild(star);
      container.appendChild(wrapper);
    }
  }

}

// Helper to create small colorful planets
function createSmallPlanets() {
  const container = document.getElementById('star-background');
  if (!container) return;

  const colors = [
    { bg: '#ff6b6b', glow: '#ff8787' }, // Red
    { bg: '#a29bfe', glow: '#6c5ce7' }, // Purple
    { bg: '#ffeaa7', glow: '#fdcb6e' }, // Gold
    { bg: '#55efc4', glow: '#00cec9' }  // Teal
  ];

  const count = 4; // Number of small planets

  for (let i = 0; i < count; i++) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('planet-wrapper');

    // Random Position (avoid top-right where main planet is)
    let x = Math.random() * 90;
    let y = Math.random() * 90;

    // Simple check to keep away from main planet (approx top 10%, right 10%)
    if (x > 60 && y < 40) {
      x = 20; // Move to left if falls in that zone
    }

    // Size (30-60px)
    const size = Math.random() * 30 + 30;

    wrapper.style.left = `${x}%`;
    wrapper.style.top = `${y}%`;
    wrapper.style.width = `${size}px`;
    wrapper.style.height = `${size}px`;

    // Parallax Speed (Slower than stars for depth)
    const speedY = (Math.random() - 0.5) * 0.2;
    const speedX = (Math.random() - 0.5) * 0.1;
    wrapper.dataset.speedY = speedY;
    wrapper.dataset.speedX = speedX;

    const planet = document.createElement('div');
    planet.classList.add('small-planet');

    // Gradient styling
    const color = colors[i % colors.length];
    planet.style.background = `radial-gradient(circle at 30% 30%, ${color.bg} 0%, #050a14 80%)`;
    planet.style.boxShadow = `inset -4px -4px 10px rgba(0,0,0,0.8), 0 0 10px ${color.glow}`;

    wrapper.appendChild(planet);
    container.appendChild(wrapper);
  }
}

// Handle the scroll movement for stars, planet, and warp speed
function initStarParallax() {
  const wrappers = document.querySelectorAll('.star-wrapper, .planet-wrapper');
  const planet = document.getElementById('planet-container');
  let warpFactor = 1;
  let currentWarp = 1;

  // expose current warp globally so other systems (like constellations) can read it
  window._currentWarp = currentWarp;

  // Warp Speed Interactions
  window.addEventListener('mousedown', () => { warpFactor = 8; });
  window.addEventListener('mouseup', () => { warpFactor = 1; });
  window.addEventListener('touchstart', () => { warpFactor = 8; });
  window.addEventListener('touchend', () => { warpFactor = 1; });

  // Cache origin positions for wrappers (used by constellation logic)
  wrappers.forEach(w => {
    const rect = w.getBoundingClientRect();
    w.dataset.origX = rect.left + rect.width / 2;
    w.dataset.origY = rect.top + rect.height / 2;
  });

  // Use a single animation loop for everything
  function animate() {
    const scrollY = window.scrollY;

    // Smooth warp transition
    currentWarp += (warpFactor - currentWarp) * 0.05;
    window._currentWarp = currentWarp;

    // 1. Planet Parallax (Slow, disconnected from warp)
    if (planet) {
      planet.style.transform = `translate3d(0, ${scrollY * 0.05}px, 0)`;
    }

    // 2. Stars Parallax + Warp
    wrappers.forEach(wrapper => {
      const speedY = parseFloat(wrapper.dataset.speedY || 0);
      const speedX = parseFloat(wrapper.dataset.speedX || 0);

      const yOffset = scrollY * speedY * currentWarp;
      const xOffset = scrollY * speedX * 0.5 * currentWarp;

      // Stretch stars when warping
      const scale = 1 + (currentWarp - 1) * 0.5;

      wrapper.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${scale})`;
    });

    requestAnimationFrame(animate);
  }

  animate();
}



// Feature 7: Custom Comet Cursor
(function () {
  // Removed touch check because many Windows laptops are hybrid
  // const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  // if (isTouch) return;

  const cursor = document.createElement('div');
  cursor.id = 'cursor-comet';
  document.body.appendChild(cursor);

  // Hide default cursor only when custom one is ready
  document.body.classList.add('custom-cursor-active');

  let lastTrail = 0;

  let cursorX = 0, cursorY = 0;
  let cursorRAF = false;

  window.addEventListener('mousemove', (e) => {
    // store latest coords
    cursorX = e.clientX;
    cursorY = e.clientY;

    // patch cursor position during rAF to avoid layout thrash
    if (!cursorRAF) {
      cursorRAF = true;
      requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        cursorRAF = false;
      });
    }

    // 2. Spawn Trail (Throttle ~25fps)
    const now = Date.now();
    if (now - lastTrail > 40) {
      lastTrail = now;
      const trail = document.createElement('div');
      trail.classList.add('cursor-trail');
      // use transform instead of left/top
      // center small 6px dot
      trail.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      document.body.appendChild(trail);

      // Cleanup
      setTimeout(() => trail.remove(), 500);
    }
  });

  // Hover states - simpler event delegation
  document.body.addEventListener('mouseover', (e) => {
    if (e.target.matches('a, button, input, .clickable, .project-card, .logo, .nav-links a, h1')) {
      cursor.classList.add('hovering');
    }
  });

  document.body.addEventListener('mouseout', (e) => {
    if (e.target.matches('a, button, input, .clickable, .project-card, .logo, .nav-links a, h1')) {
      cursor.classList.remove('hovering');
    }
  });
})();


// Cool & Exciting Features (Tilt, Reveal, Active Nav)
document.addEventListener('DOMContentLoaded', () => {
  initTiltEffect();
  initScrollReveal();
  initActiveNav();
  initBookScroll();
});

// Feature 1: Cosmic Nebula Glows
function createNebulas() {
  const container = document.getElementById('nebula-container');
  if (!container) return;

  // Colors: Deep Blue, Purple, faint Gold
  const colors = ['rgba(10, 20, 40, 0.6)', 'rgba(80, 40, 100, 0.3)', 'rgba(20, 50, 80, 0.4)', 'rgba(100, 100, 50, 0.1)'];
  const count = 4;

  for (let i = 0; i < count; i++) {
    const nebula = document.createElement('div');
    nebula.classList.add('nebula-cloud');

    // Large sizes (40-60vw)
    const size = Math.random() * 20 + 40;
    nebula.style.width = `${size}vw`;
    nebula.style.height = `${size}vw`;

    // Random Positions
    nebula.style.left = `${Math.random() * 80 - 10}%`;
    nebula.style.top = `${Math.random() * 80}%`;

    nebula.style.background = colors[i % colors.length];

    // Random Animation Delays
    nebula.style.animationDelay = `${Math.random() * -20}s`;

    container.appendChild(nebula);
  }
}

// Feature 2: Shooting Stars
function startShootingStars() {
  const container = document.getElementById('shooting-star-container');
  if (!container) return;

  // Spawn a shooting star every 10-25 seconds
  function spawn() {
    const star = document.createElement('div');
    star.classList.add('shooting-star');

    // Random start position (mostly top right area to shoot down-left)
    const startX = Math.random() * 100 + 50; // 50% to 150% (off screen right)
    const startY = Math.random() * 50 - 50; // -50% to 0% (off screen top)
    const length = Math.random() * 150 + 100; // 100-250px tail width

    star.style.left = `${startX}%`;
    star.style.top = `${startY}%`;
    star.style.width = `${length}px`;

    // Animation duration random (Faster, 0.8s - 1.5s)
    const duration = Math.random() * 0.7 + 0.8;
    star.style.animationDuration = `${duration}s`;

    container.appendChild(star);

    // Remove after animation
    setTimeout(() => {
      star.remove();
    }, duration * 1000);

    // Schedule next
    const nextSpawn = Math.random() * 5000 + 3000; // 3-8s (More frequent)
    setTimeout(spawn, nextSpawn);
  }

  // Initial delay
  setTimeout(spawn, 2000);
}

// Feature 3: Constellations (Mouse Connections)
function initConstellations() {
  const canvas = document.getElementById('constellation-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let mouse = { x: -1000, y: -1000 };
  let wrappers = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Cache the wrappers once logic is ready (wait a bit for stars to exist)
  setTimeout(() => {
    wrappers = Array.from(document.querySelectorAll('.star-wrapper'));
  }, 1000);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    if (mouse.x > 0 && mouse.y > 0) {
      const connectDistance = 150;
      const scrollY = window.scrollY;
      const warp = window._currentWarp || 1;

      wrappers.forEach(wrapper => {
        // derive projected star center using cached origin and parallax logic
        const speedY = parseFloat(wrapper.dataset.speedY || 0);
        const speedX = parseFloat(wrapper.dataset.speedX || 0);
        const origX = parseFloat(wrapper.dataset.origX) || 0;
        const origY = parseFloat(wrapper.dataset.origY) || 0;

        const yOffset = scrollY * speedY * warp;
        const xOffset = scrollY * speedX * 0.5 * warp;

        const starX = origX + xOffset;
        const starY = origY + yOffset;

        const dx = mouse.x - starX;
        const dy = mouse.y - starY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectDistance) {
          const opacity = 1 - (dist / connectDistance);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(starX, starY);
          ctx.stroke();
        }
      });
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// 1. 3D Tilt Effect for Cards
function initTiltEffect() {
  const cards = document.querySelectorAll('.project-card, .header-content');

  if (window.matchMedia('(hover: none)').matches) return; // Disable on touch

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate rotation (center is 0)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Limit max rotation (e.g. +/- 5 deg)
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// 2. Scroll Reveal Animation
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  });

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));
}

// 3. Active Navigation Highlighting
function initActiveNav() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');

  // throttle nav highlighting with rAF and avoid repeated layout reads
  let lastNavScroll = 0;
  let navTicking = false;
  function onScrollNav() {
    lastNavScroll = window.pageYOffset;
    if (!navTicking) {
      navTicking = true;
      requestAnimationFrame(() => {
        let currentSection = '';
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          //const sectionHeight = section.clientHeight; // not used
          if (lastNavScroll >= (sectionTop - 300)) {
            currentSection = section.getAttribute('id');
          }
        });

        if (lastNavScroll < 300) {
          currentSection = 'home';
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === 'index.html') link.classList.add('active');
          });
        } else {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
              link.classList.add('active');
            }
          });
        }

        navTicking = false;
      });
    }
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
}

// 4. Mature Book Scroll Interaction
function initBookScroll() {
  const wrapper = document.querySelector('.book-section-wrapper');
  const stickyContainer = document.querySelector('.book-sticky-container');
  const pages = document.querySelectorAll('.book-page');

  if (!wrapper || !stickyContainer || pages.length === 0) return;

  // If we are on mobile (height: auto), don't run the scroll logic
  if (getComputedStyle(wrapper).height === 'auto') return;

  // wrap book scroll logic in rAF throttling
  let bookTicking = false;
  function updateBookScroll() {
    if (window.innerWidth <= 900) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const totalScrollDistance = wrapperRect.height - stickyContainer.offsetHeight;
    let scrollYWithinSection = (viewportHeight * 0.15) - wrapperRect.top;
    if (scrollYWithinSection < 0) scrollYWithinSection = 0;
    const progress = Math.min(Math.max(scrollYWithinSection / totalScrollDistance, 0), 1);

    pages.forEach((page, index) => {
      const rangeStart = index * 0.33;
      const rangeEnd = (index + 1) * 0.33;

      if (index === pages.length - 1 && progress > rangeStart) {
        page.classList.add('active');
        page.classList.remove('scroll-out');
      }
      else if (progress >= rangeStart && progress < rangeEnd) {
        page.classList.add('active');
        page.classList.remove('scroll-out');
      } else if (progress >= rangeEnd) {
        page.classList.remove('active');
        page.classList.add('scroll-out');
      } else {
        page.classList.remove('active');
        page.classList.remove('scroll-out');
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!bookTicking) {
      bookTicking = true;
      requestAnimationFrame(() => {
        updateBookScroll();
        bookTicking = false;
      });
    }
  }, { passive: true });
}

// 5. Timeline Animation
function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
}

// Initialize new features
document.addEventListener('DOMContentLoaded', () => {
  initTimeline();
  initOrbitSystem();
  initContactForm();
});

// 6. Orbit Controls
function initOrbitSystem() {
  const rings = document.querySelectorAll('.orbit-ring');
  rings.forEach(ring => {
    ring.addEventListener('mouseenter', () => {
      ring.style.animationPlayState = 'paused';
    });
    ring.addEventListener('mouseleave', () => {
      ring.style.animationPlayState = 'running';
    });
  });
}

// 7. Event Horizon Contact Form
function initContactForm() {
  const form = document.getElementById('contact-form');
  const container = document.querySelector('.contact-content');
  const blackHole = document.querySelector('.black-hole');
  const successMsg = document.getElementById('success-message');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Don't actually submit

    // 1. Trigger "Suck In" animation
    form.style.transition = "all 1s cubic-bezier(0.7,0,0.3,1)";
    form.style.transform = "scale(0) rotate(360deg)";
    form.style.opacity = "0";

    // Enlarge black hole momentarily
    if (blackHole) blackHole.classList.add('eating');

    // 2. Wait for animation, then show success
    setTimeout(() => {
      form.style.display = 'none';
      if (blackHole) blackHole.classList.remove('eating');

      if (successMsg) {
        successMsg.classList.remove('hidden');
        // Reset transform for container if we animated specific parts, 
        // but here we just hid the form.
      }
    }, 1200);
  });
}