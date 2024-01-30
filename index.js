import bodyParser from "body-parser";
import express from "express";

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs")
})
app.get("/lobby", (req, res) => {
    res.render("game-room.ejs")
})
app.get("/game", (req, res) => {
    res.render("game-page.ejs")
})



app.listen(port, () => { console.log(`Game running at port: ${port}`) })