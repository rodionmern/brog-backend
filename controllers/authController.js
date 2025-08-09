const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret-jwt';
const EXPIRES_IN = '3h';

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const userExists = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (userExists) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // const salt = bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, 10)

        console.log('Регистрируем:', username, 'hash:', passwordHash);

        const stmt = db.prepare(`
            INSERT INTO users (username, passwordHash) 
            VALUES (?, ?)`);
        
        const result = stmt.run(username, passwordHash)

        const useri = db.prepare(`SELECT id FROM users WHERE username = ?`).get(username);
        
        if (!useri) {
            console.error('Пользователь не добавился в базу');
            return res.status(500).json({ error: 'Database error' });
        }

        res.status(201).json({ 
            id: result.lastInsertRowid,
            message: 'User succesfully registered' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' })
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = db.prepare(`
            SELECT id, username, passwordHash
            FROM users
            WHERE username = ?`).get(username);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: EXPIRES_IN }
        );

        res.status(200).json({
            token,
            userId: user.id,
            username: user.username,
            expiresIn: EXPIRES_IN
        });
    } catch (err) {
        res.status(500).json({ error: err.message })
        console.log(err.message)
    }
}