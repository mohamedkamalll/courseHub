const user = require('./userController')
const { poolPromise } = require('../config/db')

module.exports.addInstructor = async (req,res)=>{
    const {FirstName ,LastName ,Age ,Email ,Password ,City ,Role } = req.body;
    try {
        const userId = await user.createUser({FirstName ,LastName ,Age ,Email ,Password ,City ,Role:"instructor"},req) 
        console.log("Done",userId)
        if(userId){
             query = `INSERT INTO instructors (userId) VALUES ('${userId}');`
             const pool = await poolPromise
             await pool.request().query(query)
            }
       
    } catch (error) {
        console.log(error.message)
    } 
}

