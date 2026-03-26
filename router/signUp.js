const router = require('express').Router();
const { signUp, updatesignUp } = require('../controller/signUp');
const { upload } = require('../middlewares/multer');

router.post('/signUp', upload.single('profilePicture'), signUp);
router.put('/updatesignUp/:id', upload.single('profilePicture'), updatesignUp)

module.exports = router;