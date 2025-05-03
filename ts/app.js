//  _____ _       _____           _____
// |_   _(_)__ __|_   _|_ _ __ __|_   _|__  ___
//   | | | / _|___|| |/ _` / _|___|| |/ _ \/ -_)
//   |_| |_\__|    |_|\__,_\__|    |_|\___/\___|
//
//-----------------------------------------------------------------------------
// Ryan Sondergeld
// 2024-06-07
//
// Created in Typescript
//-----------------------------------------------------------------------------
// Get all buttons
var buttons = new Array(9);
var board = new Array(9);
var player = 1;
var blank = "*";
var turn = 0;
var new_button = document.getElementById("new");
new_button.addEventListener("click", new_clicked);
var _loop_1 = function (i) {
    var s = String(i);
    buttons[i] = document.getElementById(s);
    buttons[i].addEventListener('click', function () { clicked(i); });
};
// Get each button
for (var i = 0; i < buttons.length; i++) {
    _loop_1(i);
}
// Handle Reset Button
var reset_button = document.getElementById("reset-button");
reset_button.addEventListener("click", function () { reset_game(); });
// Reset Game
reset_game();
// Wait for functions
//-----------------------------------------------------------------------------
function clicked(i) {
    // Put data into clicked cell
    if (board[i] != blank) {
        return;
    }
    // the board data is empty, so we can put data in
    if (player == 1) {
        board[i] = "X";
        player = 2;
    }
    else {
        board[i] = "O";
        player = 1;
    }
    turn++;
    show_board();
    update_buttons();
}
//-----------------------------------------------------------------------------
function show_board() {
    console.log("Turn #" + String(turn));
    // Write per line
    var line = "";
    // go through all array
    for (var i = 0; i < board.length; i++) {
        // Write output every three values
        if ((i > 0) && (i % 3 == 0)) {
            console.log(line);
            line = "";
        }
        // Append the line
        line = line + board[i];
        if (i == 8) {
            console.log(line);
        }
    }
}
//-----------------------------------------------------------------------------
function update_buttons() {
    for (var i = 0; i < board.length; i++) {
        if (board[i] != blank) {
            buttons[i].textContent = board[i];
        }
    }
}
//-----------------------------------------------------------------------------
function reset_game() {
    console.log("Reset function called!");
    // Set all Board Values Blank
    for (var i = 0; i < board.length; i++) {
        board[i] = blank;
    }
    // Set player to Player 1
    player = 1;
    // Set turn to zero
    turn = 0;
    // Update the display
    update_buttons();
}
//-----------------------------------------------------------------------------
function new_clicked() {
    console.log("New clicked!");
}
