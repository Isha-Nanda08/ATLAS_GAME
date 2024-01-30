import express from "express"
import bodyParser from "body-parser"
import axios from "axios"
import { Player, Bot } from "./player";
import Room from "./room";

const port = 3090;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var rooms = []

app.post("/createRoom", (req, res) => {
    const newCreator = new Player(req.body.username)
    const newRoom = new Room(rooms.length, req.body.password, req.body.roomname, newCreator);
    rooms.push(newRoom);
    // go to room admin page!! with player list and option to start room
})

app.get("/joinRoom", (req, res) => {
    // render rooms list with all available rooms
})

app.post("/joinRoom", (req, res) => {
    const roomId = parseInt(req.body.roomid);
    const newPlayer = new Player(req.body.username)
    const selectedRoom = rooms[roomId];
    selectedRoom.addPlayer(newPlayer);
    // go to room admin page
})

app.get("/room/:id", (req, res) => { 
    // player is viewing a room
})

app.listen(port, () => { console.log(`Game running at port: ${port}`) })