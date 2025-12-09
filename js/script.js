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
// Fonction pour initialiser le swipe après que GLightbox soit chargé
function initSwipeSystem() {
  // Capture des événements tactiles AVANT GLightbox
  document.addEventListener('touchstart', function(e) {
    // Vérifier que c'est sur une image de galerie
    const aaItem = e.target.closest('.aa-item');
    if (!aaItem) return;
    
    const links = aaItem.querySelectorAll('a.glightbox');
    if (links.length < 2) return;
    
    // Stocker les données de swipe
    window.swipeStartX = e.touches[0].clientX;
    window.swipeStartY = e.touches[0].clientY;
    window.swipeItem = aaItem;
  }, true); // Capture phase pour priorité

  document.addEventListener('touchend', function(e) {
    if (!window.swipeStartX || !window.swipeItem) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const diffX = window.swipeStartX - endX;
    const diffY = window.swipeStartY - endY;
    
    // Vérifier que c'est un swipe horizontal
    if (Math.abs(diffY) > Math.abs(diffX) * 0.5) {
      window.swipeStartX = null;
      return;
    }
    
    // Seuil minimum
    if (Math.abs(diffX) < 40) {
      window.swipeStartX = null;
      return;
    }
    
    const links = window.swipeItem.querySelectorAll('a.glightbox');
    if (links.length < 2) {
      window.swipeStartX = null;
      return;
    }
    
    // Trouver l'image visible
    let currentIndex = 0;
    links.forEach((link, idx) => {
      if (!link.classList.contains('d-none') && link.offsetParent !== null) {
        currentIndex = idx;
      }
    });
    
    // Calculer le nouvel index
    let nextIndex = currentIndex;
    if (diffX > 0) {
      // Swipe gauche = suivant
      nextIndex = (currentIndex + 1) % links.length;
    } else {
      // Swipe droit = précédent
      nextIndex = currentIndex === 0 ? links.length - 1 : currentIndex - 1;
    }
    
    // Éviter de changer si déjà sur la même image
    if (nextIndex === currentIndex) {
      window.swipeStartX = null;
      return;
    }
    
    // Appliquer le changement
    links.forEach((link, idx) => {
      if (idx === nextIndex) {
        link.classList.remove('d-none');
        link.style.display = 'block';
      } else {
        link.classList.add('d-none');
        link.style.display = 'none';
      }
    });
    
    // Recharger GLightbox si disponible
    if (typeof window.glightboxInstance !== 'undefined' && window.glightboxInstance) {
      try {
        window.glightboxInstance.reload();
      } catch(err) {}
    }
    
    window.swipeStartX = null;
  }, true); // Capture phase
}

// Initialiser le swipe après que la page soit complètement chargée
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSwipeSystem);
} else {
  // La page est déjà chargée (après un refresh)
  initSwipeSystem();
}

// Aussi initialiser après un délai pour être sûr que GLightbox est prêt
setTimeout(initSwipeSystem, 500);

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