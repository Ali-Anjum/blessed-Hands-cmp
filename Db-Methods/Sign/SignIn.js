const bcrypt = require('bcrypt');
const connectToDatabase = require('../DbConnect'); // Adjust the path as necessary
 // Adjust the path as necessary
 const { Update, User } = require('../../Helpers/UserSignupSchema');
const signInUser = async (email, password) => {
    try {
        // Connect to the database
        await connectToDatabase();

        // Check if the email is already registered
        const user = await User.findOne({ email });

        if (!user) {
            return { status: 404, message: 'User not found' };
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return { status: 401, message: 'Invalid credentials' };
        }

        // If the email is registered and password matches, return user info
        return { status: 200, message: 'Login successful', user };
    } catch (error) {
        console.error('Error during sign-in:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

module.exports = signInUser;
