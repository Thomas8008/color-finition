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