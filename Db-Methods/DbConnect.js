const mongoose = require('mongoose');

// Define the connection string
const dbURI = 'mongodb://localhost:27017/Blessed-Hands'; // Change 'yourDatabaseName' to your actual database name

// Function to connect to the database
const connectToDatabase = async () => {
    try {
        // Check if a connection already exists
        if (mongoose.connection.readyState === 0) {
            console.log('No existing connection, attempting to connect to MongoDB...');
            await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('MongoDB connected successfully');
        } else {
            console.log('MongoDB connection already established');
        }
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process with failure
    }
};

// Export the connection function
module.exports = connectToDatabase;
