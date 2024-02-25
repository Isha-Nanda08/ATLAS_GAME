import bodyParser from "body-parser";
import express from "express";
import readline from 'readline';
import axios from "axios";

const port = 3000;
const app = express();
const rl = readline.createInterface({ //interface to read from the terminal
    input: process.stdin,
    output: process.stdout
});
let serverPort = 'http://localhost:3090'; //NOTE: if server port is changed make changes here
let userId, roomId;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    if (userId !== undefined && userId !== null && roomId !== undefined && roomId !== null) {
        res.redirect("/lobby")
    } else {
        const response = await (await axios.get(serverPort + "/roomList")).data.rooms;
        res.render("index.ejs", { rooms : response });
    }
})

app.get("/lobby", async (req, res) => {
    if (userId !== undefined && userId !== null && roomId !== undefined && roomId !== null) {
        const response = await axios.get(`${serverPort}/room/${roomId}`);
        res.render("game-room.ejs", response.data);
    } else {
        res.redirect("/");
    }
})

app.get("/game", (req, res) => {
    res.render("game-page.ejs")
})

app.get("/createRoom", (req, res) => {
    res.render("create-room.ejs")
})

app.post("/createRoom", async (req, res) => {
    let userName = req.body.username;
    let roomName = req.body.roomname;
    let password = req.body.password;
    let botEnable = req.body.enableBot;
    let botDifficulty = req.body.botdifficulty;

    const response = await axios.post(`${serverPort}/createRoom`, {
        roomName:  roomName,
        password: password,
        userName: userName,
        botEnable: botEnable,
        botDifficulty: botDifficulty
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data.roomId == -1) {
        res.render("create-room.ejs", {err: "room-name already in use"})
    } else {
        roomId = response.data.roomId;
        userId = response.data.userId;
        // console.log(`roomID: ${roomId}, playerID: ${userId}`)
        res.redirect(`/lobby`)
    }
})

app.post("/", async (req, res) => {
    let userName = req.body.userName;
    let roomNo = req.body.roomId;
    let password = req.body.password;

    console.log(userName+" "+password+" "+roomNo);

    const response = await axios.post(`${serverPort}/joinRoom`, {
        roomid: roomNo,
        username: userName,
        password: password,
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data.err == null || response.data.err == undefined) {
        roomId = response.data.roomId;
        userId = response.data.userId;
        console.log(`roomID: ${roomId}, playerID: ${userId}`)
        res.redirect(`/lobby`)
    } else {
        const response2 = await (await axios.get(serverPort + "/roomList")).data.rooms;
        res.render("index.ejs", { rooms : response2, err: response.data.err });
    }
})

app.listen(port, () => { 
    console.log(`Game running at: http://localhost:${port}`);
    takeInput();    
})

function takeInput() {
    rl.question('Enter server socket: ', async (input) => {
        serverPort = input;

        try {
            const response = await axios.get(serverPort + '/hello');
            console.log("connection established");
            rl.close();
        } catch (error) {
            console.error('Error: failed to connect');
            takeInput();
        }
    });
}
