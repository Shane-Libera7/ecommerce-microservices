const express = require('express');
const db = require('../../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const limiter = require('../../middleware/limiter');







//verify Log in attempt 
async function verifyCredentials(email, password){
    const user = await db('users').where({ email }).first();
    if (!user){
        return null;
    }

    const match = await bcrypt.compare(password, user.password_hash);

    return match ? user : null;

}


//Route 
router.post('/', limiter, async (req, res) => {
    
    const { email, password } = req.body;

    try{
        //Validate login credentials 
        const user = await verifyCredentials(email, password);
        if (!user){
        return res.status(401).json({ error: 'Incorrect Email or password'});
        } else{

            //Generation of both access and refresh token
            const accessToken = jwt.sign(
                { userId: user.id, isAdmin: user.is_admin},
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            const refreshToken = jwt.sign(
                { userId: user.id},
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            // Migrate refresh token to database 
            const newRefreshToken = await db('refresh_tokens').insert({ 'token': refreshToken, 'user_id': user.id
            });

            return res.status(200).json({ accessToken, refreshToken });

        }

        



    } catch(e) {
        next(e);

    }



   


});

module.exports = router;