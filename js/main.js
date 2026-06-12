/**
 * AUTOMATED GALLERY MANAGEMENT ENGINE
 * - Programmatically builds portfolio rows using numerical sequencing.
 * - Tailored directly to start indexes and mixed extensions.
 */

const GALLERY_CONFIG = {
    // 🎨 Artwork settings matching your files starting at art100
    startArtworkIndex: 100,
    totalArtworksCount: 75, // Keeps your 75 items count
    artworkFolder: "assets/Artworks",
    artworkPrefix: "art",
  
    // 🎬 Animation settings matching FlipaClip exports
    totalAnimations: 34, // Set to match your visible sequences
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
  
    // 🎨 1. AUTOMATICALLY LOOP & RENDER ARTWORKS (Starting at 100)
    const maxArtworkLimit = GALLERY_CONFIG.startArtworkIndex + GALLERY_CONFIG.totalArtworksCount;
    
    for (let i = GALLERY_CONFIG.startArtworkIndex; i < maxArtworkLimit; i++) {
      const cardElement = document.createElement('article');
      cardElement.className = 'anime-card';
  
      const imgElement = document.createElement('img');
      imgElement.className = 'card-image';
      imgElement.loading = 'lazy';
      imgElement.alt = `Digital Illustration Piece #${i}`;
  
      // Dynamic extension fallback layout handler (fixes the art111.png vs .jpg issue!)
      const targetSrcJpg = `${GALLERY_CONFIG.artworkFolder}/${GALLERY_CONFIG.artworkPrefix}${i}.jpg`;
      const targetSrcPng = `${GALLERY_CONFIG.artworkFolder}/${GALLERY_CONFIG.artworkPrefix}${i}.png`;
  
      // Default to jpg, but swap cleanly to png if it hits asset number 111
      imgElement.src = (i === 111) ? targetSrcPng : targetSrcJpg;
  
      const titleHeader = document.createElement('h3');
      titleHeader.className = 'card-title';
      titleHeader.textContent = `Illustration #${i}`;
  
      cardElement.appendChild(imgElement);
      cardElement.appendChild(titleHeader);
      artworkContainer.appendChild(cardElement);
    }
  
    // 🎬 2. AUTOMATICALLY LOOP & RENDER ANIMATIONS
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
  
      // Auto hover-to-play element action parameters
      cardElement.addEventListener('mouseenter', () => videoElement.play().catch(() => {}));
      cardElement.addEventListener('mouseleave', () => {
        videoElement.pause();
        videoElement.currentTime = 0;
      });
  
      const titleHeader = document.createElement('h3');
      titleHeader.className = 'card-title';
      titleHeader.textContent = `Animation Sequence #${j}`;
  
      cardElement.appendChild(videoElement);
      cardElement.appendChild(titleHeader);
      animationContainer.appendChild(cardElement);
    }
  }
  
  // Ignition
  document.addEventListener('DOMContentLoaded', loadPortfolioChannels);