// Init AOS
AOS.init({
  duration: 900,
  easing: 'ease-out-quart',
  once: true,
  offset: 80
});

// Init GLightbox - config simple et stable
window.glightboxInstance = GLightbox({
  selector: '.glightbox:not(.d-none)',
  touchNavigation: false,
  loop: true,
  closeButton: true,
  keyboard: true
});

// Swiper Main
const mainSwiper = new Swiper('.swiper-main', {
  loop: true,
  spaceBetween: 50,
  slidesPerView: 1,
  centeredSlides: true,

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  keyboard: true,
});
