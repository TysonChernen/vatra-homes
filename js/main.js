document.addEventListener('DOMContentLoaded', () => {

  // ── Preloader ──
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 2000);
  });
  setTimeout(() => preloader.classList.add('hidden'), 3500);

  // ── Navigation ──
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Scroll Reveal ──
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // ── Stat Counter Animation ──
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => counterObserver.observe(el));

  // ── Featured Gallery (Native Scroll + Snap) ──
  const track = document.getElementById('featuredTrack');
  const prevBtn = document.getElementById('featuredPrev');
  const nextBtn = document.getElementById('featuredNext');
  const currentEl = document.getElementById('featuredCurrent');

  if (track) {
    const slides = track.querySelectorAll('.featured-slide');

    const getScrollStep = () => {
      const slide = slides[0];
      if (!slide) return 350;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return slide.offsetWidth + gap;
    };

    // Update counter using IntersectionObserver for accuracy with snap points
    const observerOptions = {
      root: track,
      threshold: 0.6
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(slides).indexOf(entry.target);
          if (currentEl) currentEl.textContent = index + 1;
        }
      });
    }, observerOptions);

    slides.forEach(slide => counterObserver.observe(slide));

    // Arrow buttons
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      });
    }
  }

  // ── Portfolio Filters ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeUp 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ── Portfolio Lightbox & Multi-Photo Gallery ──
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxContent = lightbox.querySelector('.lightbox-content');

  // Handle Portfolio Item Click
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const galleryData = JSON.parse(item.dataset.gallery || '[]');
      if (galleryData.length === 0) return;

      // Create Lightbox Structure
      lightboxContent.innerHTML = `
        <div class="lightbox-track" id="lightboxTrack">
          ${galleryData.map(src => `
            <div class="lightbox-slide">
              <img src="${src}" alt="Project Photo">
            </div>
          `).join('')}
        </div>
        <div class="lightbox-nav">
          <button class="lightbox-btn" id="lboxPrev" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="lightbox-btn" id="lboxNext" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      `;

      const track = document.getElementById('lightboxTrack');
      const prev = document.getElementById('lboxPrev');
      const next = document.getElementById('lboxNext');

      if (prev && next && track) {
        prev.addEventListener('click', (e) => {
          e.stopPropagation();
          track.scrollBy({ left: -track.offsetWidth, behavior: 'smooth' });
        });
        next.addEventListener('click', (e) => {
          e.stopPropagation();
          track.scrollBy({ left: track.offsetWidth, behavior: 'smooth' });
        });
      }

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Thumbnail Slideshow Animation
  const thumbGalleries = document.querySelectorAll('.portfolio-thumb-gallery');
  thumbGalleries.forEach(gallery => {
    const images = gallery.querySelectorAll('.portfolio-thumb-img');
    if (images.length <= 1) return;

    let currentThumb = 0;
    setInterval(() => {
      images[currentThumb].classList.remove('active');
      currentThumb = (currentThumb + 1) % images.length;
      images[currentThumb].classList.add('active');
    }, 3000 + Math.random() * 2000); // Randomized timing for more natural feel
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxContent.innerHTML = ''; }, 400);
  };
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ── Contact Form ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<span>Message Sent!</span>';
      btn.style.background = '#2d8a4e';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  // ── Smooth Scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Parallax on hero video + about images ──
  const heroVideo = document.querySelector('.hero-video');
  const aboutMain = document.querySelector('.about-img--main');
  const aboutAccent = document.querySelector('.about-img--accent');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    if (heroVideo && scrolled < window.innerHeight) {
      heroVideo.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
    }

    if (aboutMain && aboutAccent) {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        const progress = -rect.top / (rect.height + window.innerHeight);
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          aboutMain.style.transform = `translateY(${progress * -30}px)`;
          aboutAccent.style.transform = `translateY(${progress * -55}px)`;
        }
      }
    }
  }, { passive: true });

  // ── Gold Section Line Traces ──
  const sectionLines = document.querySelectorAll('.section-line');
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('line-visible');
        lineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  sectionLines.forEach(el => lineObserver.observe(el));

  // ── Cursor Glow Trail ──
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    let mouseX = -500, mouseY = -500, glowX = -500, glowY = -500;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
    const lerp = (a, b, t) => a + (b - a) * t;
    const updateGlow = () => {
      glowX = lerp(glowX, mouseX, 0.08);
      glowY = lerp(glowY, mouseY, 0.08);
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(updateGlow);
    };
    cursorGlow.style.opacity = '0';
    requestAnimationFrame(updateGlow);
  }

  // ── Gold Scroll Particles ──
  const canvas = document.getElementById('goldCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, scrollY = 0, particles = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    const totalHeight = () => document.body.scrollHeight;

    class Particle {
      constructor() { this.reset(true); }
      reset(initial) {
        this.x = Math.random() * w;
        this.baseY = initial ? Math.random() * h : -Math.random() * 60 - 10;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.drift = Math.random() * 0.4 + 0.1;
        this.opacity = Math.random() * 0.35 + 0.08;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.glowSize = this.size > 2 ? this.size * 3 : 0;
      }
      update(time) {
        const scrollFactor = scrollY / (totalHeight() - h || 1);
        this.baseY += this.drift + scrollFactor * 1.5;
        this.x += this.speedX + Math.sin(time * 0.001 + this.pulseOffset) * 0.15;
        if (this.baseY > h + 20 || this.x < -20 || this.x > w + 20) this.reset(false);
        this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(time * this.pulseSpeed + this.pulseOffset));
      }
      draw() {
        if (this.glowSize > 0) {
          const grad = ctx.createRadialGradient(this.x, this.baseY, 0, this.x, this.baseY, this.glowSize);
          grad.addColorStop(0, `rgba(201, 169, 110, ${this.currentOpacity * 0.5})`);
          grad.addColorStop(1, 'rgba(201, 169, 110, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(this.x, this.baseY, this.glowSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(212, 185, 135, ${this.currentOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.baseY, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 35; i++) particles.push(new Particle());

    const animate = (time) => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(time); p.draw(); });
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  // ── Scroll Drawing Animation ──
  const scrollPath = document.getElementById('scroll-path');
  if (scrollPath) {
    const pathLength = scrollPath.getTotalLength();
    
    scrollPath.style.strokeDasharray = pathLength;
    scrollPath.style.strokeDashoffset = pathLength;

    const updateScrollPath = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      const scrollPercentage = Math.min(Math.max(scrollPos / scrollHeight, 0), 1);

      const drawLength = pathLength * scrollPercentage;
      scrollPath.style.strokeDashoffset = pathLength - drawLength;
    };

    window.addEventListener('scroll', updateScrollPath, { passive: true });
    updateScrollPath();
  }

});
