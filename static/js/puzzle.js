// Simple click-to-swap jigsaw puzzle. Works on desktop and mobile (no drag needed).

const BOARD_SIZE = 560; // rendered board size in px (square)
let pieceSize = BOARD_SIZE / gridSize;
let pieces = [];        // pieces[slotIndex] = correctIndex currently sitting in that slot
let selectedSlot = null;
let startTime = null;
let timerInterval = null;
let solved = false;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // guard against an already-solved shuffle
  if (arr.every((v, i) => v === i)) {
    return shuffle(arr);
  }
  return arr;
}

function initPuzzle() {
  pieces = shuffle(Array.from({ length: gridSize * gridSize }, (_, i) => i));
  renderBoard();
  startTimer();
}

function renderBoard() {
  const board = document.getElementById("puzzle-board");
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
  board.style.width = BOARD_SIZE + "px";
  board.style.height = BOARD_SIZE + "px";

  pieces.forEach((correctIndex, slotIndex) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.style.width = pieceSize + "px";
    tile.style.height = pieceSize + "px";
    tile.dataset.slot = slotIndex;

    const row = Math.floor(correctIndex / gridSize);
    const col = correctIndex % gridSize;
    tile.style.backgroundImage = `url('${imageUrl}')`;
    tile.style.backgroundSize = `${BOARD_SIZE}px ${BOARD_SIZE}px`;
    tile.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;

    if (String(slotIndex) === String(selectedSlot)) {
      tile.classList.add("selected");
    }

    tile.addEventListener("click", onTileClick);
    board.appendChild(tile);
  });
}

function onTileClick(e) {
  if (solved) return;
  const slot = e.currentTarget.dataset.slot;

  if (selectedSlot === null) {
    selectedSlot = slot;
  } else if (selectedSlot === slot) {
    selectedSlot = null;
  } else {
    [pieces[selectedSlot], pieces[slot]] = [pieces[slot], pieces[selectedSlot]];
    selectedSlot = null;
  }
  renderBoard();
  checkWin();
}

function checkWin() {
  if (pieces.every((v, i) => v === i)) {
    solved = true;
    clearInterval(timerInterval);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    document.getElementById("final-time").textContent = elapsed;
    document.getElementById("final-image").src = imageUrl;
    document.getElementById("win-modal").style.display = "flex";

    fetch("/api/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time_taken: parseFloat(elapsed) }),
    });
  }
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    document.getElementById("timer").textContent = elapsed + "s";
  }, 100);
}

window.onload = initPuzzle;
