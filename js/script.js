// Swiper
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

