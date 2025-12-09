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

// ===== GESTION DU SWIPE AVANT/APRÈS =====
// Système ultra-simplifié et robuste pour tous les appareils mobiles

let swipeState = {};

document.addEventListener('touchstart', function(e) {
  const item = e.target.closest('.aa-item');
  if (!item) return;
  
  const links = item.querySelectorAll('a.glightbox');
  if (links.length < 2) return;
  
  const itemId = Math.random();
  swipeState[itemId] = {
    item: item,
    links: links,
    startX: e.touches[0].clientX,
    startY: e.touches[0].clientY,
    itemId: itemId
  };
}, { passive: true });

document.addEventListener('touchend', function(e) {
  const item = e.target.closest('.aa-item');
  if (!item) return;
  
  const links = item.querySelectorAll('a.glightbox');
  if (links.length < 2) return;
  
  // Créer une clé unique basée sur le premier lien
  const galleryId = links[0].getAttribute('data-gallery');
  
  // Récupérer le dernier état enregistré
  const states = Object.values(swipeState);
  if (states.length === 0) return;
  
  const state = states[states.length - 1];
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  
  const diffX = state.startX - endX;
  const diffY = state.startY - endY;
  
  // Vérifier que c'est un swipe horizontal, pas vertical
  if (Math.abs(diffY) > Math.abs(diffX)) return;
  
  // Seuil minimum
  const threshold = 50;
  if (Math.abs(diffX) < threshold) return;
  
  // Trouver l'image visible
  let currentIndex = 0;
  links.forEach((link, idx) => {
    if (!link.classList.contains('d-none')) {
      currentIndex = idx;
    }
  });
  
  // Déterminer la direction
  let nextIndex = currentIndex;
  if (diffX > 0) {
    // Swipe gauche = image suivante
    nextIndex = (currentIndex + 1) % links.length;
  } else {
    // Swipe droit = image précédente
    nextIndex = currentIndex === 0 ? links.length - 1 : currentIndex - 1;
  }
  
  // Changer l'image
  if (nextIndex !== currentIndex) {
    links.forEach((link, idx) => {
      if (idx === nextIndex) {
        link.classList.remove('d-none');
      } else {
        link.classList.add('d-none');
      }
    });
    
    // Recharger GLightbox
    if (typeof window.glightboxInstance !== 'undefined' && window.glightboxInstance) {
      try {
        window.glightboxInstance.reload();
      } catch(e) {}
    }
  }
  
  // Nettoyer l'état
  delete swipeState[state.itemId];
}, { passive: true });

// Filtrage galerie
function filterGallery(filter) {
  const items = document.querySelectorAll('.gallery-item');
  
  items.forEach(item => {
    const category = item.getAttribute('data-category');
    
    if (category === filter) {
      item.classList.remove('hidden');
      item.style.display = '';
    } else {
      item.classList.add('hidden');
      item.style.display = 'none';
    }
  });
  
  // Reload GLightbox
  if (typeof window.glightboxInstance !== 'undefined' && window.glightboxInstance) {
    setTimeout(() => {
      try {
        window.glightboxInstance.reload();
      } catch(e) {}
    }, 100);
  }
}

// Afficher les images Extérieur par défaut
filterGallery('exterieur');

// Filtrage galerie au clic des chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const filter = this.getAttribute('data-filter');
    
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip-active'));
    this.classList.add('chip-active');
    
    filterGallery(filter);
  });
});