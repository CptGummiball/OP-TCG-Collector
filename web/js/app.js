let cardsData = [];
let collection = JSON.parse(localStorage.getItem('collection')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let language = localStorage.getItem('language') || 'EN';

// Elements
const languageToggleBtn = document.getElementById('language-toggle');
const homeContent = document.getElementById('home-content');
const collectionContent = document.getElementById('collection-content');
const wishlistContent = document.getElementById('wishlist-content');
const searchContent = document.getElementById('search-content');
const collectionList = document.getElementById('collection-list');
const wishlistList = document.getElementById('wishlist-list');
const searchBar = document.getElementById('search-bar');
const searchResults = document.getElementById('search-results');
const collectionLink = document.getElementById('collection-link');
const wishlistLink = document.getElementById('wishlist-link');
const searchLink = document.getElementById('search-link');

// Language switch
function toggleLanguage() {
  language = language === 'EN' ? 'DE' : 'EN';
  localStorage.setItem('language', language);
  languageToggleBtn.innerText = language;
  updateLanguageContent();
}

// Update content based on language
function updateLanguageContent() {
  if (language === 'DE') {
    // Change all text to German
    document.querySelector('h1').innerText = "Willkommen bei deiner TCG Sammlung";
    document.querySelector('h2').innerText = "Deine Sammlung";
  } else {
    // Default to English
    document.querySelector('h1').innerText = "Welcome to your TCG Collection";
    document.querySelector('h2').innerText = "Your Collection";
  }
}

// Handle navigation
collectionLink.addEventListener('click', () => {
  homeContent.classList.add('hidden');
  collectionContent.classList.remove('hidden');
  wishlistContent.classList.add('hidden');
  searchContent.classList.add('hidden');
  renderCollection();
});

wishlistLink.addEventListener('click', () => {
  homeContent.classList.add('hidden');
  collectionContent.classList.add('hidden');
  wishlistContent.classList.remove('hidden');
  searchContent.classList.add('hidden');
  renderWishlist();
});

searchLink.addEventListener('click', () => {
  homeContent.classList.add('hidden');
  collectionContent.classList.add('hidden');
  wishlistContent.classList.add('hidden');
  searchContent.classList.remove('hidden');
});

// Load CSV and initialize
fetch('assets/cards.csv')
  .then(response => response.text())
  .then(csvData => {
    parseCSV(csvData, (cards) => {
      cardsData = cards;
    });
  });

// Add card to collection
function addToCollection(cardId, quantity) {
  const card = cardsData.find(c => c.id === cardId);
  if (!card) return;

  const existingCard = collection.find(c => c.id === cardId);
  if (existingCard) {
    existingCard.quantity += quantity;
  } else {
    collection.push({ ...card, quantity });
  }

  localStorage.setItem('collection', JSON.stringify(collection));
  renderCollection();
}

// Render collection
function renderCollection() {
  collectionList.innerHTML = '';
  collection.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card-item');
    cardElement.innerHTML = `
      <p>${card.name} (${card.edition})</p>
      <p>Quantity: ${card.quantity}</p>
      <button onclick="addToCollection('${card.id}', 1)">Add One More</button>
    `;
    collectionList.appendChild(cardElement);
  });
}

// Add card to wishlist
function addToWishlist(cardId) {
  const card = cardsData.find(c => c.id === cardId);
  if (!card || wishlist.find(c => c.id === cardId)) return;

  wishlist.push(card);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  renderWishlist();
}

// Render wishlist
function renderWishlist() {
  wishlistList.innerHTML = '';
  wishlist.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card-item');
    cardElement.innerHTML = `
      <p>${card.name} (${card.edition})</p>
      <button onclick="addToWishlist('${card.id}')">Add to Collection</button>
    `;
    wishlistList.appendChild(cardElement);
  });
}

// Search functionality
searchBar.addEventListener('input', () => {
  const query = searchBar.value.toLowerCase();
  const results = cardsData.filter(card => card.name.toLowerCase().includes(query));
  renderSearchResults(results);
});

// Render search results
function renderSearchResults(results) {
  searchResults.innerHTML = '';
  results.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card-item');
    cardElement.innerHTML = `
      <p>${card.name} (${card.edition})</p>
      <button onclick="addToWishlist('${card.id}')">Add to Wishlist</button>
    `;
    searchResults.appendChild(cardElement);
  });
}

// Initialize language toggle
languageToggleBtn.addEventListener('click', toggleLanguage);

// Update content language on page load
updateLanguageContent();
