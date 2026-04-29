require('dotenv').config();
require('./config/database');
require('./models/signUp');
const express = require('express');
const app = express()
const PORT = process.env.PORT || 4000
const express_session = require('express-session');
const {passport} = require('./middlewares/passport');
const signUpRouter = require('./router/signUp');
const groupRouter = require('./router/group');
const requestRouter = require('./router/request');
const paymentRouter = require('./router/payment');
const orderRouter = require('./router/order');

app.use(express.json())

app.use(express_session({
    secret: 'Thank-God',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/v1',signUpRouter)
app.use('/api/v1/group',groupRouter)
app.use('/api/v1/request',requestRouter)
app.use('/api/v1/payment',paymentRouter)
app.use('/api/v1/order',orderRouter)

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    })
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