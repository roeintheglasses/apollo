//imports
const express = require("express");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const Youtube = require("simple-youtube-api");
const ytdl = require("ytdl-core")
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');

//Path and Env variables Setup
const port = process.env.PORT || 3000;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const publicDirectoryPath = path.join(__dirname, "../public");
const bulmaPath = path.join(__dirname, "../node_modules/bulma/css/");
const bulmaModalsPath = path.join(__dirname, "../node_modules/bulma-modal-fx/dist/");

//Express consts
const app = express();

//youtube const
const youtube = new Youtube(youtubeApiKey);

// Express & ejs Setup
app.use(express.static(publicDirectoryPath));
app.use('/bulma', express.static(bulmaPath));
app.use('/bulmaModal', express.static(bulmaModalsPath));
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({
    extended: false
}));


//Routes
app.get("/", (req, res) => {
    res.render("index");
});
app.post('/download', (req, res) => {
    res.d
    let messages = [];
    console.log("Got a request")
    console.log("Name : ", req.body.downloadInput);
    if (!req.body.downloadInput) {
        return res.send({
            error: 'You must provide a name'
        })
    }
    download(req, res)
})
app.get('*', (req, res) => {
    res.render('404')
})

//Download function
function download(req, res) {
    const name = req.body.downloadInput + " audio";
    var saveLocation = name + '-byApollo.mp3';
    console.log("Name in download function : ", name);
    youtube.search(name, limit = 1).then(async(results) => {
        const link = results[0].url
        console.log("Got link: " + link);
        var stream = ytdl(link);
        var proc = new ffmpeg({
                source: stream
            })
            .withAudioCodec('libmp3lame')
            .toFormat('mp3')
            .on('end', function() {
                console.log('file has been converted succesfully');
                res.download(saveLocation, function(err) {
                    if (err) {
                        console.error(err)
                        return
                    }
                    fs.unlink(saveLocation, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        console.log("File Deleted!")
                            //file removed
                    });
                });
            })
            .on('error', function(err, stdout, stderr) {
                console.log('an error happened: ' + err.message);
            })
            .saveToFile(saveLocation);
    })
    return saveLocation;
}


//Server start
app.listen(port, console.log("Server running at port " + port));