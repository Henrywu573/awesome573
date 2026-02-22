// 2048 Cute Animals – Game Logic

// Cute animal emoji map
const ANIMAL_EMOJI = {
    2: '🐰',    // Bunny
    4: '🦔',    // Hedgehog
    8: '🐹',    // Hamster
    16: '🐱',   // Kitten
    32: '🐥',   // Duckling
    64: '🦊',   // Fox
    128: '🦉',  // Owl
    256: '🐿️',  // Squirrel
    512: '🐧',  // Penguin
    1024: '🦦', // Otter
    2048: '🐆'  // Leopard
};

// Cute animal names
const ANIMAL_NAMES = {
    2: 'Bunny',
    4: 'Hedgehog',
    8: 'Hamster',
    16: 'Kitten',
    32: 'Duckling',
    64: 'Fox',
    128: 'Owl',
    256: 'Squirrel',
    512: 'Penguin',
    1024: 'Otter',
    2048: 'Leopard'
};

class Game2048 {
    constructor() {
        this.grid = Array(4).fill(null).map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.gameOver = false;
        this.history = []; // move history for undo

        this.initGame();
        this.setupEventListeners();
        this.render();
        this.updateUndoButton(); // initialize undo button state
    }

    initGame() {
        // Spawn two random starting tiles
        this.addRandomTile();
        this.addRandomTile();
    }

    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;

            const key = e.key;
            let moved = false;

            if (key === 'ArrowUp') {
                moved = this.move('up');
                e.preventDefault();
            } else if (key === 'ArrowDown') {
                moved = this.move('down');
                e.preventDefault();
            } else if (key === 'ArrowLeft') {
                moved = this.move('left');
                e.preventDefault();
            } else if (key === 'ArrowRight') {
                moved = this.move('right');
                e.preventDefault();
            }

            if (moved) {
                this.addRandomTile();
                this.render();
                this.checkGameOver();
            }
        });

        // Touch events
        let touchStartX = 0;
        let touchStartY = 0;

        const gameGrid = document.getElementById('gameGrid');
        const gameBoard = document.querySelector('.game-board');

        // Prevent default touch behaviors on the game board
        gameBoard.addEventListener('touchstart', (e) => {
            e.preventDefault();
        }, { passive: false });

        gameBoard.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        gameGrid.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });

        gameGrid.addEventListener('touchend', (e) => {
            if (this.gameOver) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            let moved = false;

            // Determine swipe direction
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 30) {
                    moved = this.move('right');
                } else if (deltaX < -30) {
                    moved = this.move('left');
                }
            } else {
                // Vertical swipe
                if (deltaY > 30) {
                    moved = this.move('down');
                } else if (deltaY < -30) {
                    moved = this.move('up');
                }
            }

            if (moved) {
                this.addRandomTile();
                this.render();
                this.checkGameOver();
            }

            e.preventDefault();
        }, { passive: false });

        // New Game button
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.resetGame();
        });

        // Undo button
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undo();
        });
    }

    move(direction) {
        // Save current state before moving
        this.saveState();

        const oldGrid = JSON.stringify(this.grid);
        const oldScore = this.score;

        if (direction === 'left') {
            this.moveLeft();
        } else if (direction === 'right') {
            this.moveRight();
        } else if (direction === 'up') {
            this.moveUp();
        } else if (direction === 'down') {
            this.moveDown();
        }

        // Check if any tile actually moved
        const moved = oldGrid !== JSON.stringify(this.grid);

        // If nothing moved, discard the saved state
        if (!moved) {
            this.history.pop();
        }

        return moved;
    }

    saveState() {
        // Save current game state to history
        this.history.push({
            grid: JSON.parse(JSON.stringify(this.grid)),
            score: this.score
        });

        // Keep at most 10 moves of undo history
        if (this.history.length > 10) {
            this.history.shift();
        }

        this.updateUndoButton();
    }

    undo() {
        if (this.history.length === 0) return;

        // Restore previous state
        const lastState = this.history.pop();
        this.grid = lastState.grid;
        this.score = lastState.score;
        this.gameOver = false;

        document.getElementById('gameOverOverlay').classList.remove('active');

        this.render();
        this.updateUndoButton();
    }

    updateUndoButton() {
        const undoBtn = document.getElementById('undoBtn');
        if (this.history.length === 0) {
            undoBtn.disabled = true;
            undoBtn.style.opacity = '0.5';
            undoBtn.style.cursor = 'not-allowed';
        } else {
            undoBtn.disabled = false;
            undoBtn.style.opacity = '1';
            undoBtn.style.cursor = 'pointer';
        }
    }

    moveLeft() {
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(x => x !== 0);

            // Merge identical adjacent tiles
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                }
            }

            // Pad with zeros
            while (row.length < 4) {
                row.push(0);
            }

            this.grid[i] = row;
        }
    }

    moveRight() {
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(x => x !== 0);

            // Merge right-to-left
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    j--;
                }
            }

            // Pad zeros on the left
            while (row.length < 4) {
                row.unshift(0);
            }

            this.grid[i] = row;
        }
    }

    moveUp() {
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }

            // Merge identical adjacent tiles
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                }
            }

            // Pad with zeros
            while (column.length < 4) {
                column.push(0);
            }

            // Write back to grid
            for (let i = 0; i < 4; i++) {
                this.grid[i][j] = column[i];
            }
        }
    }

    moveDown() {
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }

            // Merge bottom-to-top
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    i--;
                }
            }

            // Pad zeros on the top
            while (column.length < 4) {
                column.unshift(0);
            }

            // Write back to grid
            for (let i = 0; i < 4; i++) {
                this.grid[i][j] = column[i];
            }
        }
    }

    addRandomTile() {
        const emptyCells = [];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({ i, j });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            // 90% chance of spawning a 2, 10% chance of a 4
            this.grid[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    checkGameOver() {
        // Check for empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    return;
                }
            }
        }

        // Check for possible merges
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = this.grid[i][j];

                if (j < 3 && current === this.grid[i][j + 1]) {
                    return;
                }
                if (i < 3 && current === this.grid[i + 1][j]) {
                    return;
                }
            }
        }

        // No moves left – game over
        this.gameOver = true;
        this.showGameOver();
    }

    showGameOver() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverOverlay').classList.add('active');
    }

    resetGame() {
        this.grid = Array(4).fill(null).map(() => Array(4).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.history = []; // clear undo history
        document.getElementById('gameOverOverlay').classList.remove('active');
        this.initGame();
        this.render();
        this.updateUndoButton();
    }

    render() {
        const gameGrid = document.getElementById('gameGrid');
        const gridCells = gameGrid.querySelectorAll('.grid-cell');

        // Clear all tiles from cells
        gridCells.forEach(cell => {
            const existingTile = cell.querySelector('.tile');
            if (existingTile) {
                existingTile.remove();
            }
        });

        // Render current tiles
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const value = this.grid[i][j];
                if (value !== 0) {
                    this.createTile(i, j, value);
                }
            }
        }

        // Update current score display
        document.querySelector('.score-card .text-4xl').textContent = this.score;

        // Update best score
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
        }
        document.querySelector('.score-card-offset .text-3xl').textContent = this.bestScore;

        // Refresh undo button state
        this.updateUndoButton();
    }

    createTile(row, col, value) {
        const gameGrid = document.getElementById('gameGrid');
        const gridCells = gameGrid.querySelectorAll('.grid-cell');
        const cellIndex = row * 4 + col;
        const cell = gridCells[cellIndex];

        const tile = document.createElement('div');
        tile.className = `tile tile-${value} tile-new`;

        // Render cute animal emoji
        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'tile-emoji';
        emojiDiv.textContent = ANIMAL_EMOJI[value] || '🐾';
        tile.appendChild(emojiDiv);

        // Add numeric value label
        const valueLabel = document.createElement('div');
        valueLabel.className = 'tile-value';
        valueLabel.textContent = value;
        tile.appendChild(valueLabel);

        // Append tile to the correct grid cell
        cell.appendChild(tile);
    }

    loadBestScore() {
        return parseInt(localStorage.getItem('2048-xiongmaotang-best-score') || '0');
    }

    saveBestScore() {
        localStorage.setItem('2048-xiongmaotang-best-score', this.bestScore.toString());
    }
}

// Initialize the game on page load
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game2048();
});
