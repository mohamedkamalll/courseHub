const { v5, v1 } = require('uuid');
//const database = require('../config/databaseConnection');
const {isEmail} = require('validator');
const generator = require('generate-password');
import("sernam").then(({ default: sernam }) => {
    const options = {
      symbols: true,
      numbers: true,
    }
     sn = sernam(options)
  })
const bcrybt = require('bcrypt');
const { poolPromise } = require('../config/db')
const {sendMail} = require('../config/email')


let request;

module.exports.createUser= async (user,req,res) => {
    
    const {FirstName ,LastName ,birthDate ,Email ,Password ,City ,Role } = user;

    try {
        const UserId = v5(Email,v1())
        const hashedPassword = await bcrybt.hash(Password , 10)

        if(isEmail(Email)){
        const existed = await isExisted(Email,'email')
        if(!existed){
            query = `INSERT INTO users (userId ,firstName ,lastName ,birthDate ,email ,password ,city ,role)
            VALUES ('${UserId}','${FirstName}' ,'${LastName}' ,${birthDate} ,'${Email}' ,'${hashedPassword}' ,'${City}' ,'${Role}');`
            //throwQuery(query)
            const pool = await poolPromise
            await pool.request().query(query)
            return UserId;
        }else{
            throw Error("Email is already existed")
        }

    }else{
        throw Error("Email is not valid")
    }
    } catch (error) {
        console.log(error.message)
    }
    
}


module.exports.addChild = async (child, city ,fatherName,parentId)=>{
   // const bcrybt = require('bcrypt');
    const {name , birthDate } = child;   
    let username = await sn.generateOne(name + fatherName)
    const Password = await generator.generate({
        length: 10,
        numbers: true
    });
    const hashedPassword = await bcrybt.hash(Password , 10)
    try {
        console.log(Password);
        console.log(username,"user nameeeeeeeeeeeeeeeee")
            const existed = await isExisted(username,'username')
            if (existed){
                username = await createUniqueUsername(name,fatherName)
            } 
            let UserId = v5(name,v1())
            query = `INSERT INTO users (userId ,firstName ,lastName ,birthDate ,password ,city ,role ,username)
            VALUES ('${UserId}','${name}' ,'${fatherName}' ,'${birthDate}' ,'${hashedPassword}' ,'${city}' ,'student', '${username}');`
            const pool = await poolPromise
            await pool.request().query(query)
            console.log(name ,city,fatherName,username,UserId,parentId);
            await pool.request().query(`INSERT INTO students (userId,parentId) VALUES ('${UserId}',${parentId});`)
            return {"username" :username  , "password" : Password};        
    } catch (error) {
        console.log(error)
    }

}

async function createUniqueUsername(name,fatherName){
    try {
        let username = await sn.generateOne(name + fatherName)
        const existed = await isExisted(username,'username')
        if (existed){
            username = await createUniqueUsername(username)
        } else{
            return username;
        } 
    } catch (error) {
        console.log(error)
    }
    
}

async function isExisted(Email,type){
    const pool = await poolPromise
    const Existed  = await pool.request().query(`SELECT * FROM users where ${type} = '${Email}'`)

    console.log(Existed,Existed.rowsAffected,Email,type)
    if(Existed.rowsAffected == 1){
        return true
    }else{
        console.log("not existed")
        return false
    }
}

module.exports.getUser = async(identifier,req) => {
    request = req
    const pool = await poolPromise
    if(isEmail(identifier)){
        const pool = await poolPromise
        user = await pool.request().query(`SELECT * FROM users where email = '${identifier}'`)
    }else{
        user = await pool.request().query(`SELECT * FROM users where username = '${identifier}'`)        
    }
    return user
}

module.exports.getUserById = async(id,req) => {  
    //user = await pool.request().query(`SELECT * FROM users where userId = '${id}'`)  
   // console.log(user.recordset[0],"get user by id is caled")      
   const pool = await poolPromise
    const user = await pool.request().query(`SELECT * FROM users where userId = '${id}'`)      
   return user.recordset[0]
}

module.exports.createAndGetGmailId = async(email,gmailId,req) => {  
    /*
We have 3 conditions
not user try to log in email = null  gmailid = null
user try to log in email = user.email gmaild = user.gmailid
user try to auth the account with gmail  email = user.email  gmailid= null    
*/
    try {
        const pool = await poolPromise
        user = await pool.request().query(`SELECT * FROM users where email = '${email}'`)
        console.log(user,"userrrr from create and get")
        if(user.recordset[0]){
            if(user.recordset[0].gmailId){
                if(gmailId == user.recordset[0].gmailId){
                    console.log("we are here againn")
                    return user.recordset[0]
                }else{
                    throw Error("uncorrect email")
                }
            }else{
                user = await pool.request().query(`UPDATE users
                SET gmailId = '${gmailId}'
                WHERE email = '${email}';`)
                return user.recordset[0].userId
            }
        }  else{
            throw new Error("User isnt existed")
        }    
    } catch (error) {
        throw new Error(error)
    }
    
   // return null;
    
      
    //return user.recordset[0]
}

module.exports.forgetPassword = async(req,res) => {
    const {identifier} = req.body
    const pool = await poolPromise
    try {
        if(isEmail(identifier)){
            user = await pool.request().query(`SELECT * FROM users where email = '${identifier}'`)
            if(!user.recordset[0]){
                console.log("user isnt exist")
            }else{
                const Password = await generator.generate({
                    length: 10,
                    numbers: true
                });                
                const hashedPassword = await bcrybt.hash(Password , 10)
                await pool.request().query(`UPDATE users
                SET password = '${hashedPassword}'
                WHERE email = '${identifier}';`)
                console.log(`Your new password is`,identifier,Password,"")
                //await sendMail(`Your new password is`,identifier,Password,"")
            }     
        }else{
            user = await pool.request().query(`SELECT * FROM users where username = '${identifier}'`)        
            if(!user.recordset[0]){
                return ("user isnt exist")
            }else{
                child = await pool.request().query(`SELECT * FROM students where userId = '${user.recordset[0].userId}'`)
                parent = await pool.request().query(`SELECT * FROM parents where parentId = '${child.recordset[0].parentId}'`)
                parentFromUsers = await pool.request().query(`SELECT * FROM users where userId = '${parent.recordset[0].userId}'`)
                const Password = await generator.generate({
                    length: 10,
                    numbers: true
                });                
                const hashedPassword = await bcrybt.hash(Password , 10)
                await pool.request().query(`UPDATE users
                SET password = '${hashedPassword}'
                WHERE username = '${identifier}';`)
                console.log(`Your children ${user.recordset[0].firstName} password`,parentFromUsers.recordset[0].email,Password,"")
                //await sendMail(`Your children ${user.recordset[0].firstName} password`,parentFromUsers.recordset[0].email,Password,"")
            }    
        }
        
    } catch (error) {
        console.log(error)
    }
   
}

module.exports.updatePassword = async(req,res,next) => {

    try {
        if(1 != 2){
            throw new Error("error handler")
        }
        const hashedPassword = await bcrypt.hash(password , 10)
        const pool = await poolPromise
        user = await pool.request().query(`UPDATE users
        SET password = '${hashedPassword}'
        WHERE email = '${email}';`)
        return user.recordset[0]
            
    } catch (error) {
        return next(error) 
    }
    
    
}
