import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { Player, Bot } from "./player.js";
import Room from "./room.js";
import os from "os";

// refresh home page when on home screen - add new room

const port = 3090;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var rooms = [];
var newRoomId = 0;
var homePagePlayers = []

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
  playerList.forEach((player) => {
    axios.post(`${player.ip}/refresh`)
  })
}

async function startServer() {
  try {
    const localIp = await getLocalIpAddress();

    app.get("/hello", (req, res) => {
      res.send("yes");
    });

    app.get("/roomList", (req, res) => {
      res.send({rooms: rooms});
    })
    
    app.post("/atHome", (req, res) => {
      const ip = req.body.playerIp
      homePagePlayers = homePagePlayers.filter(item => item.ip !== ip);
      homePagePlayers.push({ip: ip});
      res.send("ok");
    })

    app.post("/notAtHome", (req, res) => {
      homePagePlayers = homePagePlayers.filter(item => item.ip !== req.body.playerIp);
      res.send("ok");
    })

    app.get("/createRoom", (req, res) => {
      const newCreator = new Player(req.body.userName, req.body.userIp);
      const roomName = req.body.roomName;
      const newRoom = new Room(newRoomId++, req.body.password, roomName, newCreator);

      let isMatch = false; // check if room name exists
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].name == roomName) {
          isMatch = true;
          break;
        }
      }

      if (isMatch) {
        res.send({roomId: -1});
      } else {
        rooms.push(newRoom);
        homePagePlayers = homePagePlayers.filter(item => item.ip !== ip);
        refreshAll(homePagePlayers);
        res.send({roomId: newRoom.id});        
      }
    });

    // app.get("/joinRoom", (req, res) => {
    //   // render rooms list with all available rooms
    //   res.json({ hello: "accepted" });
    // });

    app.post("/joinRoom", (req, res) => {
      const roomId = parseInt(req.body.roomid);
      const newPlayer = new Player(req.body.username, req.body.userIp);
      const password = req.body.password;

      const selectedRoom = rooms.find(item => item.id === roomId);
      if (selectedRoom != undefined && selectedRoom != null) {
        if (selectedRoom.password == password) {
          selectedRoom.addPlayer(newPlayer);
          res.json({roomId: selectedRoom.id, userId: newPlayer.id});
          refreshAll(selectedRoom.allPlayers)
        } else {
          res.json({ err: "incorrect password" });
        }
      } else {
        res.json({ err: "room not selected" });
      }
    });

    app.get("/room", (req, res) => {
      const roomId = req.body.roomId;
      // const userIp = req.body.userIp;
      // let newId;
      const room = rooms.find(item => item.id === roomId);

      // for (let i=0; i<room.allPlayers.length; i++) {
      //   if (room.allPlayers[i].ip == userIp) {
      //     newId = i;
      //   }
      // }

      const roomName = room.name;
      const creator = room.creator.name;
      const players = room.allPlayers.slice(1).map(player => player.name);
      res.json({
        roomName: roomName,
        creator: creator,
        players: players,
        // userId: newId
      });
    });

    app.post("/leaveRoom", (req, res) => {
      const room = rooms[parseInt(req.body.roomId)];
      room.allPlayers.splice(parseInt(req.body.userId), 1); // remove the player
      refreshAll(room.allPlayers);
      res.json("removed")
    })

    app.listen(port, () => {
      console.log(`Game server running at http://${localIp}:${port}`);
    });
  } catch (error) {
    console.error('Error getting local IP address:', error);
  }
}

startServer();
