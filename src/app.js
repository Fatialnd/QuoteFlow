const quoteText = document.getElementById("quote");
const newQuoteButton = document.getElementById("new-quote");
const shareQuoteButton = document.getElementById("share-quote");

let currentQuote = "";

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

newQuoteButton.addEventListener("click", () => {
  fetchQuote();
});

shareQuoteButton.addEventListener("click", () => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentQuote)}`;
  window.open(twitterUrl, "_blank");
});

fetchQuote();
