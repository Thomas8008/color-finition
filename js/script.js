// Carrousel Avis
let currentAvis = 0;

function showAvis(n) {
  const slides = document.querySelectorAll('.avis-slide');
  const dots = document.querySelectorAll('.dot');
  
  if (n >= slides.length) currentAvis = 0;
  if (n < 0) currentAvis = slides.length - 1;
  
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  slides[currentAvis].classList.add('active');
  dots[currentAvis].classList.add('active');
}

function nextAvis() {
  currentAvis++;
  showAvis(currentAvis);
}

function prevAvis() {
  currentAvis--;
  showAvis(currentAvis);
}

function goToSlide(n) {
  currentAvis = n;
  showAvis(currentAvis);
}

// Auto-carousel avis
setInterval(nextAvis, 6000);

// Calcul du temps écoulé
function calculateTimeAgo(hoursAgo) {
  const now = new Date();
  const reviewDate = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
  const diffMs = now - reviewDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `il y a ${diffMins}m`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return `il y a ${Math.floor(diffDays/7)}w`;
}

// Mettre à jour les temps écoulés
function updateTimeAgo() {
  const timeElements = document.querySelectorAll('.avis-time');
  const hoursAgoData = [12, 12, 12, 12];
  
  timeElements.forEach((el, index) => {
    el.textContent = calculateTimeAgo(hoursAgoData[index]);
  });
}

updateTimeAgo();
setInterval(updateTimeAgo, 60000);

// Filtrage galerie
function filterGallery(filter) {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    if (item.getAttribute('data-category') === filter) {
      item.classList.remove('hidden');
      item.style.display = '';
    } else {
      item.classList.add('hidden');
      item.style.display = 'none';
    }
  });
  
  // Reload GLightbox après filtrage
  if (window.GLightbox && typeof lightbox !== 'undefined') {
    setTimeout(() => {
      lightbox.reload();
    }, 100);
  }
}

// Afficher les images Extérieur par défaut
filterGallery('exterieur');

// Filtrage galerie au clic des chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function() {
    const filter = this.getAttribute('data-filter');
    
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip-active'));
    this.classList.add('chip-active');
    
    filterGallery(filter);
  });
});