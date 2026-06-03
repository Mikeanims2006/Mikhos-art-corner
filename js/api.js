// js/api.js
const BASE_URL = 'https://api.jikan.moe/v4'; 

/**
 * Core fetch utility with built-in response checking
 */
export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`Network response error: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}

/**
 * Base search execution that queries a specific single route string
 */
export async function querySingleEndpoint(query, typeRoute, minScore) {
  let url = `/${typeRoute}?q=${encodeURIComponent(query)}`;
  if (minScore) {
    url += `&min_score=${minScore}`;
  }
  return await fetchData(url);
}

/**
 * Global search engine router splitting between single lookups or combined parallel fetches
 */
export async function searchGlobalCatalog(query, medium, minScore) {
  if (medium === 'both') {
    // 🚀 ASYNC UPGRADE: Fire both fetches at the exact same time!
    const [animeResults, mangaResults] = await Promise.all([
      querySingleEndpoint(query, 'anime', minScore),
      querySingleEndpoint(query, 'manga', minScore)
    ]);

    // Tag each result item so the renderer knows its origin format layout
    const taggedAnime = animeResults.map(item => ({ ...item, originMedium: 'anime' }));
    const taggedManga = mangaResults.map(item => ({ ...item, originMedium: 'manga' }));

    // Merge them into one big array, sorting highest scored content first
    const combined = [...taggedAnime, ...taggedManga];
    return combined.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  // Fallback to old behavior for explicit single choice filters
  return await querySingleEndpoint(query, medium, minScore);
}

// localStorage state helpers
export function getSaved() {
  const raw = localStorage.getItem('savedItems');
  return raw ? JSON.parse(raw) : [];
}

export function setSaved(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}