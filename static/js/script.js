document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const betButton = document.getElementById('bet-button');
    const cashoutButton = document.getElementById('cashout-button');
    const profitDisplay = document.getElementById('profit');
    const multiplierDisplay = document.getElementById('multiplier');

    let betAmount = 10;
    let minesCount = 5;
    let mines = [];
    let revealedTiles = 0;
    let multiplier = 1.0;
    let profit = 0;
    let gameActive = false;
    const totalTiles = 25;

    // Generate 5x5 grid
    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = i;
        grid.appendChild(tile);
    }

    function startGame() {
        if (gameActive) return;

        betAmount = parseFloat(document.getElementById('bet-amount').value) || 10;
        minesCount = parseInt(document.getElementById('mines-count').value) || 5;
        if (minesCount < 1 || minesCount > 24) minesCount = 5;

        revealedTiles = 0;
        multiplier = 1.0;
        profit = 0;
        gameActive = true;

        profitDisplay.textContent = profit.toFixed(2);
        multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
        betButton.disabled = true;
        cashoutButton.disabled = false;

        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.textContent = '';
            tile.classList.remove('revealed', 'safe', 'mine');
            tile.addEventListener('click', revealTile, { once: true });
        });

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

        if (tile.classList.contains('revealed')) return;

        tile.classList.add('revealed');
        revealedTiles++;

        if (mines.includes(index)) {
            tile.textContent = '💣';
            tile.classList.add('mine');
            endGame('Game Over! You hit a mine.');
        } else {
            tile.textContent = '💎';
            tile.classList.add('safe');
            updateMultiplier();
            profit = betAmount * (multiplier - 1);
            profitDisplay.textContent = profit.toFixed(2);
            multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;

            if (revealedTiles === totalTiles - minesCount) {
                endGame('You cleared the board!');
            }
        }
    }

    function updateMultiplier() {
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
        betButton.disabled = false;
        cashoutButton.disabled = true;
        document.querySelectorAll('.tile').forEach(tile => tile.removeEventListener('click', revealTile));
    }

    // Event listeners
    betButton.addEventListener('click', startGame);
    cashoutButton.addEventListener('click', cashOut);

    // Initial state
    betButton.disabled = false;
});
