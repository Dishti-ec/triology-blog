// --- Smooth Section Reveal on Scroll ---
function revealSectionsOnScroll() {
    const sections = document.querySelectorAll('.section');
    const trigger = window.innerHeight * 0.85;
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < trigger) {
            section.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revealSectionsOnScroll);
window.addEventListener('DOMContentLoaded', revealSectionsOnScroll);

// --- Floating Puzzle Pieces Animation (Hero) ---
function createFloatingPieces() {
    const container = document.querySelector('.floating-pieces');
    if (!container) return;
    for (let i = 0; i < 8; i++) {
        const piece = document.createElement('div');
        piece.className = 'floating-piece';
        piece.style.position = 'absolute';
        piece.style.width = '32px';
        piece.style.height = '32px';
        piece.style.background = 'radial-gradient(circle, #a259ff 60%, #4f2e91 100%)';
        piece.style.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%';
        piece.style.opacity = '0.7';
        piece.style.left = Math.random() * 90 + '%';
        piece.style.top = Math.random() * 80 + '%';
        piece.style.filter = 'blur(0.5px)';
        piece.style.animation = `floatPiece${i%3} ${4 + Math.random()*2}s infinite alternate ease-in-out`;
        container.appendChild(piece);
    }
}
window.addEventListener('DOMContentLoaded', createFloatingPieces);

// --- Moving Puzzle Piece Animation ---
const movingPiece = document.getElementById('moving-puzzle-piece');
const finalSlot = document.getElementById('final-puzzle-slot');
function movePuzzlePiece() {
    const scrollY = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const percent = docHeight ? scrollY / docHeight : 0;
    // Path: follows scroll, moves left/right and up/down a bit for effect
    let top, left;
    if (percent < 0.98) {
        top = 10 + percent * 70; // vh
        left = 5 + Math.sin(percent * Math.PI * 2) * 20; // vw
        movingPiece.style.top = top + 'vh';
        movingPiece.style.left = left + 'vw';
        movingPiece.style.opacity = 1;
        if (finalSlot) finalSlot.classList.remove('placed');
    } else {
        // Move to final slot
        const slotRect = finalSlot.getBoundingClientRect();
        movingPiece.style.top = (window.scrollY + slotRect.top) + 'px';
        movingPiece.style.left = (slotRect.left) + 'px';
        movingPiece.style.opacity = 1;
        setTimeout(() => {
            movingPiece.style.opacity = 0;
            if (finalSlot) finalSlot.classList.add('placed');
        }, 700);
    }
}
window.addEventListener('scroll', movePuzzlePiece);
window.addEventListener('DOMContentLoaded', movePuzzlePiece);

// --- Rubik's Cube Game ---
function renderRubiksCube() {
    const canvas = document.getElementById('rubiks-cube-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Cube state: 3x3 faces, 6 faces
    let faces = [
        Array(9).fill(0), // yellow
        Array(9).fill(1), // red
        Array(9).fill(2), // green
        Array(9).fill(3), // blue
        Array(9).fill(4), // orange
        Array(9).fill(5)  // white
    ];
    const colors = ['#fff200', '#ff3d3d', '#009b48', '#0046ad', '#ff5800', '#ffffff'];
    // Draw cube (flat 2D net)
    function drawCube() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        // Draw faces: U, L, F, R, D, B
        // Net layout:   [0]
        //            [1][2][3][4]
        //               [5]
        const facePos = [
            [3,0], [0,3], [3,3], [6,3], [3,6], [9,3]
        ];
        for (let f=0; f<6; f++) {
            let [fx,fy] = facePos[f];
            for (let i=0; i<9; i++) {
                let x = fx + (i%3);
                let y = fy + Math.floor(i/3);
                ctx.fillStyle = colors[faces[f][i]];
                ctx.fillRect(x*20+10, y*20+10, 18, 18);
                ctx.strokeStyle = '#23234a';
                ctx.strokeRect(x*20+10, y*20+10, 18, 18);
            }
        }
    }
    drawCube();
    // Simple rotations: rotate face (simulate basic moves)
    function rotateFace(face) {
        // Rotate 3x3 face clockwise
        let f = faces[face];
        faces[face] = [f[6],f[3],f[0],f[7],f[4],f[1],f[8],f[5],f[2]];
    }
    // Simulate basic moves: F, R, U, L, D, B
    function moveCube(dir) {
        // For demo, rotate faces
        if (dir==='left') rotateFace(1);
        if (dir==='right') rotateFace(3);
        if (dir==='up') rotateFace(0);
        if (dir==='down') rotateFace(4);
        drawCube();
    }
    document.getElementById('cube-rotate-left').onclick = ()=>moveCube('left');
    document.getElementById('cube-rotate-right').onclick = ()=>moveCube('right');
    document.getElementById('cube-rotate-up').onclick = ()=>moveCube('up');
    document.getElementById('cube-rotate-down').onclick = ()=>moveCube('down');
    document.getElementById('cube-reset').onclick = ()=>{
        faces = [
            Array(9).fill(0),
            Array(9).fill(1),
            Array(9).fill(2),
            Array(9).fill(3),
            Array(9).fill(4),
            Array(9).fill(5)
        ];
        drawCube();
    };
}
window.addEventListener('DOMContentLoaded', renderRubiksCube);

// --- Chess Game ---
function renderChessGame() {
    const boardDiv = document.getElementById('chessboard');
    const msgDiv = document.getElementById('chess-message');
    if (!boardDiv) return;
    // 4x4 board, simple checkmate-in-one puzzle
    let squares = [
        '', '', '', 'K',
        '', 'Q', '', '',
        '', '', '', '',
        '', '', '', 'k'
    ];
    function renderBoard() {
        boardDiv.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const sq = document.createElement('div');
            sq.className = 'chess-cell ' + ((Math.floor(i/4)+i)%2 ? 'white' : 'black');
            sq.textContent = squares[i];
            sq.dataset.idx = i;
            boardDiv.appendChild(sq);
        }
    }
    renderBoard();
    let selected = null;
    boardDiv.addEventListener('click', e => {
        if (!e.target.classList.contains('chess-cell')) return;
        const idx = +e.target.dataset.idx;
        if (squares[idx] === 'Q') {
            // Select Queen
            boardDiv.querySelectorAll('.chess-cell').forEach(sq => sq.classList.remove('selected'));
            e.target.classList.add('selected');
            selected = idx;
            msgDiv.textContent = 'Select the destination for the Queen.';
        } else if (selected !== null && idx === 13) {
            // Move Queen to d2 (idx 13), checkmate
            squares[selected] = '';
            squares[13] = 'Q';
            renderBoard();
            msgDiv.textContent = 'Checkmate! You solved the puzzle!';
            selected = null;
        } else if (selected !== null) {
            msgDiv.textContent = 'Try again!';
            boardDiv.querySelectorAll('.chess-cell').forEach(sq => sq.classList.remove('selected'));
            selected = null;
        }
    });
    document.getElementById('chess-reset').onclick = () => {
        squares = [
            '', '', '', 'K',
            '', 'Q', '', '',
            '', '', '', '',
            '', '', '', 'k'
        ];
        renderBoard();
        msgDiv.textContent = '';
        selected = null;
    };
}
window.addEventListener('DOMContentLoaded', renderChessGame);

// --- Draggable Puzzle Piece Mini Game ---
function renderPuzzleGame() {
    const container = document.getElementById('puzzle-game-container');
    if (!container) return;
    // One draggable piece, one slot
    const slot = document.createElement('div');
    slot.className = 'puzzle-slot';
    slot.style.left = '100px';
    slot.style.top = '32px';
    container.appendChild(slot);
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece-draggable';
    piece.style.left = '10px';
    piece.style.top = '32px';
    container.appendChild(piece);
    let dragging = false, offsetX = 0, offsetY = 0;
    piece.addEventListener('mousedown', e => {
        dragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        piece.style.zIndex = 10;
        piece.style.boxShadow = '0 4px 24px #a259ffcc';
    });
    window.addEventListener('mousemove', e => {
        if (!dragging) return;
        const rect = container.getBoundingClientRect();
        let x = e.clientX - rect.left - offsetX;
        let y = e.clientY - rect.top - offsetY;
        x = Math.max(0, Math.min(x, container.offsetWidth - piece.offsetWidth));
        y = Math.max(0, Math.min(y, container.offsetHeight - piece.offsetHeight));
        piece.style.left = x + 'px';
        piece.style.top = y + 'px';
    });
    window.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        piece.style.zIndex = 2;
        piece.style.boxShadow = '';
        // Check if inside slot
        const slotRect = slot.getBoundingClientRect();
        const pieceRect = piece.getBoundingClientRect();
        if (Math.abs(slotRect.left - pieceRect.left) < 16 && Math.abs(slotRect.top - pieceRect.top) < 16) {
            piece.style.left = slot.style.left;
            piece.style.top = slot.style.top;
            piece.classList.add('placed');
            piece.style.pointerEvents = 'none';
            setTimeout(() => {
                alert('Great job! You completed the puzzle piece!');
            }, 300);
        }
    });
}
window.addEventListener('DOMContentLoaded', renderPuzzleGame);

// --- Riddle Input Checking ---
window.addEventListener('DOMContentLoaded', function() {
    const answers = [
        'piano',
        'echo',
        'footsteps'
    ];
    document.querySelectorAll('.riddle').forEach((riddle, idx) => {
        const input = riddle.querySelector('.riddle-input');
        const btn = riddle.querySelector('.riddle-check');
        const feedback = riddle.querySelector('.riddle-feedback');
        btn.addEventListener('click', function() {
            const val = input.value.trim().toLowerCase();
            if (val === answers[idx]) {
                feedback.textContent = 'Correct!';
                feedback.style.color = '#a259ff';
                input.disabled = true;
                btn.disabled = true;
            } else {
                feedback.textContent = 'Try again!';
                feedback.style.color = '#ff3d3d';
            }
        });
    });
});

// --- Side Quest Mini Game ---
const sideQuestBtn = document.getElementById('side-quest-btn');
const sideQuestPopup = document.getElementById('side-quest-popup');
const closePopup = document.getElementById('close-popup');
const sideQuestGame = document.getElementById('side-quest-game');
if (sideQuestBtn && sideQuestPopup && closePopup && sideQuestGame) {
    sideQuestBtn.addEventListener('click', () => {
        sideQuestPopup.classList.remove('hidden');
        renderSideQuest();
    });
    closePopup.addEventListener('click', () => {
        sideQuestPopup.classList.add('hidden');
        sideQuestGame.innerHTML = '';
    });
}
function renderSideQuest() {
    // Simple memory challenge: show 4 colored tiles, flash a pattern, user repeats
    sideQuestGame.innerHTML = '';
    const colors = ['#a259ff', '#ff3d3d', '#009b48', '#fff200'];
    const pattern = Array.from({length: 4}, () => Math.floor(Math.random()*4));
    let userInput = [];
    let step = 0;
    const tiles = colors.map((color, i) => {
        const tile = document.createElement('button');
        tile.style.background = color;
        tile.style.width = '48px';
        tile.style.height = '48px';
        tile.style.margin = '8px';
        tile.style.border = 'none';
        tile.style.borderRadius = '12px';
        tile.style.boxShadow = '0 2px 8px #0004';
        tile.style.cursor = 'pointer';
        tile.addEventListener('click', () => {
            userInput.push(i);
            tile.style.filter = 'brightness(1.5)';
            setTimeout(() => { tile.style.filter = ''; }, 200);
            if (userInput.length === pattern.length) {
                if (userInput.every((v, idx) => v === pattern[idx])) {
                    sideQuestGame.innerHTML = '<div style="color:#a259ff;font-weight:600;font-size:1.2rem;margin-top:16px;">You unlocked a piece of Palak’s brain. 🧠🎉</div>';
                } else {
                    sideQuestGame.innerHTML = '<div style="color:#ff3d3d;font-weight:600;font-size:1.1rem;margin-top:16px;">Try again!</div>';
                    setTimeout(renderSideQuest, 1200);
                }
            }
        });
        return tile;
    });
    const tileRow = document.createElement('div');
    tileRow.style.display = 'flex';
    tileRow.style.justifyContent = 'center';
    tileRow.style.marginTop = '18px';
    tiles.forEach(tile => tileRow.appendChild(tile));
    sideQuestGame.appendChild(tileRow);
    // Flash pattern
    function flashPattern() {
        let i = 0;
        function flashNext() {
            if (i >= pattern.length) return;
            tiles[pattern[i]].style.filter = 'brightness(2)';
            setTimeout(() => {
                tiles[pattern[i]].style.filter = '';
                i++;
                setTimeout(flashNext, 350);
            }, 350);
        }
        flashNext();
    }
    setTimeout(flashPattern, 500);
}

// --- Floating Piece Animations ---
for (let i = 0; i < 3; i++) {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes floatPiece${i} {
        0% { transform: translateY(0) scale(1); }
        100% { transform: translateY(${20 + i*10}px) scale(${1 + i*0.05}); }
    }`;
    document.head.appendChild(style);
}
