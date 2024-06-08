class Player {
    constructor(name, ip) {
        this.name = name;
        this.lives = 2;
        this.roomID = -1;
        this.hints = 2;
        this.ip = ip;
    }
}

class Bot {
    constructor(difficulty) {
        this.name = "Atlas-AI";
        this.lives = 3;
        this.roomID = -1;
        this.difficulty = difficulty; // max difficulty = 100 => unbeatable

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