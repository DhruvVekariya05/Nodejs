require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const dotenv = require('dotenv');
const chalk = require('chalk');
const authRoutes = require('./routes/auth');
const logger = require('./middleware/logger');
const { MongoClient } = require('mongodb');


const app = express();

let db;


MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(process.env.DB_NAME);

        app.locals.db = db;
    })
    .catch(error => console.error('MongoDB connection error:', error));


app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(logger);
app.use('/auth', authRoutes);

app.get('/dashboard', (req, res) => {
    if (req.session.token) {
        res.render('dashboard', { username: req.session.username });
    } else {
        res.redirect('/auth/login');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(chalk.green(`Server running on port ${PORT}`));
});
