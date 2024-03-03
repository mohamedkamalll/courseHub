const user = require('./userController')
const { poolPromise } = require('../config/db')

module.exports.addInstructor = async (req,res,next)=>{
    const {firstName ,lastName ,birthDate ,email ,password ,city  } = req.body;
    try {
        const userId = await user.createUser({firstName ,lastName ,birthDate ,email ,password ,city ,role:'instructor',activated:0},req) 
        console.log("Done",userId)
        if(userId){
             query = `INSERT INTO instructors (userId) VALUES ('${userId}');`
             const pool = await poolPromise
             await pool.request().query(query)
             return res.status(200).send("Instructor added successfully"); 
            }
    } catch (error) {
        return next(error)
    } 
}

//16754
//4983
