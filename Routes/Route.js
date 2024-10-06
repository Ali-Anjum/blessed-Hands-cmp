const express = require('express');
const router = express.Router();
const signUpUser = require('../Db-Methods/Sign/Signup');
const signInUser = require('../Db-Methods/Sign/SignIn');
const bcrypt = require('bcrypt');
const middleware=require('../Middleware/auth')
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../Db-Methods/DbConnect');
const { Update, User } = require('../Helpers/UserSignupSchema');
require('dotenv').config();
// Middleware for error handling

// jwt for signin'g the cookie


const generateJWT = (userId) => {
    // Sign the token with the user's ID and a 7-day expiration
    try{
        return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    }catch(err){
        return 0
    }
   
};



// Login Route
router.post('/login',middleware, async (req, res, next) => {
    const { email, password } = req.body;
    if(req.IsTokenProvided){
        res.status('200').send({'message':'Already Logged In'})

    }else{
        
    try {
        // Call the sign-in function and pass email and password
        const { status, message, user } = await signInUser(email, password);
        const token =await  generateJWT(user._id);

        res.status(status).json({ message, user,token });
    } catch (error) {
        console.error('Error during login:', error);
        next(error); // Pass error to the error handling middleware
    }
    }

});

// Registration Route
router.post('/register',middleware, async (req, res) => {
    if(req.IsTokenProvided!==0){    
        res.status(200).send({'message':'already logged in'})

    }else{
        const { email, password, username, profile_url, bio } = req.body;
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await signUpUser({ email, password: hashedPassword, username, profile_url, bio });
            const token =await  generateJWT(newUser._id);
            res.set('authorization', token);
              await  res.status(201).json({ message: 'User registered successfully', user: newUser,token });
        } catch (error) {
            console.error('Error during registration:', error);
            await  res.status(400).json({ message: 'error'});
            
        }
    }
});

// Update User Route
router.post('/update', middleware, async (req, res) => {
    const { password, newPassword, newPasswordConfirmed, bio } = req.body;

    // Check if the token is provided
    if (!req.IsTokenProvided) {
        return res.status(403).json({ message: 'Access Denied: Token not provided' });
    }
    else{
        try {
            // Connect to the database
            await connectToDatabase();
    
            // Find the user by ID
            const user = await Update.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            else
            {
                const updates = {};
    
                // Handle password change if requested
                if (newPassword) {
                    if (newPassword !== newPasswordConfirmed) {
                        return res.status(400).json({ message: 'New passwords do not match' });
                    }
        
                    // Verify current password
                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (!isPasswordValid) {
                        return res.status(401).json({ message: 'Incorrect current password' });
                    }
        
                    // Hash the new password
                    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                    updates.password = hashedNewPassword;
                }else{
                    if (bio) {
                        updates.bio = bio;
                    }
            
                    // Update user only if there are fields to update
                    if (Object.keys(updates).length > 0) {
                        const updatedUser = await Update.findByIdAndUpdate(
                            req.userId,
                            updates,
                            { new: true, runValidators: true }  // Return updated user and validate fields
                        );
            
                        return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
                    } else {
                        return res.status(400).json({ message: 'No valid fields to update' });
                        // Handle bio update if provided
                    } 
                }
        
                
                   
            }  
            // Initialize updates object 
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }


});

// Show Campaigns Route
{/*router.post('/campaign/all', async (req, res) => {
    const campaignData = req.body; // Ensure to validate incoming data
    const result = await CampaignSchema(campaignData);
    res.status(result.status).json(result);
});*/}

// Use error handling middleware


module.exports = router;
