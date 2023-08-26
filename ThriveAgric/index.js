const express = require('express');
const dotenv = require('dotenv');
const { pool } = require('./Config/database');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const oauthRoutes = require('./routes/OauthRouter');
const taskRoutes = require('./routes/taskRouter');
const isAuthenticated = require('./Middlewares/isAuthenticated');
const verifyJWT = require('./Middlewares/verifyJWT');
dotenv.config();
const app = express();


// Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A simple Express API',
    },
  },
  apis: ['./routes/*.js'], // Point to the files where your API is defined
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



// Middleware
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

// Set up the session middleware
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


// View engine setup
app.set('view engine', 'ejs');

// Database connection check
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connection successful. Server time:', res.rows[0].now);
    }
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/dashboard', isAuthenticated,  async (req, res) => {
    res.render('dashboard');
});

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/auth', oauthRoutes);
app.use(taskRoutes);
app.use(verifyJWT);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
