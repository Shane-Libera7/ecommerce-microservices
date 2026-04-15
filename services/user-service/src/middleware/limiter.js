const limit = require('express-rate-limit');


// Rate limiter 

const limiter = limit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
});

module.exports = limiter;