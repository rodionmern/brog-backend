const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret-jwt';

exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) return res.status(401).json({ error: 'Access denied. No token' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' })
    }
}