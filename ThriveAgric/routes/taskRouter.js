const express = require('express');
const router = express.Router();
const { getTasks, addTask } = require('../Controllers/taskController');

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     description: Fetch all tasks for the authenticated user
 *     responses:
 *       200:
 *         description: Successfully retrieved list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/tasks', getTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     description: Add a new task for the authenticated user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Successfully added a new task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/tasks', addTask);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task (optional)
 */
