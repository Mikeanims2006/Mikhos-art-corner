import { searchGlobalCatalog } from './api.js';

// DOM Target References
const filterForm = document.getElementById('filter-form');
const searchInput = document.getElementById('search-input');
const mediumSelect = document.getElementById('medium-select');
const malFeedGrid = document.getElementById('mal-feed-grid');
const searchRating = document.getElementById('search-rating');

const delay = ms => new Promise(res => setTimeout(res, ms));

/**
 * Automatically fetches image URLs for all personal favorites with Caching & Transparency
 */
async function loadPersonalFavorites() {
  const favoritesToFetch = [
    { title: 'Vagabond', medium: 'manga' },
    { title: 'Vinland Saga', medium: 'manga' },
    { title: 'Sayonara Eri', medium: 'manga' },
    { title: 'Kingdom', medium: 'manga' },
    { title: 'Vinland Saga', medium: 'anime' },
    { title: "JoJo's Bizarre Adventure: Golden Wind", medium: 'anime' },
    { title: 'Attack on Titan', medium: 'anime' },
    { title: 'Cyberpunk: Edgerunners', medium: 'anime' },
    { title: 'Usogui', medium: 'manga' },
    { title: 'Chainsaw Man', medium: 'anime' },
    { title: 'Berserk', medium: 'manga' },
    { title: 'Sousou no Frieren', medium: 'anime' }
  ];

  const CACHE_KEY = 'mikho_fav_cache';
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const now = Date.now();

  for (const fav of favoritesToFetch) {
    const cardElement = document.querySelector(`.static-card[data-title="${fav.title}"][data-medium="${fav.medium}"]`);
    if (!cardElement) continue;

    const imgElement = cardElement.querySelector('.card-image');
    const cacheKey = `${fav.title}_${fav.medium}`;

    // 1. Check Cache (Valid for 24 hours)
    if (cache[cacheKey] && (now - cache[cacheKey].timestamp < 86400000)) {
      if (imgElement) imgElement.src = cache[cacheKey].url;
      continue;
    }

    // 2. Set Loading State
    cardElement.classList.add('is-loading');

    try {
      const results = await searchGlobalCatalog(fav.title, fav.medium, null);
      
      if (results && results.length > 0) {
        const exactMatch = results.find(item => item.title.toLowerCase() === fav.title.toLowerCase()) || results[0];
        const freshImgUrl = exactMatch.images?.jpg?.image_url;

        if (freshImgUrl) {
          if (imgElement) imgElement.src = freshImgUrl;
          
          // Save to LocalStorage
          cache[cacheKey] = { url: freshImgUrl, timestamp: now };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        }

        // Add interactive pop up
        cardElement.addEventListener('click', () => {
          alert(`"${exactMatch.title}"\nOne of your all-time favorites!\nGlobal Rating: ${exactMatch.score || 'N/A'}/10`);
        });
      }
      
      // Respect API rate limits (600ms is safe for Jikan API)
      await delay(600);
      
    } catch (err) {
      console.error(`Failed to dynamically fetch image data for ${fav.title}:`, err);
    } finally {
      // 3. Remove Loading State
      cardElement.classList.remove('is-loading');
    }
  }
}

/**
 * Form Submission Event Pipeline
 */
async function handleSearchSubmit(event) {
  event.preventDefault(); 

  const queryText = searchInput.value.trim();
  const selectedMedium = mediumSelect.value; 
  const minScore = searchRating.value ? parseInt(searchRating.value) : null;

  if (!queryText) return;

  malFeedGrid.innerHTML = '';
  const loader = document.createElement('p');
  loader.className = 'loading-text';
  loader.textContent = `Searching comprehensive database records for "${queryText}"...`;
  malFeedGrid.appendChild(loader);

  try {
    const results = await searchGlobalCatalog(queryText, selectedMedium, minScore);
    
    malFeedGrid.innerHTML = '';
    renderMediaCards(results, selectedMedium);

  } catch (error) {
    malFeedGrid.innerHTML = '';
    const errorMsg = document.createElement('p');
    errorMsg.className = 'error-message';
    errorMsg.textContent = 'Failed to connect to the database server. Please try again shortly!';
    malFeedGrid.appendChild(errorMsg);
  }
}

/**
 * Layout loops transforming search arrays into visual UI grids
 */
function renderMediaCards(items, selectedMedium) {
  if (!items || items.length === 0) {
    malFeedGrid.innerHTML = '<p class="no-results">No entries match those parameters. Try adjusting your filters!</p>';
    return;
  }

  items.forEach(item => {
    const title = item.title || 'Unknown Title';
    const score = item.score || 'Unrated';
    const imgUrl = item.images?.jpg?.image_url || 'assets/placeholder.jpg';
    
    const finalMediumType = item.originMedium || selectedMedium;
    const subType = item.type || (finalMediumType === 'manga' ? 'Manga' : 'TV');

    const card = document.createElement('article');
    card.className = 'anime-card';

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = `Visual layout illustration for ${title}`;
    img.className = 'card-image';
    img.setAttribute('loading', 'lazy');
    img.setAttribute('width', '225');
    img.setAttribute('height', '320');

    const heading = document.createElement('h3');
    heading.className = 'card-title';
    heading.textContent = title;

    const infoText = document.createElement('p');
    infoText.className = 'card-info';
    infoText.textContent = `${subType} | ⭐ Rating: ${score}/10`;

    card.addEventListener('click', function() {
      alert(`"${title}"\nCategory: ${finalMediumType.toUpperCase()} (${subType})\nScore: ${score}/10\n\nStudy this masterpiece's production standards!`);
    });

    card.appendChild(img);
    card.appendChild(heading);
    card.appendChild(infoText);
    malFeedGrid.appendChild(card);
  });
}

// Attach Form Observers
if (filterForm) {
  filterForm.addEventListener('submit', handleSearchSubmit);
}

// Ignition switch
loadPersonalFavorites();