const mongoose = require('mongoose');

// Updates Schema
const UpdateSchema = new mongoose.Schema({
    username: { type: String, required: false },
    password: { type: String, required: false },
    bio: { type: String },
    // Add other fields as necessary
});

// User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    profile_url: { type: String }, // Remove the default for now
    bio: { type: String }, // Include bio field
    created_at: { type: Date, default: Date.now },
});

// Pre-save hook to set profile_url for UserSchema
UserSchema.pre('save', function (next) {
    if (!this.profile_url) { // Only set if profile_url is not already set
        this.profile_url = `${this.username}${Math.floor(Math.random() * 10000)}`;
    }
    next(); // Call next to proceed with the save
});

// Exporting both models
module.exports = {
    Update: mongoose.model('Update', UpdateSchema, 'User-Collection'),
    User: mongoose.model('User', UserSchema, 'User-Collection')
};
