const express = require('express');
const router = express.Router();
const oauthController = require('../Controllers/OauthController');

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags:
 *       - OAuth Authentication
 *     description: Start Google OAuth2.0 authentication process
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth2.0 consent screen
 */
router.get('/google', oauthController.authenticateGoogle);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags:
 *       - OAuth Authentication
 *     description: Handle callback from Google OAuth2.0 consent screen
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       400:
 *         description: Authentication failed
 */
router.get('/google/callback', oauthController.googleCallback);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     tags:
 *       - OAuth Authentication
 *     description: Start Github OAuth authentication process
 *     responses:
 *       302:
 *         description: Redirect to Github OAuth consent screen
 */
router.get('/github', oauthController.startGithubOAuth);

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     tags:
 *       - OAuth Authentication
 *     description: Handle callback from Github OAuth consent screen
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       400:
 *         description: Authentication failed
 */
router.get('/github/callback', oauthController.handleGithubCallback);

module.exports = router;
