const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('../config/database');  // Ensure correct path

const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcrypt');


exports.startGithubOAuth = (req, res) => {
    const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`;
    res.redirect(githubAuthURL);
};

exports.handleGithubCallback = async (req, res, next) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'GitHub authorization code is required.' });
    }

    try {
        const response = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const accessToken = response.data.access_token;
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${accessToken}`
            }
        });

        const githubUser = userResponse.data;

        // Check and handle if email is missing
        let email = githubUser.email || "default@example.com";

        // Splitting name for firstname and lastname
        let names = (githubUser.name || "Default Name").split(' ');
        let firstname = names.slice(0, -1).join(' ') || "Default";
        let lastname = names.slice(-1).join(' ') || "Name";

        // Placeholder password for GitHub OAuth users
        const placeholderPassword = await bcrypt.hash("github_oauth_user", 10);

        const result = await pool.query('SELECT * FROM users WHERE githubid = $1', [githubUser.id]);
        let user = result.rows[0];

        if (!user) {
            const insertResult = await pool.query(
                'INSERT INTO users (firstname, lastname, email, githubId, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [firstname, lastname, email, githubUser.id, placeholderPassword]
            );
            user = insertResult.rows[0];
        }

        // ... Rest of your code ...

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Assuming users table has a refreshToken column
        await pool.query('UPDATE users SET refreshToken = $1 WHERE id = $2', [refreshToken, user.id]);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.redirect(`/dashboard?token=${token}`);

    } catch (error) {
        console.error("Error in GitHub OAuth process", error);
        next(error);
    }
};




// Passport Google Strategy Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    const newUser = {
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        refreshToken: refreshToken // Store the refreshToken
    };

    try {
        const res = await pool.query('SELECT * FROM users WHERE googleId = $1', [profile.id]);
        let user = res.rows[0];

        if (user) {
            // If user exists, update refreshToken
            await pool.query('UPDATE users SET refreshToken = $1 WHERE id = $2', [refreshToken, user.id]);
            done(null, user);
        } else {
            const result = await pool.query('INSERT INTO users (googleId, username, email, refreshToken) VALUES ($1, $2, $3, $4) RETURNING *', [newUser.googleId, newUser.username, newUser.email, newUser.refreshToken]);
            user = result.rows[0];
            done(null, user);
        }
    } catch (err) {
        console.error(err);
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = res.rows[0];
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

exports.authenticateGoogle = passport.authenticate('google', {
    scope: ['profile', 'email']
});

exports.googleCallback = passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
});
