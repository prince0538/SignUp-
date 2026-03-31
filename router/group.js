const router = require('express').Router();
const { createGroup } = require('../controller/group');
const { authentication } = require('../middlewares/auth');

router.post('/create-group', authentication, createGroup);

module.exports = router;