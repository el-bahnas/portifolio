/* =============================================
   AHMED ELBAHNASAWY — PORTFOLIO
   script.js — Interactivity & Animations
   ============================================= */

/* ---- BOOT SEQUENCE ---- */
const bootLines = [
  "BIOS v2.026 — AEB SYSTEMS",
  "Checking RAM.............. 16384MB OK",
  "Loading kernel modules... DONE",
  "Mounting /dev/portfolio.. DONE",
  "Initializing .NET runtime.. DONE",
  "Starting React engine...... DONE",
  "Connecting to SQL Server... DONE",
  "Loading profile: ahmed.elbahnasawy",
  "Verifying DEPI certificate.. VALID",
  "",
  ">> SYSTEM READY <<"
];

const bootTextEl  = document.getElementById('boot-text');
const bootBarEl   = document.getElementById('boot-bar');
const bootScreen  = document.getElementById('boot-screen');
const mainContent = document.getElementById('main-content');
let booted        = false;

function finishBoot() {
  if (booted) return;
  booted = true;
  bootScreen.classList.add('fade-out');
  setTimeout(() => {
    bootScreen.style.display = 'none';
    mainContent.classList.remove('hidden');
    startPortfolio();
  }, 650);
}

async function runBoot() {
  let progress = 0;
  for (let i = 0; i < bootLines.length; i++) {
    if (booted) return;
    bootTextEl.textContent += bootLines[i] + '\n';
    progress = Math.round(((i + 1) / bootLines.length) * 100);
    bootBarEl.style.width = progress + '%';
    await sleep(i === bootLines.length - 1 ? 500 : randomBetween(80, 260));
  }
  await sleep(600);
  finishBoot();
}

document.addEventListener('keydown', finishBoot);
document.addEventListener('click',   finishBoot);
runBoot();

/* ---- HELPERS ---- */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function randomBetween(a, b) { return Math.floor(Math.random() * (b - a) + a); }

/* ---- MAIN INIT ---- */
function startPortfolio() {
  initClock();
  initCursor();
  initTypewriter();
  initAboutTerminal();
  initScrollAnimations();
  initNavHighlight();
  initPhotoHover();
  initContactForm();
}

/* ---- CLOCK ---- */
function initClock() {
  const el = document.getElementById('clock');
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');
    el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ---- CUSTOM CURSOR ---- */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  let tx = 0, ty = 0, mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  function animTrail() {
    tx += (mx - tx) * 0.2;
    ty += (my - ty) * 0.2;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();
}

/* ---- TYPEWRITER ---- */
const roles = [
  'Full Stack .NET Developer_',
  'C# Enthusiast_',
  'ASP.NET Core Builder_',
  'Angular Frontend Dev_',
  'API Architect_',
];
let roleIndex = 0, charIndex = 0, deleting = false;
async function initTypewriter() {
  const el = document.getElementById('typewriter');
  while (true) {
    const text = roles[roleIndex];
    if (!deleting) {
      el.textContent = text.slice(0, ++charIndex);
      if (charIndex === text.length) { await sleep(1800); deleting = true; }
      else await sleep(55);
    } else {
      el.textContent = text.slice(0, --charIndex);
      if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; await sleep(300); }
      else await sleep(30);
    }
  }
}

/* ---- ABOUT TERMINAL ---- */
const aboutText =
`Motivated and detail-oriented Full Stack
.NET Developer — Faculty of Computers &
Informatics, IT major (2023-present).

DEPI certified in Full Stack .NET.
Experienced with C#, ASP.NET Core,
Entity Framework, SQL Server,
HTML, CSS, JavaScript, and React.

Passionate about clean, maintainable code
and continuously learning through
real-world projects and collaboration.`;

async function initAboutTerminal() {
  await sleep(400);
  const el = document.getElementById('about-output');
  for (let i = 0; i < aboutText.length; i++) {
    el.textContent += aboutText[i];
    await sleep(aboutText[i] === '\n' ? 60 : 14);
  }
}

/* ---- SCROLL ANIMATIONS ---- */
function initScrollAnimations() {
  // Fade-up elements
  const fadeTargets = document.querySelectorAll(
    '.section-header, .about-left, .stats-panel, .summary-card, .terminal-box, .skill-card, .project-card, .contact-body, footer'
  );
  fadeTargets.forEach(el => {
    el.classList.add('fade-in-up');
  });

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.children);
      const delay    = siblings.indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);

      // Skill bars
      if (entry.target.classList.contains('skill-card')) triggerSkillFill(entry.target);
      // XP bars
      if (entry.target.classList.contains('stats-panel')) triggerXpBars();

      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  fadeTargets.forEach(el => fadeObserver.observe(el));

  // Education cards — slide in from left
  const eduCards = document.querySelectorAll('.edu-card');
  const eduObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Trigger degree bar if this card has one
        const bar = entry.target.querySelector('.edu-bar-fill');
        if (bar) triggerEduBar(bar);
      }, i * 200);
      eduObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  eduCards.forEach(c => eduObserver.observe(c));

  // Hero photo fade in
  const photo = document.getElementById('hero-photo');
  if (photo) {
    photo.style.opacity = '0';
    photo.style.transform = 'scale(1.04)';
    photo.style.transition = 'opacity 1s ease 0.6s, transform 1s ease 0.6s';
    setTimeout(() => {
      photo.style.opacity = '1';
      photo.style.transform = 'scale(1)';
    }, 300);
  }
}

/* ---- SKILL BARS ---- */
function triggerSkillFill(card) {
  const level = card.getAttribute('data-level') || 75;
  const fill  = card.querySelector('.skill-fill');
  if (fill) setTimeout(() => { fill.style.width = level + '%'; }, 200);
}

/* ---- XP BARS ---- */
function triggerXpBars() {
  document.querySelectorAll('.xp-fill').forEach(el => {
    const target = el.style.width;
    el.style.width = '0';
    setTimeout(() => { el.style.width = target; }, 300);
  });
}

/* ---- EDUCATION PROGRESS BAR ---- */
function triggerEduBar(barFill) {
  const target = parseInt(barFill.getAttribute('data-target')) || 35;
  const pctEl  = document.getElementById('edu-pct');
  barFill.style.width = target + '%';
  // Count up percentage display
  let current = 0;
  const step  = target / 60;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    if (pctEl) pctEl.textContent = Math.round(current) + '%';
    if (current >= target) clearInterval(timer);
  }, 25);
}

/* ---- ACTIVE NAV HIGHLIGHT ---- */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => { a.style.color = ''; a.style.textShadow = ''; });
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) {
        active.style.color = 'var(--magenta)';
        active.style.textShadow = 'var(--glow-mg)';
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
}

/* ---- PHOTO HOVER GLITCH ---- */
function initPhotoHover() {
  const frame = document.querySelector('.hero-photo-frame');
  if (!frame) return;
  frame.addEventListener('mouseenter', () => {
    frame.style.animation = 'none';
    void frame.offsetWidth;
    frame.style.animation = 'photoGlitch 0.4s steps(1) 1';
  });
}

/* ---- RANDOM SCREEN FLICKER ---- */
setInterval(() => {
  if (Math.random() < 0.06) {
    document.body.style.filter = 'brightness(1.12) contrast(1.08)';
    setTimeout(() => { document.body.style.filter = ''; }, 55);
  }
}, 3500);

/* ---- CONTACT FORM ---- */
function handleFormSubmit() {
  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const subject = document.getElementById('f-subject').value.trim();
  const message = document.getElementById('f-message').value.trim();
  const status  = document.getElementById('form-status');
  const btn     = document.getElementById('send-btn');

  if (!name || !email || !subject || !message) {
    status.textContent = '>> ERROR: All fields are required.';
    status.style.color = '#ff4444';
    return;
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    status.textContent = '>> ERROR: Invalid email format.';
    status.style.color = '#ff4444';
    return;
  }
  if (message.length > 500) {
    status.textContent = '>> ERROR: Message exceeds 500 chars.';
    status.style.color = '#ff4444';
    return;
  }

  btn.textContent = '>> TRANSMITTING...';
  btn.style.pointerEvents = 'none';
  status.style.color = 'var(--green)';

  let dots = 0;
  const loading = setInterval(() => {
    dots = (dots + 1) % 4;
    status.textContent = '>> SENDING' + '.'.repeat(dots);
  }, 300);

  setTimeout(() => {
    clearInterval(loading);
    const body   = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:elbahnas1605@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    status.textContent = '>> MESSAGE_SENT: OK — Check your mail client.';
    btn.innerHTML = '&#9658; SEND_MESSAGE';
    btn.style.pointerEvents = '';

    document.getElementById('f-name').value    = '';
    document.getElementById('f-email').value   = '';
    document.getElementById('f-subject').value = '';
    document.getElementById('f-message').value = '';
    document.getElementById('char-count').textContent = '0 / 500';
    setTimeout(() => { status.textContent = ''; }, 5000);
  }, 1800);
}

/* char counter — runs after DOM ready since form is injected after boot */
function initContactForm() {
  const textarea  = document.getElementById('f-message');
  const charCount = document.getElementById('char-count');
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = `${len} / 500`;
      charCount.style.color = len > 450 ? '#ff4444' : '';
    });
  }
}
