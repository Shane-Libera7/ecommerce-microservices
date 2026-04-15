const express = require('express');
const router = express.Router();
const loginRoute = require('./login');
const registerRoute = require('./register');
const refreshRoute = require('./refresh');
const logoutRoute = require('./logout');
const authMiddleware = require('../../middleware/auth');
const db = require('../../db');
 


//Sanity check of middleware
router.get('/me', authMiddleware, async (req, res, next) =>{
    
    try {
        const userId = req.userId;
        const user = await db('users').select(['id', 'email', 'created_at']).where('id', userId).first();

        if (!user){
        return res.status(404).json({ error: 'User not found'});
        }else {
        return res.status(200).json(user);
        }
    } catch(e){
    next(e);
    }


});



//Routes
router.use('/register', registerRoute);
router.use('/login', loginRoute);
router.use('/refresh', refreshRoute);
router.use('/logout', logoutRoute);


module.exports = router;