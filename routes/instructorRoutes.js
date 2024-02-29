const {Router} = require('express')
const Instructor = require('../controllers/instructorController')
const user = require('../controllers/userController')
const router = Router()

router.post('/addInstructor',Instructor.addInstructor)
router.post('/activateUser',user.activateUser)
module.exports = router;

/*
{
    "FirstName" : "Mohamed",
    "LastName" : "Kamal",
    "Age" : 23,
    "Email" : "mohamedkamal@gmail.com",
    "Password" : "000000", 
    "City" : "Cairo"
} */