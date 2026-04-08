/* ============================================================
   PASTELS SALON — SCRIPTS
   ============================================================ */

/* ── Cursor glow ── */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  if (cursorGlow) {
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top  = glowY + 'px';
  }
  requestAnimationFrame(animateCursor);
})();

/* ── Navbar ── */
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const burger = document.getElementById('burger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveLink();
}, { passive: true });

burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)'  : '';
  spans[1].style.opacity   = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.nav-link, .nav-mobile-cta a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
    document.body.style.overflow = '';
  });
});

/* ── Active nav link on scroll ── */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

/* ── Particle canvas ── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 55;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height,
    r:     Math.random() * 1.8 + 0.3,
    vx:    (Math.random() - 0.5) * 0.25,
    vy:    (Math.random() - 0.5) * 0.25,
    alpha: Math.random() * 0.5 + 0.1,
    pulse: Math.random() * Math.PI * 2,
  }));

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const a = p.alpha * (0.6 + 0.4 * Math.sin(t * 0.8 + p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196, 154, 108, ${a})`;
      ctx.fill();
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add('revealed'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Hero stat counter ── */
function animateCounter(el, target, suffix = '', duration = 1800) {
  let start = 0;
  const startTime = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.round(easeOut(progress) * target);
    el.textContent = value >= 1000
      ? (value / 1000).toFixed(1).replace('.0', '') + 'K' + suffix
      : value + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target >= 1000
      ? (target / 1000).toFixed(1).replace('.0', '') + 'K' + suffix
      : target + suffix;
  }
  requestAnimationFrame(step);
}

const statEls = document.querySelectorAll('.hstat-n[data-target]');
const heroSection = document.querySelector('.hero');
let statsAnimated = false;

const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statEls.forEach((el, i) => {
      setTimeout(() => {
        animateCounter(el, parseInt(el.dataset.target, 10), el.dataset.target >= 50 ? '+' : '+');
      }, i * 200 + 800);
    });
  }
}, { threshold: 0.5 });
if (heroSection) statsObserver.observe(heroSection);

/* ── Service cards staggered entrance ── */
const svcCards = document.querySelectorAll('.svc-card');
svcCards.forEach((card, i) => {
  card.style.transitionDelay = (i * 60) + 'ms';
});

/* ── Smooth parallax on hero orbs ── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.2}px)`;
  if (orb2) orb2.style.transform = `translateY(${scrollY * -0.12}px)`;
}, { passive: true });

/* ── Contact form ── */
const cform = document.getElementById('cform');
if (cform) {
  cform.addEventListener('submit', e => {
    e.preventDefault();
    const btn = cform.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = '✓  Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #7ABF8A, #4CAF6D)';
    btn.style.boxShadow  = '0 8px 28px rgba(76,175,109,0.4)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.boxShadow  = '';
      btn.disabled = false;
      cform.reset();
    }, 3800);
  });
}

/* ── Gallery items — subtle tilt on hover ── */
document.querySelectorAll('.gal-item').forEach(item => {
  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
    item.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.02)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

/* ── Service cards tilt ── */
document.querySelectorAll('.svc-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
    card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Nav CTA pulse ring ── */
const navCta = document.querySelector('.nav-cta');
if (navCta) {
  setInterval(() => {
    const ring = document.createElement('span');
    ring.style.cssText = `
      position:absolute; inset:0; border-radius:50px;
      border:2px solid rgba(196,154,108,0.7);
      animation:navPulseRing 0.8s ease-out forwards;
      pointer-events:none;
    `;
    navCta.style.position = 'relative';
    navCta.style.overflow = 'visible';
    navCta.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove());
  }, 4000);
}

/* Inject pulse ring keyframe */
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes navPulseRing {
    from { transform: scale(1); opacity: 0.8; }
    to   { transform: scale(1.4); opacity: 0; }
  }
`;
document.head.appendChild(styleEl);
