const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        throw new Error('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; 
    
    if (!token) {
        throw new Error('Token not provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return req.user;
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
};

module.exports = authMiddleware;