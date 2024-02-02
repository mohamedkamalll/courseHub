const {Router} = require('express');
const user = require('../controllers/userController');
const isLoggedIn = require('../middleware/isLoggedIn');

const router = Router()

router.get('/updatePassword',isLoggedIn,user.updatePassword)
router.get('/forgetPassword',isLoggedIn,user.forgetPassword)

module.exports = router