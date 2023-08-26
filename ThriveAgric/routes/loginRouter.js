const express = require('express');
const router = express.Router();
const { login } = require('../Controllers/loginController');

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Authenticate a user and return a token upon successful authentication
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email of the user to login
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *       400:
 *         description: Authentication failed
 */
router.post('/', login);

module.exports = router;
