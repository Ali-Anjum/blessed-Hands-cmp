const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Updates schema
const UpdatesSchema = new Schema({
  project_id: {
    type: String,
    ref: 'Project',  // Reference to Project model
    required: true
  },
  user_id: {
    type: String,
    ref: 'User_Basic_Data',  // Reference to User_Basic_Data model
    required: true
  },
  text: {
    type: String,
    required: true
  },
  photo_url: {
    type: String,
    required:false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Export the Updates model
module.exports = mongoose.model('Updates', UpdatesSchema,'Updates');