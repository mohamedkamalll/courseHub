const bcrybt = require('bcrypt');
const {v5, v1} = require('uuid');
//const database = require('../config/databaseConnection');
const {isEmail} = require('validator');
const generator = require('generate-password');
import("sernam").then(({default: sernam}) =>
{
    const options = {
        symbols: true,
        numbers: true,
    }
    sn = sernam(options)
})
const {poolPromise} = require('../config/db')
const {sendMail} = require('../config/email')
const moment = require('moment')
module.exports.checkAuth = async (req, res,next) =>
{
    try
    {
        if (await req.isAuthenticated())
        {
            res.status(200).send(true);
        }
        else
        {
            // return unauthorized user
            res.status(401).send(false);
        }
    } catch (error)
    {
        console.log(error)
        return next(error)
    }

}


module.exports.createUser = async (user, req, res, next) =>
{
    const {firstName, lastName, birthDate, email, password, city, role,activated} = user;
    console.log(role,"roleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    try
    {
        const UserId = v5(email, v1())
        const hashedPassword = await bcrybt.hash(password, 10)

        if (isEmail(email))
        {
            const existed = await isExisted(email, 'email')
            if (!existed)
            {
                query = `INSERT INTO users (userId ,firstName ,lastName ,birthDate ,email ,password ,city ,role,activated,createdOn)
            VALUES ('${UserId}','${firstName}' ,'${lastName}' ,'${birthDate}' ,'${email}' ,'${hashedPassword}' ,'${city}' ,'${role}','${activated}','${moment().format()}');`
                const pool = await poolPromise
                await pool.request().query(query)
                return UserId;
            } else
            {
                 throw new Error("Email is already existed")
            }

        } else
        {
            throw new Error("Email is not valid")
        }
    } catch (error)
    {
       throw new Error(error.message)
    }

}


module.exports.addChild = async (child, city, fatherName, parentId) =>
{
    const {name, birthDate} = child;
    let username = await sn.generateOne(name + fatherName)
    const Password = await generator.generate({
        length: 10,
        numbers: true
    });
    const hashedPassword = await bcrybt.hash(Password, 10)
    try
    {
        console.log(Password);
        console.log(username, "user nameeeeeeeeeeeeeeeee")
        const existed = await isExisted(username, 'username')
        if (existed)
        {
            username = await createUniqueUsername(name, fatherName)
        }
        let UserId = v5(name, v1())
        query = `INSERT INTO users (userId ,firstName ,lastName ,birthDate ,password ,city ,role ,username,activated)
            VALUES ('${UserId}','${name}' ,'${fatherName}' ,'${birthDate}' ,'${hashedPassword}' ,'${city}' ,'student', '${username}', 1);`
        const pool = await poolPromise
        await pool.request().query(query)
        console.log(name, city, fatherName, username, UserId, parentId);
        await pool.request().query(`INSERT INTO students (userId,parentId) VALUES ('${UserId}',${parentId});`)
        return {"username": username, "password": Password};
    } catch (error)
    {
        throw new  Error(error.message)
    }

}

async function createUniqueUsername(name, fatherName)
{
    try
    {
        let username = await sn.generateOne(name + fatherName)
        const existed = await isExisted(username, 'username')
        if (existed)
        {
            username = await createUniqueUsername(username)
        } else
        {
            return username;
        }
    } catch (error)
    {
        throw new Error(error.message)
    }

}

async function isExisted(Email, type)
{
    const pool = await poolPromise
    const Existed = await pool.request().query(`SELECT * FROM users where ${type} = '${Email}'`)
    //console.log(Existed, Existed.rowsAffected, Email, type)
    if (Existed.rowsAffected == 1)
    {
        return true
    } else
    {
        console.log("not existed")
        return false
    }
}

module.exports.getUser = async (identifier, req) =>
{
    const pool = await poolPromise
    if (isEmail(identifier))
    {
        const pool = await poolPromise
        user = await pool.request().query(`SELECT * FROM users where email = '${identifier}'`)
    } else
    {
        user = await pool.request().query(`SELECT * FROM users where username = '${identifier}'`)
    }
    return user
}

module.exports.getUserById = async (id) =>
{   
    const pool = await poolPromise
    const user = await pool.request().query(`SELECT * FROM users where userId = '${id}'`)
    return user.recordset[0]
}

module.exports.createAndGetGmailId = async (email, gmailId, req) =>
{
    /*
We have 3 conditions
not user try to log in email = null  gmailid = null
user try to log in email = user.email gmaild = user.gmailid
user try to auth the account with gmail  email = user.email  gmailid= null    
*/
    try
    {
        const pool = await poolPromise
        user = await pool.request().query(`SELECT * FROM users where email = '${email}'`)
        console.log(user, "userrrr from create and get")
        if (user.recordset[0])
        {
            if (user.recordset[0].gmailId)
            {
                if (gmailId == user.recordset[0].gmailId)
                {
                    console.log("we are here againn")
                    return user.recordset[0]
                } else
                {
                    throw Error("uncorrect email")
                }
            } else
            {
                userAfterCreate = await pool.request().query(`UPDATE users
                SET gmailId = '${gmailId}'
                WHERE email = '${email}';`)
                return user.recordset[0]
            }
        } else
        {
            throw new Error("<h1>User isnt existed</h1>")
        }
    } catch (error)
    {
        throw new Error(error)
    }
}

module.exports.forgetPassword = async (req, res, next) =>
{
    console.log(req.body)
    const {identifier} = req.body
    const pool = await poolPromise
    try
    {
        if (isEmail(identifier))
        {
            user = await pool.request().query(`SELECT * FROM users where email = '${identifier}'`)
            if (!user.recordset[0])
            {
                throw new Error("user isn't exist");
            } else
            {
                const Password = await generator.generate({
                    length: 10,
                    numbers: true
                });
                const hashedPassword = await bcrybt.hash(Password, 10)
                await pool.request().query(`UPDATE users
                SET password = '${hashedPassword}'
                WHERE email = '${identifier}';`)
                console.log(`Your new password is`, identifier, Password, null)
                await sendMail(`Your new password is`,identifier,Password,null)
            }
        } else
        {
            user = await pool.request().query(`SELECT * FROM users where username = '${identifier}'`)
            if (!user.recordset[0])
            {
                throw new Error("user isn't exist");
            } else
            {
                child = await pool.request().query(`SELECT * FROM students where userId = '${user.recordset[0].userId}'`)
                parent = await pool.request().query(`SELECT * FROM parents where parentId = '${child.recordset[0].parentId}'`)
                parentFromUsers = await pool.request().query(`SELECT * FROM users where userId = '${parent.recordset[0].userId}'`)
                const Password = await generator.generate({
                    length: 10,
                    numbers: true
                });
                const hashedPassword = await bcrybt.hash(Password, 10)
                await pool.request().query(`UPDATE users
                SET password = '${hashedPassword}'
                WHERE username = '${identifier}';`)
                console.log(`Your Daughter's / Son's ${user.recordset[0].firstName} password`, parentFromUsers.recordset[0].email, Password, "")
                await sendMail(`Your Daughter's / Son's ${user.recordset[0].firstName} password`,parentFromUsers.recordset[0].email,Password,null)
                console.log("Sent successfully")

            }
        }
        return res.status(200).send("Done")
    } catch (error)
    {
        return next(error);
    }

}

module.exports.updatePassword = async (req, res, next) =>
{
    try
    {
        const {password} = req.body
        const identifierName = req.user.email ? "email" : "username";
        const identifier = req.user.email ? req.user.email : req.user.username;
        console.log(req.user,password,identifierName,identifier)
        const hashedPassword = await bcrybt.hash(password, 10)
        const pool = await poolPromise
        user = await pool.request().query(`UPDATE users
        SET password = '${hashedPassword}'
        WHERE ${identifierName} = '${identifier}';`)
        return res.status(200).send("Done")
    } catch (error)
    {
        return next(error)
    }
}

module.exports.getCurrentUser = async (req, res, next) =>
{
    try
    {
        return res.status(200).send(req.user); 
    } catch (error)
    {
        return next(error)
    }
}


module.exports.activateUser = async (req,res,next) => {
    const {email} = req.body;
    try
    {
        const pool = await poolPromise
        user = await pool.request().query(`UPDATE users
        SET activated = ${1}
        WHERE email = '${email}';`)
        return res.status(200).send("User Activated")
    } catch (error)
    {
        return next(error)
    }   
}
