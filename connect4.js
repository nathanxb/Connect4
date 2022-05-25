/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let playerTurn = document.querySelector('h2')

const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
    //for loop on set height, then pushes based on set width
    for (let y = 0; y < HEIGHT; y++) {
        board.push(Array.from({ length: WIDTH }));

    }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
    const htmlBoard = document.querySelector('#board');
    // creates the column tops that players can click to drop their game piece
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);

    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }
    htmlBoard.append(top);

    // creates the cells of the Connect4 board
    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.setAttribute("id", `${y}-${x}`);
            row.append(cell);
        }
        htmlBoard.append(row);
    }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
    for (let y = HEIGHT - 1; y >= 0; y--) {
        if (!board[y][x]) {
            return y;
        }
    }
    return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`player${currPlayer}`);

    const column = document.getElementById(`${y}-${x}`);
    console.log(column)
    column.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
    alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // place piece in board and add to HTML table
    board[y][x] = currPlayer;
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
        return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    if (board.every(row => row.every(cell => cell))) {
        return endGame("It's a tie!");
    }

    // switch players
    currPlayer = currPlayer === 1 ? 2 : 1;

    if (currPlayer === 2) {
        playerTurn.classList.add("two")
        playerTurn.classList.remove("one")

    } else {
        playerTurn.classList.add("one")
        playerTurn.classList.remove("two")

    }
    playerTurn.innerText = `It's Player ${currPlayer}'s turn`
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
    function _win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        return cells.every(
            ([y, x]) =>
                y >= 0 &&
                y < HEIGHT &&
                x >= 0 &&
                x < WIDTH &&
                board[y][x] === currPlayer
        );
    }

    //iterates through x and y coordinates
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            //horizontal matches have same y and incremented x values by 1
            const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            //vertical matches have same x, and incremented y values by 1
            const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            //diagonal lines to right increase by one for x and y
            const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            //diagonal lines to the left increase by one for y but decrease by 1 for x
            const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
}

makeBoard();
makeHtmlBoard();
