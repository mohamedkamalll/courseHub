const {Router} = require('express');
const user = require('../controllers/userController')

const router = Router()

router.post('/updatePassword',user.updatePassword)
router.get('/forgetPassword',user.forgetPassword)

module.exports = router