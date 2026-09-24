/**
 * Kenneth Portfolio - Interactive functionality
 * Handles: contact form, scroll spy, back-to-top,
 * smooth scroll, scroll animations, real-time validation
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initTheme();
    initMenu();
    initNavbarState();
    initHeaderHide();
    initSmoothScroll();
    initYear();
    initBackToTop();
    initScrollSpy();
    initScrollReveal();
    initForm();
    initCharCounter();
    initLoader();
    initScrollProgress();
    initTimelineProgress();
    initTyping();
    initCounters();
    initSkillBars();
    initFilters();
    initModal();
    initFaq();
    initSpotlight();
    initTilt();
    initMagnetic();
    initCursorGlow();
    initPalette();
    initResume();
  }

  /* ============================================================
     THEME TOGGLE (dark / light with localStorage)
     ============================================================ */
  function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');
    const saved = localStorage.getItem('portfolioTheme');
    if (saved === 'dark' || saved === 'light') {
      root.setAttribute('data-theme', saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.setAttribute('data-theme', 'dark');
    }
    syncThemeBtn();
    syncMeta();
    if (toggle) {
      toggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('portfolioTheme', next);
        syncThemeBtn();
        syncMeta();
      });
    }
    function syncMeta() {
      if (!meta) return;
      meta.setAttribute('content', root.getAttribute('data-theme') === 'dark' ? '#0f172a' : '#1b2a41');
    }
    function syncThemeBtn() {
      if (!toggle) return;
      const isDark = root.getAttribute('data-theme') === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  /* ============================================================
     MOBILE MENU + NAVBAR SCROLL STATE
     ============================================================ */
  function initMenu() {
    const btn = document.getElementById('menu-toggle');
    const list = document.getElementById('nav-list');
    if (!btn || !list) return;

    btn.addEventListener('click', () => {
      const isOpen = list.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    list.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        list.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && list.classList.contains('open')) {
        list.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  }

  function initNavbarState() {
    const nav = document.getElementById('nav-inner');
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ============================================================
     SMOOTH SCROLL (with offset for fixed header)
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          target.focus({ preventScroll: true });
        }
      });
    });
  }

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ============================================================
     BACK-TO-TOP BUTTON
     ============================================================ */
  function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    let visible = false;

    const toggleVisibility = () => {
      const shouldBeVisible = window.scrollY > 400;

      if (shouldBeVisible && !visible) {
        backToTop.classList.add('visible');
        backToTop.setAttribute('aria-hidden', 'false');
        visible = true;
      } else if (!shouldBeVisible && visible) {
        backToTop.classList.remove('visible');
        backToTop.setAttribute('aria-hidden', 'true');
        visible = false;
      }
    };

    toggleVisibility();

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ============================================================
     SCROLL SPY (highlight active nav link)
     ============================================================ */
  function initScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-list a[data-nav]');
    const sections = document.querySelectorAll('[data-section]');

    if (!navLinks.length || !sections.length) return;

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.dataset.section;
        const navLink = document.querySelector(`.nav-list a[data-nav="${sectionId}"]`);

        if (!navLink) return;

        if (entry.isIntersecting) {
          navLink.classList.add('active');
          navLink.setAttribute('aria-current', 'page');
        } else {
          navLink.classList.remove('active');
          navLink.removeAttribute('aria-current');
        }
      });
    }, {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  }

  /* ============================================================
     SCROLL REVEAL (IntersectionObserver animations)
     ============================================================ */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe cards (existing animation)
    document.querySelectorAll('.card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });

    // Observe additional reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });

    // Inject visible-state styles
    const style = document.createElement('style');
    style.textContent = `
      .card.visible { opacity: 1 !important; transform: translateY(0) !important; }
      @media (prefers-reduced-motion: reduce) {
        .card,
        .reveal {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* ============================================================
     CONTACT FORM (validation, draft saving, submission)
     ============================================================ */
  function initForm() {
    const form = document.getElementById('portfolio-form');
    const statusEl = document.getElementById('form-status');
    const saveBtn = document.getElementById('save-contact');

    if (!form || !statusEl) return;

    loadDraft();

    form.addEventListener('submit', handleSubmit);

    if (saveBtn) {
      saveBtn.addEventListener('click', saveDraft);
    }

    // Real-time validation + debounced auto-save
    const draftFields = ['name', 'email', 'message'];
    let debounceTimer;

    form.addEventListener('input', (e) => {
      if (draftFields.includes(e.target.id)) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(saveDraft, 1000);
      }
      validateField(e.target);
    });

    // Validate on blur (when user leaves a field)
    form.addEventListener('blur', (e) => {
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        validateField(target);
      }
    }, true);
  }

  /* --- Draft loading --- */
  function loadDraft() {
    try {
      const saved = localStorage.getItem('portfolioContactDraft');
      if (!saved) return;

      const draft = JSON.parse(saved);
      Object.entries(draft).forEach(([key, value]) => {
        const field = document.getElementById(key);
        if (field && value) {
          field.value = value;
        }
      });
      showStatus('Draft restored from previous session.', 'success');
    } catch (err) {
      console.warn('Failed to load draft:', err);
    }
  }

  /* --- Draft saving --- */
  function saveDraft() {
    const draft = {
      name: document.getElementById('name')?.value || '',
      email: document.getElementById('email')?.value || '',
      message: document.getElementById('message')?.value || ''
    };

    const hasContent = Object.values(draft).some(v => v.trim().length > 0);
    if (!hasContent) {
      showStatus('Nothing to save.', 'error');
      return;
    }

    try {
      localStorage.setItem('portfolioContactDraft', JSON.stringify(draft));
      showStatus('Draft saved successfully.', 'success');
    } catch (err) {
      console.error('Failed to save draft:', err);
      showStatus('Failed to save draft.', 'error');
    }
  }

  /* --- Real-time field validation --- */
  function validateField(field) {
    const value = field.value.trim();
    const errorEl = document.getElementById(field.id + '-error');
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required.';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address.';
    } else if (field.id === 'message' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'Message must be at least 10 characters.';
    }

    field.classList.toggle('error', !isValid);
    field.classList.toggle('valid', isValid && value);

    if (errorEl) {
      errorEl.textContent = errorMessage;
      errorEl.classList.toggle('visible', !isValid && value);
    }

    return isValid;
  }

  /* --- Email format validation --- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* --- Form submission --- */
  function handleSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Run real-time validation on all fields
    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isMessageValid = validateField(messageInput);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    submitForm({ name, email, message });
  }

  /* --- Simulated form submission --- */
  function submitForm(data) {
    const submitBtn = document.querySelector('#portfolio-form button[type="submit"]');
    const originalText = submitBtn?.textContent;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    showStatus('Sending your message...', 'success');

    // Simulate API call
    setTimeout(() => {
      localStorage.removeItem('portfolioContactDraft');
      document.getElementById('portfolio-form')?.reset();

      // Clear validation states
      document.querySelectorAll('.form-field input, .form-field textarea').forEach(field => {
        field.classList.remove('error', 'valid');
      });
      document.querySelectorAll('.field-error').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
      });

      showStatus(`Thanks, ${data.name}! Your message has been sent.`, 'success');

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText || 'Send Message';
      }
    }, 1500);
  }

  /* --- Status message display --- */
  function showStatus(message, type = 'success') {
    const statusEl = document.getElementById('form-status');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.hidden = false;
    statusEl.classList.toggle('error', type === 'error');

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (statusEl.textContent === message) {
          statusEl.hidden = true;
          statusEl.classList.remove('error');
        }
      }, 5000);
    }
  }

  /* ============================================================
     ENHANCEMENTS v2
     ============================================================ */

  function toast(message, type = 'success') {
    const stack = document.getElementById('toast-stack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 320);
    }, 3200);
  }

  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    const hide = () => loader.classList.add('done');
    window.addEventListener('load', () => setTimeout(hide, 350));
    setTimeout(hide, 2500); // fallback
  }

  function initScrollProgress() {
    const fill = document.getElementById('scroll-progress-fill');
    if (!fill) return;
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      fill.style.width = pct.toFixed(2) + '%';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initTyping() {
    const el = document.getElementById('typed-role');
    if (!el) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const words = ['Beginner Developer', 'Python Learner', 'Java Explorer', 'C# Student', 'Web Builder'];
    let wi = 0, ci = words[0].length, deleting = true;
    const tick = () => {
      const word = words[wi];
      if (deleting) {
        ci -= 1;
        if (ci <= 0) { ci = 0; deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 450); return; }
      } else {
        const target = words[wi];
        ci += 1;
        el.textContent = target.slice(0, ci);
        if (ci >= target.length) { deleting = true; setTimeout(tick, 1600); return; }
        setTimeout(tick, 55);
        return;
      }
      el.textContent = word.slice(0, ci);
      setTimeout(tick, deleting ? 32 : 55);
    };
    setTimeout(tick, 1800);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.count[data-count]');
    if (!counters.length || !('IntersectionObserver' in window)) return;
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const dur = 1100, start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => obs.observe(c));
  }

  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar span[data-w]');
    if (!bars.length || !('IntersectionObserver' in window)) {
      bars.forEach(b => { b.style.width = b.dataset.w; });
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.style.width = e.target.dataset.w; obs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    bars.forEach(b => obs.observe(b));
  }

  function initFilters() {
    const btns = document.querySelectorAll('.filter-btn[data-filter]');
    const cards = document.querySelectorAll('#project-grid .project-item');
    if (!btns.length || !cards.length) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        const f = btn.dataset.filter;
        cards.forEach(card => {
          const show = f === 'all' || card.dataset.category === f;
          card.classList.toggle('is-hidden', !show);
          if (show) { card.classList.remove('visible'); requestAnimationFrame(() => card.classList.add('visible')); }
        });
      });
    });
  }

  const PROJECT_DETAILS = {
    car: {
      tag: 'Java • OOP',
      title: 'Car Rental System',
      desc: 'Console-based rental workflow with bookings, customers, and transaction records. Built to practice classes, lists, and clean menu design.',
      points: ['OOP structure: Vehicle, Customer, Booking classes', 'Booking + return workflow with validation', 'What I learned: encapsulation & error handling']
    },
    barangay: {
      tag: 'Python • Data',
      title: 'Barangay Disaster Risk Management',
      desc: 'Python tool for tracking disaster data and barangay reports — focused on clear data entry and readable summaries.',
      points: ['Data entry + reporting flow', 'Risk summaries for quick review', 'What I learned: file handling & data cleaning']
    },
    web: {
      tag: 'HTML • CSS • C#',
      title: 'Web & App Development',
      desc: 'Ongoing experiments connecting front-end layouts with C# programming concepts — forms, lists, and interactive pages.',
      points: ['Responsive one-page layouts', 'Form validation practice', 'What I learned: from static page to usable app']
    }
  };

  function initModal() {
    const backdrop = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    if (!backdrop) return;
    const tag = document.getElementById('modal-tag');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    const list = document.getElementById('modal-list');
    const cta = document.getElementById('modal-cta');
    let lastFocus = null;

    const open = (key, trigger) => {
      const d = PROJECT_DETAILS[key];
      if (!d) return;
      lastFocus = trigger || document.activeElement;
      tag.textContent = d.tag;
      title.textContent = d.title;
      desc.textContent = d.desc;
      list.innerHTML = '';
      d.points.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p;
        list.appendChild(li);
      });
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };
    const close = () => {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); open(btn.dataset.openModal, btn); });
    });
    document.querySelectorAll('#project-grid .project-item').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => open(card.dataset.project, card));
    });
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && backdrop.classList.contains('open')) close(); });
    if (cta) cta.addEventListener('click', close);
  }

  function initFaq() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;
    items.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) items.forEach(o => { if (o !== item) o.open = false; });
      });
    });
  }

  function initSpotlight() {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.spotlight').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  function initTilt() {
    const frame = document.getElementById('portrait-tilt');
    if (!frame) return;
    if (window.matchMedia && (window.matchMedia('(hover: none)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    frame.addEventListener('pointermove', (e) => {
      const r = frame.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
      frame.style.transform = `rotate(-1.5deg) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.015)`;
    });
    frame.addEventListener('pointerleave', () => { frame.style.transform = ''; });
  }

  function initResume() {
    const btn = document.getElementById('resume-btn');
    if (btn) btn.addEventListener('click', () => { toast('Use Print → Save as PDF for your résumé', 'success'); setTimeout(() => window.print(), 600); });
    const clearBtn = document.getElementById('clear-contact');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const form = document.getElementById('portfolio-form');
        if (!form) return;
        form.reset();
        localStorage.removeItem('portfolioContactDraft');
        document.querySelectorAll('.form-field input, .form-field textarea').forEach(f => f.classList.remove('error', 'valid'));
        document.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; el.classList.remove('visible'); });
        showStatus('Form cleared.', 'success');
        toast('Draft cleared', 'success');
      });
    }
    // Upgrade existing save/submit feedback with toasts
    const saveBtn = document.getElementById('save-contact');
    if (saveBtn) saveBtn.addEventListener('click', () => toast('Draft save requested', 'success'), { once: true });
  }

  /* ============================================================
     ENHANCEMENTS v3 — header hide, timeline progress,
     char counter, cursor glow, magnetic, palette
     ============================================================ */

  function initHeaderHide() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const list = document.getElementById('nav-list');
      const menuOpen = list && list.classList.contains('open');
      if (!menuOpen && y > 320 && y > lastY + 4) {
        nav.classList.add('nav--hidden');
      } else if (y < lastY - 4 || y < 320) {
        nav.classList.remove('nav--hidden');
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initTimelineProgress() {
    const tl = document.getElementById('timeline');
    if (!tl || !('IntersectionObserver' in window)) return;
    const update = () => {
      const r = tl.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = r.height + vh * 0.4;
      const passed = Math.min(Math.max(vh * 0.7 - r.top, 0), total);
      tl.style.setProperty('--tp', (passed / total).toFixed(3));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function initCharCounter() {
    const msg = document.getElementById('message');
    const count = document.getElementById('message-count');
    if (!msg || !count) return;
    const max = parseInt(msg.getAttribute('maxlength'), 10) || 500;
    const update = () => {
      const len = msg.value.length;
      count.textContent = len + ' / ' + max;
      count.classList.toggle('near', len > max * 0.85 && len <= max);
      count.classList.toggle('over', len > max);
    };
    update();
    msg.addEventListener('input', update);
    const clearBtn = document.getElementById('clear-contact');
    if (clearBtn) clearBtn.addEventListener('click', () => setTimeout(update, 0));
    const form = document.getElementById('portfolio-form');
    if (form) form.addEventListener('reset', () => setTimeout(update, 0));
  }

  function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    if (window.matchMedia && (window.matchMedia('(hover: none)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    let x = -400, y = -400, tx = x, ty = y, raf = null;
    const render = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) {
        raf = requestAnimationFrame(render);
      } else { raf = null; }
    };
    document.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add('on');
      if (!raf) raf = requestAnimationFrame(render);
    }, { passive: true });
    document.addEventListener('pointerleave', () => glow.classList.remove('on'));
  }

  function initMagnetic() {
    if (window.matchMedia && (window.matchMedia('(hover: none)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    document.querySelectorAll('.btn--primary, .brand, .back-to-top').forEach(el => {
      let raf = null;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = 'translate(' + (dx * 4).toFixed(1) + 'px,' + (dy * 4).toFixed(1) + 'px)';
        });
      });
      el.addEventListener('pointerleave', () => {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = '';
      });
    });
  }

  function initPalette() {
    const backdrop = document.getElementById('palette');
    const input = document.getElementById('palette-input');
    const list = document.getElementById('palette-list');
    const trigger = document.getElementById('palette-trigger');
    if (!backdrop || !input || !list) return;
    const items = [
      { id: 'home', label: 'Home', hint: 'Intro', key: 'H' },
      { id: 'about', label: 'About', hint: 'Story', key: 'A' },
      { id: 'skills', label: 'Skills', hint: 'Stack', key: 'S' },
      { id: 'projects', label: 'Projects', hint: 'Work', key: 'P' },
      { id: 'contact', label: 'Contact', hint: 'Say hi', key: 'C' }
    ];
    let selected = 0;
    let lastFocus = null;

    const render = (q) => {
      const query = (q || '').trim().toLowerCase();
      const shown = items.filter(i => !query || i.label.toLowerCase().includes(query) || i.hint.toLowerCase().includes(query));
      list.innerHTML = '';
      shown.forEach((item, idx) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('role', 'option');
        btn.setAttribute('aria-selected', String(idx === selected));
        btn.innerHTML = '<span class="palette-key">' + item.key + '</span><span>' + item.label + '</span><small>' + item.hint + '</small>';
        btn.addEventListener('click', () => go(item.id));
        li.appendChild(btn);
        list.appendChild(li);
      });
      if (!shown.length) {
        const li = document.createElement('li');
        li.innerHTML = '<button type="button" disabled>No matches</button>';
        list.appendChild(li);
      }
      return shown;
    };

    const open = () => {
      lastFocus = document.activeElement;
      selected = 0;
      render('');
      input.value = '';
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input.focus(), 30);
      setTimeout(() => render(''), 40);
    };
    const close = () => {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    const go = (id) => {
      close();
      const target = document.getElementById(id);
      if (!target) return;
      setTimeout(() => {
        const y = target.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
        target.focus({ preventScroll: true });
      }, 60);
    };

    if (trigger) trigger.addEventListener('click', open);
    document.addEventListener('keydown', (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (backdrop.classList.contains('open')) close(); else open();
      } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        close();
      } else if (backdrop.classList.contains('open') && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const shown = render(input.value);
        if (!shown.length) return;
        selected = e.key === 'ArrowDown' ? (selected + 1) % shown.length : (selected - 1 + shown.length) % shown.length;
        render(input.value);
      } else if (backdrop.classList.contains('open') && e.key === 'Enter') {
        const shown = render(input.value);
        if (shown[selected]) go(shown[selected].id);
      }
    });
    input.addEventListener('input', () => { selected = 0; render(input.value); });
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  }
})();
