// Utility Functions
function showNotification(message, duration = 2000) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, duration);
}

function toggleDisplay(elements, displayStyle) {
  elements.forEach(([element, style]) => {
    element.style.display = style || displayStyle;
  });
}

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// DOM Elements
const elements = {
  quoteText: document.getElementById('quote'),
  newQuoteButton: document.getElementById('new-quote'),
  shareQuoteButton: document.getElementById('share-quote'),
  favoriteQuoteButton: document.getElementById('favorite-quote'),
  showFavoritesButton: document.getElementById('show-favorites'),
  backToQuoteButton: document.getElementById('back-to-quote'),
  favoritesList: document.getElementById('favorites-list'),
  quoteContainer: document.querySelector('.quote-container'),
  quoteHeader: document.querySelector('.quote-header'),
  speech: document.querySelector('.speech'),
};

let currentQuote = '';
let previousState = { quote: '', buttonsVisible: true };

// Speech Functionality
function speakQuote() {
  if (speechSynthesis.speaking) return;
  if (!currentQuote) {
    showNotification('No quote available to read.');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(currentQuote);
  speechSynthesis.speak(utterance);
}

elements.speech.addEventListener('click', speakQuote);

// Fetch Quote
async function fetchQuote() {
  const proxyUrl = 'https://api.allorigins.win/get?url=';
  const targetUrl = 'https://zenquotes.io/api/random';
  const cacheBuster = `&timestamp=${new Date().getTime()}`;

  try {
    const response = await fetch(
      proxyUrl + encodeURIComponent(targetUrl + cacheBuster)
    );
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    const quotes = JSON.parse(data.contents);
    if (!quotes.length) throw new Error('No quotes found');

    const { q: quote, a: author } = quotes[0];
    currentQuote = `"${quote}" — ${author}`;
    elements.quoteText.textContent = currentQuote;
  } catch (error) {
    console.error('Fetching quote failed:', error);
    elements.quoteText.textContent =
      'Sorry, something went wrong. Please try again!';
  }
}

// Favorites Management
function addQuoteToFavorites() {
  const favorites = getFavorites();
  if (favorites.includes(currentQuote)) {
    showNotification('Quote is already in favorites.');
    return;
  }
  favorites.push(currentQuote);
  saveFavorites(favorites);
  showNotification('Quote saved!');
}

function removeQuoteFromFavorites(index) {
  const favorites = getFavorites();
  favorites.splice(index, 1);
  saveFavorites(favorites);
  showNotification('Quote removed!');
  showFavorites();
}

function showFavorites() {
  previousState.quote = currentQuote;

  const favorites = getFavorites();
  elements.favoritesList.innerHTML = '';

  if (!favorites.length) {
    elements.favoritesList.textContent = 'No favorite quotes added yet.';
    elements.favoritesList.classList.add('empty-favorites');
  } else {
    elements.favoritesList.classList.remove('empty-favorites');
    const list = document.createElement('ul');
    favorites.forEach((quote, index) => {
      const listItem = document.createElement('li');
      const quoteSpan = document.createElement('span');
      quoteSpan.textContent = quote;

      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M170.5 51.6..."/> 
        </svg>`;
      deleteButton.style.marginLeft = '10px';
      deleteButton.addEventListener('click', () =>
        removeQuoteFromFavorites(index)
      );

      listItem.append(quoteSpan, deleteButton);
      list.appendChild(listItem);
    });
    elements.favoritesList.appendChild(list);
  }

  toggleDisplay([
    [elements.quoteText, 'none'],
    [elements.newQuoteButton, 'none'],
    [elements.favoriteQuoteButton, 'none'],
    [elements.shareQuoteButton, 'none'],
    [elements.showFavoritesButton, 'none'],
    [elements.quoteHeader, 'none'],
    [elements.speech, 'none'],
    [elements.backToQuoteButton, 'block'],
    [elements.favoritesList, 'block'],
  ]);
}

function showQuoteContainer() {
  elements.quoteText.textContent = previousState.quote;

  toggleDisplay([
    [elements.quoteText, 'block'],
    [elements.newQuoteButton, 'inline-block'],
    [elements.favoriteQuoteButton, 'inline-block'],
    [elements.shareQuoteButton, 'inline-block'],
    [elements.showFavoritesButton, 'inline-block'],
    [elements.quoteHeader, 'block'],
    [elements.speech, 'block'],
    [elements.backToQuoteButton, 'none'],
    [elements.favoritesList, 'none'],
  ]);
}

// Event Listeners
elements.newQuoteButton.addEventListener('click', fetchQuote);
elements.shareQuoteButton.addEventListener('click', () => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentQuote)}`;
  window.open(twitterUrl, '_blank');
});
elements.favoriteQuoteButton.addEventListener('click', addQuoteToFavorites);
elements.showFavoritesButton.addEventListener('click', showFavorites);
elements.backToQuoteButton.addEventListener('click', showQuoteContainer);

// Initial Fetch
fetchQuote();
