const user = require('./userController')
const database = require('../config/databaseConnection');

module.exports.addInstructor = async (req,res)=>{
    const {FirstName ,LastName ,Age ,Email ,Password ,City ,Role } = req.body;
   // console.log(FirstName)
    try {
        const userId = await user.createUser({FirstName ,LastName ,Age ,Email ,Password ,City ,Role:"instructor"},req) 
        console.log("Done",userId)
        if(userId){
             throwQuery(`INSERT INTO instructors (userId)
             VALUES ('${userId}');`)
        }
       
    } catch (error) {
        console.log(error.message)
        //throw Error(error.message)
    } 
}

async function throwQuery(query){

    const result = await database.connect(query)
    console.log(result)
}