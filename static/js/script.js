let score = 0;
let lives = 1;
let multiplier = 1.0;
let minesCount = 3;
let mines = [];
let revealedTiles = 0;
const totalTiles = 16;

function startGame() {
    // Reset game state
    score = 0;
    lives = 1;
    multiplier = 1.0;
    revealedTiles = 0;
    minesCount = parseInt(document.getElementById("mines-count").value);
    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;
    document.getElementById("multiplier").textContent = `${multiplier.toFixed(1)}x`;
    document.getElementById("cashout-button").disabled = false;

    // Reset tiles
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        tile.textContent = "❓";
        tile.classList.remove("revealed");
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
    const tile = event.target;
    const index = parseInt(tile.dataset.index);

    if (tile.classList.contains("revealed")) return;

    tile.classList.add("revealed");
    revealedTiles++;

    if (mines.includes(index)) {
        tile.textContent = "💀";
        lives--;
        document.getElementById("lives").textContent = lives;
        endGame("You hit a mine!");
    } else {
        tile.textContent = "✅";
        score += 10;
        multiplier += 0.2 * minesCount; // Adjust multiplier based on risk
        document.getElementById("score").textContent = score;
        document.getElementById("multiplier").textContent = `${multiplier.toFixed(1)}x`;

        if (revealedTiles === totalTiles - minesCount) {
            endGame("You uncovered all safe tiles!");
        }
    }
}

function cashOut() {
    endGame(`Cashed out with ${score} points and ${multiplier.toFixed(1)}x multiplier!`);
}

function endGame(message) {
    alert(message);
    document.getElementById("cashout-button").disabled = true;
    document.querySelectorAll(".tile").forEach(tile => tile.onclick = null);
}

function restartGame() {
    startGame();
}

// Initialize game on page load
startGame();
