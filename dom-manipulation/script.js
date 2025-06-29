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

    populateCategories();
    filterQuotes();

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

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const select = document.getElementById('categoryFilter');

  select.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const createOption = document.createElement('option');
    createOption.value = category;
    createOption.textContent = category;
    select.appendChild(createOption);
  });

  const lastSelected = localStorage.getItem('selectedCategory');
  if (lastSelected) {
    select.value = lastSelected;
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const listContainer = document.getElementById("quoteList");

  localStorage.setItem('selectedCategory', selectedCategory);

  // Clear the current list
  listContainer.innerHTML = "";

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  filteredQuotes.forEach(q => {
    const li = document.createElement("li");
    li.textContent = `"${q.text}" - ${q.category}`;
    listContainer.appendChild(li);
  });
}

function fetchQuotesFromServer() {
  fetch("http://localhost:3000/quotes")
    .then(res => res.json())
    .then(serverQuotes => {
      syncWithLocal(serverQuotes);
    })
    .catch(err => console.error("Server fetch error:", err));
}

// Call every 15 seconds
setInterval(fetchQuotesFromServer, 15000);

function syncWithLocal(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("saved")) || [];

  const newQuotes = serverQuotes.filter(
    serverQ => !localQuotes.some(localQ => localQ.text === serverQ.text)
  );

  if (newQuotes.length > 0) {
    const updated = [...localQuotes, ...newQuotes];
    localStorage.setItem("saved", JSON.stringify(updated));
    quotes.length = 0;
    updated.forEach(q => quotes.push(q));
    populateCategories();
    filterQuotes();
    showSyncNotification(newQuotes.length);
  }
}

function showSyncNotification(count) {
  const notice = document.getElementById("syncNotice");
  notice.textContent = `${count} new quote(s) synced from server.`;
  notice.style.display = "block";
  setTimeout(() => {
    notice.style.display = "none";
  }, 5000);
}



//<input type="file" id="importFile" accept=".json" />
//<button onclick="importQuotes()">Import Quotes</button>
