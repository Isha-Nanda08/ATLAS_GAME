import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { Player, Bot } from "./player.js";
import Room from "./room.js";
import os from "os";

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
        console.log("   room successfully created")
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

    app.post("/leaveRoom", (req, res) => {
      const roomId = parseInt(req.body.roomId);
      const targetIp = req.body.playerIp;
      const selectedRoom = rooms.find(item => item.id == roomId);
      selectedRoom.allPlayers = selectedRoom.allPlayers.filter(player => player.ip != targetIp);
      if (selectedRoom.allPlayers.length == 0) { // remove room
        rooms = rooms.filter(room => room.id != roomId);
      } else if (selectedRoom.allPlayers.length == 1 && selectedRoom.allPlayers[0] instanceof Bot) {
        rooms = rooms.filter(room => room.id != roomId);
      } else if (selectedRoom.creator.ip == targetIp) { // change leader
        selectedRoom.changeCreator();
      }

      refreshAll(selectedRoom.allPlayers);
      res.json("removed");
    })

    app.get("/gameUpdate/:id", (req, res) => {
      // console.log("this was pinged!!!!")
      const roomId  = parseInt(req.params.id);
      const selectedRoom = rooms.find(item => item.id == roomId);
      res.send({room: selectedRoom});
    })

    app.post("/gameUpdate/:id", async (req, res) => {
      const roomId  = parseInt(req.params.id);
      const selectedRoom = rooms.find(item => item.id == roomId);
      const ans = req.body.locationInp.toLowerCase();

      const locationInvalid = true; 
      try {
        const response = await axios.post(`http://localhost:3080/location/${ans}`,);
        console.log(response.data);
      } catch (err) {
        console.log(err.message);
      }
      // // name invalid, starting char invalid
      // locationInvalid = (response.error == undefined) || ans[0] == selectedRoom.currWord[selectedRoom.currWord.length - 1];
      // if (locationInvalid || ans == "pass") {
      //   // TODO send a message
      //   selectedRoom.reduceCurrLive();
      // } else if (ans == "quit") {
      //   selectedRoom.livePlayers.splice(selectedRoom.currPlayer, 1);
      //   selectedRoom.currPlayer = selectedRoom.currPlayer - 1;
      //   selectedRoom.getNextPlayer();
      //   // TODO check if only 1 player is left or not
      // } else if (req.body.sender == selectedRoom.livePlayers[selectedRoom.currPlayer].ip) {
      //     let placeUnused = selectedRoom.updateGame(ans);
      //     if (!placeUnused) {
      //       // TODO send message
      //       selectedRoom.reduceCurrLive()
      //     }
      //   // TODO: timeup!!
      //   // TODO refresh all
      // }
      refreshAll(selectedRoom.allPlayers);
    })

    app.post("/gameUpdate/hint/:id", async (req, res) => {
      const roomId  = parseInt(req.params.id);
      const selectedRoom = rooms.find(item => item.id == roomId);
      selectedRoom.livePlayers[selectedRoom.currPlayer].hints--;
      selectedRoom.getNextPlayer();
      refreshAll(selectedRoom.allPlayers);
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