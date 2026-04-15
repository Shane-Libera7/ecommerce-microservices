const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../db');
const router = express.Router();

//Verify refresh token 

async function verifyToken(refreshToken) {
    const token = await db('refresh_tokens').where('token', refreshToken).first();

   return token ? true : false;
}

//Route 

router.post('/', async(req,res) => {

    const { refreshToken } = req.body;

    try {

        //Check that refresh token exists in database 

        const tokenInDb = await verifyToken(refreshToken);

        if(tokenInDb){
            
            const validToken = jwt.verify(refreshToken , process.env.JWT_SECRET);

            
                const accessToken = jwt.sign(
                    { userId: validToken.userId},
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' }
                )

                return res.status(200).json({ accessToken });
                
           
        
        } else {
            return res.status(400).json({ error: 'Refresh token not found in database'})
        }




        

    } catch(e){
        next(e);
    }



})

module.exports = router;