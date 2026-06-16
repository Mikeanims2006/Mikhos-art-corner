const GALLERY_CONFIG = {
  startArtworkIndex: 100,
  totalArtworksCount: 75,
  artworkFolder: "assets/Artworks",
  artworkPrefix: "art",

  totalAnimations: 34,
  animationFolder: "assets/Animations",
  animationPrefix: "sequence",
  animationExt: "mp4"
};

function loadPortfolioChannels() {
  const artworkContainer = document.getElementById('artwork-row-grid');
  const animationContainer = document.getElementById('animation-row-grid');

  if (!artworkContainer || !animationContainer) return;

  artworkContainer.innerHTML = '';
  animationContainer.innerHTML = '';

  /* Intersection observer to handle lazy loading as elements scroll into view */
  const mediaObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const mediaElement = entry.target;
        if (mediaElement.dataset.src) {
          mediaElement.src = mediaElement.dataset.src;
          mediaElement.removeAttribute('data-src');
          
          /* If the element is a video, force-load the first frame to prevent a black card */
          if (mediaElement.tagName === 'VIDEO') {
            mediaElement.load();
          }
        }
        observer.unobserve(mediaElement);
      }
    });
  }, {
    rootMargin: '200px 0px'
  });

  const maxArtworkLimit = GALLERY_CONFIG.startArtworkIndex + GALLERY_CONFIG.totalArtworksCount;
  
  /* Loop and render image elements */
  for (let i = GALLERY_CONFIG.startArtworkIndex; i < maxArtworkLimit; i++) {
    const cardElement = document.createElement('article');
    cardElement.className = 'anime-card';

    const imgElement = document.createElement('img');
    imgElement.className = 'card-image';
    imgElement.alt = `Digital Illustration Piece #${i - 99}`;

    const srcJpg = `${GALLERY_CONFIG.artworkFolder}/${GALLERY_CONFIG.artworkPrefix}${i}.jpg`;
    const srcPng = `${GALLERY_CONFIG.artworkFolder}/${GALLERY_CONFIG.artworkPrefix}${i}.png`;
    const srcJpeg = `${GALLERY_CONFIG.artworkFolder}/${GALLERY_CONFIG.artworkPrefix}${i}.jpeg`;

    /* Eager load the first 8 visible items and lazy load the rest */
    if (i < GALLERY_CONFIG.startArtworkIndex + 8) {
      imgElement.loading = 'eager';
      imgElement.src = srcJpg;
    } else {
      imgElement.loading = 'lazy';
      imgElement.dataset.src = srcJpg;
      mediaObserver.observe(imgElement);
    }

    /* Sequential fallback check for image file extensions */
    imgElement.onerror = function() {
      if (this.src.endsWith('.jpg')) {
        this.src = srcPng;
      } else if (this.src.endsWith('.png')) {
        this.src = srcJpeg;
      } else {
        this.onerror = null;
        console.warn(`Asset rendering failed for artwork index target: art${i}`);
      }
    };

    const titleHeader = document.createElement('h3');
    titleHeader.className = 'card-title';
    titleHeader.textContent = `Illustration #${i - 99}`;

    cardElement.appendChild(imgElement);
    cardElement.appendChild(titleHeader);
    artworkContainer.appendChild(cardElement);
  }

  /* Loop and render video elements */
  for (let j = 1; j <= GALLERY_CONFIG.totalAnimations; j++) {
    const cardElement = document.createElement('article');
    cardElement.className = 'anime-card';

    const videoElement = document.createElement('video');
    const targetVideoSrc = `${GALLERY_CONFIG.animationFolder}/${GALLERY_CONFIG.animationPrefix}${j}.${GALLERY_CONFIG.animationExt}`;
    
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.playsInline = true;
    videoElement.className = 'card-image';
    videoElement.setAttribute('preload', 'none');
    videoElement.dataset.src = targetVideoSrc;
    mediaObserver.observe(videoElement);

    /* Mouse triggers for desktop hover playback */
    cardElement.addEventListener('mouseenter', () => {
      videoElement.play().catch(() => {});
    });
    
    cardElement.addEventListener('mouseleave', () => {
      videoElement.pause();
      videoElement.currentTime = 0;
    });
    
    /* Touch triggers for mobile touch playback and reset toggles */
    cardElement.addEventListener('touchstart', (e) => {
      e.preventDefault(); 
      
      if (videoElement.paused) {
        document.querySelectorAll('#animation-row-grid video').forEach(v => {
          if (v !== videoElement) {
            v.pause();
            v.currentTime = 0;
          }
        });
        videoElement.play().catch(() => {});
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    }, { passive: false });

    const titleHeader = document.createElement('h3');
    titleHeader.className = 'card-title';
    titleHeader.textContent = `Animation #${j}`;

    cardElement.appendChild(videoElement);
    cardElement.appendChild(titleHeader);
    animationContainer.appendChild(cardElement);
  }
}

document.addEventListener('DOMContentLoaded', loadPortfolioChannels);