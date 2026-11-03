class GameLogic {
    constructor() {
        // 1. Initialize 25 Cells with their corresponding probabilities
        this.cellList = [
            { id: 1, status: "", probability: 3 },
            { id: 2, status: "", probability: 4 },
            { id: 3, status: "", probability: 3 },
            { id: 4, status: "", probability: 4 },
            { id: 5, status: "", probability: 3 },
            { id: 6, status: "", probability: 4 },
            { id: 7, status: "", probability: 6 },
            { id: 8, status: "", probability: 6 },
            { id: 9, status: "", probability: 6 },
            { id: 10, status: "", probability: 4 },
            { id: 11, status: "", probability: 3 },
            { id: 12, status: "", probability: 6 },
            { id: 13, status: "", probability: 8 },
            { id: 14, status: "", probability: 6 },
            { id: 15, status: "", probability: 3 },
            { id: 16, status: "", probability: 4 },
            { id: 17, status: "", probability: 6 },
            { id: 18, status: "", probability: 6 },
            { id: 19, status: "", probability: 6 },
            { id: 20, status: "", probability: 4 },
            { id: 21, status: "", probability: 3 },
            { id: 22, status: "", probability: 4 },
            { id: 23, status: "", probability: 3 },
            { id: 24, status: "", probability: 4 },
            { id: 25, status: "", probability: 3 }
        ];

        // 2. Define Winning Combinations (using cell references)
        const c = (id) => this.cellList[id - 1];
        
        this.combinationList = [
            { id: 1, comb: [c(17), c(18), c(19), c(20)] },
            { id: 2, comb: [c(10), c(15), c(20), c(25)] },
            { id: 3, comb: [c(7), c(12), c(17), c(22)] },
            { id: 4, comb: [c(1), c(2), c(3), c(4)] },
            { id: 5, comb: [c(2), c(3), c(4), c(5)] },
            { id: 6, comb: [c(1), c(6), c(11), c(16)] },
            { id: 7, comb: [c(9), c(13), c(17), c(21)] },
            { id: 8, comb: [c(10), c(14), c(18), c(22)] },
            { id: 9, comb: [c(7), c(13), c(19), c(25)] },
            { id: 10, comb: [c(2), c(8), c(14), c(20)] },
            { id: 11, comb: [c(2), c(7), c(12), c(17)] },
            { id: 12, comb: [c(3), c(8), c(13), c(18)] },
            { id: 13, comb: [c(21), c(22), c(23), c(24)] },
            { id: 14, comb: [c(11), c(12), c(13), c(14)] },
            { id: 15, comb: [c(8), c(13), c(18), c(23)] },
            { id: 16, comb: [c(1), c(7), c(13), c(19)] },
            { id: 17, comb: [c(4), c(8), c(12), c(16)] },
            { id: 18, comb: [c(4), c(9), c(14), c(19)] },
            { id: 19, comb: [c(22), c(23), c(24), c(25)] },
            { id: 20, comb: [c(12), c(13), c(14), c(15)] },
            { id: 21, comb: [c(9), c(14), c(19), c(24)] },
            { id: 22, comb: [c(6), c(11), c(16), c(21)] },
            { id: 23, comb: [c(5), c(9), c(13), c(17)] },
            { id: 24, comb: [c(16), c(17), c(18), c(19)] },
            { id: 25, comb: [c(5), c(10), c(15), c(20)] },
            { id: 26, comb: [c(6), c(12), c(18), c(24)] },
            { id: 27, comb: [c(7), c(8), c(9), c(10)] },
            { id: 28, comb: [c(6), c(7), c(8), c(9)] }
        ];

        // 3. Player Profiles and Settings
        this.player1 = { name: "Gagani", sign: "O", priority: 1 };
        this.player2 = { name: "Vihangi", sign: "X", priority: 2 };
        this.opponentType = "human";
        this.activePlayer = this.decideFirstPlayer();
        this.counter = 0;
    }

    decideFirstPlayer() {
        return this.player1.priority > this.player2.priority ? this.player2 : this.player1;
    }

    swapActivePlayer() {
        return this.activePlayer === this.player1 ? this.player2 : this.player1;
    }

    statusDraw() {
        const emptyCount = this.cellList.filter(cell => cell.status === "").length;
        return emptyCount === 0 ? "draw" : null;
    }

    statusWin() {
        for (let item of this.combinationList) {
            const count = item.comb.filter(cell => cell.status === this.activePlayer.sign).length;
            if (count === 4) return 1;
        }
        return 0;
    }

    getWinCombination() {
        for (let item of this.combinationList) {
            const count = item.comb.filter(cell => cell.status === this.activePlayer.sign).length;
            if (count === 4) {
                return item.comb.map(cell => cell.id);
            }
        }
        return [];
    }

    resetBoard() {
        this.cellList.forEach(cell => cell.status = "");
        this.activePlayer = this.decideFirstPlayer();
        this.counter = 0;

        if (this.opponentType === "computer" && this.player2.priority === 1) {
            const cellIndex = this.getComputerFirstMove();
            const sign = this.player2.sign;
            this.activePlayer = this.swapActivePlayer(); // Switch back to human
            return {
                status: "success",
                sign: sign,
                active_player_name: this.activePlayer.name,
                cell_index: cellIndex
            };
        } else {
            return {
                status: "success",
                active_player_name: this.activePlayer.name
            };
        }
    }

    updateSettings(data) {
        this.opponentType = data.opponent;
        this.player1.name = data.p1_name;
        this.player2.name = data.p2_name;
        this.player2.sign = data.opponent_sign;
        this.player1.sign = (data.opponent_sign === "X") ? "O" : "X";

        if (data.who_plays_first === "player1") {
            this.player1.priority = 1;
            this.player2.priority = 2;
        } else {
            this.player1.priority = 2;
            this.player2.priority = 1;
        }

        return this.resetBoard();
    }

    getHighestProbabilityEmptyCellId(combination) {
        let pr = -1;
        let localId = null;
        for (let point of combination) {
            if (point.status === "") {
                if (pr <= point.probability) {
                    pr = point.probability;
                    localId = point.id;
                }
            }
        }
        return localId;
    }

    countSign(combination, sign) {
        return combination.filter(cell => cell.status === sign).length;
    }

    getComputerFirstMove() {
        if (this.opponentType === "computer" && this.player2.priority === 1) {
            const cellIndex = this.otherMove(this.player2.sign, this.player1.sign);
            this.cellList[cellIndex - 1].status = this.player2.sign;
            return cellIndex;
        }
        return null;
    }

    otherMove(playerPiece, opponentPiece) {
        let cId = 0;
        let moveStatus = true;

        // 1. Make winning move
        if (moveStatus) {
            for (let item of this.combinationList) {
                if (this.countSign(item.comb, playerPiece) === 3 && this.countSign(item.comb, opponentPiece) === 0) {
                    cId = this.getHighestProbabilityEmptyCellId(item.comb);
                    if (cId) {
                        this.cellList[cId - 1].status = playerPiece;
                        moveStatus = false;
                        break;
                    }
                }
            }
        }

        // 2. Prevent opponent's winning move
        if (moveStatus) {
            for (let item of this.combinationList) {
                if (this.countSign(item.comb, opponentPiece) === 3 && this.countSign(item.comb, playerPiece) === 0) {
                    cId = this.getHighestProbabilityEmptyCellId(item.comb);
                    if (cId) {
                        this.cellList[cId - 1].status = playerPiece;
                        moveStatus = false;
                        break;
                    }
                }
            }
        }

        // 3. Defense move when opponent has 2 cells
        if (moveStatus) {
            let tempCellList = [];
            for (let item of this.combinationList) {
                if (this.countSign(item.comb, playerPiece) === 0 && this.countSign(item.comb, opponentPiece) === 2) {
                    let cellId = this.getHighestProbabilityEmptyCellId(item.comb);
                    if (cellId) tempCellList.push(this.cellList[cellId - 1]);
                }
            }
            if (tempCellList.length > 0) {
                let highestProb = Math.max(...tempCellList.map(item => item.probability));
                let hpList = tempCellList.filter(item => item.probability === highestProb);
                let chosenCell = hpList[Math.floor(Math.random() * hpList.length)];
                chosenCell.status = playerPiece;
                cId = chosenCell.id;
                moveStatus = false;
            }
        }

        // 4. Make 2nd best move (player has 2)
        if (moveStatus) {
            let tempCellList = [];
            for (let item of this.combinationList) {
                if (this.countSign(item.comb, playerPiece) === 2 && this.countSign(item.comb, opponentPiece) === 0) {
                    let cellId = this.getHighestProbabilityEmptyCellId(item.comb);
                    if (cellId) tempCellList.push(this.cellList[cellId - 1]);
                }
            }
            if (tempCellList.length > 0) {
                let highestProb = Math.max(...tempCellList.map(item => item.probability));
                let hpList = tempCellList.filter(item => item.probability === highestProb);
                let chosenCell = hpList[Math.floor(Math.random() * hpList.length)];
                chosenCell.status = playerPiece;
                cId = chosenCell.id;
                moveStatus = false;
            }
        }

        // 5. Make 3rd best move (player has 1)
        if (moveStatus) {
            let tempCellList = [];
            for (let item of this.combinationList) {
                if (this.countSign(item.comb, playerPiece) === 1 && this.countSign(item.comb, opponentPiece) === 0) {
                    let cellId = this.getHighestProbabilityEmptyCellId(item.comb);
                    if (cellId) tempCellList.push(this.cellList[cellId - 1]);
                }
            }
            if (tempCellList.length > 0) {
                let highestProb = Math.max(...tempCellList.map(item => item.probability));
                let hpList = tempCellList.filter(item => item.probability === highestProb);
                let chosenCell = hpList[Math.floor(Math.random() * hpList.length)];
                chosenCell.status = playerPiece;
                cId = chosenCell.id;
                moveStatus = false;
            }
        }

        // 6. Make first opening move
        if (moveStatus) {
            let tempCellList = [];
            for (let item of this.combinationList) {
                if (this.countSign(item.comb, playerPiece) === 0 && this.countSign(item.comb, opponentPiece) === 0) {
                    let cellId = this.getHighestProbabilityEmptyCellId(item.comb);
                    if (cellId) tempCellList.push(this.cellList[cellId - 1]);
                }
            }
            if (tempCellList.length > 0) {
                let highestProb = Math.max(...tempCellList.map(item => item.probability));
                let hpList = tempCellList.filter(item => item.probability === highestProb);
                let chosenCell = hpList[Math.floor(Math.random() * hpList.length)];
                chosenCell.status = playerPiece;
                cId = chosenCell.id;
                moveStatus = false;
            }
        }

        // 7. Random fallback move
        if (moveStatus) {
            let emptyCells = this.cellList.filter(cell => cell.status === "");
            if (emptyCells.length > 0) {
                let chosenCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                chosenCell.status = playerPiece;
                cId = chosenCell.id;
            }
        }

        return cId;
    }

    processPlayerMove(cellId) {
        if (this.cellList[cellId - 1].status !== "") {
            return { status: "error", message: "Cell is already marked." };
        }

        this.cellList[cellId - 1].status = this.activePlayer.sign;
        const humanSign = this.activePlayer.sign;
        this.counter++;

        if (this.statusWin() === 1) {
            return {
                status: "win",
                sign: humanSign,
                combination: this.getWinCombination(),
                active_player: this.activePlayer.name
            };
        } else if (this.statusDraw() === "draw") {
            return { status: "draw", sign: humanSign };
        }

        let computerCellIndex = null;
        let computerSign = null;

        if (this.opponentType === "computer") {
            this.activePlayer = this.swapActivePlayer();
            computerCellIndex = this.otherMove(this.player2.sign, this.player1.sign);

            if (computerCellIndex !== null) {
                computerSign = this.player2.sign;
                this.counter++;

                if (this.statusWin() === 1) {
                    return {
                        status: "win",
                        computer_sign: computerSign,
                        sign: humanSign,
                        "human_cell:": cellId,
                        cell_index: computerCellIndex,
                        combination: this.getWinCombination(),
                        active_player: this.player2.name
                    };
                } else if (this.statusDraw() === "draw") {
                    return {
                        status: "draw",
                        sign: humanSign,
                        computer_sign: computerSign,
                        "human_cell:": cellId,
                        cell_index: computerCellIndex
                    };
                }
            }
        }

        this.activePlayer = this.swapActivePlayer();

        return {
            status: "continue",
            human_cell: cellId,
            sign: humanSign,
            cell_index: computerCellIndex,
            computer_sign: computerSign,
            active_player: this.activePlayer.name
        };
    }
}
