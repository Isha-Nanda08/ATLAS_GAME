import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import http from 'http';
import os from "os";
import readline from 'readline';
import { Server } from 'socket.io';

const port = 3030;
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
            console.log("connection established\n\n");
            rl.close();
        } catch (error) {
            console.error('Error: failed to connect\n\n');
            takeInput();
        }
    });
}
app.get("/winnerPage", async (req,res) => {
    if (roomId == undefined || roomId == null) {
        console.log("LOG: (at '/winnerpage') room id not defined, redirecting user")
        res.redirect("/")
    } else {
        const response = await axios.get(`${serverPort}/gameUpdate/`+roomId);
        const room = response.data.room;
        if (!room.status || room.livePlayers.length != 1) {
            console.log("LOG: (at '/winnerPage') game not concluded, redirecting")
            res.redirect('/lobby')
        } else {
            const gameWinner = room.livePlayers[0];
            const playerList = room.allPlayers.filter(player => player.ip !== room.creator.ip); 
            res.render("winner.ejs", { creator: room.creator.name, name: room.name, winner: gameWinner.name, players: playerList, isCreator: localIp === room.creator.ip });
        }
    }
})


app.get("/", async (req, res) => {
    if (roomId !== undefined && roomId !== null) {
        console.log(`\nLOG: (at '/') roomId already defined: ${roomId}, redirecting to lobby`)
        res.redirect("/lobby");
    } else {
        console.log(`\nLOG: (at '/') updating server's home page...`)
        axios.post(serverPort + "/atHome", {
            playerIp: localIp
        }, {
            headers: {'Content-Type': 'application/json'}
        });
        const response = (await axios.get(serverPort + "/roomList")).data.rooms;
        console.log(`       ${response.length} rooms found`)
        res.render("index.ejs", { rooms : response });
    }
})

app.post("/", async (req, res) => {
    let userName = req.body.userName;
    let roomNo = req.body.roomId;
    let password = req.body.password;

    console.log(`\nLOG: (at '/') joining room with: [${userName}, ${roomNo}, ${password}] ...`)

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
        console.log(`       no error, roomId: ${roomId}, redirecting to lobby and updating server home page...`)
        axios.post(serverPort + "/notAtHome", {
            playerIp: localIp
        }, {
            headers: {'Content-Type': 'application/json'}
        });
        res.redirect(`/lobby`);
    } else {
        console.log(`       error occured... reopening page with error message: '${response.data.err}'`)
        const response2 = (await axios.get(serverPort + "/roomList")).data.rooms;
        res.render("index.ejs", { rooms : response2, err: response.data.err });
    }
})

app.get("/lobby", async (req, res) => {
    if (roomId !== undefined && roomId !== null) {
        console.log(`\nOG: (at '/lobby') fetching room status...`)
        const response2 = await axios.get(serverPort + "/room/status/" + roomId);
        if (response2.data == true) {
            console.log(`       game already running, redirecting user`)
            res.redirect("/game");
        } else {
            console.log(`       game not running, fetching room data`)
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
        console.log(`\nLOG: (at '/lobby') roomId is undefined, redirecting user...`)
        res.redirect("/");
    }
})

app.get("/game", async (req, res) => {
    if (roomId == undefined || roomId == null) {
        console.log(`\nLOG: (at '/game') roomId not defined, redirecting player`)
        res.redirect('/');
    } else {
        console.log(`\nLOG: (at '/game') requesting updates for roomId: ${roomId}...`)
        const response = await axios.get(`${serverPort}/gameUpdate/`+roomId);
        const data = response.data.room;
        if (data.status) {
            let turnIp = data.livePlayers[data.currPlayer].ip;
            if (data.livePlayers.length == 1) {
                console.log(`       game completed, redirecting user`)
                res.redirect("/winnerPage");
            } else {
                console.log(`       game running, updating user view`)
                res.render("game-page.ejs", {...data, hasTurn: (turnIp == localIp)});
            }
        } else {
            console.log('       game not started, redirecting user')
            res.redirect("/lobby")
        }
    }
})

app.post("/game", async (req, res) => {
    if (req.body.action == "submit") {
        const inp = req.body.locationInp;
        if (inp == null || inp == undefined || inp == '') { // empty input by user
            res.redirect('/game')
        } else {
            console.log(`\nLOG: (at '/game') player clicked submit button, sending ${inp} as input`)
            axios.post(`${serverPort}/gameUpdate/`+roomId, {
                sender: localIp,
                locationInp: inp,
                action: req.body.action
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } else {
        console.log(`\nLOG: (at '/game') player clicked hint, asking for hint`)
        axios.post(`${serverPort}/gameUpdate/hint/`+roomId, {
            params: {
              sender: localIp,
            },
            headers: {
              'Content-Type': 'application/json'
            }
        });
    }
    res.redirect("/game")
})

app.get("/createRoom", (req, res) => {
    // TODO: send notAtHomePg req
    if (roomId == null || roomId == undefined) {
        res.render("create-room.ejs")
    } else {
        console.log(`\nLOG: (at '/createRoom') player already in a room, redirecting`)
        res.redirect("/lobby")
    }
})

app.post("/createRoom", async (req, res) => {
    let userName = req.body.username;
    let roomName = req.body.roomname;
    let password = req.body.password;
    let botEnable = req.body.enableBot == "on" ? true : false ; 
    let botDifficulty = req.body.botdifficulty || 0;

    console.log(`\nLOG: (at '/createRoom') sending request with room: [${roomName}, ${password}, ${userName}], bot: [${botEnable}, ${botDifficulty}] as input...`)

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
        console.log("       room name already exists")
        res.render("create-room.ejs", {err: "room-name already in use"})
    } else {
        roomId = response.data.roomId;
        console.log(`       room accepted, roomId: ${roomId}, redirecting`)
        res.redirect(`/lobby`)
    }
})

app.post("/lobby", async (req, res) => {
    const action = req.body.action;
    if (action == 'start') {
        console.log("\nLog: (at '/lobby') sending game start request...")
        const response = await axios.post(`${serverPort}/startRoom/${roomId}`);
        if (response.data == false) {
            console.log("       failed, Insufficient players")
            res.redirect("/lobby?error=insufficient%20players");
        } else {
            console.log("       success, game started")
            res.redirect('/game');
        }
    } else if (action == 'restart') {
        console.log("\nLog: (from '/winnerPage' at '/lobby') sending game restart request...")
        const response = await axios.post(`${serverPort}/restartRoom/${roomId}`);
        if (response.data == false) {
            console.log("       failed, Insufficient players")
            res.redirect("/winnerPage?error=insufficient%20players");
        } else {
            console.log("       success, game restarted")
            res.redirect('/game');
        }
    } else {
        console.log("LOG: (at '/lobby') requesting to leave game")
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
    console.log("\n-----LOG: update request recieved from server-----\n")
    io.emit('update', "dataUpdate")
    res.json("accepted");
})

server.listen(port, async () => { 
    localIp = await getLocalIpAddress();
    console.log("\n\n======================== WELCOME TO ATLAS GAME!! ========================\n\n")
    localIp = `http://${localIp}:${port}`
    console.log(`Your Game is running at: http://localhost:${port}  or ${localIp}\n`);
    takeInput();
})
