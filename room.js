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
            this.currPlayer = (this.currPlayer + 1) % this.livePlayers.length;
            // if (this.currPlayer) curr player is bot
        };
        this.addPlayer = (newPlayer) => {
            this.allPlayers.push(newPlayer);
            newPlayer.roomID = this.id;
        }

        this.updateGame = (location) => {
            if (this.usedPlaces[location[0]].includes(location)) {
                return false;
            }
            this.usedPlaces[location[0]].push(location);
            this.currWord = location;
            this.getNextPlayer();
            return true;
        }

        this.reduceCurrLive = () => {
            this.livePlayers[this.currPlayer].lives--;
            if (this.livePlayers[this.currPlayer].lives < 0) {
                this.livePlayers.splice(this.currPlayer, 1);
                this.currPlayer = this.currPlayer - 1;
            }
            this.getNextPlayer();
        }

        // this.checkWinner = () => {
        //     return this.livePlayers.length == 1;
        // }

        // ------- data -------
        this.id = id;
        this.name = name;
        this.password = password;
        this.creator = creator;
        this.status = false; // if the room is running or not
        // this.hasBot = false;

        this.allPlayers = [];
        this.livePlayers = [];
        this.usedPlaces = {
            "a":[],"b":[],"c":[],"d":[],"e":[],"f":[],
            "g":[],"h":[],"i":[],"j":[],"k":[],"l":[],
            "m":[],"n":[],"o":[],"p":[],"q":[],"r":[],
            "s":[],"t":[],"u":[],"v":[],"w":[],"x":[],
            "y":[],"z":[]
        };
        this.currPlayer = -1; // id of current player
        this.currWord = "a";
        this.roomLog = "";

        this.addPlayer(creator);
    }
}

export default Room;