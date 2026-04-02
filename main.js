// ===== SCROLL ANIMATION =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.classList.toggle("show", e.isIntersecting);
  });
}, { threshold: 0.1 });

document.querySelectorAll(".watch").forEach(el => observer.observe(el));


// ===== CONTADOR =====
const counter = document.getElementById("counter");
const startDate = new Date("2026-01-22T14:27:00-03:00");

function updateCounter() {
  const diff = new Date() - startDate;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);

  counter.innerHTML = `${d}d ${h}h ${m}m ${s}s`;
}

setInterval(updateCounter, 1000);
updateCounter();


// ===== DIGITAÇÃO =====
const message = "Desde o nosso primeiro encontro, cada momento tem sido uma aventura incrível.";
let index = 0;
let started = false;

function type() {
  if (index < message.length) {
    document.getElementById("typing-text").textContent += message[index++];
    setTimeout(type, 50);
  }
}

new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !started) {
    started = true;
    type();
  }
}, { threshold: 0.5 }).observe(document.getElementById("typing-section"));


// ===== ESTRELAS (WARP) =====
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let w, h;
let stars = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * w - w / 2,
    y: Math.random() * h - h / 2,
    z: Math.random() * w
  });
}

function animate() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "white";

  stars.forEach(s => {
    s.z -= 2;

    if (s.z <= 0) {
      s.x = Math.random() * w - w / 2;
      s.y = Math.random() * h - h / 2;
      s.z = w;
    }

    const k = 128 / s.z;
    const x = s.x * k + w / 2;
    const y = s.y * k + h / 2;
    const size = (1 - s.z / w) * 3;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

// ===== IPHONE LEVEL CAROUSEL =====
const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".slide");
const carousel = document.querySelector(".carousel");

let idx = 0;

let startX = 0;
let currentX = 0;
let velocity = 0;
let lastX = 0;
let lastTime = 0;

let isDragging = false;
let moved = false;
let startTime = 0;

function getSlideWidth() {
  return slides[0].offsetWidth + 30;
}

function setPosition(x, smooth = false) {
  track.style.transition = smooth ? "transform 0.5s cubic-bezier(.22,.61,.36,1)" : "none";
  track.style.transform = `translateX(${x}px)`;
}

function updateActive() {
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === idx);
  });
}

function snap() {
  const base = -idx * getSlideWidth();
  setPosition(base, true);
  updateActive();
}

// ===== START =====
function start(e) {
  isDragging = true;
  moved = false;

  startX = getX(e);
  currentX = startX;

  lastX = startX;
  lastTime = Date.now();

  startTime = lastTime;
}

// ===== MOVE =====
function move(e) {
  if (!isDragging) return;

  currentX = getX(e);
  let diff = currentX - startX;

  if (Math.abs(diff) > 5) moved = true;

  // cálculo de velocidade
  const now = Date.now();
  velocity = (currentX - lastX) / (now - lastTime);

  lastX = currentX;
  lastTime = now;

  const pos = -(idx * getSlideWidth()) + diff;
  setPosition(pos);
}

// ===== END =====
function end(e) {
  if (!isDragging) return;

  let diff = currentX - startX;
  let time = Date.now() - startTime;

  // ===== INÉRCIA =====
  if (Math.abs(velocity) > 0.5 || Math.abs(diff) > 80) {
    if (velocity < 0 || diff < -80) {
      idx = Math.min(idx + 1, slides.length - 1);
    } else if (velocity > 0 || diff > 80) {
      idx = Math.max(idx - 1, 0);
    }
  }

  snap();
  isDragging = false;

  // ===== TAP =====
  if (!moved && time < 200) {
    const img = e.target.closest("img");
    if (img) openFullscreen(img.src);
  }
}

// ===== HELPERS =====
function getX(e) {
  return e.touches ? e.touches[0].clientX : e.clientX;
}

// ===== EVENTS =====
carousel.addEventListener("mousedown", start);
carousel.addEventListener("mousemove", move);
carousel.addEventListener("mouseup", end);
carousel.addEventListener("mouseleave", end);

carousel.addEventListener("touchstart", start, { passive: true });
carousel.addEventListener("touchmove", move, { passive: true });
carousel.addEventListener("touchend", end);

// ===== INIT =====
snap();


// ===== FULLSCREEN COM BOTÕES =====
const overlay = document.createElement("div");
overlay.classList.add("fullscreen");
document.body.appendChild(overlay);

let fsIndex = 0;

// abrir
function openFullscreen(index) {
  fsIndex = index;
  renderFS();
  overlay.classList.add("active");
}

// render com botões
function renderFS() {
  const src = slides[fsIndex].querySelector("img").src;

  overlay.innerHTML = `
    <button class="fs-close">✕</button>
    <button class="fs-prev">‹</button>
    <img src="${src}">
    <button class="fs-next">›</button>
  `;

  // eventos
  overlay.querySelector(".fs-close").onclick = () => {
    overlay.classList.remove("active");
  };

  overlay.querySelector(".fs-next").onclick = (e) => {
    e.stopPropagation();
    fsIndex = Math.min(fsIndex + 1, slides.length - 1);
    renderFS();
  };

  overlay.querySelector(".fs-prev").onclick = (e) => {
    e.stopPropagation();
    fsIndex = Math.max(fsIndex - 1, 0);
    renderFS();
  };
}

// abrir ao clicar
slides.forEach((slide, i) => {
  slide.querySelector("img").addEventListener("click", () => {
    if (moved) return;
    openFullscreen(i);
  });
});


// ===== SWIPE FULLSCREEN =====
let fsStartX = 0;
let fsStartY = 0;

overlay.addEventListener("touchstart", (e) => {
  fsStartX = e.touches[0].clientX;
  fsStartY = e.touches[0].clientY;
});

overlay.addEventListener("touchend", (e) => {
  let diffX = e.changedTouches[0].clientX - fsStartX;
  let diffY = e.changedTouches[0].clientY - fsStartY;

  // fechar
  if (Math.abs(diffY) > 100) {
    overlay.classList.remove("active");
    return;
  }

  // trocar imagem
  if (Math.abs(diffX) > 60) {
    if (diffX < 0) {
      fsIndex = Math.min(fsIndex + 1, slides.length - 1);
    } else {
      fsIndex = Math.max(fsIndex - 1, 0);
    }
    renderFS();
  }
});
// ===== DIGITAÇÃO 2 =====
const message2 = "Já que estamos falando de máquina do tempo, vamos viajar um pouco mais nos nossos momentos juntos. Espero que goste!";
let index2 = 0;
let started2 = false;

function type2() {
  if (index2 < message2.length) {
    document.getElementById("typing-text-2").textContent += message2[index2++];
    setTimeout(type2, 50);
  }
}

new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !started2) {
    started2 = true;
    type2();
  }
}, { threshold: 0.5 }).observe(document.getElementById("typing-section-2"));