// Gameboard function to manage the board state
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].addToken(player);
            return true;
        } else {
            console.log("Cell is already occupied! Choose another one.");
            return false;
        }
    };

    const checkWinner = () => {
        const values = board.map(row => row.map(cell => cell.getValue()));

        // Winning combinations
        const winningCombinations = [
            [values[0][0], values[0][1], values[0][2]], // Row 1
            [values[1][0], values[1][1], values[1][2]], // Row 2
            [values[2][0], values[2][1], values[2][2]], // Row 3
            [values[0][0], values[1][0], values[2][0]], // Column 1
            [values[0][1], values[1][1], values[2][1]], // Column 2
            [values[0][2], values[1][2], values[2][2]], // Column 3
            [values[0][0], values[1][1], values[2][2]], // Diagonal 1
            [values[0][2], values[1][1], values[2][0]]  // Diagonal 2
        ];

        for (const combination of winningCombinations) {
            if (combination.every(val => val === 1)) return "X";
            if (combination.every(val => val === 2)) return "O";
        }

        return null;
    };

    return { getBoard, dropToken, checkWinner };
}

// Cell function to manage individual cell state
function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player.token;
    }

    const getValue = () => value;
    return { addToken, getValue };
}

// GameController function to manage game flow
function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {name: playerOneName, token: 1},
        {name: playerTwoName, token: 2}
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        if (board.dropToken(row, column, getActivePlayer())) {
            const winner = board.checkWinner();
            return winner;
        }
        return null;
    };

    const resetGame = () => {
        board.getBoard().forEach(row => row.forEach(cell => cell.addToken({ token: 0 })));
        activePlayer = players[0]; // Reset to Player X
    };

    return { playRound, getActivePlayer, switchPlayerTurn, resetGame };
}

// UI elements
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('but');

// Game controller instance
const game = GameController();

// Function to update the UI and play the round
function handleCellClick(event) {
    const cell = event.target;
    const index = Array.from(cells).indexOf(cell);
    const row = Math.floor(index / 3);
    const col = index % 3;

    if (cell.value === "") {
        const currentPlayer = game.getActivePlayer();
        const symbol = currentPlayer.token === 1 ? "X" : "O";

        cell.value = symbol;
        const winner = game.playRound(row, col);

        if (winner) {
            alert(`${symbol} wins!`);
            highlightWinner(symbol);
            disableBoard();
        } else if (Array.from(cells).every(cell => cell.value !== "")) {
            alert("It's a draw!");
            disableBoard();
        } else {
            game.switchPlayerTurn();
        }
    }
}

// Function to highlight the winning cells
function highlightWinner(winningSymbol) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combination of winningCombinations) {
        if (combination.every(index => cells[index].value === winningSymbol)) {
            combination.forEach(index => {
                cells[index].style.backgroundColor = "red";
            });
            break;
        }
    }
}

// Function to disable the board after a win or draw
function disableBoard() {
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
}

// Function to enable the board
function enableBoard() {
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
}

// Function to reset the game board
function resetBoard() {
    cells.forEach(cell => {
        cell.value = "";
        cell.style.backgroundColor = "";
    });
    game.resetGame(); // Reset game logic
    enableBoard();
}

// Attach event listeners
enableBoard();
resetButton.addEventListener('click', resetBoard);
