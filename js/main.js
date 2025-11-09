// ================================
// 🎴 HERO SLIDER (FADE + TEXT FX)
// ================================
const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentIndex = 0;
let autoSlide;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === (index + slides.length) % slides.length);
  });
  currentIndex = (index + slides.length) % slides.length;
}

function startAutoSlide() {
  autoSlide = setInterval(() => showSlide(currentIndex + 1), 8000);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

nextBtn.addEventListener("click", () => {
  showSlide(currentIndex + 1);
  resetAutoSlide();
});
prevBtn.addEventListener("click", () => {
  showSlide(currentIndex - 1);
  resetAutoSlide();
});

showSlide(currentIndex);
startAutoSlide();


// ================================
// 💾 REGISTRO DE SERVICE WORKER
// ================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
      .catch(err => console.error('❌ Error registrando Service Worker:', err));
  });
}
