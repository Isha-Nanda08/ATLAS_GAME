import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import http from 'http';
import os from "os";
import readline from 'readline';
import { Server } from 'socket.io';

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const rl = readline.createInterface({ //interface to read from the terminal
    input: process.stdin,
    output: process.stdout
});

let serverPort = 'http://localhost:3090'; //NOTE: if server port is changed make changes here
let localIp = `http://localhost:${port}`;
let roomId = undefined;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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

function takeInput() {
    rl.question('Enter server socket: ', async (input) => {
        serverPort = input;
        try {
            await axios.get(serverPort + '/hello');
            console.log("connection established");
            rl.close();
        } catch (error) {
            console.error('Error: failed to connect');
            takeInput();
        }
    });
}
app.get("/test", (req,res)=>{
    res.render("winner.ejs");
}
)
app.get("/", async (req, res) => {
    if (roomId !== undefined && roomId !== null) {
        res.redirect("/lobby");
    } else {
        axios.post(serverPort + "/atHome", {
            playerIp: localIp
        }, {
            headers: {'Content-Type': 'application/json'}
        });
        const response = (await axios.get(serverPort + "/roomList")).data.rooms;
        res.render("index.ejs", { rooms : response });
    }
})

app.post("/", async (req, res) => {
    let userName = req.body.userName;
    let roomNo = req.body.roomId;
    let password = req.body.password;

    const response = await axios.post(`${serverPort}/joinRoom`, {
        roomid: roomNo,
        username: userName,
        password: password,
        userIp: localIp
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data.err == null || response.data.err == undefined) {
        roomId = response.data.roomId;
        axios.post(serverPort + "/notAtHome", {
            playerIp: localIp
        }, {
            headers: {'Content-Type': 'application/json'}
        });
        res.redirect(`/lobby`);
    } else {
        const response2 = (await axios.get(serverPort + "/roomList")).data.rooms;
        res.render("index.ejs", { rooms : response2, err: response.data.err });
    }
})

app.get("/lobby", async (req, res) => {
    if (roomId !== undefined && roomId !== null) {
        const response2 = await axios.get(serverPort + "/room/status/" + roomId);
        if (response2.data == true) {
            res.redirect("/game");
        } else {
            const response = await axios.get(`${serverPort}/room`, {
                params: {
                  roomId: roomId
                },
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            const error = req.query.error || "";
            res.render("game-room.ejs", {...response.data, error: error, isCreator: (response.data.creatorIp == localIp)});
        }
    } else {
        res.redirect("/");
    }
})

app.get("/game", async (req, res) => {
    // TODO: check game status also
    if (roomId == undefined || roomId == null) {
        res.redirect('/');
    } else {
        const response = await axios.get(`${serverPort}/gameUpdate/`+roomId);
        const data = response.data.room;
        if (data.status) {
            let turnIp = data.livePlayers[data.currPlayer].ip;
            if (data.livePlayers.length == 1) {
                res.redirect("/winnerPage");
            } else {
                res.render("game-page.ejs", {...data, hasTurn: (turnIp == localIp)});
            }
        } else {
            res.redirect("/lobby")
        }
    }
})

app.post("/game", async (req, res) => {
    if (req.body.action == "submit") {
        axios.post(`${serverPort}/gameUpdate/`+roomId, {
            sender: localIp,
            locationInp: req.body.locationInp,
            action: req.body.action
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        axios.post(`${serverPort}/gameUpdate/hint/`+roomId, {
            params: {
              sender: localIp,
            },
            headers: {
              'Content-Type': 'application/json'
            }
        });
    }
})

app.get("/createRoom", (req, res) => {
    // TODO: send notAtHomePg req
    res.render("create-room.ejs")
})

app.post("/createRoom", async (req, res) => {
    let userName = req.body.username;
    let roomName = req.body.roomname;
    let password = req.body.password;
    let botEnable = req.body.enableBot == "on" ? true : false ; 
    let botDifficulty = req.body.botdifficulty || 0;

    const response = await axios.post(`${serverPort}/createRoom`, {
        roomName:  roomName,
        password: password,
        userName: userName,
        botEnable: botEnable,
        botDifficulty: botDifficulty,
        userIp: localIp
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data.roomId == -1) {
        res.render("create-room.ejs", {err: "room-name already in use"})
    } else {
        roomId = response.data.roomId;
        res.redirect(`/lobby`)
    }
})

app.post("/lobby", async (req, res) => {
    const action = req.body.action;
    if (action == 'start') {
        const response = await axios.post(`${serverPort}/startRoom/${roomId}`);
        if (response.data == false) {
            res.redirect("/lobby?error=insufficient%20players");
        } else {
            res.redirect('/game');
        }
    } else {
        axios.post(`${serverPort}/leaveRoom`, {
            roomId: roomId,
            playerIp: localIp
        }, {
            headers: { 'Content-Type': 'application/json' }
        })
        roomId = undefined;
        res.redirect("/");
    }
})

app.post('/refresh', (req, res) => {
    io.emit('update', "dataUpdate")
    res.json("accepted");
})

server.listen(port, async () => { 
    localIp = await getLocalIpAddress();
    localIp = `http://${localIp}:${port}`
    console.log(`Game running at: http://localhost:${port}  or ${localIp}`);
    takeInput();
})
