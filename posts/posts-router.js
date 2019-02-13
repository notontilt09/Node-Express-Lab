const express = require('express');

const Posts = require('../data/db.js');

const router = express.Router();

// this only runs if the url has /api/posts in it

// GET all posts
router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." });
        })
})

// GET post by specific id parameter
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

// POST a new post to the database
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

// DELETE a post by specific id parameter
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Posts.findById(id)
        .then(post => {
            if (post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                Posts.remove(id)
                    .then(post => {
                        res.status(204).end();
                    })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post could not be removed" });
        })
})

// UPDATE a post by specific id parameter
router.put('/:id', (req, res) => {
    const now = new Date().toISOString();
    const id = req.params.id;
    const updatedPost = req.body;

    if (!updatedPost.title || !updatedPost.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        // Posts.update(id, updatedPost)
        Posts.update(id, {...updatedPost, ['updated_at']: now.split('T').join(' ').slice(0, now.length -5)})
            .then(updated => {
                if (updated) {
                    Posts.findById(id)
                        .then(post => {
                            res.status(200).json(
                                {...post[0],
                                    ['updated_at']: now.split('T').join(' ').slice(0, now.length -5)
                            })
                        })
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." });
                }
            })
            .catch(err => {
                res.status(500).json({ error: "The post information could not be modified." });
            })
    }

})

module.exports = router;