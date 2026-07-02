// ================================================================
// RAPIASEO — interacciones del sitio
// ================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------
  // 1. NAVBAR + PROGRESS BAR
  // --------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('progress-bar');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 40);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';

    if (backToTop) {
      backToTop.classList.toggle('show', scrollY > 700);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --------------------------------------------------------------
  // 2. MENÚ MÓVIL
  // --------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.innerHTML = isOpen ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = '';
    });
  });

  // --------------------------------------------------------------
  // 3. SCROLLSPY
  // --------------------------------------------------------------
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');
  const spySections = Array.from(navAnchors)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  spySections.forEach(sec => spyObserver.observe(sec));

  // --------------------------------------------------------------
  // 4. SCROLL REVEAL
  // --------------------------------------------------------------
  const revealTargets = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------
  // 5. CONTADORES ANIMADOS
  // --------------------------------------------------------------
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const formatted = Math.round(eased * target).toLocaleString('es-CO');
        el.textContent = '$' + formatted + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterObserver.observe(el));

  // --------------------------------------------------------------
  // 6. ACORDEONES (tablas de insumos)
  // --------------------------------------------------------------
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const target = document.getElementById(this.dataset.target);
      if (!target) return;
      target.classList.toggle('open');
      this.classList.toggle('open');
      const label = this.dataset.label;
      if (label) {
        const isOpen = this.classList.contains('open');
        this.querySelector('.btn-text').textContent = isOpen ? `Ocultar ${label}` : `Ver ${label}`;
      }
    });
  });

  // --------------------------------------------------------------
  // 7. ACORDEÓN "POR QUÉ ELEGIRNOS"
  // --------------------------------------------------------------
  document.querySelectorAll('.accordion-diff-header').forEach(header => {
    header.addEventListener('click', function() {
      const parent = this.closest('.accordion-diff-item');
      if (!parent) return;
      parent.classList.toggle('open');
    });
  });

  // --------------------------------------------------------------
  // 8. ACORDEÓN "SERVICIOS FIJOS / ESPECIALIZADOS"
  // --------------------------------------------------------------
  document.querySelectorAll('.service-accordion-header').forEach(header => {
    header.addEventListener('click', function() {
      const parent = this.closest('.service-accordion-item');
      if (!parent) return;
      parent.classList.toggle('open');
    });
  });

  // --------------------------------------------------------------
  // 9. DESPLEGABLES DE LOS PILARES (El Diferenciador)
  // --------------------------------------------------------------
  document.querySelectorAll('.pilar-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.dataset.target;
      const details = document.getElementById(targetId);
      if (!details) return;
      details.classList.toggle('open');
      this.classList.toggle('open');
      const isOpen = this.classList.contains('open');
      this.innerHTML = isOpen ? 'Ver menos <i class="fas fa-chevron-up"></i>' : 'Ver más <i class="fas fa-chevron-down"></i>';
    });
  });

  // --------------------------------------------------------------
  // 10. TABS (servicios)
  // --------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tabs-wrapper');
      if (!group) return;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = group.querySelector('#' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  // --------------------------------------------------------------
  // 11. MODAL DE IMÁGENES
  // --------------------------------------------------------------
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');

  window.openModal = function(src, alt) {
    if (modal && modalImg) {
      modal.classList.add('show');
      modalImg.src = src;
      modalImg.alt = alt || 'Imagen ampliada';
      document.body.style.overflow = 'hidden';
    }
  };
  window.closeModal = function() {
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  };

  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });
  }

  document.querySelectorAll('.image-thumb').forEach(thumb => {
    thumb.setAttribute('tabindex', '0');
    thumb.setAttribute('role', 'button');
    const img = thumb.querySelector('img');
    if (!img) return;
    const trigger = () => openModal(img.src, img.alt);
    thumb.addEventListener('click', trigger);
    thumb.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  });

  // Cerrar modal con Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('show')) closeModal();
    }
  });

  // --------------------------------------------------------------
  // 12. SCROLL SUAVE
  // --------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --------------------------------------------------------------
  // 13. BOTÓN VOLVER ARRIBA
  // --------------------------------------------------------------
  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  console.log('✅ Script cargado correctamente.');
});