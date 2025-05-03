//  _____ _       _____           _____
// |_   _(_)__ __|_   _|_ _ __ __|_   _|__  ___
//   | | | / _|___|| |/ _` / _|___|| |/ _ \/ -_)
//   |_| |_\__|    |_|\__,_\__|    |_|\___/\___|
//
//-----------------------------------------------------------------------------
// Ryan Sondergeld
// 2025-05-02
//
// Created in Typescript
//-----------------------------------------------------------------------------
// Declare variables
var buttons = new Array(9);
var board = new Array(9);
var players = new Array(2);
var player = 1;
var turn = 0;
var _loop_1 = function (i) {
    var s = String(i);
    buttons[i] = document.getElementById(s);
    buttons[i].addEventListener('click', function () { clicked(i); });
};
// Add button events
for (var i = 0; i < buttons.length; i++) {
    _loop_1(i);
}
// Add reset button event
var resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", function () { resetGame(); });
// Add Radio button events
var randomButton = document.getElementById("random");
randomButton.addEventListener("change", function () { radioButtonChanged(); });
var cpuButton = document.getElementById("CPU");
cpuButton.addEventListener("change", function () { radioButtonChanged(); });
var playerButton = document.getElementById("player");
playerButton.addEventListener("change", function () { radioButtonChanged(); });
// Add Status / Header elements
var header = document.getElementById("header");
var gameStatus = document.getElementById("status-text");
// Grab player spans
var oPlayer = document.getElementById("player-1");
var xPlayer = document.getElementById("player-2");
// Reset Game and wait for events to occur
resetGame();
//minMaxTest();
//-----------------------------------------------------------------------------
// Events and functions
//-----------------------------------------------------------------------------
function checkWin() {
    // Create return variable
    var r = false;
    // Check all rows
    for (var i = 0; i < 3; i++) {
        // Get the rows for column check
        var c1 = i * 3;
        var c2 = (i * 3) + 1;
        var c3 = (i * 3) + 2;
        // Get the columns for row check
        var r1 = i;
        var r2 = i + 3;
        var r3 = i + 6;
        // Check column win
        var columnCheck = board[r1] + board[r2] + board[r3];
        if ((columnCheck == 3) || (columnCheck == -3)) {
            r = true;
        }
        // Check row win
        var rowCheck = board[c1] + board[c2] + board[c3];
        if ((rowCheck == 3) || (rowCheck == -3)) {
            r = true;
        }
    }
    // Check diagonal one
    var diagCheckOne = board[0] + board[4] + board[8];
    if ((diagCheckOne == 3) || (diagCheckOne == -3)) {
        r = true;
    }
    // Check diagonal two
    var diagCheckTwo = board[2] + board[4] + board[6];
    if ((diagCheckTwo == 3) || (diagCheckTwo == -3)) {
        r = true;
    }
    return r;
}
//-----------------------------------------------------------------------------
function clicked(i) {
    // Guard Clause - if the clicked button already has something, exit
    if (board[i] != 0) {
        return;
    }
    // Don't handle the click event if someone has already won
    if (checkWin()) {
        return;
    }
    // Process the turn
    processTurn(i);
    // CPU turn if game isnt' over
    if (!checkWin() && turn < 9) {
        cpuTurn();
    }
}
//-----------------------------------------------------------------------------
function resetGame() {
    // Set all Board Values Blank
    for (var i = 0; i < board.length; i++) {
        board[i] = 0;
    }
    // Set player to Player 1
    player = 1;
    // Set turn to zero
    turn = 0;
    // Update the display
    setPlayerOrder();
    updateButtons();
    updateHeader();
    // If CPU is first, take the firs turn
    if (players[0] == "CPU") {
        cpuTurn();
    }
}
//-----------------------------------------------------------------------------
function updateButtons() {
    for (var i = 0; i < board.length; i++) {
        switch (board[i]) {
            case -1:
                buttons[i].textContent = "X";
                break;
            case 1:
                buttons[i].textContent = "0";
                break;
            default:
                buttons[i].textContent = "";
                break;
        }
    }
}
//-----------------------------------------------------------------------------
function updateHeader() {
    // Update Header Info
    if (player == 1) {
        header.textContent = players[0] + " turn";
    }
    else {
        header.textContent = players[1] + " turn";
    }
    // Update game over / Game won status
    var displayTurn = turn + 1;
    if (turn < 9) {
        gameStatus.textContent = "Turn " + displayTurn.toString();
    }
    else {
        gameStatus.textContent = "Draw";
    }
    // Guard Clause - if someone hasn't won, stop here
    if (!checkWin()) {
        return;
    }
    // Update the header
    if (player == 1) {
        gameStatus.textContent = players[1] + " wins!";
    }
    else {
        gameStatus.textContent = players[0] + " wins!";
    }
}
//-----------------------------------------------------------------------------
function radioButtonChanged() {
    setPlayerOrder();
    resetGame();
}
//-----------------------------------------------------------------------------
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//-----------------------------------------------------------------------------
function setPlayerOrder() {
    // Cast elements to HTMLInputElements
    var p = playerButton;
    var c = cpuButton;
    var r = randomButton;
    // Find which one is checked and set the players
    if (p.checked) {
        players[0] = "Player";
        players[1] = "CPU";
    }
    if (c.checked) {
        players[0] = "CPU";
        players[1] = "Player";
    }
    if (r.checked) {
        // Randomize
        var r_1 = getRandomInt(0, 1);
        if (r_1 == 0) {
            players[0] = "CPU";
            players[1] = "Player";
        }
        else {
            players[0] = "Player";
            players[1] = "CPU";
        }
    }
    // Update the display
    oPlayer.innerText = "O: " + players[0];
    xPlayer.innerText = "X: " + players[1];
}
//-----------------------------------------------------------------------------
function cpuTurn() {
    // If the turn is 0, try to take the outside
    var move = bestCellMove(board);
    processTurn(move);
}
//-----------------------------------------------------------------------------
function processTurn(i) {
    // Create a value to put into the board
    var value = 1;
    // Check if the value should be negative
    if (player == 2) {
        value = -1;
    }
    // Put the value in the board
    board[i] = value;
    // Swap the players
    if (player == 1) {
        player = 2;
    }
    else {
        player = 1;
    }
    // Increment the turn
    turn++;
    // Update the board
    updateButtons();
    // Check for a win
    checkWin();
    // Update the header
    updateHeader();
}
//-----------------------------------------------------------------------------
function minMax(board) {
    // Base case : the board is a winner, so return the value
    if (boardValue(board) != 0) {
        return boardValue(board);
    }
    // Next, find a list of empty cells
    var empty = findEmptyCells(board);
    // Base case 2 : the board has no empty ells, there are no more moves
    // and no winner, so we have a value of zero to return
    if (empty.length < 1) {
        return 0;
    }
    // -- Past this point are boards with no winning value ---
    // First, grab the turn value we want to insert
    var value = findTurnValue(board);
    // Now, create a list of boards based on the empty cells
    var boards = new Array;
    // Fill each board in with the right move
    for (var i = 0; i < empty.length; i++) {
        // Copy the board over to a new array
        var b = Array.from(board);
        // Copy the move cell
        var move = empty[i];
        // Set the value
        b[move] = value;
        // Add board to list of boards
        boards.push(b);
    }
    // Now create a list of values
    var values = new Array;
    // Iterate through each new board condition and call this function
    // to fill the values in
    for (var i = 0; i < boards.length; i++) {
        var v = minMax(boards[i]);
        values.push(v);
    }
    // Now we have a list of values.  Iterate and find the best one
    var best = values[0];
    for (var i = 0; i < boards.length; i++) {
        var v = values[i];
        switch (v) {
            case 1:
                if (value == 1) {
                    best = 1;
                }
                break;
            case 0:
                if (value == 1 && best != 1) {
                    best = 0;
                }
                if (value == -1 && best != -1) {
                    best = 0;
                }
                break;
            case -1:
                if (value == -1) {
                    best = -1;
                }
        }
    }
    // Finally, return our best value
    return best;
}
//-----------------------------------------------------------------------------
function bestCellMove(board) {
    // Next, find a list of empty cells
    var empty = findEmptyCells(board);
    // Base case 2 : the board has no empty cells, there are no more moves
    // and no winner, so we have a value of zero to return
    if (empty.length < 1) {
        return 0;
    }
    // First, grab the turn value we want to insert
    var value = findTurnValue(board);
    console.log("Value in bestCellMove " + value.toString());
    // Now, create a list of boards based on the empty cells
    var boards = new Array;
    // Fill each board in with the right move
    for (var i = 0; i < empty.length; i++) {
        // Copy the board over to a new array
        var b = Array.from(board);
        // Copy the move cell
        var move = empty[i];
        // Set the value
        b[move] = value;
        // Add board to list of boards
        boards.push(b);
    }
    // Now create a list of values
    var values = new Array;
    // Iterate through each new board condition and call this function
    // to fill the values in
    for (var i = 0; i < boards.length; i++) {
        var v = minMax(boards[i]);
        values.push(v);
    }
    // Now we have a list of values.  Iterate and find the best one
    var best = values[0];
    for (var i = 0; i < boards.length; i++) {
        var v = values[i];
        switch (v) {
            case 1:
                if (value == 1) {
                    best = 1;
                }
                break;
            case 0:
                if (value == 1 && best != 1) {
                    best = 0;
                }
                if (value == -1 && best != -1) {
                    best = 0;
                }
                break;
            case -1:
                if (value == -1) {
                    best = -1;
                }
        }
    }
    // Now that we know the best value, we need to find it in the value list
    var r = 0;
    for (var i = 0; i < values.length; i++) {
        if (values[i] == best) {
            r = empty[i];
        }
    }
    // Finally, return our best value
    return r;
}
//-----------------------------------------------------------------------------
function boardValue(board) {
    // Create return variable
    var r = 0;
    // Check all rows
    for (var i = 0; i < 3; i++) {
        // Get the rows for column check
        var c1 = i * 3;
        var c2 = (i * 3) + 1;
        var c3 = (i * 3) + 2;
        // Get the columns for row check
        var r1 = i;
        var r2 = i + 3;
        var r3 = i + 6;
        // Check column win
        var columnCheck = board[r1] + board[r2] + board[r3];
        if ((columnCheck == 3) || (columnCheck == -3)) {
            r = columnCheck / 3;
        }
        // Check row win
        var rowCheck = board[c1] + board[c2] + board[c3];
        if ((rowCheck == 3) || (rowCheck == -3)) {
            r = rowCheck / 3;
        }
    }
    // Check diagonal one
    var diagCheckOne = board[0] + board[4] + board[8];
    if ((diagCheckOne == 3) || (diagCheckOne == -3)) {
        r = diagCheckOne / 3;
    }
    // Check diagonal two
    var diagCheckTwo = board[2] + board[4] + board[6];
    if ((diagCheckTwo == 3) || (diagCheckTwo == -3)) {
        r = diagCheckTwo / 3;
    }
    return r;
}
//-----------------------------------------------------------------------------
function findEmptyCells(board) {
    // Create an array
    var a = new Array;
    // Loop through the board and append any empty spaces
    for (var i = 0; i < board.length; i++) {
        if (board[i] == 0) {
            a.push(i);
        }
    }
    // Return our array
    return a;
}
//-----------------------------------------------------------------------------
function findTurnValue(board) {
    //Find all empty cells
    var empty = findEmptyCells(board);
    // Return a value based on the number of empty cells
    // Odd = O turn = 1
    // Even = X turn = -1
    if (empty.length % 2 == 0) {
        return -1;
    }
    else {
        return 1;
    }
}
//-----------------------------------------------------------------------------
