class gameModel{
    constructor(){
        this.score = 0;
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

    getActiveMoleCount(){
        return this.board.filter(hole => hole.status).length;
    }

    popRandomMole(){
        if (this.getActiveMoleCount() >= 3) return;
        
        const emptyHoles = this.board.filter(hole => !hole.status);

        if (emptyHoles.length === 0) return;

        const randomIndex = Math.floor(Math.random() * emptyHoles.length);
        const randomHole = emptyHoles[randomIndex];

        randomHole.status = true;
    }

    hitHole(id){
        const hole = this.board[id];
        if (hole && hole.status) {
            hole.status = false;
            this.score += 1;
            return true;
        }
        return false;
    }
}
class gameView{
    constructor(){
        this.holes = document.querySelectorAll(".game-hole");
        this.scoreElement = document.getElementById("score");
        this.timerElement = document.getElementById("timer");
        this.startButton = document.querySelector("button");
    }
    renderBoard(board){
        this.holes.forEach(holeElement => {
            const id = Number(holeElement.dataset.id);
            const holeData = board[id];
            if (holeData.status) {
                holeElement.classList.add("mole");
            } else {
                holeElement.classList.remove("mole");
            }
        });
    }

    bindHoleClick(handler){
        this.holes.forEach(hole => {
            hole.addEventListener("click", () => {
            const id = Number(hole.dataset.id);
            handler(id);
            });
        });
    }
    updateScore(score){
        this.scoreElement.textContent = score;
    }
}
class gameController{
    constructor(model, view){
        this.model = model;
        this.view = view;
        this.intervalId = null;
    }

    init(){
        this.view.startButton.addEventListener("click", () => {
            this.handleStart();
        });
        this.view.bindHoleClick((id) => {
            this.handleHoleClick(id);
        });
    }

    handleHoleClick(id){
        const wasHit = this.model.hitHole(id);
        if (wasHit){
            this.view.updateScore(this.model.score);
            this.view.renderBoard(this.model.board);
        }
    }
    handleStart(){
        this.startGameLoop();
    }

    startGameLoop(){
        this.intervalId = setInterval(() => {
        this.model.popRandomMole();
        this.view.renderBoard(this.model.board);
        }, 1000);
    }

    stopGameLoop(){
        clearInterval(this.intervalId);
    }

}   

const model = new gameModel();
const view = new gameView();
const controller = new gameController(model, view);

controller.init();