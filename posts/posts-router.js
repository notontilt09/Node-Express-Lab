const express = require('express');

const Posts = require('../data/db.js');

const router = express.Router();

// this only runs if the url has /api/posts in it
router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." });
        })
})

module.exports = router;