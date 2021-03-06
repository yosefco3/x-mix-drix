let board;
let moves = [];
let gameWon = "";
let players = ["x", "o"];
let whoseTurn;
let pick = "";
let gamewon = null;

const x_img = "x.png"
const y_img = "o.png"

const winComb = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
];


const cells = document.querySelectorAll(".cell");
const cell_imges = document.querySelectorAll(".img_cell");
let end_game_message = document.querySelector("#endgame");
const start = document.querySelector('#startgame');
const submit_names = document.querySelector('#submit_names');
const name1 = document.querySelector('#name1');
const name2 = document.querySelector('#name2');
const names = document.querySelector('#names');
const game = document.querySelector('#game');
const turn_declare = document.querySelector('#turn_declare');
const reverse_move = document.querySelector('#reverse');
const save_game = document.querySelector('#save');
const load_game = document.querySelector('#load');
const load_pick = document.querySelector('#pick');




submit_names.addEventListener('click', (e) => {
    e.preventDefault();
    name_player1 = name1.value;
    name_player2 = name2.value;
    players = [name_player1, name_player2];

    names.style.display = "none";
    game.classList.remove("d-none");
    turn_declare.classList.remove("d-none");
    turn_declare.textContent = "Turn of " + players[0]
})

// toggles players.
// 0 is x , 1 is y (circle)
let togglePlayers = () => {
    whoseTurn++;
    whoseTurn %= 2;
    turn_declare.textContent = "Turn of " + players[whoseTurn];

}

// gets the moves array and makes the board array.
let make_board_from_moves = function (moves) {
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    moves.forEach(move => {
        board[move.cell] = move.player;
    });
    return board
}


// get the board array and make the DOM board
let make_board_with_img = function (board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === players[0]) {
            cell_imges[i].style.display="inline";
            cell_imges[i].src = x_img;
        } else if (board[i] === players[1]) {
            cell_imges[i].style.display="inline";
            cell_imges[i].src = y_img;
        } else {
            cell_imges[i].src = "";
            cell_imges[i].style.display="none";
        }
    }
}

// checks if array contains array
let arrayContainsArray = function (needle, haystack) {
    for (let item of needle) {
        if (haystack.indexOf(item) === -1) return false;
    }
    return true;
}



// checks if there is a winner , returns the winner 
// and the combination
let checkWin = function (board, player) {
    // from the array "board" makes array "a" of all player moves. 
    let a = [];
    board.forEach((element, index) => {
        if (element === player) a.push(index);
    });
    
    // checks if winner comb is in a.
    // if is , returns the player and the winning comb.
    for (let i = 0; i < winComb.length; i++) {
        if (arrayContainsArray(winComb[i], a)) {
            gamewon = {
                player: player,
                comb: winComb[i]
            }
            return gamewon
        }
    }
}

// checks if the win is a pick. if it is , stores it.
let check_if_pick = function (moves) {
    // if there is allready pick in the local st' 
    // we load it , and compare to the current win:
    pick = JSON.parse(localStorage.getItem('pick'));
    if (!pick || moves.length < pick.moves.length) {
        const new_pick ={
            moves:moves,
            players:players,
        }
        localStorage.setItem('pick', JSON.stringify(new_pick));
    }
}

// loads the pic from the storage.

let loadPick =function (e) {
    let pick = JSON.parse(localStorage.getItem('pick'));
    if (!pick) {
        alert('There is no pick yet!');
    } else {
        // cleaning
        cells.forEach(cell => {
            cell.style.removeProperty('background-color');
        });
        cell_imges.forEach(img =>{
            img.src="";
            img.style.display="none";
        });
        // 
        moves = pick.moves
        board = make_board_from_moves(moves);
        player=moves[moves.length-1].player
        players=pick.players
        make_board_with_img(board);
        gameWon = checkWin(board, player);
        gameOver(gameWon);
        turn_declare.textContent = "The pick:";
    }
}


//    if there is a winner , makes green backgrond to the comb ,
//    removes the event listener from the cells.
let gameOver = function (gameWon) {
    // console.log(gameWon)
    for (let index of gameWon.comb) {
        cells[index].style.backgroundColor = 'green';
    }
    cells.forEach(cell => {
        cell.removeEventListener('click', turnClick, false)
    });
    turn_declare.textContent = gameWon.player + " won!"
    check_if_pick(moves);
    save_game.removeEventListener('click', saveGame);
    reverse_move.removeEventListener('click',reverseMove);
}

let checkDraw = function (board) {
    if (board.some((x) => typeof x === "number")) {
        return;
    } else {
        turn_declare.textContent = "It's a DRAW !"
        save_game.removeEventListener('click', saveGame);
        reverse_move.removeEventListener('click',reverseMove);
        cells.forEach(cell => {
            cell.removeEventListener('click', turnClick, false)
        });
    }
}

let turnClick = function (e) {
    // we dont want that a cell we allready press would be 
    // selected again. in the selected board we have "x" and "y" ,
    //  in the non selected we have numbers.
    if (Number.isInteger(board[this.id])) {
        // makes array of moves , so we could reverse moves etc. 
        move = {
            cell: this.id,
            player: players[whoseTurn],
        }
        moves.push(move);


        // makes the simple array "board" from moves.
        board = make_board_from_moves(moves);
        // makes the DOM how the board is.
        make_board_with_img(board);
        // chakes if we have winner. returns the player 
        // and the combination.
        gameWon = checkWin(board, players[whoseTurn]);
        console.log(gameWon);
        if (!gameWon) {
            togglePlayers();
            checkDraw(board);
        } else {
            gameOver(gameWon);
        }
        // console.log(moves);
        // console.log(board);
    }
}


startGame = function () {
    // initialization
    cell_imges.forEach(img => {
        img.src = "";
        img.style.display="none";
    });
    gameWon = null;
    moves = [];
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    whoseTurn = 0;
    save_game.addEventListener('click', saveGame);
    reverse_move.addEventListener('click', reverseMove);
    turn_declare.textContent = "Turn of " + players[0];


    cells.forEach(cell => {
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', turnClick);
    });

}


let reverseMove=function (e) {
    if (!gameWon && moves.length > 0) {
        moves.pop();
        // console.log(moves);
        board = make_board_from_moves(moves);
        // console.log(board)
        make_board_with_img(board);
        togglePlayers();

        cells.forEach(cell => {
            cell.style.removeProperty('background-color');
            cell.addEventListener('click', turnClick);
        });
    }
}




let saveGame = function (e) {
    if (moves.length > 1 && !gameWon) {
        saved_game = {
            moves: moves,
            players: players,
            whoseTurn: whoseTurn,
        }
        localStorage.setItem('saved_game', JSON.stringify(saved_game));

        alert("saved");
    } else if (moves.length<2){
        alert("You can save only from 2 moves!")
    }
}

let loadGame=function  (e) {
    let saved_game = JSON.parse(localStorage.getItem('saved_game'));
    gameWon = null;
    reverse_move.addEventListener('click', reverseMove);    
    save_game.addEventListener('click', saveGame);
    if (saved_game) {
        // console.log(saved_game)
        whoseTurn = saved_game.whoseTurn;
        moves = saved_game.moves;
        players = saved_game.players;
        board = make_board_from_moves(moves);
        make_board_with_img(board);
        cells.forEach(cell => {
            cell.style.removeProperty('background-color');
            cell.addEventListener('click', turnClick);
        });
        turn_declare.textContent = "Turn of " + moves[moves.length - 2].player;
    } else {
        alert("No game saved!")
    }
}



reverse_move.addEventListener('click', reverseMove);
load_game.addEventListener('click',loadGame);
load_pick.addEventListener('click', loadPick);
save_game.addEventListener('click', saveGame);
start.addEventListener('click', startGame);
startGame();