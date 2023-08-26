const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../Config/database');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password were provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create and sign a JWT token
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

    // Saving refreshToken with current user
    await pool.query('UPDATE users SET refreshToken = $1 WHERE id = $2', [refreshToken, user.id]);

    // Set the refresh token as a cookie
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

    // Return the JWT token to the client
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
