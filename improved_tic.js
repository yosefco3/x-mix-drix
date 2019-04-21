let board ;
let moves=[];

const players=["x","y"];
let whoseTurn=0;

const x_img="x.png"
const y_img="o.jpeg"

const winComb= [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8],
];


const cells=document.querySelectorAll(".cell");
const cell_imges=document.querySelectorAll(".img_cell");
let end_game_message=document.querySelector("#endgame");
const start=document.querySelector('#startgame');

// toggles players.
// 0 is x , 1 is y (circle)
let togglePlayers=()=>{
    whoseTurn++;
    whoseTurn%=2;
    
}

// gets the moves array and makes the board array.
let make_board_from_moves=function (moves){
    moves.forEach(move => {
        board[move.cell]=move.player;
    });
    return board
}


// get the board array and make the DOM board
let make_board_with_img=function(board){
    for (let i=0;i<board.length;i++){
        if (board[i]==="x"){
            cell_imges[i].src=x_img;
        } else if (board[i]==="y") {
            cell_imges[i].src=y_img;
        }
    }
}



// checks if array contains array
let arrayContainsArray = function(needle, haystack){
    for(let i = 0; i < needle.length; i++){
      if(haystack.indexOf(needle[i]) === -1)
         return false;
    }
    return true;
  }


// checks if there is a winner , returns the winner 
// and the combination
let checkWin=function(board,player){
    // makes array "a" of all x or y moves. 
    let a=[];
    board.forEach((element,index) => {
        if (element===player) a.push(index);

    });
    let gamewon=null;
    // checks if winner comb is in a.
    // if is , returns the player and the winning comb.
    for (let i=0; i<winComb.length;i++){
        if (arrayContainsArray(winComb[i],a)){
            gamewon={player:player,comb:winComb[i]}
            return gamewon
            }
        }
    }

//    if there is a winner , makes green backgrond to the comb ,
//    removes the event listener from the cells.
let gameOver=function(gameWon){
        // console.log(gameWon)
        for (let index of gameWon.comb){
            cells[index].style.backgroundColor='green';
        }
        cells.forEach(cell => {
            cell.removeEventListener('click',turnClick,false)
        });
    
    }



let turnClick=function(e){
    // we dont want that a cell we allready press would be 
    // selected again. in the selected board we have "x" and "y" ,
    //  in the non selected we have numbers.
    if (Number.isInteger(board[this.id])){
        // makes array of moves , so we could reverse moves etc. 
    move={
        cell:this.id,
        player: players[whoseTurn],
    }
    moves.push(move);
// makes the simple array "board" from moves.
    board=make_board_from_moves(moves);
    // makes the DOM how the board is.
    make_board_with_img(board);
    // chakes if we have winner. returns the player 
    // and the combination.
    let gameWon=checkWin(board,players[whoseTurn]);
    console.log(gameWon);
    if (!gameWon) togglePlayers();
    else {
        gameOver(gameWon);
    }
        
    // console.log(moves);
    // console.log(board);
    }
}


startGame=function(){
    // initialization
    cell_imges.forEach(img => {
        img.src="";
    });
    moves=[];
    board=[0,1,2,3,4,5,6,7,8];
    end_game_message.style.display="none";
    cells.forEach(cell => {
        cell.style.removeProperty('background-color');
        cell.addEventListener('click',turnClick);
    });
    
}

start.addEventListener('click',startGame);
startGame();
