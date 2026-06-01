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
 * Global search engine router splitting between /anime and /manga
 */
export async function searchGlobalCatalog(query, medium) {
  const endpoint = medium === 'manga' ? '/manga' : '/anime';
  const url = `${endpoint}?q=${encodeURIComponent(query)}`;
  
  return await fetchData(url);
}

// localStorage state helpers
export function getSaved() {
  const raw = localStorage.getItem('savedItems');
  return raw ? JSON.parse(raw) : [];
}

export function setSaved(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}