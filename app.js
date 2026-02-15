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

  // MẶT TRƯỚC: chữ to – đậm
  display.textContent = card.front;
  display.classList.add("front-text");
  showingBack = false;

  display.onclick = () => {
    if (!showingBack) {
      display.textContent = card.back;
      display.classList.remove("front-text"); // mặt sau bình thường
    } else {
      display.textContent = card.front;
      display.classList.add("front-text"); // mặt trước to – đậm
    }
    showingBack = !showingBack;
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
      INITIAL LOAD
--------------------------*/

renderDecks(); // load deck khi mở trang