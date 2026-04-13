const router = require('express').Router();
const { signUp,  verifyEmail, login, forgetPassword, resetPassword } = require('../controller/signUp');
const { upload } = require('../middlewares/multer');
const { signUpVaidator } = require('../middlewares/validator');

router.post('/signUp', upload.single('profilePicture'), signUpVaidator, signUp);
// router.put('/updatesignUp/:id', upload.single('profilePicture'), updatesignUp)
router.post('/verifyEmail', verifyEmail);
router.post('/login', login);
router.post('/forget-Password', forgetPassword);
router.post('/reset-Password', resetPassword);
module.exports = router