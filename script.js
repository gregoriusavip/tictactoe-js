function createPlayer(name, symbol) {
    const totalWins = 0;

    const winnerSpeech = (() => {
        return `${name} is the winner`;
    });

    const incrementWin = (() => {
        totalWins++;
    });

    return { name, symbol, winnerSpeech, incrementWin };
};

const tttBoard = (() => {
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

    function move(player, row, column) {
        // Place the player's symbol on the board
        // Row, Column: integer of 1 to SIZE
        --row, --column;    // 0 index
        if (validate(row, column)) {
            board[row][column] = player.symbol;
            addToSums(player.symbol, row, column);
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

    function gameover(row, column) {
        // Row and column should already be 0 index
        console.log([rows[row], columns[column], diagonals[0], diagonals[1]])
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

    return { move, draw, gameover, board };
});

const display = (() => {
    function displayBoard(board) {
        for (const row of board) {
            displayToConsole(displayColumn(row));
        }
    }

    function displayToConsole(string) {
        // Temp function to display the game
        // TODO: display to DOM instead of console
        console.log(string);
    }

    function displayColumn(row) {
        let columnStr = ""
        for (const col of row) {
            if (col === 1) {
                columnStr = columnStr.concat("X ");
            } else if (col === -1) {
                columnStr = columnStr.concat("O ");
            } else {
                columnStr = columnStr.concat("_ ");
            }
        }
        return columnStr.slice(0, -1);
    }

    return { displayBoard, displayToConsole };
})();

const tictactoe = (() => {
    // Main driver function to play the game

    const gameboard = tttBoard();
    const player1 = createPlayer("Bob", 1);
    const player2 = createPlayer("Bet", -1);

    function startGame() {
        while (true) {
            if (playTurn(player1)) {
                break;
            };
            if (playTurn(player2)) {
                break;
            };
        }
    };

    function playTurn(player) {
        display.displayToConsole(`${player.name}'s turn`);
        display.displayBoard(gameboard.board);
        return movePrompt(player);
    }

    function movePrompt(player) {
        let row = parseInt(prompt("Row?"), 10);
        let column = parseInt(prompt("Column?", 10));
        if (!gameboard.move(player, row, column)) {
            alert("Move is invalid");
            movePrompt(player);
        } else {
            return checkGameover(player, row, column);
        }
    }

    function checkGameover(player, row, column) {
        let gameoverMessage = "";
        if (gameboard.gameover(row - 1, column - 1)) {
            gameoverMessage = player.winnerSpeech();
            player.incrementWin();
        }
        else if (gameboard.draw()) {
            gameoverMessage = "It's a draw!";
        } else {
            return false;
        }
        display.displayToConsole(gameoverMessage);
        return true;
    }

    return { startGame };
})();

tictactoe.startGame();