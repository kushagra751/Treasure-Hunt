let betAmount = 10;
let minesCount = 5;
let mines = [];
let revealedTiles = 0;
let multiplier = 1.0;
let profit = 0;
let gameActive = false;
const totalTiles = 25;

function startGame() {
    if (gameActive) return;

    // Reset game state
    betAmount = parseFloat(document.getElementById("bet-amount").value) || 10;
    minesCount = parseInt(document.getElementById("mines-count").value) || 5;
    if (minesCount < 1 || minesCount > 24) minesCount = 5;
    revealedTiles = 0;
    multiplier = 1.0;
    profit = 0;
    gameActive = true;

    document.getElementById("profit").textContent = profit.toFixed(2);
    document.getElementById("multiplier").textContent = `${multiplier.toFixed(2)}x`;
    document.getElementById("bet-button").disabled = true;
    document.getElementById("cashout-button").disabled = false;

    // Reset tiles
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        tile.textContent = "";
        tile.classList.remove("revealed", "safe", "mine");
        tile.onclick = revealTile;
    });

    // Place mines randomly
    mines = [];
    while (mines.length < minesCount) {
        const randomIndex = Math.floor(Math.random() * totalTiles);
        if (!mines.includes(randomIndex)) mines.push(randomIndex);
    }
}

function revealTile(event) {
    if (!gameActive) return;

    const tile = event.target;
    const index = parseInt(tile.dataset.index);

    if (tile.classList.contains("revealed")) return;

    tile.classList.add("revealed");
    revealedTiles++;

    if (mines.includes(index)) {
        tile.textContent = "💣";
        tile.classList.add("mine");
        endGame("Game Over! You hit a mine.");
    } else {
        tile.textContent = "💎";
        tile.classList.add("safe");
        updateMultiplier();
        profit = betAmount * (multiplier - 1);
        document.getElementById("profit").textContent = profit.toFixed(2);
        document.getElementById("multiplier").textContent = `${multiplier.toFixed(2)}x`;

        if (revealedTiles === totalTiles - minesCount) {
            endGame("You cleared the board!");
        }
    }
}

function updateMultiplier() {
    // Simplified multiplier calculation (inspired by Stake Mines)
    const safeTilesLeft = totalTiles - minesCount - revealedTiles + 1;
    const riskFactor = minesCount / totalTiles;
    multiplier = (1 / (safeTilesLeft / totalTiles)) * (1 + riskFactor);
}

function cashOut() {
    if (!gameActive) return;
    endGame(`Cashed out with ${profit.toFixed(2)} profit at ${multiplier.toFixed(2)}x!`);
}

function endGame(message) {
    alert(message);
    gameActive = false;
    document.getElementById("bet-button").disabled = false;
    document.getElementById("cashout-button").disabled = true;
    document.querySelectorAll(".tile").forEach(tile => tile.onclick = null);
}

// Initialize game on page load
document.getElementById("bet-button").disabled = false;
