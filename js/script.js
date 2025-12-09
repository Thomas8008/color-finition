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
const gallerySwipeManager = {
  touchStartX: 0,
  touchEndX: 0,
  activeGalleries: new Map(),
  
  init() {
    // Initialiser le tracking de chaque galerie
    document.querySelectorAll('.aa-item').forEach((item) => {
      const links = item.querySelectorAll('a.glightbox');
      const galleryId = links[0]?.getAttribute('data-gallery');
      
      if (galleryId && links.length > 1) {
        if (!this.activeGalleries.has(galleryId)) {
          this.activeGalleries.set(galleryId, {
            item: item,
            links: links,
            currentIndex: 0
          });
        }
      }
      
      // Ajouter les event listeners
      item.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
      item.addEventListener('touchend', (e) => this.handleTouchEnd(e, item), false);
      item.addEventListener('click', (e) => this.handleClick(e, item), false);
    });
  },
  
  handleTouchStart(e) {
    this.touchStartX = e.touches[0]?.clientX || 0;
  },
  
  handleTouchEnd(e, item) {
    this.touchEndX = e.changedTouches[0]?.clientX || 0;
    this.processSwipe(item);
  },
  
  processSwipe(item) {
    const diff = this.touchStartX - this.touchEndX;
    const threshold = 40;
    
    if (Math.abs(diff) > threshold) {
      this.switchImage(item, diff > 0 ? 'next' : 'prev');
    }
  },
  
  handleClick(e, item) {
    const img = e.target.closest('.aa-img');
    if (img) {
      // Vérifier si c'est un double-clic (on peut aussi ajouter une logique de double-tap)
      e.preventDefault();
    }
  },
  
  switchImage(item, direction) {
    const links = item.querySelectorAll('a.glightbox');
    if (links.length < 2) return;
    
    const galleryId = links[0].getAttribute('data-gallery');
    const gallery = this.activeGalleries.get(galleryId);
    
    if (!gallery) return;
    
    // Trouver l'index actuel
    let currentIndex = 0;
    links.forEach((link, index) => {
      if (!link.classList.contains('d-none')) {
        currentIndex = index;
      }
    });
    
    // Calculer le prochain index
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % links.length;
    } else {
      nextIndex = currentIndex === 0 ? links.length - 1 : currentIndex - 1;
    }
    
    // Mettre à jour la visibilité
    links.forEach((link, index) => {
      if (index === nextIndex) {
        link.classList.remove('d-none');
        link.style.display = '';
      } else {
        link.classList.add('d-none');
        link.style.display = 'none';
      }
    });
    
    // Recharger GLightbox
    this.reloadGLightbox();
  },
  
  reloadGLightbox() {
    if (typeof window.glightboxInstance !== 'undefined' && window.glightboxInstance) {
      try {
        window.glightboxInstance.reload();
      } catch(e) {
        console.log('GLightbox reload error');
      }
    }
  }
};

// Initialiser le swipe manager
document.addEventListener('DOMContentLoaded', () => {
  gallerySwipeManager.init();
});

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