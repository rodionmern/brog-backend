// const Database = require('better-sqlite3');
const { db } = require('../config/db');

exports.createPost = (req, res) => {
    const {title, content} = req.body;

    try {
        const stmt = db.prepare(`
            INSERT INTO posts (title, content) 
            VALUES (?, ?)`);
        const result = stmt.run(title, content)
        res.status(201).json({ id: result.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ error: err.message })
        console.log(err.message)
    }
}

exports.deletePost = (req, res) => {
    try {
        const postId = req.params.id;

        const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId);

        if (!post) return res.status(404).json({error: 'Post not found'});
            
        db.prepare('DELETE FROM posts WHERE id = ?').run(postId);

        res.json({message: 'Post deleted'});
    } catch (err) {
        console.error('Error of delete: ', err)
        res.json({error: 'Server error'})
    }
}

exports.getAllPosts = (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM posts');
        const posts = stmt.all();

        res.status(200).json(posts);
        console.log(posts)
    } catch (err) {
        res.status(500).json({ error: err.message })
        console.log(err.message)
    }
}

exports.getPostById = (req, res) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
        const post = stmt.get(Number(id));

        if (!post) {
            return res.status(404).json({ error: 'Post not found' })
        }

        res.status(200).json(post);
        console.log(post)
    } catch (err) {
        res.status(500).json({ error: err.message })
        console.log(err.message)
    }
}