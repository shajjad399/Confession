// ============================================
// প্রেমপত্র — shared behavior across all pages
// ============================================

/* ---------- Firefly / ember particle field ---------- */
(function particles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particlesArr;
  const COUNT = window.innerWidth < 720 ? 26 : 48;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeParticle() {
    const hueChoice = Math.random() > 0.6 ? 'rose' : 'gold';
    return {
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.6, 2.2),
      baseY: 0,
      speedY: rand(0.06, 0.22),
      driftX: rand(-0.15, 0.15),
      phase: rand(0, Math.PI * 2),
      twinkleSpeed: rand(0.01, 0.03),
      color: hueChoice === 'rose' ? '217,114,143' : '205,160,89'
    };
  }

  particlesArr = Array.from({ length: COUNT }, makeParticle);

  function tick() {
    ctx.clearRect(0, 0, w, h);
    particlesArr.forEach(p => {
      p.phase += p.twinkleSpeed;
      p.y -= p.speedY;
      p.x += p.driftX;
      if (p.y < -10) { p.y = h + 10; p.x = rand(0, w); }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const alpha = 0.25 + Math.sin(p.phase) * 0.25 + 0.25;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, alpha)})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(${p.color}, 0.8)`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tick();
  }
})();

/* ---------- Scroll reveal ---------- */
(function reveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(i => obs.observe(i));
})();

/* ---------- Chapter nav active state ---------- */
(function chapterNav() {
  const links = document.querySelectorAll('.chapter-nav a');
  if (!links.length) return;
  const current = document.body.dataset.page;
  links.forEach(a => {
    if (a.dataset.page === current) a.classList.add('active');
  });
})();

/* ---------- Flame glow grows per chapter ---------- */
(function flameGlow() {
  const flame = document.querySelector('.flame-mark');
  if (!flame) return;
  const step = parseInt(document.body.dataset.step || '1', 10);
  const glowMap = {
    1: 'rgba(205,160,89,0.30)',
    2: 'rgba(205,160,89,0.45)',
    3: 'rgba(217,114,143,0.55)',
    4: 'rgba(217,114,143,0.70)',
    5: 'rgba(242,212,155,0.95)'
  };
  flame.style.setProperty('--flame-glow', glowMap[step] || glowMap[1]);
  const scale = 1 + (step - 1) * 0.08;
  flame.style.transform = `scale(${scale})`;
})();