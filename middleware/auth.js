const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Auth Error' });

    try {
        const decoded = jwt.verify(token.split(" ")[1] || token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(500).send({ message: 'Invalid Token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin Access Denied' });
    }
};

module.exports = { auth, isAdmin };
