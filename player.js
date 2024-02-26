class Player {
    constructor(name, ip) {
        this.id = -1;
        this.name = name;
        this.lives = 3;
        this.roomID = -1;
        this.hints = 2;
        this.ip = ip;
    }
}

class Bot {
    constructor() {
        this.id = -1
        this.name = "Atlas-AI";
        this.lives = 3;
        this.roomID = -1;
        this.difficulty = 0; // max difficulty = 100 => unbeatable

        this.makeGuess = (character, usedPLaces) => {
            if (Math.random() * 100 <= this.difficulty) { // bot gives correct answer
                return true;
            } else { // bot gives incorrect answer
                return false;
            }
        }
    }
}
export { Player, Bot };