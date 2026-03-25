const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No Identity Token Found' });
    }

    const token = authHeader.split(" ")[1] || authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        console.error('JWT Verification Error:', e.name, e.message);
        
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token Expired' });
        }
        
        res.status(401).json({ message: 'Invalid Token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin Privilege Required' });
    }
};

module.exports = { auth, isAdmin };
