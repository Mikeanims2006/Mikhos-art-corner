// js/inspirations.js
import { searchGlobalCatalog } from './api.js';

// DOM Target References
const filterForm = document.getElementById('filter-form');
const searchInput = document.getElementById('search-input');
const mediumSelect = document.getElementById('medium-select');
const searchRating = document.getElementById('search-rating');
const malFeedGrid = document.getElementById('mal-feed-grid');

const delay = ms => new Promise(res => setTimeout(res, ms));

/**
 * Automatically fetches pristine image URLs for your personal favorites on page load
 */
async function loadPersonalFavorites() {
  const favoritesToFetch = [
    { title: 'Vagabond', medium: 'manga', selector: 'Vagabond' },
    { title: 'Vinland Saga', medium: 'manga', selector: 'Vinland Saga' },
    { title: 'Attack on Titan', medium: 'anime', selector: 'Attack on Titan' }
  ];

  for (const fav of favoritesToFetch) {
    try {
      const results = await searchGlobalCatalog(fav.title, fav.medium, null);
      
      if (results && results.length > 0) {
        const exactMatch = results.find(item => item.title.toLowerCase() === fav.title.toLowerCase()) || results[0];
        const freshImgUrl = exactMatch.images?.jpg?.image_url;

        if (freshImgUrl) {
          const cardHeadings = document.querySelectorAll('.static-favorites .card-title');
          cardHeadings.forEach(heading => {
            if (heading.textContent.trim() === fav.selector) {
              const imgElement = heading.parentElement.querySelector('.card-image');
              if (imgElement) {
                imgElement.src = freshImgUrl;
              }
              
              heading.parentElement.addEventListener('click', () => {
                alert(`"${exactMatch.title}"\nOne of your all-time favorites!\nGlobal Rating: ${exactMatch.score || 'N/A'}/10`);
              });
            }
          });
        }
      }
      await delay(1000);
      
    } catch (err) {
      console.error(`Failed to dynamically fetch image for ${fav.title}:`, err);
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
    
    // Fall back intelligently depending on whether it's a separate category or a combined mixed payload
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

if (searchInput) {
  searchInput.addEventListener('input', () => {
    console.log(`Current query typing state: ${searchInput.value}`);
  });
}

if (mediumSelect) {
  mediumSelect.addEventListener('change', () => {
    console.log(`Dropdown format query change: ${mediumSelect.value}`);
  });
}

// Ignition switch
loadPersonalFavorites();