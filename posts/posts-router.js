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

router.get('/:id', (req, res) => {
    const id = req.params.id;

    Posts.findById(id)
        .then(post => {
            if (post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be retrieved." });
        })
})

router.post('/', (req, res) => {
    const newPost = req.body;
    if (!newPost.title || !newPost.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        Posts.insert(newPost)
            .then(post => {
                Posts.findById(post.id)
                    .then(post => {
                        res.status(201).json(post)
                    })
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the post to the database" });
            })
    }  
})

module.exports = router;