document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".grid-btn");
    const nextPlayer = document.getElementById("next-player");
    const gameStatus = document.getElementById("game-status");
    const restartBtn = document.getElementById("restart-btn");

    // --- BOOTSTRAP MODAL INITIALIZATION ---
    const settingsModalEl = document.getElementById("settings-modal");
    const rulesModalEl = document.getElementById("rules-modal");

    const settingsModal = new bootstrap.Modal(settingsModalEl);
    const rulesModal = new bootstrap.Modal(rulesModalEl);

    /// --- CUSTOM THEME SETUP ---
    const colorSelect = document.getElementById("setting-color");

    function applyTheme(themeClass) {
        // Remove all previous theme classes from body
        document.body.classList.remove(
            "theme-ocean-obsidian", 
            "theme-emerald-mint", 
            "theme-sunset-cyber", 
            "theme-slate-minimal"
        );
        // Add the chosen theme class
        document.body.classList.add(themeClass);
    }

    // Load saved theme on startup (default to ocean-obsidian)
    const savedTheme = localStorage.getItem("board_theme") || "theme-ocean-obsidian";
    applyTheme(savedTheme);
    if (colorSelect) {
        colorSelect.value = savedTheme;
    }

    // Live preview of theme changes instantly
    if (colorSelect) {
        colorSelect.addEventListener("change", (e) => {
            const chosenTheme = e.target.value;
            applyTheme(chosenTheme);
            localStorage.setItem("board_theme", chosenTheme);
        });
    }

    //handle normal button click
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");

            // Send index to Flask via POST request
            fetch("/calculate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ index: index })
            })
            .then(response => response.json())
            .then(data => {
                if(data.status === "continue") {
                    // Display the returned result in the HTML when the game is still ongoing
                    nextPlayer.textContent = "Active Player: " + data.active_player;
                    gameStatus.textContent = data.status;
                    button.textContent = data.sign; // Update button text
                    button.disabled = true; // Disable the button after click

                    //mark the computer's move on the board
                    if (data.cell_index != null) {
                        const targetButton = document.querySelector(`.grid-btn[data-index="${data.cell_index}"]`);

                        if (targetButton) {
                            targetButton.textContent = data.computer_sign; // e.g., "X" or "O"
                            targetButton.disabled = true;
                            targetButton.style.backgroundColor = "#e0e0e0";
                        } 
                    }
                } else if(data.status === "win") {
                    nextPlayer.textContent = "Active Player: " + data.active_player;
                    gameStatus.textContent = "Game Over: " + data.status;
                    button.textContent = data.sign;
                    // disable all buttons after game over
                    buttons.forEach(btn => btn.disabled = true);

                    //mark the computer's move on the board
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

                } else if(data.status === "draw") {
                    nextPlayer.textContent = "Active Player: " + data.active_player;
                    gameStatus.textContent = "Game Over: " + data.status;
                    button.textContent = data.sign;
                    buttons.forEach(btn => btn.disabled = true);
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        });
    });

    //handle restart button click
    restartBtn.addEventListener("click", () => {
        fetch("/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.textContent = "";                       
                btn.style.backgroundColor = "";
            });
            nextPlayer.textContent = "Next Player: " + data.active_player_name;
            gameStatus.textContent = data.status;
            
            if (data.cell_index != null) {
                const targetButton = document.querySelector(`.grid-btn[data-index="${data.cell_index}"]`);
                if (targetButton) {
                    targetButton.textContent = data.sign;
                    targetButton.disabled = true;
                    targetButton.style.backgroundColor = "#e0e0e0";
                }
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });

    // --- SETTINGS MODAL LOGIC (BOOTSTRAP) ---
    const openSettingsBtn = document.getElementById("open-settings");
    const saveSettingsBtn = document.getElementById("save-settings");

    // Open settings modal using Bootstrap API
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener("click", () => {
            settingsModal.show();
        });
    }

    // Handle Save & Restart button inside modal
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener("click", () => {
            const settingsData = {
                opponent: document.getElementById("setting-opponent").value,
                opponent_sign: document.getElementById("setting-sign").value,
                who_plays_first: document.getElementById("setting-first-player").value,
                p1_name: document.getElementById("setting-p1-name").value,
                p2_name: document.getElementById("setting-p2-name").value,
                board_color: colorSelect ? colorSelect.value : "btn-light"
            };

            // Close modal programmatically using Bootstrap API
            settingsModal.hide();

            // Send settings to Flask backend
            fetch("/save-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settingsData)
            })
            .then(response => response.json())
            .then(data => {
                buttons.forEach(button => {
                    button.textContent = "";
                    button.disabled = false;
                    button.style.backgroundColor = ""; 
                });

                if (data.cell_index != null) {
                    const targetButton = document.querySelector(`.grid-btn[data-index="${data.cell_index}"]`);
                    if (targetButton) {
                        targetButton.textContent = data.sign;
                        targetButton.disabled = true;
                        targetButton.style.backgroundColor = "#e0e0e0";
                    }
                }

                gameStatus.textContent = data.status;
                nextPlayer.textContent = `Next Player: ${data.active_player_name}`;
            })
            .catch(error => console.error("Error:", error));
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