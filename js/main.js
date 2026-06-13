/**
 * AUTOMATED GALLERY MANAGEMENT ENGINE
 * - Programmatically builds portfolio rows using numerical sequencing.
 * - Dynamically resolves mixed image file extensions (.jpg, .png, .jpeg).
 * - Implements desktop hover triggers and graceful mobile touch screen toggles.
 */

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

/**
 * Automatically generates the dataset loops and directs nodes to track rows
 */
function loadPortfolioChannels() {
  const artworkContainer = document.getElementById('artwork-row-grid');
  const animationContainer = document.getElementById('animation-row-grid');

  if (!artworkContainer || !animationContainer) return;

  artworkContainer.innerHTML = '';
  animationContainer.innerHTML = '';

  // 🎨 1. AUTOMATICALLY LOOP & RENDER ARTWORKS (With dynamic extension fallbacks)
  const maxArtworkLimit = GALLERY_CONFIG.startArtworkIndex + GALLERY_CONFIG.totalArtworksCount;
  
  for (let i = GALLERY_CONFIG.startArtworkIndex; i < maxArtworkLimit; i++) {
    const cardElement = document.createElement('article');
    cardElement.className = 'anime-card';

    const imgElement = document.createElement('img');
    imgElement.className = 'card-image';
    imgElement.loading = 'lazy';
    imgElement.alt = `Digital Illustration Piece #${i}`;

    const srcJpg = `${GALLERY_CONFIG.artworkFolder}/${GALLERY_CONFIG.artworkPrefix}${i}.jpg`;
    const srcPng = `${GALLERY_CONFIG.artworkFolder}/${GALLERY_CONFIG.artworkPrefix}${i}.png`;
    const srcJpeg = `${GALLERY_CONFIG.artworkFolder}/${GALLERY_CONFIG.artworkPrefix}${i}.jpeg`;

    imgElement.src = srcJpg;

    /**
     * 🔄 EXTENSION FALLBACK CASCADE
     * If the current file target doesn't exist, try the alternatives sequentially 
     * before dropping into a black frame layout state.
     */
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
    titleHeader.textContent = `Illustration #${i - 100}`;

    cardElement.appendChild(imgElement);
    cardElement.appendChild(titleHeader);
    artworkContainer.appendChild(cardElement);
  }

  // 🎬 2. AUTOMATICALLY LOOP & RENDER ANIMATIONS (With Hybrid Touch Controls)
  for (let j = 1; j <= GALLERY_CONFIG.totalAnimations; j++) {
    const cardElement = document.createElement('article');
    cardElement.className = 'anime-card';

    const videoElement = document.createElement('video');
    videoElement.src = `${GALLERY_CONFIG.animationFolder}/${GALLERY_CONFIG.animationPrefix}${j}.${GALLERY_CONFIG.animationExt}`;
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.playsInline = true;
    videoElement.className = 'card-image';
    videoElement.setAttribute('preload', 'metadata');

    cardElement.addEventListener('mouseenter', () => {
      videoElement.play().catch(() => {});
    });
    
    cardElement.addEventListener('mouseleave', () => {
      videoElement.pause();
      videoElement.currentTime = 0;
    });
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

// Ignition
document.addEventListener('DOMContentLoaded', loadPortfolioChannels);