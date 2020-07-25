const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core")
const fs = require('fs');
const youtube = require('scrape-youtube').default;
const router = require('express').Router();

router.post('/music', (req, res) => {
    res.d
    let messages = [];
    console.log("Got a request")
    console.log("Name : ", req.body.downloadMusicInput);
    if (!req.body.downloadMusicInput) {
        res.render('music', {
            error: 'Please enter a valid youtube URL'
        });
    }
    downloadMusic(req, res)
})

router.post('/video', (req, res) => {
    res.d
    let messages = [];
    console.log("Got a request")
    console.log("Name : ", req.body.downloadVideoInput);
    if (!req.body.downloadVideoInput) {
        res.render('video', {
            error: 'Please enter a valid youtube URL'
        });
    }
    downloadVideo(req, res)
})

module.exports = router;

//Music Download function
async function downloadMusic(req, res) {
    const url = req.body.downloadMusicInput;
    if (ytdl.validateURL(url)) {
        const videoInfo = await ytdl.getInfo(url);
        const video = {
            title: videoInfo.title,
            url: videoInfo.video_url
        };
        var stream = ytdl(video.url);
        var str = video.title;
        var name = str.replace(/[^a-zA-Z ]/g, "");
        var saveLocation = name + ' audio.mp3';

        var proc = new ffmpeg({
            source: stream
        })
            .withAudioCodec('libmp3lame')
            .toFormat('mp3')
            .on('end', function () {
                console.log('file has been converted succesfully');
                res.download(saveLocation, function (err) {
                    if (err) {
                        console.log(err)
                        return
                    }
                    //Deleting File after sending it to the user
                    fs.unlink(saveLocation, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        console.log("File Deleted!")
                    });
                });
            })
            .on('error', function (err, stdout, stderr) {
                console.log('Error in proc: ' + err.message);
            })
            .saveToFile(saveLocation);
    }
    else {
        res.render('music', {
            error: 'Please enter a valid youtube URL'

        });
    }


    // old search method Might work on it later
    // const name = req.body.downloadMusicInput + " audio";
    // var saveLocation = name + '-byApollo.mp3';
    // console.log("Name in download function : ", name);
    // youtube.searchOne(name).then(result => {
    //     const link = result.link
    //     console.log("Got link: " + link);
    //     var stream = ytdl(link);
    //     var proc = new ffmpeg({
    //             source: stream
    //         })
    //         .withAudioCodec('libmp3lame')
    //         .toFormat('mp3')
    //         .on('end', function() {
    //             console.log('file has been converted succesfully');
    //             res.download(saveLocation, function(err) {
    //                 if (err) {
    //                     console.log(err)
    //                     return
    //                 }
    //                 //Deleting File after sending it to the user
    //                 fs.unlink(saveLocation, (err) => {
    //                     if (err) {
    //                         console.error(err)
    //                         return
    //                     }
    //                     console.log("File Deleted!")
    //                 });
    //             });
    //         })
    //         .on('error', function(err, stdout, stderr) {
    //             console.log('Error in proc: ' + err.message);
    //         })
    //         .saveToFile(saveLocation);
    // }).catch(error => {
    //     console.log('Error in search : ' + error.message);
    // })
}

async function downloadVideo(req, res) {
    const url = req.body.downloadVideoInput;
    if (ytdl.validateURL(url)) {
        const videoInfo = await ytdl.getInfo(url);
        const video = {
            title: videoInfo.title,
            url: videoInfo.video_url
        };
        var saveLocation = video.title + '.mp4';
        res.header('Content-Disposition', `attachment; filename= ${saveLocation}`);
        ytdl(url, {
            format: 'mp4'
        }).pipe(res);
    } else {
        res.render('video', {
            error: 'Please enter a valid youtube URL'

        });
    }
}