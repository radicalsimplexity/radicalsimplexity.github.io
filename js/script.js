/* ============================================================
   LESTER · MATH TUTOR — JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== 1. AOS INIT ===== */
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });


  /* ===== 2. NAVBAR SCROLL ===== */
  const navbar = document.getElementById('navbar');

  const updateNav = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ===== 3. MOBILE MENU ===== */
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose  = document.getElementById('mobileClose');

  const openMenu = () => {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  // Close on internal nav link click (not PDF links)
  mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  /* ===== 4. SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ===== 5. COUNTER ANIMATION ===== */
  const counters = document.querySelectorAll('.hs-num[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const update = () => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        return;
      }
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

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

  counters.forEach(counter => counterObserver.observe(counter));


  /* ===== 6. ACTIVE NAV LINK (scrollspy) ===== */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const setActive = () => {
    let current = '';
    const scrollY = window.scrollY + navbar.offsetHeight + 80;

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) current = section.id;
    });

    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();


  /* ===== 7. CONTACT FORM — build WhatsApp message ===== */
  const form = document.getElementById('enquiryForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name  = document.getElementById('fname').value.trim();
      const phone = document.getElementById('fphone').value.trim();
      const email = document.getElementById('femail').value.trim();
      const level = document.getElementById('flevel').value;
      const msg   = document.getElementById('fmsg').value.trim();

      if (!name || !phone) {
        showFormError('Please fill in your name and phone number.');
        return;
      }

      const lines = [
        `Hi Lester, I'm interested in mathematics tuition! 👋`,
        ``,
        `*Name:* ${name}`,
        `*Phone:* ${phone}`,
        email ? `*Email:* ${email}` : null,
        level  ? `*Level / Subject:* ${level}` : null,
        msg    ? `*Message:*\n${msg}` : null
      ]
        .filter(Boolean)
        .join('\n');

      const waNumber = '6587588329';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines)}`;

      window.open(waUrl, '_blank', 'noopener,noreferrer');
      showFormSuccess();
    });
  }

  function showFormError(msg) {
    const existing = form.querySelector('.form-msg');
    if (existing) existing.remove();
    const el = document.createElement('p');
    el.className = 'form-msg form-error';
    el.textContent = msg;
    el.style.cssText = 'color:#f87171;font-size:.85rem;margin-top:.5rem;';
    form.querySelector('.btn-submit').after(el);
    setTimeout(() => el.remove(), 4000);
  }

  function showFormSuccess() {
    const btn = form.querySelector('.btn-submit');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Opening WhatsApp…';
    btn.style.background = '#1da853';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
    }, 3000);
  }

});


/* ===== 8. CSS: active nav link highlight (injected) ===== */
const styleEl = document.createElement('style');
styleEl.textContent = `
  .nav-links a.active {
    color: #fff !important;
    background: rgba(245,158,11,.15) !important;
  }
`;
document.head.appendChild(styleEl);
