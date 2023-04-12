const express = require('express');

const router = express.Router();

const Song = require("../models/songsModel");
const {application} = require("express");



// router.all('*', function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'application/json');
//     next();
// });

router.use(function (req, res, next){
    if (req.accepts('json')) {
        next();
    } else {
        res.status(400).send();
    }
});
//random shit plz god help
router.get("/", async (req, res) => {
    let limit = null
    let start = 1
    if(req.query.limit !== undefined) {
        limit = parseInt(req.query.limit);
    }
    if(req.query.start !== undefined) {
        start = parseInt(req.query.start);
    }

    let totalItems = await Song.find().count();

    if (limit === null) {
        limit = totalItems
    }

    let people = await Song.find()
        .limit(limit)
        .skip((start - 1) * limit)
        .exec();

    // let totalItems = allPeople;
    let totalPages = Math.ceil((totalItems / limit));
    console.log(`limit: ${limit}, start: ${start}, totalPages: ${totalPages}, totalItems: ${totalItems}`);

    if (people.length < 1) {
        res.status(500).send();
    } else {

        let songColletion = {
            items: people,

            _links: {
                self: {
                    href: `${process.env.BASE_URI}songs/`
                },
                collection: {
                    href: `${process.env.BASE_URI}songs/`
                }
            },

            pagination: {
                "currentPage": start,
                "currentItems": limit,
                "totalPages": totalPages,
                "totalItems": totalItems,
                "_links": {
                    "first": {
                        "page": 1,
                        "href": `${process.env.BASE_URI}songs/?start=1&limit=${limit}`
                    },

                    "last": {
                        "page": totalPages,
                        "href": `${process.env.BASE_URI}songs/?start=${totalPages}&limit=${limit}`
                    },
                    "previous": {
                        "page": start - 1,
                        "href": `${process.env.BASE_URI}songs/?start=${start - 1}&limit=${limit}`
                    },
                    "next": {
                        "page": start + 1,
                        "href": `${process.env.BASE_URI}songs/?start=${start + 1}&limit=${limit}`
                    }
                }
            }

        }

        res.json(songColletion);
    }
});

router.get('/:id', async (req, res) => {
    console.log("GET");

    try {
        let song = await Song.findById(req.params.id);
        if (song == null) {
            res.status(404).send();
        } else {
            res.json(song);
        }

    } catch {
        res.status(404).send();
    }

})
//create form
router.get("/create", (req, res) => {
    res.send('TODO: create form');
});


// middleware checkt header content type
router.post("/", (req, res, next) => {
    //Check if request is either form data or json
    if (req.header('Content-Type') !== 'application/x-www-form-urlencoded' && req.header('Content-Type') !== 'application/json') {
        res.status(415).send();
    } else {
        next();
    }
});

// middleware to dissallow empty values
router.post('/', (req, res, next) => {
    console.log("POST middleware check empty values")

    if (req.body.title && req.body.artist && req.body.genre){
        next();
    }else {
        res.status(400).send();
    }
});

router.post('/', async (req, res) => {
    let song = new Song ({
        title: req.body.title,
        artist: req.body.artist,
        genre: req.body.genre
    })

    try {
        await song.save();
        res.status(201).send();
    } catch {
        res.status(500).send()
    }
});

router.delete("/:id/", async (req, res) => {
    try {
        await Song.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch {
        res.status(404).send();
    }
});

router.get("/:id/change", async (req, res) => {
    console.log('change');
    res.json(`Changing thing with id: ${req.params.id}`);
});

router.put("/:id/", (req, res, next) => {
    //Check if request is either form data or json
    if (req.header('Content-Type') !== 'application/x-www-form-urlencoded' && req.header('Content-Type') !== 'application/json') {
        res.status(415).send();
    } else {
        next();
    }
});

router.put("/:id/", (req, res, next) => {
    console.log(req.body.title, req.body.artist, req.body.genre);
    if (req.body.title && req.body.artist && req.body.genre) {
        next();
    } else {
        res.status(400).send();
    }
});

router.put('/:id/', async (req, res) => {
    try {
        await Song.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            artist: req.body.artist,
            genre: req.body.genre
        })
        res.status(200).send();
    } catch {
        res.status(500).send();
    }

});

router.options("/", (req,res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Access-Control-Allow-Origin');
    res.header("Allow", "HEAD,GET,POST,OPTIONS")
    res.send();
});

router.options("/:id", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'HEAD, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Access-Control-Allow-Origin');
    res.header("Allow", "HEAD,GET,POST,OPTIONS")
    res.send();
});

module.exports = router;