const express = require('express')
const app = express()
const port = 4747;

app.use(express.static('static'));

app.get('/', (req, res) => {
    res.redirect('/app.html');
})

app.listen(port, () => {
    console.log(`Insfa webserver listening on port ${port}`)
})

