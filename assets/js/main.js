// ============================================================
// JJOKAH Portfolio — main.js
// ============================================================

/* ---------- Navbar scroll behaviour ---------- */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ---------- Mobile nav toggle ---------- */
const menuBtn = document.getElementById('nav-menu-btn');
const mobileNav = document.getElementById('nav-mobile');

if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.textContent = isOpen ? '✕' : '☰';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuBtn.textContent = '☰';
    });
  });
}

/* ---------- Typewriter effect ---------- */
function typewriter(el, phrases, speed = 70, pause = 1800) {
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    if (deleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
    } else {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
    }

    let delay = deleting ? speed / 2 : speed;

    if (!deleting && charIndex === current.length) {
      delay = pause;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
}

const typeEl = document.getElementById('typewriter');
if (typeEl) {
  typewriter(typeEl, [
    'AI Engineer',
    'Machine Learning Practitioner',
    'Software Engineer',
    'Systems Designer',
    'Python Developer',
  ]);
}

/* ---------- Scroll Reveal ---------- */
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ---------- Active nav link ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href*="index.html#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.style.color = href.includes(current) && current ? 'var(--red-light)' : '';
  });
}, { passive: true });
