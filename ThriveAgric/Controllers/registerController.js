const bcrypt = require('bcrypt');
const { pool }  = require('../Config/database');

exports.registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    let result;
    try {
      result = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
    } catch (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }


    if (result.rows && result.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists!' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    await pool.query('INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4)', [firstName, lastName, email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    next(error);  // Passing the error to express middleware for centralized error handling
  }
};
