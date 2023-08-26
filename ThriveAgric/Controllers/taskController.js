const pool = require('../Config/database');

exports.getTasks = async (req, res) => {
    const userId = req.user && req.user.id;
    if (!userId) {
       return res.status(400).send({ message: 'User ID not found' });
    }

    try {
        const result = await pool.query('SELECT * FROM tasks WHERE userId = $1', [userId]);
        const tasks = result.rows;
        res.status(200).send(tasks);
    } catch (error) {
        console.error(error); 
        res.status(500).send({ message: 'Error fetching tasks' });
    }
};

exports.addTask = async (req, res) => {
    const userId = req.user && req.user.id;
    if (!userId) {
       return res.status(400).send({ message: 'User ID not found' });
    }
 
    try {
        const { title, description } = req.body;
        const result = await pool.query('INSERT INTO tasks (title, description, userId) VALUES ($1, $2, $3) RETURNING *', [title, description, userId]);
        const task = result.rows[0]; 
        res.status(201).send(task);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error adding task' });
    }
};
