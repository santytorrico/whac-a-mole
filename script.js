class gameModel{
    constructor(){
        this.board = this.createBoard();
    }

    createBoard(){
        const board = [];
        for(let i = 0; i < 12 ; i++){
            board.push({
                id: i,
                status: false
            });
        }
        return board;
    }
}
class gameView{

}
class gameController{

}   

const game = new gameModel();
console.log(game.createBoard());
console.log(game.board[1].status);