//Error Handler 

function errorHandler(err, req, res, next){
    const message = process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message;



    const code = err.status || 500;
   return res.status(code).json({ error: { message, code } });
};


module.exports = errorHandler;