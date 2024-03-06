// Will Shanks 

/**
 * Solving Algorithm
 * -
 * Implementation of the backtracking algorithm. Starting top left, for each cell, 
 * cycle the numbers 1-9, each time evaluating whether that input breaks the game 
 * rules or not. If it does, iterate to next values in the 1-9 range. If all these 
 * numbers are exhausted and all result in an invalid board, backtrack to the last
 * position that had un-exhausted numbers 1-9. When a full board is completed, 
 * record this solve state, and continue backtracking to see if any other possible 
 * solutions are possible.  
 * 
 * Board Creating Algorithm
 * -
 * Populate a random cell with a single random value. Then apply the solving algorithm 
 * to create the whole board solved state. Next randomly remove a cell from the grid 
 * and assess whether the board has just one solution. If so, we continue. If not, 
 * return that value to the board and try another. Stop removing cells when there are
 * just 40 cells populated (should emulate quite an easy game). 
 */


// Global board variables 
const emptyBoard = [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]
];
let board = [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]
];
let startingBoard = [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]
];
let isNewGameButtonsVisible = false;
let solutionBoards = [];
const possibleValues  = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let newGameInterval;
let hasGameStarted = false;
let congratsAnimationInterval;
let selectedRow = null;
let selectedCol = null;

// Global timer variables
let dateTimeOnStartingTimer;
let isTimerOn = false;
let timerInterval;
let millisecondsElapsed;
let prevoiusTimeElapsed = 0;

// Global winning animation variables 
let winningRow;
let winningCol;
let colourOpts = ["#a7beae","#b85042"];
let colourIndex = 0;
let intervalCount = 0;

// Pads a number string to two figures 
function PadToTwo(numberString) {
    if (numberString.length < 2) {
        numberString = '0' + numberString;
    }
    return numberString;
}

// Returns the average hex value between two hex values 
function HexAverage() {
    var args = Array.prototype.slice.call(arguments);
    return args.reduce(function (previousValue, currentValue) {
        return currentValue
            .replace(/^#/, '')
            .match(/.{2}/g)
            .map(function (value, index) {
                return previousValue[index] + parseInt(value, 16);
            });
    }, [0, 0, 0])
    .reduce(function (previousValue, currentValue) {
        return previousValue + PadToTwo(Math.floor(currentValue / args.length).toString(16));
    }, '#');
}

// Initialises the colours opts array with a big range 
function InitialiseColourOpts() {
    for (let d = 0; d < 5; d++) {
        let tempColourOpts = [colourOpts[0]];

        for (let i = 0; i < (colourOpts.length - 1); i++) {
            const leftColour = colourOpts[i];
            const rightColour = colourOpts[i+1];
            const middleColour = HexAverage(leftColour, rightColour);
            tempColourOpts.push(middleColour);
            tempColourOpts.push(rightColour);
        }

        colourOpts = tempColourOpts.slice();
    }
    let initialColourOptsLength = colourOpts.length;

    for (let i = (initialColourOptsLength-2); i > 0; i--) {
        colourOpts.push(colourOpts[i]);
    }
    return;
}

// Returns a true copy, for 2D arrays
function CloneGrid(grid) {
    // Clone the 1st dimension (column)
    const newGrid = [...grid]
    // Clone each row
    newGrid.forEach((row, rowIndex) => newGrid[rowIndex] = [...row])
    return newGrid
}

// Converts int (e.g. 4) and outputs a two digit string with leading zeros if required (e.g. "04")
function FormatIntAsTwoDigitsString(input) {
    return input.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
}

// Updates the document to display the new time value
function PublishTimerValue(hours, minutes, seconds) {
    formattedTime = FormatIntAsTwoDigitsString(hours) + 
        ":" +  FormatIntAsTwoDigitsString(minutes) + 
        ":" + FormatIntAsTwoDigitsString(seconds);
    document.getElementById("timer").innerHTML = formattedTime;
    return;
}

// Applies a modulo, then rounds down to nearest int 
function FloorAndModulo(value) {
    return Math.floor(value%60);
}

// Increments the timer one second - called by interval command
function IncrementTimer() {
    millisecondsElapsed = new Date() - dateTimeOnStartingTimer + prevoiusTimeElapsed;
    const totalSeconds = Math.floor(millisecondsElapsed/1000);
    const seconds = FloorAndModulo(totalSeconds); 
    const minutes = FloorAndModulo(totalSeconds/60);
    const hours = FloorAndModulo(totalSeconds/3600); 
    PublishTimerValue(hours, minutes, seconds);
    return;
}

// Play/pause timer 
function ToggleTimer(option) {
    option = (option !== undefined) ? option : !isTimerOn; 
    if (option && !isTimerOn) {
        // Start Timer 
        dateTimeOnStartingTimer = new Date();
        timerInterval = setInterval(IncrementTimer, 1000);
        document.getElementById("ToggleTimer").innerHTML = "<b>Pause</b>";
        isTimerOn = true;
    } 
    else if (!option && isTimerOn) {
        // Stop Timer
        prevoiusTimeElapsed = millisecondsElapsed;
        clearInterval(timerInterval);
        document.getElementById("ToggleTimer").innerHTML = "<b>Resume</b>";
        isTimerOn = false;
    }
    return;
}

// Reset timer to 00:00:00
function ResetTimer() {
    dateTimeOnStartingTimer = new Date();
    prevoiusTimeElapsed = 0;
    if (!isTimerOn) {
        PublishTimerValue(0,0,0);
    }
    return;
}

// Changes the value of a cell on the GUI 
function UpdateBoardCell(i, j, num) {
    board[i][j] = num;
    return;
}

// Changes the value of a cell on the GUI 
function UpdateGuiCell(i, j, num) {
    document.getElementById(i.toString() + j.toString()).value = num;
    CheckIfSolved(i, j);
    return;
}

// Updates the document to place a value in a cell i,j
function UpdateBoardAndGuiCell(i, j, val) {
    UpdateBoardCell(i, j, val);
    UpdateGuiCell(i, j, val);
    return;
}

// Restricts the available options of a cell to one value   
function DisableOtherSelectionsOnStartingCell(i, j, num) {
    const HtmlString =  '<option value="' + num.toString() + '">' + num.toString() + '</option>';
    document.getElementById(i.toString() + j.toString()).innerHTML = HtmlString;
    return;
}

// Allows all available options to a cell   
function EnableOtherSelectionsOnStartingCell(i, j) {
    let accumulativeString = '<option value=""></option>';
    for (let p = 0; p < possibleValues.length; p++) {
        const num = possibleValues[p];
        accumulativeString += '<option value="' + num + '">' + num + '</option>';
    }
    document.getElementById(i.toString() + j.toString()).innerHTML = accumulativeString;
    return;
}

// Prints a board for a new game 
function PrintNewGameBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const num = board[i][j];
            UpdateGuiCell(i, j, num);
            if (num) {
                DisableOtherSelectionsOnStartingCell(i, j, num);
            } else {
                EnableOtherSelectionsOnStartingCell(i, j);
            }
        }
    }
    startingBoard = CloneGrid(board);
    return;
}

// Publishes the given cell i,j background colour 
function PublishCellBackgroundColour(i, j, colour) {
    document.getElementById(i.toString() + j.toString()).style.backgroundColor = colour;
    return;
}

// TODO 
function PublishBoardColour(colour) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            PublishCellBackgroundColour(i, j, colour);
        }
    }
    return;
}

// Assesses whether a given column is valid
function IsColInvalid(col) {
    let valuesSoFar = [];
    for (let i = 0; i < 9; i++) {
        const val = board[i][col];
        if (val) {
            if (valuesSoFar.includes(val)) {return true;}
            valuesSoFar.push(val);
        }
    }
    return false;
}

// Assesses whether a given row is valid
function IsRowInvalid(row) {
    let valuesSoFar = [];
    for (let i = 0; i < 9; i++) {
        const val = board[row][i];
        if (val) {
            if (valuesSoFar.includes(val)) {return true;}
            valuesSoFar.push(val);
        }    
    }
    return false;
}

// Assesses whether a given 3x3 cluster is valid
function IsClusterInvalid(hOffset, vOffset) {
    let valuesInCluster = [];
    for (let i = hOffset; i < (hOffset+3); i++) {
        for (let j = vOffset; j < (vOffset + 3); j++) {
            const val = board[i][j];
            if (val) {
                if (valuesInCluster.includes(val)) {return true;}
                valuesInCluster.push(val);
            }
        }
    }
    return false; 
}

// Assesses whether the board is valid
function IsBoardInvalid() {

    // Check each row and column
    for (let i = 0; i < 9; i++) {
        if (IsRowInvalid(i) || IsColInvalid(i)) {
            return true;
        }
    }
    
    // Check each 3x3 cluster 
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            if (IsClusterInvalid(i, j)) {return true;}
        }
    }

    // If haven't failed yet, the board is valid 
    return false;
}

// Adds the current board permutation to the solutions array
function SaveSolution() {
    let solutionBoard = emptyBoard.slice();
    solutionBoard = CloneGrid(board);
    solutionBoards.push(solutionBoard);
    return;
}

// Updates the document with the calculated solution 
function PrintSolution(solIndex) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const num = solutionBoards[solIndex][i][j];
            UpdateBoardAndGuiCell(i, j, num);
        }        
    }
    return;
}

// Returns a random integer between 0:maxVal (inclusive)
function RandomIntUpTo(maxVal) {
    return Math.floor((maxVal+1)*Math.random());
}

// Assesses if all cells in the board are full
function IsBoardFull() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!board[i][j]){
                return false;
            }
        }        
    }
    return true;
}

// Assesses if all cells in the board are empty
function IsBoardEmpty() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j]){
                return false;
            }
        }        
    }
    return true;
}

// If board is not empty or full, find solutions and print one
function Solve() {
    if (IsBoardFull() || IsBoardEmpty()) {return;}
    SolveRecursively(0, false);
    PrintSolution(RandomIntUpTo(solutionBoards.length - 1));
    CheckIfSolved(4,4);
    return;
}

// Use recursive backtracking approach to find all solutions
function SolveRecursively(cellIndex, exitEarly){

    // Check the recursion has overflowed, if so save the completed state, and return down 
    if (cellIndex === 81) {
        SaveSolution();
        return;
    }

    // Define local properties for this iteration 
    let i = Math.floor(cellIndex / 9);
    let j = cellIndex % 9;

    // Check that current cell isn't a starting given value 
    if (startingBoard[i][j] === "") {

        let triedVals = ShuffleArray(possibleValues.slice());

        // Check for each possible value which could be valid entries 
        for (let t = 0; t < triedVals.length; t++) {

            const val = triedVals[t];

            // Put value on board
            UpdateBoardCell(i, j, val);
            
            // Check board -> if valid, recurse to next cell 
            if (!IsBoardInvalid()) {
                SolveRecursively(cellIndex + 1, exitEarly);
            } 

            // If only wanting the first solution, exit early
            // True for new games for performance, beacuse solution-space with 1 starting cell is too large
            if (exitEarly && (solutionBoards.length > 0)) {
                return;
            }

            // Remove value from board 
            UpdateBoardCell(i, j, "");
        }
    } else {
        // If cell is a starting given value, check next
        SolveRecursively(cellIndex + 1, exitEarly)
    }

    return;
} 

// Sourced from StackOverflow 
function ShuffleArray(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

// Remove random i,j cells until only remainingCells are left 
function ReduceGameRecursively(remainingCells){
    let i, j;
    do {
        i = RandomIntUpTo(8);
        j = RandomIntUpTo(8);
    } while (board[i][j] === "");

    UpdateBoardCell(i, j, "");
    remainingCells++;

    if (remainingCells < 81) {ReduceGameRecursively(remainingCells);} 
    return;
}

// Helper function to start ReduceGameRecursively 
function ReduceGame(difficulty){
    ReduceGameRecursively(CalculateRemainingCellCountFromDifficulty(difficulty));
    return;
}

// Equate a semantic difficulty rating to a remainingCells count 
function CalculateRemainingCellCountFromDifficulty(difficulty) {
    switch (difficulty) {
        case 'easy':
            return 40;
        case 'med':
            return 32
        case 'hard':
            return 24;
        default:
            return 40;
    }
}

// Enable/Disable the timer toggle, reset and solve buttons depending on whether the game has started
function ToggleButtonsExecutability() {
    document.getElementById("ToggleTimer").disabled = hasGameStarted ? false : true;
    document.getElementById("ResetBoard").disabled = hasGameStarted ? false : true;
    document.getElementById("Solve").disabled = hasGameStarted ? false : true;
    return;
}

// Reset and restart timer 
function RestartTimer() {
    ResetTimer();
    ToggleTimer(true);
    return;
}

// If a new game option is pressed before timeout, timeout is cancelled 
function ResetNewGameOptionsTimeout() {
    hasGameStarted = true;
    clearTimeout(newGameInterval);
    return;
}

// Create random new game board and print to document 
function NewGame(difficulty) {

    // Reset Timer and game options timeout 
    ResetNewGameOptionsTimeout();
    RestartTimer();

    // Hide buttons and clear boards
    ToggleNewGameOptions();
    SetControlsText("Good Luck!");
    ToggleButtonsExecutability()
    board = CloneGrid(emptyBoard);
    solutionBoards = [];
    
    // Populate 1 random cell and set startingBoard
    UpdateBoardAndGuiCell(RandomIntUpTo(8), RandomIntUpTo(8), possibleValues[RandomIntUpTo(8)]);
    startingBoard = CloneGrid(board);

    // Fill board with a random solution and reduce board to given difficulty 
    SolveRecursively(0, true); 
    ReduceGame(difficulty);
    
    // Print to document
    PrintNewGameBoard();
    return;
}

// Set the text value of the textbox in the controls box 
function SetControlsText(val) {
    document.getElementById("status").innerHTML = val;
    return;
}

// After timeout, toggle back the game options to be visible 
function HideNewGameOptionsIfNoChoice() {
    clearTimeout(newGameInterval);
    if (isNewGameButtonsVisible){
        ToggleNewGameOptions();
    }
    return;
}

// Hide/Show the "New Game" button vs set of "Easy", "Med", "Hard" buttons 
function ToggleNewGameOptions() {
    
    // Toggle state boolean 
    isNewGameButtonsVisible = isNewGameButtonsVisible ? false : true;
    
    // Toggle Buttons
    buttons = document.getElementsByClassName("newGameButton");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.display = isNewGameButtonsVisible ? "block": "none";
    }

    // Change toggle New Game
    document.getElementById("ToggleNewGameOptions").style.display = isNewGameButtonsVisible ? "none" : "block";

    // Start timer in case no choice is made 
    newGameInterval = setTimeout(HideNewGameOptionsIfNoChoice, 5000);
}

// Assesses whether a given column is valid
function GetUsedRowAndColVals(usedValues, row, col) {
    for (let i = 0; i < 9; i++) {
        const colVal = board[i][col];
        if (colVal) {
            if (!usedValues.has(colVal)) {
                usedValues.add(colVal);
            }
        }

        const rowVal = board[row][i];
        if (rowVal) {
            if (!usedValues.has(rowVal)) {
                usedValues.add(rowVal);
            }
        }
    }
    return usedValues;
}

// Assesses whether a given 3x3 cluster is valid
function GetUsedClusterVals(usedValues, iOffset, jOffset) {
    for (let i = iOffset; i < (iOffset+3); i++) {
        for (let j = jOffset; j < (jOffset + 3); j++) {
            const val = board[i][j];
            if (val) {
                if (!usedValues.has(val)) {
                    usedValues.add(val);
                }
            }
        }
    }
    return usedValues; 
}

//
function UpdateAvailableOptions() {
    let usedValues = new Set();
    if (IsNull(selectedRow) || IsNull(selectedCol) || startingBoard[selectedRow][selectedCol]) {
        usedValues = new Set(possibleValues.slice());
    } else if (IsNotNull(selectedCol) && IsNotNull(selectedRow)){
        usedValues = GetUsedRowAndColVals(usedValues, selectedRow, selectedCol);
        usedValues = GetUsedClusterVals(usedValues, 3*Math.floor(selectedRow/3), 3*Math.floor(selectedCol/3));
    }

    for (let i = 1; i < 10; i++) {
        if ((selectedCol===null) || (selectedRow===null) || (usedValues.has(i.toString()))) {
            document.getElementById(i.toString()).innerText = "";
        } else {
            document.getElementById(i.toString()).innerText = i.toString();
        }
    }
    return;
}

//
function SetSelectedCell(i, j) {
    selectedRow = i;
    selectedCol = j;
    UpdateAvailableOptions();
    return;
}

//
function OptionSelected(event,i) {
    event.stopPropagation();
    document.getElementById(selectedRow.toString() + selectedCol.toString()).value = i.toString();
    ValueSelected(selectedRow, selectedCol);
    UpdateAvailableOptions();
    return;
}

// Run whenever a cell is clicked - restart timer if paused 
function CellClicked(event, i, j) {
    event.stopPropagation();

    if (hasGameStarted && !IsBoardFull()) {
        ToggleTimer(true);
    }
    const val = document.getElementById(i.toString() + j.toString()).value;

    HighlightCellBackgroundsInline(i, j);
    HighlightCellForegroundsEqual(val);
    SetSelectedCell(i, j);
    
    return;
}

// Handles clearing the board's decorations when a cell is deselected 
function BackgroundClicked() {
    HighlightCellBackgroundsInline(null, null);
    HighlightCellForegroundsEqual(null);
    SetSelectedCell(null, null);
    return;
}

// Reset timer and board back to starting set up 
function ResetBoard() {
    ResetTimer();
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const val = startingBoard[i][j];
            if (!val){
                UpdateBoardAndGuiCell(i, j, val)
            }
        }        
    }
    RestartTimer();
    SetControlsText("Good Luck!");
    hasGameStarted = true;
    return;
}

function PublishCellTextColour(i, j, colour) {
    document.getElementById(i.toString() + j.toString()).style.color = colour;
    return;
}

// Assess if the board is full and solved 
function CheckIfSolved(i, j) {
    if (IsBoardFull() && !IsBoardInvalid()) {
        PublishCellTextColour(i, j, "black");
        SetControlsText("Congrats!!!");
        ToggleTimer(false);
        document.getElementById("Solve").disabled = true;
        document.getElementById("ToggleTimer").disabled = true;
        document.getElementById("ToggleTimer").innerText = "-";
        AnimateWin(i,j);
        hasGameStarted = false;
    } else if(IsBoardInvalid()) {
        PublishCellTextColour(i, j, "red");
    }
    return;
}

// Run whenever a new value is selected 
//   - checks if board is solved
//   - updates board model with new value 
//   - triggers animations/visuals 
function ValueSelected(i, j) {
    const val = document.getElementById(i.toString() + j.toString()).value;
    UpdateBoardCell(i, j, val);
    HighlightCellForegroundsEqual(val);
    CheckIfSolved(i, j);
    return;
}

// Returns if given cell i,j is in the same cluster as the cell n,m
function IsInSameCluster(i, j, n, m) {
    return ((Math.floor(i/3) === Math.floor(n/3)) && (Math.floor(j/3) === Math.floor(m/3)));
}

// Returns if given row i is the same as the row n
function IsInSameRow(i, n) {
    return n===i;
}

// Returns if given col j is the same as the row m
function IsInSameCol(j, m) {
    return m===j;
}

// Returns is a is not a null value
function IsNull(a) {
    return a === null;
}

// Returns is a is not a null value
function IsNotNull(a) {
    return a !== null;
}

// Highlights the row, column and cluster of the selected cell 
function HighlightCellBackgroundsInline(i, j) {
    for (let n = 0; n < 9; n++) {
        for (let m = 0; m < 9; m++) {
            if (IsNotNull(i) && IsNotNull(j) && (IsInSameRow(i, n) || IsInSameCol(j, m) || IsInSameCluster(i, j, n, m))) {
                PublishCellBackgroundColour(n, m, "#EEEEEE");
            } else {
                PublishCellBackgroundColour(n, m, "#FFFFFF");
            }
        }        
    }
    return;
}

// Bolds/unbolds cell text for all cells with equal value to selected cell 
function HighlightCellForegroundsEqual(selectedVal) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === selectedVal){
                PublishCellTextWeight(i, j, "900");
            } else {
                PublishCellTextWeight(i, j, "100");
            }
        }        
    }
    return;
}

// Publishes the given cell i,j background colour 
function PublishCellTextWeight(i, j, weight) {
    document.getElementById(i.toString() + j.toString()).style.fontWeight = weight;
    return;
}

// Initialises the board with event listeners 
function init(){
    document.getElementById("body").addEventListener("click", BackgroundClicked, false);

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            document.getElementById(i.toString()+j.toString()).addEventListener("click", function(event){CellClicked(event,i,j);}, false);
        }        
    }

    for (let i = 0; i < 10; i++) {
        document.getElementById(i.toString()).addEventListener("click", function(event){OptionSelected(event,i);}, false);
    }

    InitialiseColourOpts();
    
    return;
}

//
function AnimateWinInterval() {
    if (intervalCount > 400) {
        intervalCount = 0;
        colourIndex = 0;
        HighlightCellBackgroundsInline(winningRow, winningCol);
        clearInterval(congratsAnimationInterval);
        return;
    }
    
    let internalColourIndex = colourIndex;
    intervalCount++;
    for (let offset = 8; offset >= 0; offset--) {
        for (let i = (winningRow - offset); i <= (winningRow + offset); i++) {
            for (let j = (winningCol - offset); j <= (winningCol + offset); j++) {
                if ((i>=0) && (i<=8) && (j>=0) && (j<=8)) {
                    PublishCellBackgroundColour(i, j, colourOpts[internalColourIndex]);
                }
            }
        }
        internalColourIndex = (internalColourIndex + 1) % colourOpts.length;
    }
    colourIndex++;
    return;
}

// 
function AnimateWin(i,j) {
    winningRow = i;
    winningCol = j;
    colourIndex = 0;
    congratsAnimationInterval = setInterval(AnimateWinInterval, 20);
    return;
}

