const {Router} = require('express');
const parent = require('../controllers/parentController')

const router = Router()


/* {
    "parentEmail" : "momoooi4111iq166o@gmail.com",
    "parentFirstName" : "taherrrr",
    "parentLastName" : "ahmeddd",
    "parentPhone" : "01234516488",
    "parentCity" : "cairo",
    "parentPassword" : "351518hdsjgghjb",
    "fatherName" : "taherrrr",
    "students" :[ {"name": "ramaaa", "age": 8},{"name" : "tamerrrr" , "age" : 9}]
    } */
router.post('/addParent',parent.addParent)

module.exports = router