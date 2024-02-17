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
let serverPort;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const response = await (await axios.get(serverPort + "/roomList")).data.rooms;
    res.render("index.ejs", { rooms : response });
})

app.get("/lobby", (req, res) => {
    res.render("game-room.ejs")
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

    await axios.post(`${serverPort}/createRoom`, {
        roomName:  roomName,
        password: password,
        userName: userName
    });
})

app.listen(port, () => { 
    console.log(`Game running at port: ${port}`);
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
