const express = require('express');
const authRoutes = require('./routes/auth/index');
const errorHandler = require('../src/middleware/errorHandler');
const app = express();
const helmet = require('helmet');
require('dotenv').config();


//Accept Railway proxy
app.set('trust proxy', 1);

//Middleware
app.use(express.json());
app.use(helmet());



//routes 

//health 
app.get('/health', (req,res) =>{
    res.status(200).json({ status: 'ok'});
});

//Authentication
app.use('/auth', authRoutes);



//Error Handling
app.use(errorHandler);



module.exports = app;