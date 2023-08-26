const express = require('express');
const { registerUser } = require('../Controllers/registerController');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const validate = (method) => {
  switch (method) {
    case 'registerUser': {
      return [
        body('firstName', 'First name is required').exists().notEmpty(),
        body('lastName', 'Last name is required').exists().notEmpty(),
        body('email', 'Email is required').exists().notEmpty(),
        body('password', 'Password is required').exists().notEmpty(),
      ];
    }
  }
}

/**
 * @swagger
 * /:
 *   post:
 *     tags:
 *       - User Registration
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user
 *               lastName:
 *                 type: string
 *                 description: The last name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the user
 *     responses:
 *       200:
 *         description: Successfully registered the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request (validation error or missing fields)
 *       500:
 *         description: Server error
 */
router.post('/', validate('registerUser'), registerUser);

module.exports = router;
