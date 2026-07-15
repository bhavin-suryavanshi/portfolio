/* ============================================================
   Bhavin Suryavanshi — Portfolio Scripts
   ============================================================ */

(function () {
  'use strict';

  // ─── LOADING SCREEN ───────────────────────────────────────
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hide');
        setTimeout(() => loader.remove(), 600);
      }, 800);
    }

    // Re-trigger KPI bar animations
    document.querySelectorAll('.kpi-bars i').forEach(bar => {
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = null;
    });
  });

  // ─── YEAR ─────────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── MOBILE NAV TOGGLE ────────────────────────────────────
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ─── STICKY NAV SCROLL EFFECT ─────────────────────────────
  const header = document.querySelector('header');
  const scrollThreshold = 60;

  // ─── SCROLL PROGRESS BAR ─────────────────────────────────
  const scrollProgress = document.getElementById('scrollProgress');

  // ─── BACK TO TOP BUTTON ───────────────────────────────────
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Combined scroll handler
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      // Nav shadow
      if (header) {
        header.classList.toggle('scrolled', scrollY > scrollThreshold);
      }

      // Scroll progress bar
      if (scrollProgress) {
        scrollProgress.style.width = progress + '%';
      }

      // Back to top
      if (backToTop) {
        backToTop.classList.toggle('show', scrollY > 400);
      }

      // Active nav link
      updateActiveNav();

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ─── ACTIVE NAV LINK HIGHLIGHTING ────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let currentSection = '';

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentSection = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentSection);
    });
  }

  // ─── SCROLL REVEAL (Intersection Observer) ────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ─── ANIMATED COUNTER ─────────────────────────────────────
  const counterElements = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window && counterElements.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterElements.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const isDecimal = String(target).includes('.');
    const duration = 1400;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      const current = target * eased;

      el.textContent = prefix + (isDecimal ? current.toFixed(2) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + (isDecimal ? target.toFixed(2) : target) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ─── PARTICLE BACKGROUND ──────────────────────────────────
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let animationId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        // Use brass or teal colors
        this.color = Math.random() > 0.5
          ? `rgba(201, 162, 39, ${this.opacity})`
          : `rgba(63, 138, 140, ${this.opacity})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.8;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }

        // Dampen velocity
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Wrap around
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Determine particle count based on screen size
    function getParticleCount() {
      const area = window.innerWidth * window.innerHeight;
      return Math.min(Math.max(Math.floor(area / 12000), 30), 100);
    }

    function initParticles() {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function drawLines() {
      const maxDist = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 162, 39, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawLines();
      animationId = requestAnimationFrame(animate);
    }
    animate();

    // Pause animation when tab is hidden (perf)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
  }

  // ─── CURSOR GLOW ──────────────────────────────────────────
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let glowX = 0, glowY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      glowX = e.clientX;
      glowY = e.clientY;
    });

    function updateGlow() {
      currentX += (glowX - currentX) * 0.08;
      currentY += (glowY - currentY) * 0.08;
      cursorGlow.style.left = currentX + 'px';
      cursorGlow.style.top = currentY + 'px';
      requestAnimationFrame(updateGlow);
    }
    requestAnimationFrame(updateGlow);
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  // ─── BUTTON SPOTLIGHT EFFECT ──────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--x', x + '%');
      btn.style.setProperty('--y', y + '%');
    });
  });

  // ─── TILT EFFECT ON KPI CARD ──────────────────────────────
  const kpiCard = document.querySelector('.kpi-card');
  if (kpiCard && window.matchMedia('(pointer: fine)').matches) {
    kpiCard.addEventListener('mousemove', (e) => {
      const rect = kpiCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      kpiCard.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    kpiCard.addEventListener('mouseleave', () => {
      kpiCard.style.transform = '';
    });
  }

  // ─── CONTACT FORM HANDLING ────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      formStatus.textContent = 'Sending...';
      formStatus.className = 'form-status sending';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.textContent = '✓ Message sent successfully!';
          formStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        formStatus.textContent = 'Failed to send. Please email me directly.';
        formStatus.className = 'form-status error';
      }

      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 5000);
    });
  }

  // ─── TYPING ANIMATION FOR HERO ────────────────────────────
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const words = ['decisions', 'insights', 'strategy', 'growth', 'clarity'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimer;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }

      typeTimer = setTimeout(type, delay);
    }

    // Start after a brief delay
    setTimeout(type, 1200);
  }

  // ─── SMOOTH ANCHOR SCROLLING WITH OFFSET ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
