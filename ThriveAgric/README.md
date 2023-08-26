## HOW TO
Node JS, Express and Postgres SQL server.

### Database Schemas for Users
```sh
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- Assuming roles like 'user', 'admin', etc.
    refreshtoken TEXT, -- This could be stored elsewhere too, depending on the strategy
    githubid VARCHAR(255) UNIQUE,
    username VARCHAR(255) UNIQUE,
    googleid VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Schemas for Tasks
```sh
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    userId INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


```


### Installation
1. Clone the repo
```sh
git clone git@github.com:Newman-Nheeon/NodeJs_PostgresSql_Server.git
```
2. Install NPM packages
```sh
cd ThriveAgric
npm install
```
3. Create a .env file in root directory of project and add following variables to it:
```sh
DB_DATABASE="your database name"
DB_USERNAME="your database username or user"
DB_PASSWORD="password"
DB_HOST="localhost"
DB_PORT = "your database port"

ACCESS_TOKEN_SECRET= "any random token"
REFRESH_TOKEN_SECRET="any random token"

GITHUB_CLIENT_ID="your github client token"
GITHUB_CLIENT_SECRET="your github secret token"
GOOGLE_CLIENT_ID="your github client token"
GOOGLE_CLIENT_SECRET="your github secret token"
```

4. Start Server
```sh
npm start
```
5. Test routes using postman or other API testing tools, test Oauth routes using Frontend code /views/index.ejs.
6. Enjoy :)



## Endpoints:
GET / - index.ejs page - test github Oauth
GET /dashboard - dashboard.js - Authenticated page
POST /register - Register a new user.
POST /login - Login an existing user and return JWT.
GET /auth/github - Start Github OAuth process.
GET /auth/github/callback - Handle Github OAuth callback.
GET /tasks - Get all tasks for a logged-in user.
POST /tasks - Add a new task for a logged-in user.

## Swagger Docs
http://localhost:3000/api-docs/#/


## Issues
### swagger docs not correctly documented
### Google Oauth not correctly functioning as it should, due to time factor in debugging (not returning refresh tokens)

