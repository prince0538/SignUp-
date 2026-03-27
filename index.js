require('dotenv').config();
require('./config/database');
require('./models/signUp');
const express = require('express');
const app = express()
const PORT = process.env.PORT || 4000
const signUpRouter = require('./router/signUp');
app.use(express.json())
app.use(signUpRouter)

app.use('/', (req, res) => {
    res.send('Hello world')
})

app.use((err, req, res, next) => {
    // console.log(err)
    if (err) {
        console.log(err)
        res.status(500).json({
            message: err.meassage
        })
    }
    next()
})

app.listen(PORT, () => {
    console.log(`PORT: ${PORT}`)
})