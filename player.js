class Player {
    constructor(name) {
        this.id = -1;
        this.name = name;
        this.lives = 3;
        this.roomID = -1;
    }
}

class Bot {
    constructor() {
        this.id = -1
        this.name = "Atlas-AI";
        this.lives = 3;
        this.roomID = -1;
        this.difficulty = 0; // max difficulty = 10 => unbeatable

        this.makeGuess = (character, usedPLaces) => {
            if (Math.random() * 10 <= this.difficulty) { // bot gives correct answer
                return true;
            } else { // bot gives incorrect answer
                return false;
            }
        }
    }
}
export { Player, Bot };