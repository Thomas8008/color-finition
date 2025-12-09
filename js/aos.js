// Init AOS
AOS.init({
  duration: 900,
  easing: 'ease-out-quart',
  once: true,
  offset: 80
});

// Init GLightbox avec configuration améliorée mobile
const lightbox = GLightbox({
  selector: '.glightbox',
  touchNavigation: true,
  loop: true,
  closeButton: true,
  zoomable: true,
  draggable: true,
  autoplayVideos: true,
  videosWidth: 900,
  width: '90%',
  height: 'auto'
});

// Reinitialize GLightbox après chaque changement de filtre galerie
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function() {
    setTimeout(() => {
      lightbox.reload();
    }, 100);
  });
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
