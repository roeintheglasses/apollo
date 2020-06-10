//imports
const express = require("express");
const path = require("path");
const expressLayouts = require('express-ejs-layouts');

//Path and Env variables Setup
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const bulmaPath = path.join(__dirname, "../node_modules/bulma/css/");
const alertsPath = path.join(__dirname, "../node_modules/alerts-css/assets/");

//Setting express routes
const indexRoute = require('../routes/indexRoute');
const downloadRoute = require('../routes/downloadRoute');

//Express consts
const app = express();

// Express & ejs Setup
app.use(express.static(publicDirectoryPath));
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({
    extended: false
}));

//Routes
app.use('/', indexRoute);
app.use('/download', downloadRoute);
app.use('/bulma', express.static(bulmaPath));
app.use("/alerts", express.static(alertsPath));
app.get('*', (req, res) => {
    res.render('404')
})

//Server start
app.listen(port, console.log("Server running at port " + port));