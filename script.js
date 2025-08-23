class Player {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
        this.totalWins = 0;
    }

    winnerSpeech() {
        return `${this.name} is the winner`;
    }

    incrementWin() {
        totalWins++;
    }
}

const tttPlayers = (() => {
    const players = [new Player("Bob", -1), new Player("Lowks", 1)];

    let currentPlayerPointer = 0;

    function switchCurrentPlayer() {
        currentPlayerPointer === 0 ? currentPlayerPointer = 1 : currentPlayerPointer = 0;
    }

    function getCurrentPlayer() {
        return players[currentPlayerPointer];
    }

    function resetPlayerPointer() {
        currentPlayerPointer = 0;
    }

    return { getCurrentPlayer, switchCurrentPlayer, resetPlayerPointer };
})();

const gameboard = (() => {
    // Initialize a 3x3 tic tac toe board
    // We will use 1 and -1 to represent "X" and "O"
    // The sum of a row, a column, a diagonal, or anti-diagonal as 3 or -3 determines as a game over
    const SIZE = 3;
    const board = Array.from({ length: SIZE }, e => Array(SIZE).fill(0));   // Create 3x3 array

    // Arrays to store the sums
    const rows = Array(SIZE).fill(0);   // 3 rows
    const columns = Array(SIZE).fill(0);    // 3 columns
    const diagonals = [0, 0];

    let totalMoves = 0;   // To determine draws

    function move(symbol, row, column) {
        // Place the player's symbol on the board
        // Row, Column: integer of 1 to SIZE
        --row, --column;    // 0 index
        if (validate(row, column)) {
            board[row][column] = symbol;
            addToSums(symbol, row, column);
            totalMoves++;
            return true;
        }
        return false;
    };

    function addToSums(symbol, row, column) {
        rows[row] += symbol;
        columns[column] += symbol;
        if (row === column) {
            diagonals[0] += symbol;
        };
        if (row + column == SIZE - 1) {
            diagonals[1] += symbol;
        };
    };

    function win(row, column) {
        --row, --column;    // 0 index
        return [rows[row], columns[column], diagonals[0], diagonals[1]].some((e) => {
            return e === SIZE || e === -SIZE;
        });
    };

    function draw() {
        return totalMoves === SIZE * SIZE;
    }

    function validate(row, column) {
        // Row and column should already be 0 index
        if (board[row][column] === 0) {
            return true;
        }
        return false;
    };

    return { move, draw, win, board };
});

const display = (() => {
    const activatedElements = [];

    function displayMove(symbolElement) {
        activatedElements.push(symbolElement);
        symbolElement.classList.add('active');
    }

    function displayGameOver(text) {
        const containerElement = document.getElementById("winner-text");
        containerElement.textContent = text;
    }

    function deactivateMoves() {
        while (activatedElements.length) {
            activatedElements.pop().classList.remove('active');
        }
    }

    return { displayMove, displayGameOver, deactivateMoves };
})();

const interactable = (() => {
    const buttons = document.getElementsByClassName("move-buttons");
    let tttBoard = gameboard();

    for (const button of buttons) {
        button.addEventListener("click", function clicked(event) {
            event.preventDefault();

            const row = parseInt(button.dataset.row, 10);
            const col = parseInt(button.dataset.column, 10);
            const currentPlayer = tttPlayers.getCurrentPlayer();

            if (tttBoard.move(currentPlayer.symbol, row, col)) {
                // Move is playable
                display.displayMove(getSymbolElement(button, currentPlayer.symbol));
                tttPlayers.switchCurrentPlayer();
                checkGameOver(currentPlayer, row, col);
                button.disabled = true;
            }
        })
    }

    // Restart button
    document.querySelector("div.ui button#restart").addEventListener("click", () => {
        enableButtons();
        display.deactivateMoves();
        display.displayGameOver("");
        tttBoard = gameboard();
        tttPlayers.resetPlayerPointer();
    })

    function checkGameOver(currentPlayer, row, col) {
        let result = "";
        if (tttBoard.win(row, col)) {
            result = currentPlayer.winnerSpeech();
        } else if (tttBoard.draw()) {
            result = "It is a draw!";
        } else {
            return
        }
        display.displayGameOver(result);
        disableButtons();
    }

    function disableButtons() {
        const notDisabledButtons = document.querySelectorAll(".move-buttons:not([disabled])");
        for (const button of notDisabledButtons) {
            button.disabled = true;
        }
    }

    function enableButtons() {
        for (const button of buttons) {
            button.disabled = false;
        }
    }

    function getSymbolElement(buttonElement, playerSymbol) {
        if (playerSymbol === -1) {
            return buttonElement.getElementsByClassName("circle")[0];
        } else {
            return buttonElement.getElementsByClassName("cross")[0];
        }
    }
})();