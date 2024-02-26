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

var rooms = [];

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

    app.post("/createRoom", (req, res) => {
      const newCreator = new Player(req.body.userName, req.body.userIp);
      const roomName = req.body.roomName;
      const newRoom = new Room(rooms.length, req.body.password, roomName, newCreator);

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
        // go to room admin page!! with player list and option to start room
        res.send({roomId: newRoom.id, userId: newCreator.id});
        
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

      const selectedRoom = rooms[roomId];
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

    app.get("/room/:id", (req, res) => {
      const roomId = req.params.id;
      const room = rooms[roomId];

      const roomName = room.name;
      const creator = room.creator.name;
      const players = room.allPlayers.slice(1).map(player => player.name);
      res.json({
        roomName: roomName,
        creator: creator,
        players: players
      });
    });

    app.listen(port, () => {
      console.log(`Game server running at http://${localIp}:${port}`);
    });
  } catch (error) {
    console.error('Error getting local IP address:', error);
  }
}

startServer();
