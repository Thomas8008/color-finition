// ===== SWIPE BEFORE/AFTER =====
function attachSwipeListeners() {
  const aaItems = document.querySelectorAll('.aa-item');
  
  aaItems.forEach(aaItem => {
    const img = aaItem.querySelector('img.aa-img');
    if (!img) return;
    
    let swipeStart = null;
    
    img.addEventListener('touchstart', (e) => {
      const links = aaItem.querySelectorAll('a.glightbox');
      if (links.length < 2) return;
      swipeStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, ts: Date.now() };
      e.preventDefault();
    }, { passive: false, capture: true });
    
    img.addEventListener('touchend', (e) => {
      if (!swipeStart) return;
      const links = aaItem.querySelectorAll('a.glightbox');
      if (links.length < 2) { swipeStart = null; return; }
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = swipeStart.x - endX;
      const diffY = swipeStart.y - endY;
      const duration = Date.now() - swipeStart.ts;
      
      if (Math.abs(diffX) < 40 || duration > 500 || Math.abs(diffY) > Math.abs(diffX) * 0.4) {
        swipeStart = null;
        return;
      }
      
      let currentIdx = 0;
      links.forEach((link, idx) => { if (!link.classList.contains('d-none')) currentIdx = idx; });
      
      const nextIdx = diffX > 0 ? (currentIdx + 1) % links.length : currentIdx === 0 ? links.length - 1 : currentIdx - 1;
      if (nextIdx === currentIdx) { swipeStart = null; return; }
      
      links.forEach((link, idx) => { link.classList.toggle('d-none', idx !== nextIdx); });
      
      const newLink = links[nextIdx];
      if (newLink.href) img.src = newLink.href;
      
      if (window.glightboxInstance) {
        try { window.glightboxInstance.reload(); } catch(err) {}
      }
      
      e.preventDefault();
      swipeStart = null;
    }, { passive: false, capture: true });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachSwipeListeners);
} else {
  attachSwipeListeners();
}


// ===== CAROUSEL AVIS =====
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

setInterval(nextAvis, 6000);


// ===== GALLERY FILTERING =====
function filterGallery(filter) {
  const items = document.querySelectorAll('.gallery-item');
  
  items.forEach(item => {
    const category = item.getAttribute('data-category');
    item.style.display = (category === filter) ? '' : 'none';
  });
  
  if (window.glightboxInstance) {
    setTimeout(() => { try { window.glightboxInstance.reload(); } catch(e) {} }, 100);
  }
}

filterGallery('exterieur');

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip-active'));
    this.classList.add('chip-active');
    filterGallery(this.getAttribute('data-filter'));
  });
});




// ==================== CUSTOM COMPARISON LIGHTBOX ====================
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.aa-item[data-before][data-after]').forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showComparisonLightbox(
          item.dataset.before,
          item.dataset.after,
          item.dataset.title || 'Avant/Après'
        );
      });
    });
  });

  function showComparisonLightbox(beforeUrl, afterUrl, title) {
    // Vérifier qu'il n'y a pas déjà une lightbox ouverte
    const existingLightbox = document.getElementById('custom-lightbox-wrapper');
    if (existingLightbox) {
      existingLightbox.remove();
    }

    const lightboxHTML = `
      <div class="glightbox-container" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.98); z-index: 99999; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px; overflow: hidden;">
        <button class="glightbox-close" style="position: absolute; top: 20px; right: 30px; background: none; border: none; color: white; font-size: 40px; cursor: pointer; z-index: 100000; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">&times;</button>
        
        <div class="comparison-lightbox" style="width: 100%; max-width: 1200px;">
          <img src="${beforeUrl}" alt="Avant" class="comparison-lightbox-img comparison-lightbox-before" style="width: 100%; height: 100%; object-fit: contain;">
          <div class="comparison-lightbox-img comparison-lightbox-after" style="background-image: url('${afterUrl}'); width: 100%; height: 100%;"></div>
          <input type="range" min="0" max="100" value="50" class="comparison-lightbox-slider">
          <div class="comparison-lightbox-labels">
            <span class="comparison-lightbox-label-before">AVANT</span>
            <span class="comparison-lightbox-label-after">APRÈS</span>
          </div>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.id = 'custom-lightbox-wrapper';
    container.innerHTML = lightboxHTML;
    document.body.appendChild(container);
    document.body.style.overflow = 'hidden';

    const glightboxContainer = container.querySelector('.glightbox-container');
    const closeBtn = container.querySelector('.glightbox-close');
    const slider = container.querySelector('.comparison-lightbox-slider');
    const afterImg = container.querySelector('.comparison-lightbox-after');

    const updateSlider = () => {
      const value = slider.value;
      afterImg.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    };

    slider.addEventListener('input', updateSlider);
    slider.addEventListener('touchmove', updateSlider);
    updateSlider();

    let escapeListener = null;

    const closeLightbox = () => {
      container.remove();
      document.body.style.overflow = '';
      if (escapeListener) {
        document.removeEventListener('keydown', escapeListener);
      }
    };

    escapeListener = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    closeBtn.addEventListener('click', closeLightbox);
    glightboxContainer.addEventListener('click', (e) => {
      if (e.target === glightboxContainer) {
        closeLightbox();
      }
    });
    document.addEventListener('keydown', escapeListener);
  }

  // ==================== SIMPLE IMAGE LIGHTBOX ====================
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.aa-item:not([data-before]):not([data-after])').forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        const img = item.querySelector('img');
        if (img) {
          showSimpleLightbox(img.src, img.alt);
        }
      });
    });
  });

  function showSimpleLightbox(imageUrl, title) {
    const existingLightbox = document.getElementById('simple-lightbox-wrapper');
    if (existingLightbox) {
      existingLightbox.remove();
    }

    const lightboxHTML = `
      <div class="glightbox-container" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.98); z-index: 99999; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px; overflow: hidden;">
        <button class="glightbox-close" style="position: absolute; top: 20px; right: 30px; background: none; border: none; color: white; font-size: 40px; cursor: pointer; z-index: 100000; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">&times;</button>
        
        <div style="width: 100%; max-width: 1200px; margin-bottom: 15px; text-align: center;">
          <h2 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">${title}</h2>
        </div>

        <img src="${imageUrl}" alt="${title}" style="width: 100%; max-width: 1200px; height: auto; max-height: 80vh; object-fit: contain;">
      </div>
    `;

    const container = document.createElement('div');
    container.id = 'simple-lightbox-wrapper';
    container.innerHTML = lightboxHTML;
    document.body.appendChild(container);
    document.body.style.overflow = 'hidden';

    const glightboxContainer = container.querySelector('.glightbox-container');
    const closeBtn = container.querySelector('.glightbox-close');

    let escapeListener = null;

    const closeLightbox = () => {
      container.remove();
      document.body.style.overflow = '';
      if (escapeListener) {
        document.removeEventListener('keydown', escapeListener);
      }
    };

    escapeListener = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    closeBtn.addEventListener('click', closeLightbox);
    glightboxContainer.addEventListener('click', (e) => {
      if (e.target === glightboxContainer) {
        closeLightbox();
      }
    });
    document.addEventListener('keydown', escapeListener);
  }

  // ==================== FILTRAGE GALERIE ====================
  document.addEventListener('DOMContentLoaded', function() {
    const chips = document.querySelectorAll('.chip');
    const galleryItems = document.querySelectorAll('.gallery-item');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('chip-active'));
        chip.classList.add('chip-active');
        
        const filter = chip.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
          const categories = item.getAttribute('data-category').split(' ');
          if (categories.includes(filter)) {
            item.style.display = 'block';
            setTimeout(() => item.style.opacity = '1', 10);
          } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });

    // Déclencher le filtre initial au chargement
    const firstChip = chips[0];
    if (firstChip) {
      firstChip.click();
    }
  });
