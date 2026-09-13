const CONFIG = {
  shortTitle: "Para ti",
  recipientName: "mi persona favorita",
  senderName: "alguien que te ama",
  songTitle: "Soy tuyo",
  songArtist: "Peint",
  letterHtml: `
    <p>Gracias por llenar mis días de momentos bonitos, de sonrisas inesperadas y de esa calma que solo encuentro contigo.</p>
    <p>Me haces sentir afortunado de coincidir en este mundo. Quiero seguir construyendo recuerdos, celebrando tus alegrías y acompañándote incluso en los días difíciles.</p>
    <p>No importa qué pase: volvería a escogerte. Hoy, mañana y todas las veces que haga falta.</p>
  `
};

const slides = [...document.querySelectorAll("[data-slide]")];
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const qrDialog = document.querySelector("#qrDialog");
const toast = document.querySelector("#toast");
let currentSlide = 0;

document.querySelectorAll("[data-copy]").forEach((element) => {
  const value = CONFIG[element.dataset.copy];
  if (typeof value !== "string") return;
  if (element.dataset.copy === "letterHtml") element.innerHTML = value;
  else element.textContent = value;
});

function showSlide(index) {
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentSlide);
    slide.toggleAttribute("inert", slideIndex !== currentSlide);
  });
  progressText.textContent = `${currentSlide + 1} de ${slides.length}`;
  progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  window.scrollTo({ top: 0, behavior: "smooth" });
  const heading = slides[currentSlide].querySelector("h1, h2");
  if (heading && currentSlide > 0) {
    heading.setAttribute("tabindex", "-1");
    window.setTimeout(() => heading.focus({ preventScroll: true }), 70);
  }
  if (currentSlide === slides.length - 1) confetti(44);
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showSlide(currentSlide + 1));
});
document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => showSlide(currentSlide - 1));
});
document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showSlide(Number(button.dataset.go)));
});

const loveRange = document.querySelector("#loveRange");
const loveValue = document.querySelector("#loveValue");
const loveStatus = document.querySelector("#loveStatus");
const loveContinue = document.querySelector("#loveContinue");
const meter = document.querySelector("#meter");
const loveBear = document.querySelector("#loveBear");
const bearMood = document.querySelector("#bearMood");
let celebratedLove = false;
let currentBearState = -1;

const bearStates = [
  {
    max: 34,
    image: "assets/bear-sad.webp",
    alt: "Osito triste porque el medidor está muy bajo",
    mood: "Ese número rompió su corazoncito…"
  },
  {
    max: 79,
    image: "assets/bear-skeptical.webp",
    alt: "Osito desconfiado mirando el medidor",
    mood: "Mmm… el osito no está convencido."
  },
  {
    max: 129,
    image: "assets/bear-shy.webp",
    alt: "Osito tímido y sonrojado",
    mood: "Ahora se puso rojito. Vas mejor."
  },
  {
    max: 199,
    image: "assets/bear-happy.webp",
    alt: "Osito feliz rodeado de corazones",
    mood: "¡Ya está sonriendo! Falta muy poquito."
  },
  {
    max: 200,
    image: "assets/bear-love.webp",
    alt: "Osito enamorado abrazando un gran corazón",
    mood: "¡200%! Ahora sí: amor infinito."
  }
];

bearStates.forEach((state) => {
  const preload = new Image();
  preload.src = state.image;
});

function updateBear(value) {
  const nextState = bearStates.findIndex((state) => value <= state.max);
  if (nextState === currentBearState) return;
  currentBearState = nextState;
  const state = bearStates[nextState];
  loveBear.src = state.image;
  loveBear.alt = state.alt;
  bearMood.textContent = state.mood;
  loveBear.classList.remove("is-changing");
  void loveBear.offsetWidth;
  loveBear.classList.add("is-changing");
}

function updateLove() {
  const value = Number(loveRange.value);
  loveValue.textContent = value;
  meter.style.setProperty("--love", value);
  updateBear(value);
  loveContinue.disabled = value < 200;

  if (value < 30) loveStatus.textContent = "Eso dolió un poquito… sigue intentando.";
  else if (value < 75) loveStatus.textContent = "¿Solo eso? Sé que puedes quererme más.";
  else if (value < 120) loveStatus.textContent = "Vamos por buen camino, pero falta algo.";
  else if (value < 170) loveStatus.textContent = "Ahora sí estamos hablando de amor.";
  else if (value < 200) loveStatus.textContent = "Casi… un último empujoncito.";
  else {
    loveStatus.textContent = "¡Respuesta correcta! Sabía que era 200%.";
    if (!celebratedLove) {
      celebratedLove = true;
      confetti(28);
    }
  }
}
loveRange.addEventListener("input", updateLove);
updateLove();

const giftContinue = document.querySelector("#giftContinue");
document.querySelectorAll("[data-gift]").forEach((gift) => {
  gift.addEventListener("click", () => {
    gift.classList.toggle("is-open");
    gift.setAttribute("aria-pressed", String(gift.classList.contains("is-open")));
    giftContinue.disabled = !document.querySelector(".gift.is-open");
  });
});

document.querySelector("#openQr").addEventListener("click", () => qrDialog.showModal());
document.querySelector("#closeQr").addEventListener("click", () => qrDialog.close());
qrDialog.addEventListener("click", (event) => {
  if (event.target === qrDialog) qrDialog.close();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("Enlace copiado");
  } catch {
    showToast("Copia el enlace desde la barra del navegador");
  }
}
document.querySelector("#copyLink").addEventListener("click", copyLink);

document.querySelector("#shareButton").addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, text: "Preparé una sorpresa para ti ♥", url: window.location.href });
    } catch (error) {
      if (error.name !== "AbortError") copyLink();
    }
  } else {
    copyLink();
  }
});

function confetti(amount) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#d72f65", "#f4a9be", "#8f1f49", "#f4c451", "#7fb7a4"];
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--drift", `${(Math.random() - .5) * 240}px`);
    piece.style.animationDelay = `${Math.random() * .35}s`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 3200);
  }
}

showSlide(0);

