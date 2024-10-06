// middleware/auth.js
const jwt = require('jsonwebtoken'); // If you're using JWT for auth

const authenticate = (req, res, next) => {

    try {
        req.IsTokenProvided = 0

        const token = req.headers['authorization']; // Get token from headers


        req.IsTokenProvided = 0
        if (!token) {

            next();
        }else{
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.log(err)
                    next();
    
    
    
                }
                else {
                    req.userId = decoded.id;
                    req.IsTokenProvided = 1 // Store user id in request for later use
                    next(); // Call the next middleware or route handler
                }
    
            });

        }

 
    }
    catch (err) {
        console.log(err)
        next();
    }
};

module.exports = authenticate;
