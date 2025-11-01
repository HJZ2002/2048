var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();

    // ADDED: wire up buttons 
    var restartBtn = document.getElementById("restartBtn");
    var tryAgainBtn = document.getElementById("tryAgainBtn");
    if (restartBtn) restartBtn.addEventListener("click", restartGame);   // ADDED
    if (tryAgainBtn) tryAgainBtn.addEventListener("click", restartGame); // ADDED
}

function setGame() {
    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ];

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    // ADDED: clear any previous tiles before regenerating
    var boardEl = document.getElementById("board");            // ADDED
    if (boardEl) boardEl.innerHTML = "";                       // ADDED

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    //create 2 to begin the game
    setTwo();
    setTwo();

    // ADDED: hide game-over overlay on a fresh game
    hideGameOver();                                            // ADDED
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }                
    }
}

document.addEventListener('keyup', (e) => {
    let moved = false; // ADDED: track if a move actually happened

    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
        moved = true; // ADDED
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
        moved = true; // ADDED
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
        moved = true; // ADDED
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
        moved = true; // ADDED
    }

    if (moved) { // ADDED
        document.getElementById("score").innerText = score; // keep your update
        checkGameOver(); // ADDED: see if no moves/tiles remain
    }
})

function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    } //[4, 0, 2]
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}



// ADDED: check if no moves are possible; if none, show overlay
function checkGameOver() {
    // if there is still an empty tile, it's not game over
    if (hasEmptyTile()) return false;

    // if any horizontal or vertical merge is possible, not game over
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let v = board[r][c];
            if (c + 1 < columns && v === board[r][c + 1]) return false;
            if (r + 1 < rows && v === board[r + 1][c]) return false;
        }
    }

    // otherwise, game over
    showGameOver();
    return true;
}

// ADDED: show overlay with final score
function showGameOver() {
    var panel = document.getElementById("gameOver");
    var final = document.getElementById("finalScore");
    if (final) final.innerText = score;
    if (panel) panel.classList.remove("hidden");
}

// ADDED: hide overlay (used on new games)
function hideGameOver() {
    var panel = document.getElementById("gameOver");
    if (panel) panel.classList.add("hidden");
}

// ADDED: reset score, clear board tiles, and start fresh
function restartGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    hideGameOver();
    // Clear board restarts the game
    var boardEl = document.getElementById("board");
    if (boardEl) boardEl.innerHTML = "";
    setGame();
}
