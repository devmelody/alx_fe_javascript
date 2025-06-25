const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document
  .getElementById("newQuote")
  .addEventListener("click", showRandomQuote);
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const quoteList = document.getElementById("quoteList");

const quotes = [
  {
    text: "Be yourself; everyone else is already taken.",
    category: "Inspiration",
  },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteToBeDisplayed = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quoteToBeDisplayed.text}" - ${quoteToBeDisplayed.category}`;
}

function createAddQuoteForm() {
  const newQuote = newQuoteText.value;
  const newCategory = newQuoteCategory.value;
  const newestQuote = `"${newQuote}" - ${newCategory}`;

  if (newQuote !== "" && newCategory !== "") {
    quotes.push({ text: newQuote, category: newCategory });
    localStorage.setItem("saved", JSON.stringify(quotes));

    const list = document.createElement("li");
    list.textContent = newestQuote;
    quoteList.appendChild(list);

    // Clear input fields after showing
    newQuoteText.value = "";
    newQuoteCategory.value = "";
  } else {
    alert("Please fill in both the quote and category.");
  }

  console.log(quotes);
}

// Ensure that the application loads existing quotes from local storage when initialized.
window.onload = () => {
  const savedQuotes = JSON.parse(localStorage.getItem("saved"));

  if (savedQuotes) {
    savedQuotes.forEach((savedQuote) => {
      quotes.push(savedQuote);
    });
  }
};

function exportToJsonFile() {
  //Create a blob that shows data and data type.
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  //Create URL for data in blob

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json"; //What to download it as
  a.click();
  console.log(url);
  URL.revokeObjectURL(url);
}
/*| Step | What Happens                                |
| ---- | ------------------------------------------- |
| 📁 1 | User selects a `.json` file                 |
| 📖 2 | `FileReader` reads the file as text         |
| 🔄 3 | JSON is parsed into a JavaScript array      |
| ✅ 4  | Valid quotes are added to the existing list |
| 💾 5 | Updated list is saved to localStorage       |
| 🎉 6 | User is notified that import was successful |*/

function importFromJsonFile(event) {
  const fileInput = document.getElementById("fileInput");
  const file = event.target.files[0];
  const fileReader = new FileReader();

  if (!file) {
    alert("Please select a file🙂");
    return;
  }
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (Array.isArray(importedQuotes)) {
        importedQuotes.forEach((eachQuote) => {
          if (eachQuote.text && eachQuote.category) {
            quotes.push(eachQuote);
          }
        });
        localStorage.setItem("saved", JSON.stringify(quotes));
        alert("Quotes imported successfully");
      } else {
        alert("Invalid file format!");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };
    fileReader.readAsText(file);

}

//<input type="file" id="importFile" accept=".json" />
//<button onclick="importQuotes()">Import Quotes</button>
