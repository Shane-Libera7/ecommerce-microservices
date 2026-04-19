const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');
const productRoutes = require('./routes/products');
const app = express();
const helmet = require('helmet');
require('dotenv').config();



//Middleware
app.use(express.json());
app.use(helmet());





//routes 
app.use('/products', productRoutes);

//health 
app.get('/health', (req,res) =>{
    res.status(200).json({ status: 'ok'});
});





//Error Handling
app.use(errorHandler);



module.exports = app;
