const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to the request object
        req.user = { userId: decoded.userId, role: decoded.role };
        next();

    } catch (err) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;
