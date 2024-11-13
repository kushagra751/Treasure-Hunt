let score = 0;
let lives = 3;
let treasures = [];
let traps = [];

function startGame() {
    score = 0;
    lives = 3;
    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;
    treasures = generatePositions();
    traps = generatePositions();
    
    document.querySelectorAll('.tile').forEach(tile => {
        tile.classList.remove('digged');
        tile.textContent = '';
        tile.addEventListener('click', dig);
    });
}

function generatePositions() {
    const positions = new Set();
    while (positions.size < 5) {
        positions.add(Math.floor(Math.random() * 16));
    }
    return [...positions];
}

function dig(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    if (event.target.classList.contains('digged')) return;

    event.target.classList.add('digged');

    if (treasures.includes(index)) {
        event.target.textContent = "💎";
        score += 10;
        document.getElementById("score").textContent = score;
    } else if (traps.includes(index)) {
        event.target.textContent = "💀";
        lives -= 1;
        document.getElementById("lives").textContent = lives;
        if (lives === 0) {
            alert("Game Over! Try again!");
            document.querySelectorAll('.tile').forEach(tile => tile.removeEventListener('click', dig));
        }
    } else {
        event.target.textContent = "🌿";
    }
}

startGame();
