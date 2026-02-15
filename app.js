let decks = JSON.parse(localStorage.getItem("decks") || "[]");
let currentDeckIndex = null;
let remainingCards = [];
let showingBack = false;

function save() {
  localStorage.setItem("decks", JSON.stringify(decks));
}

/* -------------------------
      DECK FUNCTIONS
--------------------------*/

function addDeck() {
  const name = document.getElementById("deck-name").value;
  if (!name) return;

  decks.push({ name, cards: [] });
  save();
  renderDecks();
}

function renderDecks() {
  const list = document.getElementById("deck-list");
  list.innerHTML = "";

  decks.forEach((deck, i) => {
    const row = document.createElement("div");
    row.className = "deck-row";
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.margin = "8px 0";

    row.innerHTML = `
      <div class="deck" style="flex:1; cursor:pointer;">
        ${deck.name} (${deck.cards.length} thẻ)
      </div>
      <button onclick="deleteDeck(${i})">Xóa</button>
    `;

    row.querySelector(".deck").onclick = () => openDeck(i);

    list.appendChild(row);
  });
}

function deleteDeck(i) {
  if (!confirm("Bạn có chắc muốn xóa deck này?")) return;

  decks.splice(i, 1);
  save();
  renderDecks();
}

function openDeck(i) {
  currentDeckIndex = i;

  document.getElementById("deck-title").textContent = decks[i].name;
  document.getElementById("deck-list").style.display = "none";
  document.getElementById("deck-view").style.display = "block";

  remainingCards = [...decks[i].cards];
  nextCard();
}

function backHome() {
  document.getElementById("deck-view").style.display = "none";
  document.getElementById("deck-list").style.display = "block";
}

/* -------------------------
      CARD FUNCTIONS
--------------------------*/

function addCard() {
  const front = document.getElementById("front").value;
  const back = document.getElementById("back").value;

  if (!front || !back) return;

  decks[currentDeckIndex].cards.push({ front, back });
  save();

  remainingCards = [...decks[currentDeckIndex].cards];

  document.getElementById("front").value = "";
  document.getElementById("back").value = "";
  document.getElementById("front").focus();
}

function nextCard() {
  const display = document.getElementById("card-display");

  if (remainingCards.length === 0) {
    display.textContent = "Hết thẻ!";
    display.classList.remove("front-text");
    return;
  }

  const idx = Math.floor(Math.random() * remainingCards.length);
  const card = remainingCards[idx];

  display.classList.remove("flip");
  setTimeout(() => {
    display.textContent = card.front;
    display.classList.add("front-text");
    showingBack = false;
  }, 150);

  display.onclick = () => {
    display.classList.add("flip");

    setTimeout(() => {
      if (!showingBack) {
        display.textContent = card.back;
        display.classList.remove("front-text");
      } else {
        display.textContent = card.front;
        display.classList.add("front-text");
      }
      showingBack = !showingBack;

      display.classList.remove("flip");
    }, 150);
  };

  remainingCards.splice(idx, 1);
}

/* -------------------------
      MANAGE CARDS
--------------------------*/

function showManage() {
  document.getElementById("study-area").style.display = "none";
  document.getElementById("manage-area").style.display = "block";
  renderManageList();
}

function hideManage() {
  document.getElementById("manage-area").style.display = "none";
  document.getElementById("study-area").style.display = "block";
}

function renderManageList() {
  const list = document.getElementById("manage-list");
  list.innerHTML = "";

  decks[currentDeckIndex].cards.forEach((c, i) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.margin = "5px 0";

    row.innerHTML = `
      <span>${c.front} → ${c.back}</span>
      <button onclick="deleteCard(${i})">Xóa</button>
    `;

    list.appendChild(row);
  });
}

function deleteCard(i) {
  decks[currentDeckIndex].cards.splice(i, 1);
  save();

  remainingCards = [...decks[currentDeckIndex].cards];

  renderManageList();
}

/* -------------------------
      FULLSCREEN MODE
--------------------------*/

document.getElementById("fullscreen-btn").addEventListener("click", toggleFullscreen);

function toggleFullscreen() {
  const deckView = document.getElementById("deck-view");

  if (!deckView.classList.contains("fullscreen-mode")) {
    deckView.classList.add("fullscreen-mode");
  } else {
    deckView.classList.remove("fullscreen-mode");
  }
}

/* -------------------------
      SWIPE GESTURES
--------------------------*/

let touchStartX = 0;
let touchEndX = 0;

const swipeZone = document.getElementById("card-display");

swipeZone.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

swipeZone.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const distance = touchEndX - touchStartX;

  if (Math.abs(distance) < 50) return;

  nextCard();
}

swipeZone.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (Math.abs(dx) < 50) return;
    nextCard();
  } else {
    if (dy > 80) {
      // Vuốt xuống → thoát fullscreen
      document.getElementById("deck-view").classList.remove("fullscreen-mode");
    }
  }
}

/* -------------------------
      INITIAL LOAD
--------------------------*/

renderDecks();


