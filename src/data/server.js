import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { Player, Bot } from "./player.js";
import Room from "./room.js";
import os from "os";
import { botSleepTime } from "./settings.js";

const port = 3090;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let rooms = [
  // new Room(1000, "abcd", "test room", new Player("Test person", "http://12.12.1.1:9090"))
];
let newRoomId = 0;
let homePagePlayers = [];

async function getLocalIpAddress() {
  return new Promise((resolve, reject) => {
    const interfaces = os.networkInterfaces();
    const interfaceKeys = Object.keys(interfaces);

    for (const intf of interfaceKeys) {
      for (const alias of interfaces[intf]) {
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          resolve(alias.address);
          return;
        }
      }
    }

    reject(new Error('Unable to determine local IP address.'));
  });
}

function refreshAll(playerList) {
  console.log(`\nLOG: updating ${playerList.length} players`);
  playerList.forEach((player) => {
    if (player.ip) {
      console.log("   sending refresh request to player "+player.ip)
      axios.post(`${player.ip}/refresh`)
    }
  })
}

async function giveHint(usedPlaces, hint) {
  // console.log(`\nLOG: alerting ${player.ip}`);
  const response = await axios.get(`http://localhost:3080/starts-with/${hint}`);
  let list = response.data;
  list = list.filter(item => !usedPlaces.includes(item.toLowerCase()));
  if (list.length > 0) { return list[0]; }
  return null;
}

async function botTurn(room, bot) {
  console.log(bot.isBot)
  const correctAns = bot.makeGuess();
  if (correctAns) {
    console.log(`\nLOG: Bot answered correctly`)
    const ans = await giveHint(room.usedPlaces[room.currWord[room.currWord.length - 1]], room.currWord[room.currWord.length - 1])
    room.roomLog = "bot has made correct guess"
    refreshAll(room.allPlayers);
    setTimeout(() => {
      room.getNextPlayer();
      refreshAll(room.allPlayers);
    }, botSleepTime)
  } else {
    console.log(`\nLOG: Bot answered incorrectly`)
    room.roomLog = "bot has made incorrect guess"
    refreshAll(room.allPlayers);
    setTimeout(() => {
      room.reduceCurrLive();
      refreshAll(room.allPlayers);
    }, botSleepTime)
  }
}

async function startServer() {
  try {
    const localIp = await getLocalIpAddress();

    app.get("/hello", (req, res) => { res.send("yes"); });

    app.post("/atHome", (req, res) => {
      const ip = req.body.playerIp
      console.log(`\nLOG: player ${ip} found at home page`)
      homePagePlayers = homePagePlayers.filter(item => item.ip !== ip); // to remove duplicasies on refreshing
      homePagePlayers.push({ip: ip});
      console.log(`   home page players: ${homePagePlayers}`)
      res.send("ok");
    })

    app.post("/notAtHome", (req, res) => {
      homePagePlayers = homePagePlayers.filter(item => item.ip !== req.body.playerIp);
      console.log("\nLOG: player: " + req.body.playerIp + " left home page")
      console.log(`   home page players: ${homePagePlayers}`)
      res.send("ok");
    })

    app.get("/roomList", (req, res) => {
      res.json({rooms: rooms});
    })

    app.get("/room", (req, res) => {
      const roomId = parseInt(req.query.roomId);
      const selectedRoom = rooms.find(item => item.id == roomId);
      res.json({
        roomName: selectedRoom.name,
        creator: selectedRoom.creator.name,
        players: selectedRoom.allPlayers.filter(player => player.ip != selectedRoom.creator.ip).map(player => player.name),
        creatorIp: selectedRoom.creator.ip
      });
    });    

    app.post("/createRoom", (req, res) => {
      const newCreator = new Player(req.body.userName, req.body.userIp);
      const roomName = req.body.roomName;
      const newRoom = new Room(newRoomId, req.body.password, roomName, newCreator);
      console.log(`\nLOG: recieved room creation request: [${req.body.userName}, ${roomName}, ${req.body.password}]`)
      console.log(`    from ${req.body.userIp}, room id available: ${newRoomId}`)
      newRoomId++;

      const botEnable = req.body.botEnable;
      const botDifficulty = req.body.botDifficulty;

      let isMatch = false;
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].name == roomName) {
          console.log("   error: room name already in use")
          isMatch = true;
          break;
        }
      }
      if (isMatch) {
        res.send({roomId: -1});
      } else {
        rooms.push(newRoom);
        console.log("   room successfully created");
        if (botEnable) {
          const bot = new Bot(botDifficulty)
          newRoom.addBot(bot);
        }
        homePagePlayers = homePagePlayers.filter(item => item.ip !== req.body.userIp);
        console.log(`   refreshing ${homePagePlayers.length} home page players`)
        refreshAll(homePagePlayers);
        res.send({roomId: newRoom.id});
      }
    });

    app.post("/joinRoom", (req, res) => {
      const roomId = parseInt(req.body.roomid);
      const newPlayer = new Player(req.body.username, req.body.userIp);
      const password = req.body.password;

      console.log(`\nLOG: player: ${req.body.userIp} requested to join room ${roomId}...`)

      const selectedRoom = rooms.find(item => item.id === roomId);
      if (selectedRoom != undefined && selectedRoom != null) {
        console.log("   room found, confirming password...")
        if (selectedRoom.password == password) {
          selectedRoom.addPlayer(newPlayer);
          res.json({roomId: selectedRoom.id});
          console.log(`       password confirmed, refreshing all ${selectedRoom.allPlayers.length} players in room`)
          refreshAll(selectedRoom.allPlayers);
        } else {
          console.log("       incorrect password")
          res.json({ err: "incorrect password" });
        }
      } else {
        res.json({ err: "room not selected" });
      }
    });

    app.get("/room/status/:id", (req, res) => {
      const roomId = req.params.id;
      const selectedRoom = rooms.find(r => r.id === parseInt(roomId));
      res.send(selectedRoom.status);
    })

    app.post("/startRoom/:id", (req, res) => {
      const roomId = req.params.id;
      const selectedRoom = rooms.find(r => r.id === parseInt(roomId));
      console.log(`\nLOG: starting room: ${roomId}`)
      console.log(`   room info: ${selectedRoom.allPlayers}\n`)
      selectedRoom.startRoom();
      if (selectedRoom.status) {
        console.log("   refreshing all players")
        refreshAll(selectedRoom.allPlayers.filter(player => player.ip != selectedRoom.creator.ip)); // refresh all except creator
      }
      res.send(selectedRoom.status);
    })

    app.post("/restartRoom/:id", (req, res) => {
      const roomId = req.params.id;
      const selectedRoom = rooms.find(r => r.id === parseInt(roomId));
      console.log(`\nLOG: restarting room: ${roomId}`)
      console.log(`   room info: ${selectedRoom.allPlayers}\n`)
      selectedRoom.restartRoom();
      if (selectedRoom.status) {
        console.log("   refreshing all players")
        refreshAll(selectedRoom.allPlayers.filter(player => player.ip != selectedRoom.creator.ip)); // refresh all except creator
      }
      res.send(selectedRoom.status);
    })

    app.post("/leaveRoom", (req, res) => {
      const roomId = parseInt(req.body.roomId);
      const targetIp = req.body.playerIp;
      const selectedRoom = rooms.find(item => item.id == roomId);
      selectedRoom.allPlayers = selectedRoom.allPlayers.filter(player => player.ip != targetIp);
      console.log(`\nLog: player: ${targetIp} removed from room ${roomId}`)
      if (selectedRoom.allPlayers.length == 0) { // remove room
        console.log("   No player left in room, deleting room")
        rooms = rooms.filter(room => room.id != roomId);
      } else if (selectedRoom.allPlayers.length == 1 && selectedRoom.allPlayers[0] instanceof Bot) {
        console.log("   No player left in room, deleting room")
        rooms = rooms.filter(room => room.id != roomId);
      } else if (selectedRoom.creator.ip == targetIp) { // change leader
        console.log("   Changing room owner")
        selectedRoom.changeCreator();
        console.log(`   ${selectedRoom.creator.ip} is new owner`)
      }

      refreshAll(selectedRoom.allPlayers);
      res.json("removed");
    })

    app.get("/gameUpdate/:id", (req, res) => {
      const roomId  = parseInt(req.params.id);
      const selectedRoom = rooms.find(item => item.id == roomId);
      res.send({room: selectedRoom});
    })

    app.post("/gameUpdate/:id", async (req, res) => {
      const roomId  = parseInt(req.params.id);
      const selectedRoom = rooms.find(item => item.id == roomId);
      const ans = req.body.locationInp.toLowerCase();
      const player = selectedRoom.livePlayers[selectedRoom.currPlayer]

      if (req.body.sender == player.ip) { // correct user sent message
        let locationInvalid = true; 
        const response = await axios.post(`http://localhost:3080/location/${ans}`,);

        console.log(`\nLOG: api response for input: ${ans}`)
        console.log(response.data)

        // name invalid, starting char invalid
        locationInvalid = (response.data.error) || ans[0] != selectedRoom.currWord[selectedRoom.currWord.length - 1];
      
        if (ans == "quit") {
          console.log(`   user quits, removing user`)
          selectedRoom.livePlayers.splice(selectedRoom.currPlayer, 1);
          selectedRoom.currPlayer = selectedRoom.currPlayer - 1;
          selectedRoom.getNextPlayer();
          selectedRoom.roomLog = `${player.name} quits the game`
        } else if (locationInvalid) { // case of "pass" is included here
          if (ans == 'pass') {
            console.log('   user passed')
            selectedRoom.roomLog = `${player.name} passed his turn`
          } else {
            selectedRoom.roomLog = `${player.name}'s input: ${ans} is invalid`
            console.log(`   invalid input, ${ans} doesnot exist`)
          }
          selectedRoom.reduceCurrLive();
        } else {
          let placeUnused = selectedRoom.updateGame(ans);
          if (!placeUnused) {
            selectedRoom.roomLog = `${player.name}'s input: ${ans} is already used`
            console.log("   place already used")
            selectedRoom.reduceCurrLive()
          } else {
            selectedRoom.roomLog = `${player.name}'s input: ${ans}`
          }
        }
        res.send("ok");
        refreshAll(selectedRoom.allPlayers);

        if (selectedRoom.livePlayers[selectedRoom.currPlayer].isBot) {
          setTimeout(async () => await botTurn(selectedRoom, selectedRoom.livePlayers[selectedRoom.currPlayer]), botSleepTime)
        }
      }
    })

    app.post("/gameUpdate/hint/:id", async (req, res) => {
      console.log('\nLOG: received request for hint')
      const roomId  = parseInt(req.params.id);
      const selectedRoom = rooms.find(item => item.id == roomId);
      selectedRoom.livePlayers[selectedRoom.currPlayer].hints--;
      const ans = await giveHint(selectedRoom.usedPlaces[selectedRoom.currWord[selectedRoom.currWord.length - 1]], selectedRoom.currWord[selectedRoom.currWord.length - 1])
      if (ans == null) { // TODO - no hint
        res.send("no-hint");
      }
      res.send(ans);
    })

    app.listen(port, () => {
      console.log("\n\n======================== WELCOME TO ATLAS GAME!! ========================\n\n")
      console.log(`Game server running at http://${localIp}:${port}\n`);
    });
  } catch (error) {
    console.error('Error getting local IP address:', error);
  }
}

startServer();


// todo destroy room when creator exits winner room
// TODO: update homepage if a room is deleted due to lack of players
// TODO: timeup!!
// TODO - no hint