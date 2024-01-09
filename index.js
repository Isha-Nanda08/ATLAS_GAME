import express from "express"
import bodyParser from "body-parser"
import axios from "axios"
import pg from "pg"

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs")
})


app.listen(port, () => { console.log(`Game running at port: ${port}`) })