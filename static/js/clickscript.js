document.addEventListener("DOMContentLoaded", () => {
            const buttons = document.querySelectorAll(".grid-btn");
            const nextPlayer = document.getElementById("next-player");
            const gameStatus = document.getElementById("game-status");
            const restartBtn = document.getElementById("restart-btn");

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
                        } 
                        else if(data.status === "win") {
                            nextPlayer.textContent = "Active Player: " + data.active_player;
                            gameStatus.textContent = "Game Over: " + data.status;
                            button.textContent = data.sign;
                            // diable all buttons after game over
                            buttons.forEach(btn => btn.disabled = true); // Disable all buttons after game over
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
                    // Reset the game board in the HTML
                        buttons.forEach(btn => {
                        btn.disabled = false;
                        btn.textContent = "";                        
                        btn.style.backgroundColor = "";
                    });
                    nextPlayer.textContent = "Active Player: " + data.active_player;
                    gameStatus.textContent = data.status;
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            });

            // --- SETTINGS MODAL LOGIC ---
    const settingsModal = document.getElementById("settings-modal");
    const openSettingsBtn = document.getElementById("open-settings");
    const closeSettingsBtn = document.getElementById("close-settings");
    const saveSettingsBtn = document.getElementById("save-settings");
    const colorSelect = document.getElementById("setting-color");

    // Open modal when gear icon is clicked
    openSettingsBtn.addEventListener("click", () => {
        settingsModal.style.display = "flex";
    });

    // Close modal when Cancel is clicked
    closeSettingsBtn.addEventListener("click", () => {
        settingsModal.style.display = "none";
    });

    // Close modal if user clicks anywhere outside the white box
    window.addEventListener("click", (event) => {
        if (event.target === settingsModal) {
            settingsModal.style.display = "none";
        }
    });

    // Live preview of board color changes instantly without reloading
    colorSelect.addEventListener("change", (e) => {
        document.documentElement.style.setProperty('--btn-bg', e.target.value);
    });

    // Handle Save & Restart button inside modal
    saveSettingsBtn.addEventListener("click", () => {
        const settingsData = {
            opponent: document.getElementById("setting-opponent").value,
            opponent_sign: document.getElementById("setting-sign").value,
            who_plays_first: document.getElementById("setting-first-player").value,
            p1_name: document.getElementById("setting-p1-name").value,
            p2_name: document.getElementById("setting-p2-name").value,
            board_color: colorSelect.value
        };
        // Close modal
        settingsModal.style.display = "none";

        // Send settings to Flask backend
        fetch("/save-settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settingsData)
        })
        .then(response => response.json())
        .then(data => {
            // Reset all board buttons visually
            buttons.forEach(button => {
                button.textContent = "";
                button.disabled = false;
                button.style.backgroundColor = ""; 
            });

            // Clear result and update header with the new Player 1 name
            gameStatus.textContent = data.status;
            nextPlayer.textContent = `Next Player: ${data.active_player_name}`;
            
        
        })
        .catch(error => console.error("Error:", error));
    });
});