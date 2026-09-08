const typingText = document.getElementById('typingText');
const words = ['Data Engineer', 'Cloud Learner', 'Python Developer', 'Analytics Enthusiast'];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = words[wordIndex];
  typingText.textContent = deleting
    ? current.slice(0, charIndex--)
    : current.slice(0, charIndex++);

  let delay = deleting ? 42 : 82;

  if (!deleting && charIndex > current.length) {
    deleting = true;
    delay = 1150;
  } else if (deleting && charIndex < 0) {
    deleting = false;
    charIndex = 0;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 260;
  }

  setTimeout(typeLoop, delay);
}

typeLoop();

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((item) => revealObserver.observe(item));

const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => nav.classList.toggle('open'));

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const heroVisual = document.getElementById('heroVisual');
if (heroVisual && window.matchMedia('(min-width: 900px)').matches) {
  window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 7;
    const y = (event.clientY / window.innerHeight - 0.5) * -5;
    heroVisual.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    heroVisual.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

const canvas = document.getElementById('particleCanvas');
const ctx = canvas?.getContext('2d');
let particles = [];
let animationId;

function setupParticles() {
  if (!canvas || !ctx) return;
  const hero = canvas.parentElement;
  const rect = hero.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = window.innerWidth < 700 ? 24 : 45;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * rect.width,
    y: Math.random() * rect.height,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    r: Math.random() * 1.4 + 0.5,
    alpha: Math.random() * 0.3 + 0.12
  }));
}

function drawParticles() {
  if (!canvas || !ctx) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    const warm = index % 2 === 0;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
    gradient.addColorStop(0, warm ? `rgba(184,95,52,${p.alpha})` : `rgba(85,127,114,${p.alpha})`);
    gradient.addColorStop(1, warm ? 'rgba(184,95,52,0)' : 'rgba(85,127,114,0)');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 110) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(87,91,79,${0.055 * (1 - distance / 110)})`;
        ctx.lineWidth = 0.7;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  animationId = requestAnimationFrame(drawParticles);
}

setupParticles();
drawParticles();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    cancelAnimationFrame(animationId);
    setupParticles();
    drawParticles();
  }, 150);
});

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a');

window.addEventListener('scroll', () => {
  let current = 'home';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 180) current = section.id;
  });

  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${current}`;
    link.style.color = active ? '#20211e' : '';
    link.style.textShadow = 'none';
    link.style.fontWeight = active ? '700' : '';
  });
});
