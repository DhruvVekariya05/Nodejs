const express = require('express');
const axios = require('axios');
const hbs = require('hbs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App'
    });
});

app.get('/api/countries', async (req, res) => {
    try {
        const response = await axios.get('https://api.example.com/countries');
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.get('/api/states/:country', async (req, res) => {
    try {
        const response = await axios.get(`https://api.example.com/states/${req.params.country}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.get('/api/cities/:state', async (req, res) => {
    try {
        const response = await axios.get(`https://api.example.com/cities/${req.params.state}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.get('/api/weather/:city', async (req, res) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=YOUR_API_KEY`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
