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
let swipeInProgress = false;

// Fonction pour attacher les listeners de swipe aux éléments
function attachSwipeListeners() {
  const aaItems = document.querySelectorAll('.aa-item');
  
  aaItems.forEach(aaItem => {
    const links = aaItem.querySelectorAll('a.glightbox');
    if (links.length < 2) return; // Seulement si 2+ images
    
    // Cloner l'élément pour supprimer les anciens listeners
    const newItem = aaItem.cloneNode(true);
    aaItem.parentNode.replaceChild(newItem, aaItem);
    
    // Touchstart
    newItem.addEventListener('touchstart', function(e) {
      if (swipeInProgress) return;
      window.swipeStartX = e.touches[0].clientX;
      window.swipeStartY = e.touches[0].clientY;
      window.swipeItem = newItem;
      window.swipeTime = Date.now();
    });
    
    // Touchend
    newItem.addEventListener('touchend', function(e) {
      if (!window.swipeStartX || !window.swipeItem || window.swipeItem !== newItem) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaTime = Date.now() - (window.swipeTime || 0);
      
      const diffX = window.swipeStartX - endX;
      const diffY = window.swipeStartY - endY;
      const distance = Math.sqrt(diffX * diffX + diffY * diffY);
      const velocity = distance / deltaTime;
      
      // Vérifier que c'est un swipe horizontal (pas vertical ou scroll)
      if (Math.abs(diffY) > Math.abs(diffX) * 0.5) {
        window.swipeStartX = null;
        return;
      }
      
      // Seuil minimum (distance ou vélocité)
      if (Math.abs(diffX) < 30 && velocity < 0.5) {
        window.swipeStartX = null;
        return;
      }
      
      const links = newItem.querySelectorAll('a.glightbox');
      if (links.length < 2) {
        window.swipeStartX = null;
        return;
      }
      
      // Trouver l'image visible
      let currentIndex = 0;
      links.forEach((link, idx) => {
        if (!link.classList.contains('d-none')) {
          currentIndex = idx;
        }
      });
      
      // Calculer le nouvel index
      let nextIndex = currentIndex;
      if (diffX > 0) {
        // Swipe gauche = suivant
        nextIndex = (currentIndex + 1) % links.length;
      } else if (diffX < 0) {
        // Swipe droit = précédent
        nextIndex = currentIndex === 0 ? links.length - 1 : currentIndex - 1;
      }
      
      // Éviter de changer si déjà sur la même image
      if (nextIndex === currentIndex) {
        window.swipeStartX = null;
        return;
      }
      
      // Appliquer le changement
      swipeInProgress = true;
      links.forEach((link, idx) => {
        if (idx === nextIndex) {
          link.classList.remove('d-none');
        } else {
          link.classList.add('d-none');
        }
      });
      
      // Recharger GLightbox si disponible
      if (typeof window.glightboxInstance !== 'undefined' && window.glightboxInstance) {
        try {
          window.glightboxInstance.reload();
        } catch(err) {}
      }
      
      swipeInProgress = false;
      window.swipeStartX = null;
    });
  });
}

// Initialiser le swipe après un délai pour être sûr que tout est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(attachSwipeListeners, 100);
  });
} else {
  setTimeout(attachSwipeListeners, 100);
}

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
        attachSwipeListeners(); // Réattacher les listeners après le filtrage
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