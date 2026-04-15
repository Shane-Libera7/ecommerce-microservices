const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../db');
const router = express.Router();


//Verify token is in database

async function verifyToken(refreshToken) {
    const token = await db('refresh_tokens').where('token', refreshToken).first();

   return token ? true : false;
}


router.post('/', async (req,res) => {
    
    const { refreshToken } = req.body;

    try{

    const tokenInDb = await verifyToken(refreshToken);

    if(tokenInDb){
        await db('refresh_tokens').where('token', refreshToken).delete();
        return res.status(204).send();

    } else{
        return res.status(400).json({ error: 'Invalid token, logout unsuccessful'});
    }



    } catch(e){
        next(e);
    }



})


module.exports = router;