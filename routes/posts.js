const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/authMiddleware')

const { createPost, deletePost, getAllPosts, getPostById } = require('../controllers/postController')

router.get('/', getAllPosts)
router.get('/:id', getPostById)
router.post('/post', authenticate, createPost)
router.delete('/delete/:id', authenticate, deletePost)

module.exports = router