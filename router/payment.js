const router = require('express').Router();

const { initailizePayment, verifyPayment, getAllPaymentBysignUp } = require('../controller/payment');
const { initailizePaystackPayment, verifyPaystackPayment } = require('../controller/paystack');
const { authentication } = require('../middlewares/auth');

router.post('/:groupId', authentication, initailizePayment);
router.post('/:groupId', authentication, initailizePaystackPayment);
router.get('/', authentication, verifyPayment);
router.get('/', authentication, verifyPaystackPayment);
router.get('/', authentication, getAllPaymentBysignUp);

module.exports = router;