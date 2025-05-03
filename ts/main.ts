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
let buttons = new Array<any>(9);
let board = new Array<number>(9);
let players: string[] = new Array<string>(2);
let player: number = 1;
let turn : number = 0;

// Add button events
for (let i = 0; i < buttons.length; i++)
{
    let s = String(i);
    buttons[i] = document.getElementById(s);
    buttons[i].addEventListener('click', () => {clicked(i)})
}

// Add reset button event
let resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => { resetGame() })

// Add Radio button events
let randomButton = document.getElementById("random");
randomButton.addEventListener("change", () =>{ radioButtonChanged() })

let cpuButton  = document.getElementById("CPU");
cpuButton.addEventListener("change", () => { radioButtonChanged() })

let playerButton = document.getElementById("player");
playerButton.addEventListener("change", () => { radioButtonChanged() })

// Add Status / Header elements
let header = document.getElementById("header");
let gameStatus = document.getElementById("status-text");

// Grab player spans
let oPlayer = document.getElementById("player-1");
let xPlayer = document.getElementById("player-2");


// Reset Game and wait for events to occur
resetGame();
//minMaxTest();

//-----------------------------------------------------------------------------
// Events and functions
//-----------------------------------------------------------------------------
function checkWin() : boolean
{

    // Create return variable
    let r = false;

    // Check all rows
    for(let i = 0; i < 3; i++)
    {
        // Get the rows for column check
        let c1 = i * 3;
        let c2 = (i * 3) + 1;
        let c3 = (i * 3) + 2;

        // Get the columns for row check
        let r1 = i;
        let r2 = i + 3;
        let r3 = i + 6;

        // Check column win
        let columnCheck = board[r1] + board[r2] + board[r3];
        if((columnCheck == 3) || (columnCheck == -3)) { r = true;}

        // Check row win
        let rowCheck = board[c1] + board[c2] + board[c3];
        if((rowCheck == 3) || (rowCheck == -3)) { r = true;}
    }

    // Check diagonal one
    let diagCheckOne = board[0] + board[4] + board[8];
    if((diagCheckOne == 3) || (diagCheckOne == -3)) { r = true;}

    // Check diagonal two
    let diagCheckTwo = board[2] + board[4] + board[6];
    if((diagCheckTwo == 3) || (diagCheckTwo == -3)) { r = true;}

    return r;
}
//-----------------------------------------------------------------------------
function clicked(i: number) : void
{
    // Guard Clause - if the clicked button already has something, exit
    if (board[i] != 0) { return; }

    // Don't handle the click event if someone has already won
    if (checkWin()) { return;}

    // Process the turn
    processTurn(i);

    // CPU turn if game isnt' over
    if(!checkWin() && turn < 9) { cpuTurn(); }
}
//-----------------------------------------------------------------------------
function resetGame() : void
{
    // Set all Board Values Blank
    for (let i = 0; i < board.length; i++) { board[i] = 0; }

    // Set player to Player 1
    player = 1;

    // Set turn to zero
    turn = 0;

    // Update the display
    setPlayerOrder();
    updateButtons();
    updateHeader();

    // If CPU is first, take the firs turn
    if(players[0] == "CPU") { cpuTurn();}
}
//-----------------------------------------------------------------------------
function updateButtons() : void
{
    for (let i = 0; i < board.length; i++)
    {
        switch (board[i])
        {
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
function updateHeader() : void
{
    // Update Header Info
    if (player == 1) { header.textContent = players[0] + " turn";}
    else { header.textContent = players[1] + " turn";}

    // Update game over / Game won status
    let displayTurn = turn + 1;
    if(turn < 9) { gameStatus.textContent = "Turn " + displayTurn.toString();}
    else { gameStatus.textContent = "Draw";}

    // Guard Clause - if someone hasn't won, stop here
    if(!checkWin()) { return; }

    // Update the header
    if(player == 1)  { gameStatus.textContent = players[1] + " wins!"; }
    else { gameStatus.textContent = players[0] +" wins!"; }
}
//-----------------------------------------------------------------------------
function radioButtonChanged(): void
{
    setPlayerOrder();
    resetGame();
}
//-----------------------------------------------------------------------------
function getRandomInt(min: number, max: number)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}
//-----------------------------------------------------------------------------
function setPlayerOrder() : void
{
    // Cast elements to HTMLInputElements
    let p = <HTMLInputElement>playerButton;
    let c = <HTMLInputElement>cpuButton;
    let r = <HTMLInputElement>randomButton;

    // Find which one is checked and set the players
    if (p.checked)
    {
        players[0] = "Player";
        players[1] = "CPU";
    }
    if (c.checked)
    {
        players[0] = "CPU";
        players[1] = "Player";
    }
    if (r.checked)
    {
        // Randomize
        let r = getRandomInt(0, 1)
        if(r == 0)
        {
            players[0] = "CPU";
            players[1] = "Player";
        }
        else
        {
            players[0] = "Player";
            players[1] = "CPU";
        }
    }

    // Update the display
    oPlayer.innerText = "O: " + players[0];
    xPlayer.innerText = "X: " + players[1];
}
//-----------------------------------------------------------------------------
function cpuTurn() : void
{
    // If the turn is 0, try to take the outside
    let move: number = bestCellMove(board);
    processTurn(move);

}
//-----------------------------------------------------------------------------
function processTurn(i: number) : void
{
    // Create a value to put into the board
    let value = 1;

    // Check if the value should be negative
    if(player == 2) { value = -1;}

    // Put the value in the board
    board[i] = value;

    // Swap the players
    if(player == 1) { player = 2;}
    else { player = 1;}

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
function minMax(board: number[]) : number
{
    // Base case : the board is a winner, so return the value
    if(boardValue(board) != 0) { return boardValue(board); }

    // Next, find a list of empty cells
    let empty: number[] = findEmptyCells(board);

    // Base case 2 : the board has no empty ells, there are no more moves
    // and no winner, so we have a value of zero to return
    if(empty.length < 1) { return 0; }

    // -- Past this point are boards with no winning value ---

    // First, grab the turn value we want to insert
    let value: number = findTurnValue(board);

    // Now, create a list of boards based on the empty cells
    let boards: number[][] = new Array<Array<number>>;

    // Fill each board in with the right move
    for(let i: number = 0; i < empty.length; i++)
    {
        // Copy the board over to a new array
        let b : number[] = Array.from(board);

        // Copy the move cell
        let move: number = empty[i];

        // Set the value
        b[move] = value;

        // Add board to list of boards
        boards.push(b);
    }

    // Now create a list of values
    let values: number [] = new Array<number>;

    // Iterate through each new board condition and call this function
    // to fill the values in
    for(let i: number = 0; i < boards.length; i++)
    {
        let v: number = minMax(boards[i]);
        values.push(v);
    }

    // Now we have a list of values.  Iterate and find the best one
    let best: number = values[0];
    for(let i: number = 0; i < boards.length; i++)
    {
        let v: number = values[i];
        switch(v)
        {
            case 1:
                if (value == 1) { best = 1; }
                break;
            case 0:
                if (value == 1 && best != 1) { best = 0;}
                if (value == -1 && best != -1) { best = 0;}
                break;
            case -1:
                if (value == -1) { best = -1;}
        }
    }

    // Finally, return our best value
    return best;
}
//-----------------------------------------------------------------------------
function bestCellMove(board: number[]): number
{

    // Next, find a list of empty cells
    let empty: number[] = findEmptyCells(board);

    // Base case 2 : the board has no empty cells, there are no more moves
    // and no winner, so we have a value of zero to return
    if(empty.length < 1) { return 0; }

    // First, grab the turn value we want to insert
    let value: number = findTurnValue(board);

    console.log("Value in bestCellMove " + value.toString());

    // Now, create a list of boards based on the empty cells
    let boards: number[][] = new Array<Array<number>>;

    // Fill each board in with the right move
    for(let i: number = 0; i < empty.length; i++)
    {
        // Copy the board over to a new array
        let b : number[] = Array.from(board);

        // Copy the move cell
        let move: number = empty[i];

        // Set the value
        b[move] = value;

        // Add board to list of boards
        boards.push(b);
    }

    // Now create a list of values
    let values: number [] = new Array<number>;

    // Iterate through each new board condition and call this function
    // to fill the values in
    for(let i: number = 0; i < boards.length; i++)
    {
        let v: number = minMax(boards[i]);
        values.push(v);
    }

    // Now we have a list of values.  Iterate and find the best one
    let best: number = values[0];
    for(let i: number = 0; i < boards.length; i++)
    {
        let v: number = values[i];
        switch(v)
        {
            case 1:
                if (value == 1) { best = 1; }
                break;
            case 0:
                if (value == 1 && best != 1) { best = 0;}
                if (value == -1 && best != -1) { best = 0;}
                break;
            case -1:
                if (value == -1) { best = -1;}
        }
    }

    // Now that we know the best value, we need to find it in the value list
    let r: number = 0;
    for(let i:number = 0; i < values.length; i++)
    {
        if(values[i] == best) { r = empty[i]; }
    }

    // Finally, return our best value
    return r;
}
//-----------------------------------------------------------------------------
function boardValue(board: number[]) : number
{
    // Create return variable
    let r : number = 0;

    // Check all rows
    for(let i : number = 0; i < 3; i++)
    {
        // Get the rows for column check
        let c1 : number = i * 3;
        let c2 : number = (i * 3) + 1;
        let c3 : number = (i * 3) + 2;

        // Get the columns for row check
        let r1 : number = i;
        let r2 : number = i + 3;
        let r3 : number = i + 6;

        // Check column win
        let columnCheck : number = board[r1] + board[r2] + board[r3];
        if((columnCheck == 3) || (columnCheck == -3)) { r = columnCheck / 3;}

        // Check row win
        let rowCheck : number = board[c1] + board[c2] + board[c3];
        if((rowCheck == 3) || (rowCheck == -3)) { r = rowCheck / 3;}
    }

    // Check diagonal one
    let diagCheckOne : number = board[0] + board[4] + board[8];
    if((diagCheckOne == 3) || (diagCheckOne == -3)) { r = diagCheckOne / 3;}

    // Check diagonal two
    let diagCheckTwo : number = board[2] + board[4] + board[6];
    if((diagCheckTwo == 3) || (diagCheckTwo == -3)) { r = diagCheckTwo / 3;}

    return r;
}
//-----------------------------------------------------------------------------
function findEmptyCells(board: number[]) : number[]
{
    // Create an array
    let a : number[] = new Array<number>;

    // Loop through the board and append any empty spaces
    for (let i = 0; i < board.length; i++)
    {
        if(board[i] == 0) { a.push(i); }
    }

    // Return our array
    return a;
}
//-----------------------------------------------------------------------------
function findTurnValue(board: number[]) : number
{
    //Find all empty cells
    let empty : number[] = findEmptyCells(board);

    // Return a value based on the number of empty cells
    // Odd = O turn = 1
    // Even = X turn = -1
    if(empty.length % 2 == 0) { return -1; }
    else { return 1; }
}
//-----------------------------------------------------------------------------