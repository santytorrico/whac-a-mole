class gameModel{
    constructor(){
        this.resetGame();
    }

    createBoard(){
        const board = [];
        for(let i = 0; i < 12 ; i++){
            board.push({
                id: i,
                type: "empty"
            });
        }
        return board;
    }

    resetGame(){
        this.score = 0;
        this.timeLeft = 30;
        this.board = this.createBoard();
    }

    decreaseTimer(){
        if (this.timeLeft > 0) {
            this.timeLeft -= 1;
        }
    }

    isGameOver(){
        return this.timeLeft <= 0;
    }

    // getActiveMoleCount(){
    //     return this.board.filter(hole => hole.status).length;
    // }

    // popRandomMole(){
    //     if (this.getActiveMoleCount() >= 3) return;
        
    //     const emptyHoles = this.board.filter(hole => !hole.status);

    //     if (emptyHoles.length === 0) return;

    //     const randomIndex = Math.floor(Math.random() * emptyHoles.length);
    //     const randomHole = emptyHoles[randomIndex];

    //     randomHole.status = true;
    // }

    // hitHole(id){
    //     const hole = this.board[id];
    //     if (hole && hole.status) {
    //         hole.status = false;
    //         this.score += 1;
    //         return true;
    //     }
    //     return false;
    // }
    spawnMole(){
        const emptyHoles = this.board.filter(h => h.type === "empty");
        const activeMoles = this.board.filter(h => h.type === "mole");

        if (activeMoles.length >= 3 || emptyHoles.length === 0) return null;

        const randomHole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
        randomHole.type = "mole";

        return randomHole.id;
    }
    spawnSnake(){
        this.board.forEach(h => {
            if (h.type === "snake"){
                h.type = "empty";
            }
        });

        const randomIndex = Math.floor(Math.random() * this.board.length);
        this.board[randomIndex].type = "snake";

        return randomIndex;
    }
}
class gameView{
    constructor(){
        this.holes = document.querySelectorAll(".game-hole");
        this.scoreElement = document.getElementById("score");
        this.timerElement = document.getElementById("timer");
        this.startButton = document.querySelector("button");
    }
    // renderBoard(board){
    //     this.holes.forEach(holeElement => {
    //         const id = Number(holeElement.dataset.id);
    //         const holeData = board[id];
    //         if (holeData.status) {
    //             holeElement.classList.add("mole");
    //         } else {
    //             holeElement.classList.remove("mole");
    //         }
    //     });
    // }
    renderBoard(board){
        this.holes.forEach(holeElement => {
            const id = Number(holeElement.dataset.id);
            const holeData = board[id];

            holeElement.classList.remove("mole", "snake");

            if (holeData.type === "mole"){
                holeElement.classList.add("mole");
            }
            else if (holeData.type === "snake"){
                holeElement.classList.add("snake");
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

    updateTimer(time){
        this.timerElement.textContent = time;
    }

    showGameOver(){
        alert("Time is Over !");
    }
}
class gameController{
    constructor(model, view){
        this.model = model;
        this.view = view;
        this.moleInterval = null;
        this.timerInterval = null;
    }

    init(){
        this.view.startButton.addEventListener("click", () => {
            this.handleStart();
        });
        this.view.bindHoleClick((id) => {
            this.handleHoleClick(id);
        });
    }

    // handleHoleClick(id){
    //     if (this.model.isGameOver()) return;
    //     const wasHit = this.model.hitHole(id);
    //     if (wasHit){
    //         this.view.updateScore(this.model.score);
    //         this.view.renderBoard(this.model.board);
    //     }
    // }
    handleHoleClick(id){
        if (this.model.isGameOver()) return;

        const hole = this.model.board[id];

        if (hole.type === "mole"){
            hole.type = "empty";
            this.model.score++;
            this.view.updateScore(this.model.score);
        }

        else if (hole.type === "snake"){
            this.stopGame();

            // turn all holes into snake
            this.model.board.forEach(h => {
                h.type = "snake";
            });

            this.view.renderBoard(this.model.board);
            return;
        }

        this.view.renderBoard(this.model.board);
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

    // startMoleLoop(){
    //     this.moleInterval = setInterval(() => {
    //         this.model.popRandomMole();
    //         this.view.renderBoard(this.model.board);
    //     }, 1000);
    // }
    
    startMoleLoop(){
        this.moleInterval = setInterval(() => {
            const id = this.model.spawnMole();

            if (id !== null){
                this.view.renderBoard(this.model.board);

                // setTimeout(() => {
                //     this.model.board[id].type = "empty";
                //     this.view.renderBoard(this.model.board);
                // }, 2000);
                setTimeout(() => {
                    if (this.model.board[id].type === "mole"){
                        this.model.board[id].type = "empty";
                        this.view.renderBoard(this.model.board);
                    }
                }, 2000);
            }

        }, 1000);
    }
    startSnakeLoop(){
        this.snakeInterval = setInterval(() => {
            this.model.spawnSnake();
            this.view.renderBoard(this.model.board);
        }, 2000);
    }

    startTimerLoop(){
        this.timerInterval = setInterval(() => {
            this.model.decreaseTimer();
            this.view.updateTimer(this.model.timeLeft);

            if (this.model.isGameOver()){
                this.stopGame();
                this.view.showGameOver();
            }

        }, 1000);
    }

    startGame(){
        this.startMoleLoop();
        this.startSnakeLoop();
        this.startTimerLoop();
    }

    stopGame(){
        clearInterval(this.moleInterval);
        clearInterval(this.snakeInterval);
        clearInterval(this.timerInterval);
        this.moleInterval = null;
        this.snakeInterval = null;
        this.timerInterval = null;
    }
    handleStart(){
        this.stopGame();
        this.model.resetGame();
        this.view.updateScore(this.model.score);
        this.view.updateTimer(this.model.timeLeft);
        this.view.renderBoard(this.model.board);

        this.startGame();
    }

}   

const model = new gameModel();
const view = new gameView();
const controller = new gameController(model, view);

controller.init();