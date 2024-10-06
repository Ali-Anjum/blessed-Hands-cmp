const connectToDatabase = require('../DbConnect');

const { Update, User } = require('../../Helpers/UserSignupSchema');
const signUpUser = async (userData) => {
  await connectToDatabase(); // Connect if not already connected

  const { email, password, username, profile_url, bio } = userData;

  const newUser = new User({
    email,
    password, // Make sure to hash this before saving
    username,
    profile_url,
    bio,
  });

  try {
    const savedUser = await newUser.save();
    console.log('User signed up:', savedUser);
    return savedUser;
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error; // Rethrow the error for further handling
  }
};

// Correctly export the function
module.exports = signUpUser;
