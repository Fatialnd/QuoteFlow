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

function speakQuote() {
  const utterance = new SpeechSynthesisUtterance(currentQuote);
  speechSynthesis.speak(utterance);
}

speech.addEventListener("click", () => {
  speakQuote();
});

function speakQuote() {
  if (speechSynthesis.speaking) {
    return;
  }

  if (currentQuote === "") {
    showNotification("No quote available to read.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(currentQuote);
  speechSynthesis.speak(utterance);
}

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
  previousState.quote = currentQuote;

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    favoritesList.textContent = "No favorite quotes added yet.";
    favoritesList.classList.add("empty-favorites");
  } else {
    favoritesList.classList.remove("empty-favorites");
    const list = document.createElement("ul");
    favorites.forEach((quote, index) => {
      const listItem = document.createElement("li");

      const quoteText = document.createElement("span");
      quoteText.textContent = quote;
      listItem.appendChild(quoteText);

      const deleteButton = document.createElement("button");
      document.body.appendChild(deleteButton);
      deleteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
      </svg>`;
      deleteButton.style.marginLeft = "10px";
      deleteButton.addEventListener("click", () => {
        removeQuoteFromFavorites(index);
      });
      listItem.appendChild(deleteButton);

      list.appendChild(listItem);
    });
    favoritesList.appendChild(list);
  }

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

function removeQuoteFromFavorites(index) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  showNotification("Quote removed!");
  showFavorites();
}

function showQuoteContainer() {
  quoteText.textContent = previousState.quote;
  quoteText.style.display = "block";

  newQuoteButton.style.display = "inline-block";
  favoriteQuoteButton.style.display = "inline-block";
  shareQuoteButton.style.display = "inline-block";
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
