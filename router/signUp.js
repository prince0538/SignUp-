const router = require('express').Router();
const { signUp,  verifyEmail, login} = require('../controller/signUp');
const { upload } = require('../middlewares/multer');

router.post('/signUp', upload.single('profilePicture'), signUp);
// router.put('/updatesignUp/:id', upload.single('profilePicture'), updatesignUp)
router.post('/verifyEmail', verifyEmail)
router.post('/login', login)

module.exports = router;    