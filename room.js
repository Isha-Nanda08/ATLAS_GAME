import { Bot } from "./player.js";

class Room {
    constructor(id, password, name, creator) {
        // ------- functions -------
        this.startRoom = () => {
            // room can run only if there are more that 1 players
            this.status = this.allPlayers.length > 1;
            if (this.status) {
                for (let i=0; i<this.allPlayers.length; i++) {
                    this.livePlayers.push(this.allPlayers[i]);
                }
                // select random player to start game with
                this.currPlayer = Math.floor(Math.random() * this.allPlayers.length);
            }
            return this.status;
        };

        this.changeCreator = () => {
            let i = 0;
            while (true) {
                if  (this.allPlayers[i].ip != creator.ip && !(this.allPlayers[i] instanceof Bot)) {
                    this.creator = this.allPlayers[i];
                    break;
                }
                i++;
            }
        }

        // this.addBot = () => {};
        this.getNextPlayer = () => {
            this.currPlayer = (this.currPlayer + 1) % this.livePlayers;
            // if (this.currPlayer) curr player is bot
        };
        this.addPlayer = (newPlayer) => {
            this.allPlayers.push(newPlayer);
            newPlayer.roomID = this.id;
        }

        // ------- data -------
        this.id = id;
        this.name = name;
        this.password = password;
        this.creator = creator;
        this.status = false; // if the room is running or not
        // this.hasBot = false;

        this.allPlayers = [];
        this.livePlayers = [];
        this.usedPlaces = [];
        this.currPlayer = -1; // index of current player

        this.addPlayer(creator);
    }
}

export default Room;