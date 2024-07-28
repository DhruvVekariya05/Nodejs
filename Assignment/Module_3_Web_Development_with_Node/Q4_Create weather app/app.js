require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('public'));


app.use(express.json())


app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'));


// Go to Weather Page And Featch details
app.get('/weather', async (req, res) => {
    res.render('weather' );
});


// server start
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
