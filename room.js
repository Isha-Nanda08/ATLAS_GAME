class Room {
    constructor(id, password, name, creator) {
        thid.id = id;
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

    // ------- functions -------
        this.startRoom = () => {
            // room can run only if there are more that 1 players
            this.status = this.allPlayers.length > 1;
            if (this.status) {
                // select random player to start game with
                this.currPlayer = Math.floor(Math.random() * this.allPlayers.length);
            }
            return this.status;
        };
        // this.addBot = () => {};
        this.getNextPlayer = () => {
            this.currPlayer = (this.currPlayer + 1) % this.livePlayers;
            // if (this.currPlayer)
        };
        this.addPlayer = (newPlayer) => {
            this.allPlayers.push(newPlayer);
            this.livePlayers.push(newPlayer);

            newPlayer.roomID = this.id;
            newPlayer.id = this.allPlayers.length;
        }
    }
}

export default Room;