const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show"); // Faz o efeito repetir ao subir
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".watch").forEach(el => observer.observe(el));

// Contador
const startDate = new Date("2026-01-22T14:27:00-03:00");
function updateCounter() {
  const diff = new Date() - startDate;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  document.getElementById("counter").innerHTML = `${d}d ${h}h ${m}m ${s}s`;
}
setInterval(updateCounter, 1000);
updateCounter();

// Digitação
const message = "Desde o nosso primeiro encontro, cada momento tem sido uma aventura incrível. Descubro todos os dias novas razões para te amar.";
let index = 0;
let started = false;

function type() {
  if (index < message.length) {
    document.getElementById("typing-text").textContent += message.charAt(index);
    index++;
    setTimeout(type, 50);
  }
}

const typeObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !started) {
    started = true;
    type();
  }
}, { threshold: 0.5 });
typeObserver.observe(document.getElementById("typing-section"));