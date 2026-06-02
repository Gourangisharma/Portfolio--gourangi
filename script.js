/* ═══════════════════════════════════════════════════
   GOURANGI SHARMA — PORTFOLIO INTERACTIONS
   Cursor glow · Scroll reveals · Counter animation
   Nav behavior · Local time · Smooth scroll
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── CURSOR GLOW ──
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursorGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;
    requestAnimationFrame(animateCursorGlow);
  }
  animateCursorGlow();


  // ── INTERSECTION OBSERVER: Card Reveal ──
  const cards = document.querySelectorAll('[data-animate]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  cards.forEach((card) => revealObserver.observe(card));


  // ── ANIMATED COUNTERS ──
  const counters = document.querySelectorAll('[data-count]');
  let countersDone = false;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersDone) {
          countersDone = true;
          runCounters();
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => counterObserver.observe(el));

  function runCounters() {
    counters.forEach((el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target + '+';
        }
      }

      requestAnimationFrame(tick);
    });
  }


  // ── NAVBAR: Hide on scroll down, show on scroll up ──
  const nav = document.getElementById('main-nav');
  let lastScrollY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY;

        if (currentY > lastScrollY && currentY > 120) {
          nav.classList.add('hidden');
        } else {
          nav.classList.remove('hidden');
        }

        lastScrollY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  });


  // ── SMOOTH SCROLL for nav links ──
  document.querySelectorAll('.nav-links a, .nav-logo').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 90;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });


  // ── LOCAL TIME DISPLAY ──
  const timeEl = document.getElementById('local-time');

  function updateTime() {
    const now = new Date();
    // IST offset: +5:30
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + 5.5 * 3600000);

    const hours = ist.getHours().toString().padStart(2, '0');
    const mins  = ist.getMinutes().toString().padStart(2, '0');
    const secs  = ist.getSeconds().toString().padStart(2, '0');

    timeEl.textContent = `${hours}:${mins}:${secs}`;
  }

  updateTime();
  setInterval(updateTime, 1000);


  // ── SKILL CHIPS: Tilt micro-interaction ──
  document.querySelectorAll('.skill-chip').forEach((chip) => {
    chip.addEventListener('mousemove', (e) => {
      const rect = chip.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      chip.style.transform = `translateY(-4px) perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    chip.addEventListener('mouseleave', () => {
      chip.style.transform = 'translateY(0) perspective(500px) rotateX(0) rotateY(0)';
    });
  });


  // ── BENTO CARD: Subtle tilt on hover ──
  document.querySelectorAll('.bento-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2;
      const rotateY = ((x - centerX) / centerX) * 2;

      card.style.transform = `translateY(0) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ── PARALLAX: Background name shifts with scroll ──
  const bgName = document.querySelector('.bg-name');

  if (bgName) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      const opacity = Math.max(0, 1 - scroll / 800);
      bgName.style.opacity = opacity;
      bgName.style.transform = `translate(-50%, calc(-50% + ${scroll * 0.15}px))`;
    });
  }


  // ── CONTACT BUTTON: Ripple effect ──
  const contactBtn = document.getElementById('contact-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        width: 0; height: 0;
        left: ${e.offsetX}px;
        top: ${e.offsetY}px;
        transform: translate(-50%, -50%);
        animation: ripple-out 0.6s ease-out forwards;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });

    // Inject ripple keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple-out {
        to { width: 300px; height: 300px; opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

})();