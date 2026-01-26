// 2048 宠物版游戏逻辑

// 熊猫堂成员图片映射 (使用本地图片)
const ANIMAL_IMAGES = {
    2: 'images/xiongmaotang/1.jpeg',     // 成员1
    4: 'images/xiongmaotang/2.jpeg',     // 成员2
    8: 'images/xiongmaotang/3.jpeg',     // 成员3
    16: 'images/xiongmaotang/4.jpeg',    // 成员4
    32: 'images/xiongmaotang/5.jpeg',    // 成员5
    64: 'images/xiongmaotang/6.jpeg',    // 成员6
    128: 'images/xiongmaotang/7.jpeg',   // 成员7
    256: 'images/xiongmaotang/8.jpeg',   // 成员8
    512: 'images/xiongmaotang/9.jpeg',   // 成员9
    1024: 'images/xiongmaotang/10.jpeg', // 成员10
    2048: 'images/xiongmaotang/11.jpeg'  // 堂主
};

// 熊猫堂成员名称
const ANIMAL_NAMES = {
    2: '成员',
    4: '成员',
    8: '成员',
    16: '成员',
    32: '成员',
    64: '成员',
    128: '成员',
    256: '成员',
    512: '成员',
    1024: '成员',
    2048: '堂主'
};

class Game2048 {
    constructor() {
        this.grid = Array(4).fill(null).map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.gameOver = false;
        this.history = []; // 历史记录，用于撤销
        
        this.initGame();
        this.setupEventListeners();
        this.render();
        this.updateUndoButton(); // 初始化撤销按钮状态
    }
    
    initGame() {
        // 初始化两个随机方块
        this.addRandomTile();
        this.addRandomTile();
    }
    
    setupEventListeners() {
        // 键盘事件
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
        
        // 触摸事件
        let touchStartX = 0;
        let touchStartY = 0;
        
        const gameGrid = document.getElementById('gameGrid');
        const gameBoard = document.querySelector('.game-board');
        
        // 阻止游戏板区域的默认触摸行为
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
            
            // 判断滑动方向
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // 水平滑动
                if (deltaX > 30) {
                    moved = this.move('right');
                } else if (deltaX < -30) {
                    moved = this.move('left');
                }
            } else {
                // 垂直滑动
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
        
        // 新游戏按钮
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // 撤销按钮
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undo();
        });
    }
    
    move(direction) {
        // 保存当前状态到历史记录
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
        
        // 检查是否有移动
        const moved = oldGrid !== JSON.stringify(this.grid);
        
        // 如果没有移动，移除刚才保存的状态
        if (!moved) {
            this.history.pop();
        }
        
        return moved;
    }
    
    saveState() {
        // 保存当前游戏状态
        this.history.push({
            grid: JSON.parse(JSON.stringify(this.grid)),
            score: this.score
        });
        
        // 限制历史记录最多10步
        if (this.history.length > 10) {
            this.history.shift();
        }
        
        this.updateUndoButton();
    }
    
    undo() {
        if (this.history.length === 0) return;
        
        // 恢复上一个状态
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
            
            // 合并相同的
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            
            // 填充0
            while (row.length < 4) {
                row.push(0);
            }
            
            this.grid[i] = row;
        }
    }
    
    moveRight() {
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(x => x !== 0);
            
            // 从右往左合并
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    j--;
                }
            }
            
            // 在前面填充0
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
            
            // 合并相同的
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                }
            }
            
            // 填充0
            while (column.length < 4) {
                column.push(0);
            }
            
            // 放回网格
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
            
            // 从下往上合并
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    i--;
                }
            }
            
            // 在前面填充0
            while (column.length < 4) {
                column.unshift(0);
            }
            
            // 放回网格
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
                    emptyCells.push({i, j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            // 90%概率生成2，10%概率生成4
            this.grid[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    checkGameOver() {
        // 检查是否有空格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    return;
                }
            }
        }
        
        // 检查是否有可合并的
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
        
        // 游戏结束
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
        this.history = []; // 清空历史记录
        document.getElementById('gameOverOverlay').classList.remove('active');
        this.initGame();
        this.render();
        this.updateUndoButton();
    }
    
    render() {
        const gameGrid = document.getElementById('gameGrid');
        const gridCells = gameGrid.querySelectorAll('.grid-cell');
        
        // 清空所有格子中的方块
        gridCells.forEach(cell => {
            const existingTile = cell.querySelector('.tile');
            if (existingTile) {
                existingTile.remove();
            }
        });
        
        // 渲染新方块
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const value = this.grid[i][j];
                if (value !== 0) {
                    this.createTile(i, j, value);
                }
            }
        }
        
        // 更新分数
        document.querySelector('.score-card .text-4xl').textContent = this.score;
        
        // 更新最高分
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
        }
        document.querySelector('.score-card-offset .text-3xl').textContent = this.bestScore;
        
        // 更新撤销按钮状态
        this.updateUndoButton();
    }
    
    createTile(row, col, value) {
        const gameGrid = document.getElementById('gameGrid');
        const gridCells = gameGrid.querySelectorAll('.grid-cell');
        const cellIndex = row * 4 + col;
        const cell = gridCells[cellIndex];
        
        const tile = document.createElement('div');
        tile.className = `tile tile-${value} tile-new`;
        
        // 创建图片
        const img = document.createElement('img');
        img.src = ANIMAL_IMAGES[value] || ANIMAL_IMAGES[2];
        img.alt = ANIMAL_NAMES[value] || '动物';
        img.onerror = function() {
            // 图片加载失败时显示emoji
            this.style.display = 'none';
            const emoji = document.createElement('div');
            emoji.style.fontSize = '48px';
            emoji.textContent = ['🐱','🐶','🐰','🐻','🦊','🐼','🦁','🐯','🐨','🦄','🐉'][Math.log2(value)-1] || '🐱';
            tile.appendChild(emoji);
        };
        
        tile.appendChild(img);
        
        // 添加数值标签
        const valueLabel = document.createElement('div');
        valueLabel.className = 'tile-value';
        valueLabel.textContent = value;
        tile.appendChild(valueLabel);
        
        // 直接添加到对应的格子中
        cell.appendChild(tile);
    }
    
    loadBestScore() {
        return parseInt(localStorage.getItem('2048-xiongmaotang-best-score') || '0');
    }
    
    saveBestScore() {
        localStorage.setItem('2048-xiongmaotang-best-score', this.bestScore.toString());
    }
}

// 初始化游戏
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game2048();
});
