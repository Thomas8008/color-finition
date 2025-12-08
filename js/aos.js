// Init AOS
AOS.init({
  duration: 900,         // Animation plus fluide
  easing: 'ease-out-quart', // Courbe très douce
  once: true,            // Animate 1 seule fois
  offset: 80             // Déclenchement plus naturel
});

// Init GLightbox
const lightbox = GLightbox({
  selector: '.glightbox',
  touchNavigation: true,
  loop: true,
  closeButton: true
});
