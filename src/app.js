//imports
const express = require("express");
const path = require("path");

//Path and Env variables Setup
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const bulmaPath = path.join(__dirname, "../node_modules/bulma/css/");

//Express and Socket.io consts
const app = express();

// Express & ejs Setup
app.use(express.static(publicDirectoryPath));
app.use('/bulma', express.static(bulmaPath));
app.set("view engine", "ejs");

//Routes
app.get("/", (req, res) => {
    res.render("index");
});

//Server start
app.listen(port, console.log("Server running at port " + port));