/* =========================
   ANIMAÇÃO AO APARECER
========================= */

const elements = document.querySelectorAll(".watch");

const appear = new IntersectionObserver((entries, observer)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");

      /* SE FOR A SECTION DE DIGITAÇÃO → inicia efeito */
      if(entry.target.classList.contains("typing-section")){
        startTyping();
      }

      observer.unobserve(entry.target);
    }
  });
},{
  threshold: 0.25,
  rootMargin: "0px 0px -40px 0px"
});

elements.forEach(el => appear.observe(el));


/* =========================
   CONTADOR
========================= */

const startDate = new Date("2026-01-22T14:27:00-03:00");

function updateCounter(){
  const now = new Date();
  let diff = now - startDate;

  const days = Math.floor(diff/(1000*60*60*24));
  diff -= days*(1000*60*60*24);

  const hours = Math.floor(diff/(1000*60*60));
  diff -= hours*(1000*60*60);

  const minutes = Math.floor(diff/(1000*60));
  diff -= minutes*(1000*60);

  const seconds = Math.floor(diff/1000);

  document.getElementById("counter").textContent =
    `${days} dias, ${hours}h ${minutes}min ${seconds}s`;
}

updateCounter();
setInterval(updateCounter,1000);


/* =========================
   FUNDO INTERATIVO
========================= */

const root = document.documentElement;

let mouseX = window.innerWidth/2;
let mouseY = window.innerHeight/2;
let currentX = mouseX;
let currentY = mouseY;

function animateLight(){
  currentX += (mouseX-currentX)*0.08;
  currentY += (mouseY-currentY)*0.08;

  root.style.setProperty("--x",currentX+"px");
  root.style.setProperty("--y",currentY+"px");

  requestAnimationFrame(animateLight);
}

animateLight();

window.addEventListener("mousemove",e=>{
  mouseX=e.clientX;
  mouseY=e.clientY;
});

window.addEventListener("touchmove",e=>{
  mouseX=e.touches[0].clientX;
  mouseY=e.touches[0].clientY;
},{passive:true});


/* =========================
   EFEITO DIGITAÇÃO
========================= */

const message = `
Desde o nosso primeiro encontro, cada momento tem sido uma aventura incrível e a cada dia, descubro mais razões para te amar e me sinto grato por ter você ao meu lado.

`;

const textElement = document.getElementById("typing-text");

let index = 0;
let typingStarted = false;

function startTyping(){
  if(typingStarted) return;
  typingStarted = true;

  /* MOSTRA O TEXTO (isso que faltava) */
  textElement.classList.add("typing");

  function typeLetter(){
    if(index < message.length){
      textElement.textContent += message.charAt(index);
      index++;

      const delay =
        message.charAt(index-1) === "." ? 320 :
        message.charAt(index-1) === "," ? 180 :
        message.charAt(index-1) === "\n" ? 400 :
        45;

      setTimeout(typeLetter, delay);
    }
  }

  typeLetter();
}

