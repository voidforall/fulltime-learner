const express = require('express');
const app = express();
const path = require('path');
const redditData = require('./data.json')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1
    res.render('random', { num })
})

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params
    const data = redditData[subreddit]
    res.render('subreddit', { ...data })
})

app.get('/cats', (req, res) => {
    const cats = [
        'Blue', 'Cute', 'Kitty', 'Vivian'
    ]
    res.render('cats', { cats })
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})