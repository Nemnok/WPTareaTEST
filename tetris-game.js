// Tetris Game - JavaScript Implementation
// Juego completo de Tetris jugable en el navegador

const canvas = document.getElementById('tetris-canvas');
if (!canvas) {
    console.error('Canvas element not found');
} else {
    const ctx = canvas.getContext('2d');

// Configuración del juego
const BLOCK_SIZE = 30;
const ROWS = 20;
const COLS = 10;

// Colores de las piezas
const COLORS = {
    'I': '#00f0f0',
    'O': '#f0f000',
    'T': '#a000f0',
    'S': '#00f000',
    'Z': '#f00000',
    'J': '#0000f0',
    'L': '#f0a000',
    'empty': '#000000'
};

// Formas de las piezas (tetrominos)
const SHAPES = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'O': [
        [1, 1],
        [1, 1]
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ]
};

// Estado del juego
let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let score = 0;
let lines = 0;
let level = 1;
let gameOver = false;
let isPaused = false;
let dropInterval = 1000;
let lastDropTime = 0;
let animationId = null;

// Pieza actual
let currentPiece = null;
let currentX = 0;
let currentY = 0;

// Класс генератор
class Piece {
    constructor(type) {
        this.type = type;
        this.shape = SHAPES[type];
        this.color = COLORS[type];
    }

    rotate() {
        const newShape = [];
        const size = this.shape.length;
        
        for (let i = 0; i < size; i++) {
            newShape[i] = [];
            for (let j = 0; j < size; j++) {
                newShape[i][j] = this.shape[size - 1 - j][i];
            }
        }
        
        return newShape;
    }
}

// Иницация игры
function init() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    score = 0;
    lines = 0;
    level = 1;
    gameOver = false;
    isPaused = false;
    dropInterval = 1000;
    
    updateScore();
    spawnPiece();
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    gameLoop();
}

// Новая деталь
function spawnPiece() {
    const types = Object.keys(SHAPES);
    const randomType = types[Math.floor(Math.random() * types.length)];
    currentPiece = new Piece(randomType);
    currentX = Math.floor(COLS / 2) - Math.floor(currentPiece.shape.length / 2);
    currentY = 0;
    
    if (checkCollision(currentX, currentY, currentPiece.shape)) {
        gameOver = true;
        showGameOver();
    }
}

// Колизия расчёт
function checkCollision(x, y, shape) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = x + col;
                const newY = y + row;
                
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                
                if (newY >= 0 && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Colocar la pieza en el tablero
function placePiece() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const boardY = currentY + row;
                const boardX = currentX + col;
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece.type;
                }
            }
        }
    }
}

// Limpiar líneas completas
function clearLines() {
    let linesCleared = 0;
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++; // Revisar la misma fila de nuevo
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        
        // Puntuación: 1 línea = 100, 2 = 300, 3 = 500, 4 = 800
        const points = [0, 100, 300, 500, 800];
        score += points[Math.min(linesCleared, 4)] * level;
        
        // Aumentar nivel cada 10 líneas
        const newLevel = Math.floor(lines / 10) + 1;
        if (newLevel > level) {
            level = newLevel;
            dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        }
        
        updateScore();
    }
}

// Actualizar visualización de puntuación
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

// Mover pieza
function movePiece(dx, dy) {
    if (!checkCollision(currentX + dx, currentY + dy, currentPiece.shape)) {
        currentX += dx;
        currentY += dy;
        return true;
    }
    return false;
}

// Rotar pieza
function rotatePiece() {
    const rotated = currentPiece.rotate();
    
    if (!checkCollision(currentX, currentY, rotated)) {
        currentPiece.shape = rotated;
    } else {
        // Intentar wall kick (mover al rotar cerca de los bordes)
        for (let offset of [-1, 1, -2, 2]) {
            if (!checkCollision(currentX + offset, currentY, rotated)) {
                currentPiece.shape = rotated;
                currentX += offset;
                break;
            }
        }
    }
}

// Caída instantánea
function hardDrop() {
    let maxDrops = ROWS; // Safety limit to prevent infinite loops
    let drops = 0;
    
    while (movePiece(0, 1) && drops < maxDrops) {
        score += 2; // Bonus por hard drop
        drops++;
    }
    
    updateScore();
    placePiece();
    clearLines();
    spawnPiece();
}

// Dibujar el tablero
function drawBoard() {
    // Limpiar canvas
    ctx.fillStyle = COLORS.empty;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar bloques del tablero
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                drawBlock(col, row, COLORS[board[row][col]]);
            }
        }
    }
    
    // Dibujar pieza actual
    if (currentPiece) {
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    drawBlock(currentX + col, currentY + row, currentPiece.color);
                }
            }
        }
    }
    
    // Dibujar grid
    drawGrid();
}

// Dibujar un bloque individual
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    
    // Bordes del bloque para efecto 3D
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    
    // Sombra interior
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(
        x * BLOCK_SIZE + 2,
        y * BLOCK_SIZE + 2,
        BLOCK_SIZE - 4,
        BLOCK_SIZE - 4
    );
}

// Dibujar grid
function drawGrid() {
    ctx.strokeStyle = 'rgba(139, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    
    for (let row = 0; row <= ROWS; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, row * BLOCK_SIZE);
        ctx.stroke();
    }
    
    for (let col = 0; col <= COLS; col++) {
        ctx.beginPath();
        ctx.moveTo(col * BLOCK_SIZE, 0);
        ctx.lineTo(col * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
    }
}

// Game loop
function gameLoop(timestamp = 0) {
    if (!gameOver && !isPaused) {
        if (timestamp - lastDropTime > dropInterval) {
            if (!movePiece(0, 1)) {
                placePiece();
                clearLines();
                spawnPiece();
            }
            lastDropTime = timestamp;
        }
        
        drawBoard();
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

// Mostrar Game Over
function showGameOver() {
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-lines').textContent = lines;
    document.getElementById('final-level').textContent = level;
    document.getElementById('game-over-overlay').style.display = 'flex';
}

// Reiniciar juego
function restartGame() {
    document.getElementById('game-over-overlay').style.display = 'none';
    init();
}

// Controles del teclado
document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            if (movePiece(0, 1)) {
                score += 1; // Bonus por soft drop
                updateScore();
            }
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
        case 'p':
        case 'P':
            isPaused = !isPaused;
            // No need to call gameLoop() - it's already running via requestAnimationFrame
            break;
    }
    
    drawBoard();
});

// Iniciar el juego cuando se carga la página
window.addEventListener('load', () => {
    init();
    
    // Mensaje de bienvenida
    console.log('%c🎮 ¡Tetris Cargado!', 'color: #8B0000; font-size: 24px; font-weight: bold;');
    console.log('%c¡Usa las flechas para mover y rotar! Espacio para caída instantánea.', 'color: #CD5C5C; font-size: 14px;');
});

} // End of canvas check
