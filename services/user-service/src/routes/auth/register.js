const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../../db');
const router = express.Router();
const limiter = require('../../middleware/limiter');







//Validation logic
const emailIsValid = (email) => {
    return /\S+@\S+\.\S+/.test(email);
    }


const passwordIsValid = (password) => {
        return password.length > 7;
    }

//Router



router.post('/', limiter, async (req,res) => {
    
    const { email, password } = req.body;


    try {
        //Validate input & create user in database
        if (emailIsValid(email) && passwordIsValid(password)){
            const existingUser = await db('users').where({ email }).first();


            //Make sure Email doesnt already exist
            if (existingUser){
                return res.status(400).json({ error: 'Email already in use' });
            }

            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = {
                email: email,
                password_hash: hashPassword 
            }

           const [confirmedUser] = await db('users').insert(newUser).returning(['id', 'email']);
           res.status(201).json(confirmedUser);



        } else{
            return res.status(400).json({ error: 'Invalid email or password' });
        }
    } catch(e) {
        next(e);
    }

})


//Export router
module.exports = router;