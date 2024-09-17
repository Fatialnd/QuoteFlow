function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
}

const quoteText = document.getElementById("quote");
const newQuoteButton = document.getElementById("new-quote");
const shareQuoteButton = document.getElementById("share-quote");
const favoriteQuoteButton = document.getElementById("favorite-quote");
const showFavoritesButton = document.getElementById("show-favorites");
const backToQuoteButton = document.getElementById("back-to-quote");
const favoritesList = document.getElementById("favorites-list");
const quoteContainer = document.querySelector(".quote-container");
const quoteHeader = document.querySelector(".quote-header");
const speech = document.querySelector(".speech");

let currentQuote = "";
let previousState = { quote: "", buttonsVisible: true };

async function fetchQuote() {
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const targetUrl = "https://zenquotes.io/api/random";
  const cacheBuster = `&timestamp=${new Date().getTime()}`;

  try {
    const response = await fetch(
      proxyUrl + encodeURIComponent(targetUrl + cacheBuster),
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const quotes = JSON.parse(data.contents);
    if (quotes.length === 0) {
      throw new Error("No quotes found");
    }
    const quote = quotes[0].q;
    const author = quotes[0].a;
    currentQuote = `"${quote}" — ${author}`;
    quoteText.textContent = currentQuote;
  } catch (error) {
    console.error("Fetching quote failed:", error);
    quoteText.textContent = "Sorry, something went wrong. Please try again!";
  }
}

function addQuoteToFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(currentQuote)) {
    favorites.push(currentQuote);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showNotification("Quote saved!");
  } else {
    showNotification("Quote is already in favorites.");
  }
}

function showFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favoritesList.innerHTML = "";
  if (favorites.length === 0) {
    favoritesList.textContent = "No favorite quotes added yet.";
  } else {
    const list = document.createElement("ul");
    favorites.forEach((quote) => {
      const listItem = document.createElement("li");
      listItem.textContent = quote;
      list.appendChild(listItem);
    });
    favoritesList.appendChild(list);
  }

  previousState.quote = quoteText.textContent;
  previousState.buttonsVisible = newQuoteButton.style.display !== "none";
  quoteText.style.display = "none";
  newQuoteButton.style.display = "none";
  favoriteQuoteButton.style.display = "none";
  shareQuoteButton.style.display = "none";
  showFavoritesButton.style.display = "none";
  quoteHeader.style.display = "none";
  speech.style.display = "none";
  backToQuoteButton.style.display = "block";
  favoritesList.style.display = "block";
}

function showQuoteContainer() {
  quoteText.textContent = previousState.quote;
  quoteText.style.display = "block";
  newQuoteButton.style.display = previousState.buttonsVisible
    ? "inline-block"
    : "none";
  favoriteQuoteButton.style.display = previousState.buttonsVisible
    ? "inline-block"
    : "none";
  shareQuoteButton.style.display = previousState.buttonsVisible
    ? "inline-block"
    : "none";
  showFavoritesButton.style.display = "inline-block";
  quoteHeader.style.display = "block";
  speech.style.display = "block";
  backToQuoteButton.style.display = "none";
  favoritesList.style.display = "none";
}

newQuoteButton.addEventListener("click", () => {
  fetchQuote();
});

shareQuoteButton.addEventListener("click", () => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentQuote)}`;
  window.open(twitterUrl, "_blank");
});

favoriteQuoteButton.addEventListener("click", () => {
  addQuoteToFavorites();
});

showFavoritesButton.addEventListener("click", () => {
  showFavorites();
});

backToQuoteButton.addEventListener("click", () => {
  showQuoteContainer();
});

fetchQuote();
