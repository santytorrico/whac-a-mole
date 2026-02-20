class gameModel{
    constructor(){
        this.board = [];
    }

    createBoard(){
        const board = [];
        for(let i = 0; i < 12 ; i++){
            this.board.push({
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
console.log(game.board[12].id);