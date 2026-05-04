/**
 * MACM Infrastructure — Space Asteroid Field
 * Drifting asteroid/debris particles with subtle star background
 */
(function () {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let asteroids = [];

  const STAR_COUNT = 120;
  const ASTEROID_COUNT = 18;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // Tiny twinkling background stars
  function createStar() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.2 + 0.3,
      baseOpacity: Math.random() * 0.5 + 0.15,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
    };
  }

  // Drifting asteroid rocks
  function createAsteroid() {
    const size = Math.random() * 3 + 1.5;
    const speed = (0.08 + Math.random() * 0.15) * (Math.random() < 0.5 ? 1 : -1);
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: size,
      vx: speed,
      vy: (Math.random() - 0.5) * 0.12,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.008,
      opacity: 0.15 + Math.random() * 0.2,
      vertices: generateShape(size),
    };
  }

  // Generate irregular polygon shape for asteroid
  function generateShape(size) {
    const points = 5 + Math.floor(Math.random() * 4);
    const vertices = [];
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const radius = size * (0.6 + Math.random() * 0.4);
      vertices.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
    }
    return vertices;
  }

  function init() {
    resize();
    stars = [];
    asteroids = [];
    for (let i = 0; i < STAR_COUNT; i++) stars.push(createStar());
    for (let i = 0; i < ASTEROID_COUNT; i++) asteroids.push(createAsteroid());
  }

  function drawStars(time) {
    for (const s of stars) {
      const twinkle = Math.sin(time * s.twinkleSpeed + s.phase);
      const opacity = s.baseOpacity + twinkle * 0.15;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 200, 240, ${Math.max(0.05, opacity)})`;
      ctx.fill();
    }
  }

  function drawAsteroids() {
    for (const a of asteroids) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rotation);
      ctx.beginPath();
      ctx.moveTo(a.vertices[0].x, a.vertices[0].y);
      for (let i = 1; i < a.vertices.length; i++) {
        ctx.lineTo(a.vertices[i].x, a.vertices[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(100, 120, 160, ${a.opacity * 0.5})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(140, 160, 200, ${a.opacity * 0.4})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    }
  }

  function updateAsteroids() {
    for (const a of asteroids) {
      a.x += a.vx;
      a.y += a.vy;
      a.rotation += a.rotationSpeed;

      // Wrap around
      if (a.x < -20) a.x = width + 20;
      if (a.x > width + 20) a.x = -20;
      if (a.y < -20) a.y = height + 20;
      if (a.y > height + 20) a.y = -20;
    }
  }

  let time = 0;
  function loop() {
    time++;
    ctx.clearRect(0, 0, width, height);
    drawStars(time);
    drawAsteroids();
    updateAsteroids();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();
