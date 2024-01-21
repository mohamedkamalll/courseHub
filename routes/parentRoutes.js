const {Router} = require('express');
const parent = require('../controllers/parentController')

const router = Router()



router.post('/addParent',parent.addParent)

module.exports = router