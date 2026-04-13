const router = require('express').Router();
const { createGroup, getAll, getOneGroup } = require('../controller/group');
const { authentication } = require('../middlewares/auth');

router.post('/create-group', authentication, createGroup);
router.get('/all-groups', authentication, getAll);
router.get('/group/:id', authentication, getOneGroup);

module.exports = router;