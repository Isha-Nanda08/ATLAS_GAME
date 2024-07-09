import http from "http";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { Server } from 'socket.io'

const port = 3090;
const app = express();
const server = http.createServer(app)
const io = new Server(server)

// IO ---
io.on('connection', (socket) => {
    console.log(`new user has connected ${socket.id}`)
})

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.listen(port, () => { console.log(`Server started at port: ${port}`) })