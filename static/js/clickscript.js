document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.getElementById("grid-container");
    const nextPlayerEl = document.getElementById("next-player");
    const gameStatus = document.getElementById("game-status");
    const restartBtn = document.getElementById("restart-btn");

    // --- INITIALIZE 25 BUTTONS DYNAMICALLY ---
    for (let i = 1; i <= 25; i++) {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-primary grid-btn shadow-sm";
        btn.setAttribute("data-index", i);
        gridContainer.appendChild(btn);
    }

    const buttons = document.querySelectorAll(".grid-btn");

    // --- CELL PROBABILITIES MAPPING ---
    const cellProbabilities = {
        1: 3, 2: 4, 3: 3, 4: 4, 5: 3,
        6: 4, 7: 6, 8: 6, 9: 6, 10: 4,
        11: 3, 12: 6, 13: 8, 14: 6, 15: 3,
        16: 4, 17: 6, 18: 6, 19: 6, 20: 4,
        21: 3, 22: 4, 23: 3, 24: 4, 25: 3
    };

    // --- WINNING COMBINATIONS ---
    const winningCombinations = [
        [17, 18, 19, 20], [10, 15, 20, 25], [7, 12, 17, 22], [1, 2, 3, 4],
        [2, 3, 4, 5], [1, 6, 11, 16], [9, 13, 17, 21], [10, 14, 18, 22],
        [7, 13, 19, 25], [2, 8, 14, 20], [2, 7, 12, 17], [3, 8, 13, 18],
        [21, 22, 23, 24], [11, 12, 13, 14], [8, 13, 18, 23], [1, 7, 13, 19],
        [4, 8, 12, 16], [4, 9, 14, 19], [22, 23, 24, 25], [12, 13, 14, 15],
        [9, 14, 19, 24], [6, 11, 16, 21], [5, 9, 13, 17], [16, 17, 18, 19],
        [5, 10, 15, 20], [6, 12, 18, 24], [7, 8, 9, 10], [6, 7, 8, 9]
    ];

    // --- GAME STATE ---
    let board = {};
    for (let i = 1; i <= 25; i++) board[i] = "";

    let player1 = { name: "Gagani", sign: "O", priority: 1 };
    let player2 = { name: "Vihangi", sign: "X", priority: 2 };
    let opponentType = "human"; // 'human' or 'computer'
    let activePlayer = player1;
    let gameOver = false;

    // --- MODAL SETUP ---
    const settingsModal = new bootstrap.Modal(document.getElementById("settings-modal"));
    const rulesModal = new bootstrap.Modal(document.getElementById("rules-modal"));

    // --- THEME SETUP ---
    const colorSelect = document.getElementById("setting-color");
    function applyTheme(themeClass) {
        document.body.classList.remove("theme-ocean-obsidian", "theme-emerald-mint", "theme-sunset-cyber", "theme-slate-minimal");
        document.body.classList.add(themeClass);
    }
    const savedTheme = localStorage.getItem("board_theme") || "theme-ocean-obsidian";
    applyTheme(savedTheme);
    if (colorSelect) colorSelect.value = savedTheme;
    if (colorSelect) {
        colorSelect.addEventListener("change", (e) => {
            applyTheme(e.target.value);
            localStorage.setItem("board_theme", e.target.value);
        });
    }

    // --- DECIDE FIRST PLAYER ---
    function updateFirstPlayer() {
        activePlayer = player1.priority < player2.priority ? player1 : player2;
    }
    updateFirstPlayer();

    function swapActivePlayer() {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    // --- CHECK WIN OR DRAW ---
    function checkWin(sign) {
        for (let combo of winningCombinations) {
            if (combo.every(id => board[id] === sign)) {
                return combo;
            }
        }
        return null;
    }

    function checkDraw() {
        return Object.values(board).every(cell => cell !== "");
    }

    // --- AI MOVE LOGIC (Ported from tictactoe.py) ---
    function computerMove(aiSign, humanSign) {
        let bestCellId = null;

        // 1. Make winning move
        for (let combo of winningCombinations) {
            let count = combo.filter(id => board[id] === aiSign).length;
            let emptyCount = combo.filter(id => board[id] === "").length;
            if (count === 3 && emptyCount === 1) {
                bestCellId = getHighestProbabilityEmpty(combo);
                if (bestCellId) break;
            }
        }

        // 2. Prevent opponent's winning move
        if (!bestCellId) {
            for (let combo of winningCombinations) {
                let count = combo.filter(id => board[id] === humanSign).length;
                let emptyCount = combo.filter(id => board[id] === "").length;
                if (count === 3 && emptyCount === 1) {
                    bestCellId = getHighestProbabilityEmpty(combo);
                    if (bestCellId) break;
                }
            }
        }

        // 3. Defense move when opponent has 2 cells
        if (!bestCellId) {
            bestCellId = getBestCellByCondition(aiSign, humanSign, 0, 2);
        }

        // 4. Second best move (AI has 2 cells)
        if (!bestCellId) {
            bestCellId = getBestCellByCondition(aiSign, humanSign, 2, 0);
        }

        // 5. Third best move (AI has 1 cell)
        if (!bestCellId) {
            bestCellId = getBestCellByCondition(aiSign, humanSign, 1, 0);
        }

        // 6. First move (Empty combination)
        if (!bestCellId) {
            bestCellId = getBestCellByCondition(aiSign, humanSign, 0, 0);
        }

        // 7. Fallback random empty cell
        if (!bestCellId) {
            let emptyCells = Object.keys(board).filter(id => board[id] === "");
            if (emptyCells.length > 0) {
                bestCellId = parseInt(emptyCells[Math.floor(Math.random() * emptyCells.length)]);
            }
        }

        if (bestCellId) {
            board[bestCellId] = aiSign;
            let btn = document.querySelector(`[data-index="${bestCellId}"]`);
            if (btn) {
                btn.textContent = aiSign;
                btn.disabled = true;
                btn.style.backgroundColor = "#e0e0e0";
            }
        }
        return bestCellId;
    }

    function getHighestProbabilityEmpty(combo) {
        let emptyIds = combo.filter(id => board[id] === "");
        if (emptyIds.length === 0) return null;
        emptyIds.sort((a, b) => cellProbabilities[b] - cellProbabilities[a]);
        return emptyIds[0];
    }

    function getBestCellByCondition(aiSign, humanSign, aiCount, humanCount) {
        let candidateCells = [];
        let maxProb = -1;

        for (let combo of winningCombinations) {
            let aCount = combo.filter(id => board[id] === aiSign).length;
            let hCount = combo.filter(id => board[id] === humanSign).length;
            if (aCount === aiCount && hCount === humanCount) {
                let cellId = getHighestProbabilityEmpty(combo);
                if (cellId) {
                    let prob = cellProbabilities[cellId];
                    candidateCells.push({ cellId, prob });
                    if (prob > maxProb) maxProb = prob;
                }
            }
        }

        if (candidateCells.length === 0) return null;

        let bestCandidates = candidateCells.filter(c => c.prob === maxProb);
        let chosen = bestCandidates[Math.floor(Math.random() * bestCandidates.length)];
        return chosen.cellId;
    }

    // --- HANDLE TURN ---
    function makeMove(index) {
        if (gameOver || board[index] !== "") return;

        // Human Move
        board[index] = activePlayer.sign;
        let btn = document.querySelector(`[data-index="${index}"]`);
        btn.textContent = activePlayer.sign;
        btn.disabled = true;

        let winningCombo = checkWin(activePlayer.sign);
        if (winningCombo) {
            gameStatus.textContent = `Game Over: win`;
            nextPlayerEl.textContent = `Winner: ${activePlayer.name}`;
            highlightWinningCombo(winningCombo);
            disableAllButtons();
            gameOver = true;
            return;
        }

        if (checkDraw()) {
            gameStatus.textContent = `Game Over: draw`;
            nextPlayerEl.textContent = `It's a Draw!`;
            gameOver = true;
            return;
        }

        // Swap to next player
        swapActivePlayer();
        nextPlayerEl.textContent = `Active Player: ${activePlayer.name}`;

        // Computer AI Move (if applicable)
        if (opponentType === "computer" && activePlayer.sign === player2.sign && !gameOver) {
            setTimeout(() => {
                let aiCell = computerMove(player2.sign, player1.sign);
                let aiWinningCombo = checkWin(player2.sign);

                if (aiWinningCombo) {
                    gameStatus.textContent = `Game Over: win`;
                    nextPlayerEl.textContent = `Winner: ${player2.name}`;
                    highlightWinningCombo(aiWinningCombo);
                    disableAllButtons();
                    gameOver = true;
                    return;
                }

                if (checkDraw()) {
                    gameStatus.textContent = `Game Over: draw`;
                    nextPlayerEl.textContent = `It's a Draw!`;
                    gameOver = true;
                    return;
                }

                swapActivePlayer();
                nextPlayerEl.textContent = `Active Player: ${activePlayer.name}`;
            }, 300); // Slight delay for realistic feel
        }
    }

    function highlightWinningCombo(combo) {
        combo.forEach(id => {
            let b = document.querySelector(`[data-index="${id}"]`);
            if (b) b.style.backgroundColor = "skyblue";
        });
    }

    function disableAllButtons() {
        buttons.forEach(b => b.disabled = true);
    }

    // --- RESET BOARD ---
    function resetGame() {
        for (let i = 1; i <= 25; i++) board[i] = "";
        gameOver = false;
        gameStatus.textContent = "";
        buttons.forEach(b => {
            b.disabled = false;
            b.textContent = "";
            b.style.backgroundColor = "";
        });
        updateFirstPlayer();
        nextPlayerEl.textContent = `Next Player: ${activePlayer.name}`;

        // If computer plays first
        if (opponentType === "computer" && player2.priority === 1) {
            setTimeout(() => {
                computerMove(player2.sign, player1.sign);
                swapActivePlayer();
                nextPlayerEl.textContent = `Active Player: ${activePlayer.name}`;
            }, 300);
        }
    }

    // --- EVENT LISTENERS ---
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            let idx = parseInt(btn.getAttribute("data-index"));
            makeMove(idx);
        });
    });

    restartBtn.addEventListener("click", resetGame);

    document.getElementById("open-settings").addEventListener("click", () => settingsModal.show());
    document.getElementById("open-rules").addEventListener("click", () => rulesModal.show());

    // Save Settings
    document.getElementById("save-settings").addEventListener("click", () => {
        opponentType = document.getElementById("setting-opponent").value;
        let p2Sign = document.getElementById("setting-sign").value;
        let p1Sign = p2Sign === "X" ? "O" : "X";
        let firstChoice = document.getElementById("setting-first-player").value;

        player1.name = document.getElementById("setting-p1-name").value;
        player2.name = document.getElementById("setting-p2-name").value;
        player1.sign = p1Sign;
        player2.sign = p2Sign;

        if (firstChoice === "player1") {
            player1.priority = 1;
            player2.priority = 2;
        } else {
            player1.priority = 2;
            player2.priority = 1;
        }

        settingsModal.hide();
        resetGame();
    });

    // Initial load check if computer is first
    if (opponentType === "computer" && player2.priority === 1) {
        computerMove(player2.sign, player1.sign);
        swapActivePlayer();
        nextPlayerEl.textContent = `Active Player: ${activePlayer.name}`;
    }
});