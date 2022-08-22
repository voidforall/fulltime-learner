const express = require("express")
const app = express()
const port = 3000

// invoked once got a new request
// app.use(() => {
//     console.log("Got a new request!")
// })

// routing
app.get('/', (req, res) => {
    res.send("This is the homepage.")
})

app.get('/cat', (req, res) => {
    res.send("Meowuuu~")
})

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    res.send(`<h1> Welcome to Subreddit ${subreddit} </h1>`)
})

// query strings
app.get('/search', (req, res) => {
    const { q } = req.query;
    res.send(`<h1> Search results for: ${q} </h1>`)
})

app.get('*', (req, res) => {
    res.send("Unknown path :(")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})