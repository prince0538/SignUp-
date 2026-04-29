const router = require('express').Router()

const { createOrder, getAllOrders } = require('../controller/order')
const { authentication } = require('../middlewares/auth');

router.post('/', authentication, createOrder)
router.get('/',authentication, getAllOrders)

module.exports = router