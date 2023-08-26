const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1] || (req.cookies && req.cookies.jwt);


    // If there's no token, the user is not authenticated.
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    // Verify the JWT token.
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        req.user = decoded;  // Store the decoded payload to request object.
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = isAuthenticated;
