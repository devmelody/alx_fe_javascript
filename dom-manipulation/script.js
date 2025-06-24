const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote').addEventListener('click', showRandomQuote);
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

const quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" }
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteToBeDisplayed = quotes[randomIndex]
  quoteDisplay.innerHTML = `"${quoteToBeDisplayed.text}" - ${quoteToBeDisplayed.category}`;
}

function createAddQuoteForm() {
  const newQuote = newQuoteText.value;
  const newCategory = newQuoteCategory.value;
  const newestQuote = `"${newQuote}" - ${newCategory}` ;

  if (newQuote !== '' && newCategory !== '') {

    quotes.push({text: newQuote, category: newCategory});

    quoteDisplay.innerHTML = newestQuote;

        // Clear input fields after showing
    newQuoteText.value = '';
    newQuoteCategory.value = '';
  } else {
    alert("Please fill in both the quote and category.");
  }

console.log(quotes);

}