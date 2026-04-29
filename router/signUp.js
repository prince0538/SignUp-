const router = require('express').Router();
const { signUp,  verifyEmail, login, forgetPassword, resetPassword, changePassword, loginWithGoogle, getAllUser, deleteUser } = require('../controller/signUp');
const { upload } = require('../middlewares/multer');
const { signUpVaidator } = require('../middlewares/validator');
const { authentication } = require('../middlewares/auth');

router.post('/signUp', upload.single('profilePicture'), signUpVaidator, signUp);
// router.put('/updatesignUp/:id', upload.single('profilePicture'), updatesignUp)
router.post('/verifyEmail', verifyEmail);
router.post('/login', login);
router.post('/forget-Password', forgetPassword);
router.post('/reset-Password', resetPassword);
router.post('/change-password', authentication, changePassword);

router.post('/login-with-google', loginWithGoogle);
router.get('/all-users', authentication, getAllUser);
router.delete('/delete-user/:id', authentication, deleteUser);

module.exports = router