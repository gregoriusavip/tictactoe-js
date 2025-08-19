function createPlayer(name) {
    const playerName = name;
    const totalWins = 0;

    const winnerSpeech = (() => {
        return `${playerName} is the winner`;
    });

    const incrementWin = (() => {
        totalWins++;
    });

    return { winnerSpeech, incrementWin };
};

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

    const display = (() => {
        function displayBoard() {
            for (const row of board) {
                console.log(displayColumn(row));
            }
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

        return { displayBoard };
    })();

    function move(symbol, row, column) {
        // Place the player's symbol on the board
        // Row, Column: integer of 1 to SIZE
        --row, --column;    // 0 index
        if (validate(row, column)) {
            board[row, column] = symbol;
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
        if (row + col == SIZE - 1) {
            diagonals[1] += symbol;
        };
    };

    function validate(row, column) {
        // Row and column should already be 0 index
        if (board[row][column] === 0) {
            return true;
        }
        return false;
    };

    return { move };
})();