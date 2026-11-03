document.addEventListener("DOMContentLoaded", () => {
    // --- INSTANTIATE LOCAL GAME LOGIC OBJECT ---
    const game = new GameLogic();

    const buttons = document.querySelectorAll(".grid-btn");
    const nextPlayer = document.getElementById("next-player");
    const gameStatus = document.getElementById("game-status");
    const restartBtn = document.getElementById("restart-btn");

    // --- BOOTSTRAP MODAL INITIALIZATION ---
    const settingsModalEl = document.getElementById("settings-modal");
    const rulesModalEl = document.getElementById("rules-modal");

    const settingsModal = new bootstrap.Modal(settingsModalEl);
    const rulesModal = new bootstrap.Modal(rulesModalEl);

    // --- BOOTSTRAP THEME SETUP ---
    const colorSelect = document.getElementById("setting-color");

    function applyBootstrapTheme(themeClass) {
        buttons.forEach(button => {
            // Remove old theme classes
            button.classList.remove("btn-light", "btn-dark", "btn-outline-primary", "btn-outline-success");
            // Add the new theme class
            button.classList.add(themeClass);
        });
    }

    // Load saved theme on startup if available (default to btn-light)
    const savedTheme = localStorage.getItem("board_theme") || "btn-light";
    applyBootstrapTheme(savedTheme);
    if (colorSelect) {
        colorSelect.value = savedTheme;
    }

    // Live preview of board theme changes instantly
    if (colorSelect) {
        colorSelect.addEventListener("change", (e) => {
            const chosenTheme = e.target.value;
            applyBootstrapTheme(chosenTheme);
            localStorage.setItem("board_theme", chosenTheme);
        });
    }

    // Handle normal button click locally
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-index"));

            // Process move locally via GameLogic instance
            const data = game.processPlayerMove(index);

            if (data.status === "error") {
                console.log(data.message);
                return;
            }

            if (data.status === "continue") {
                nextPlayer.textContent = "Active Player: " + data.active_player;
                gameStatus.textContent = data.status;
                button.textContent = data.sign; // Update human button text
                button.disabled = true; // Disable the button after click

                // Mark the computer's move on the board if AI played
                if (data.cell_index != null) {
                    const targetButton = document.querySelector(`.grid-btn[data-index="${data.cell_index}"]`);

                    if (targetButton) {
                        targetButton.textContent = data.computer_sign;
                        targetButton.disabled = true;
                        targetButton.style.backgroundColor = "#e0e0e0";
                    } 
                }
            } else if (data.status === "win") {
                nextPlayer.textContent = "Active Player: " + data.active_player;
                gameStatus.textContent = "Game Over: " + data.status;
                button.textContent = data.sign;
                buttons.forEach(btn => btn.disabled = true); // Disable all buttons

                // Mark computer's move if it happened on the winning turn
                if (data.cell_index != null) {
                    const targetButton = document.querySelector(`.grid-btn[data-index="${data.cell_index}"]`);
                    if (targetButton) {
                        targetButton.textContent = data.computer_sign;
                        targetButton.disabled = true;
                        targetButton.style.backgroundColor = "#e0e0e0";
                    } 
                }

                // Highlight winning cells
                if (data.combination) {
                    data.combination.forEach(winningIndex => {
                        const winningButton = document.querySelector(`[data-index="${winningIndex}"]`);
                        if (winningButton) {
                            winningButton.style.backgroundColor = "skyblue";
                        }
                    });
                }

            } else if (data.status === "draw") {
                nextPlayer.textContent = "Game Over";
                gameStatus.textContent = "Game Over: draw";
                button.textContent = data.sign;
                buttons.forEach(btn => btn.disabled = true);
            }
        });
    });

    // Handle restart button click locally
    restartBtn.addEventListener("click", () => {
        const data = game.resetBoard();

        buttons.forEach(btn => {
            btn.disabled = false;
            btn.textContent = "";                       
            btn.style.backgroundColor = "";
        });

        nextPlayer.textContent = "Next Player: " + data.active_player_name;
        gameStatus.textContent = "";
        
        // Handle computer first move if configured
        if (data.cell_index != null) {
            const targetButton = document.querySelector(`.grid-btn[data-index="${data.cell_index}"]`);
            if (targetButton) {
                targetButton.textContent = data.sign;
                targetButton.disabled = true;
                targetButton.style.backgroundColor = "#e0e0e0";
            }
        }
    });

    // --- SETTINGS MODAL LOGIC (BOOTSTRAP) ---
    const openSettingsBtn = document.getElementById("open-settings");
    const saveSettingsBtn = document.getElementById("save-settings");

    if (openSettingsBtn) {
        openSettingsBtn.addEventListener("click", () => {
            settingsModal.show();
        });
    }

    // Handle Save & Restart button inside modal locally
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener("click", () => {
            const settingsData = {
                opponent: document.getElementById("setting-opponent").value,
                opponent_sign: document.getElementById("setting-sign").value,
                who_plays_first: document.getElementById("setting-first-player").value,
                p1_name: document.getElementById("setting-p1-name").value,
                p2_name: document.getElementById("setting-p2-name").value
            };

            // Close modal programmatically
            settingsModal.hide();

            // Update settings locally via GameLogic instance
            const data = game.updateSettings(settingsData);

            buttons.forEach(button => {
                button.textContent = "";
                button.disabled = false;
                button.style.backgroundColor = ""; 
            });

            // Handle computer first move if configured in new settings
            if (data.cell_index != null) {
                const targetButton = document.querySelector(`.grid-btn[data-index="${data.cell_index}"]`);
                if (targetButton) {
                    targetButton.textContent = data.sign;
                    targetButton.disabled = true;
                    targetButton.style.backgroundColor = "#e0e0e0";
                }
            }

            gameStatus.textContent = "";
            nextPlayer.textContent = `Next Player: ${data.active_player_name}`;
        });
    }

    // --- RULES MODAL LOGIC (BOOTSTRAP) ---
    const openRulesBtn = document.getElementById("open-rules");

    if (openRulesBtn) {
        openRulesBtn.addEventListener("click", () => {
            rulesModal.show();
        });
    }
});