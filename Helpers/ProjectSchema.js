const mongoose = require('mongoose');

const BProjectSchema = new mongoose.Schema({

    creator_id: {
        type: String,
        required: true,
        ref: 'User_Basic_Data' // Reference to User_Basic_Data schema
    },
    title: {
        text: {
            type: String,
            required: true,
            maxlength: 100
        },
        img: {
            url: {
                type: String,
                required: false
            }
        }
    },
    description: {
        text: {
            type: String,
            required: true,
            maxlength: 1000
        },
        img: {
            url: {
                type: String,
                required: false
            }
        }
    },
    goal_amount: {
        type: Number,
        required: true,
        min: 0
    },
    current_amount: {
        type: Number,
        required: true,
        min: 0
    },
    start_date: {
        type: Date,
        required: true,
        default: new Date()
    },
    end_date: {
        type: Date,
        required: false // Consider adding validation to ensure it's greater than start_date if applicable
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active'
    },
    category: {
        type: String,
        required: true,
        maxlength: 50
    }
});

// Middleware to update the created_at field before saving
BProjectSchema.pre('save', function (next) {
    if (this.start_date >= this.end_date) {
        return next(new Error('Start date must be before end date'));
    }
    next();
});

const BProject = mongoose.model('BProject', BProjectSchema,'Campaigns');
module.exports = BProject;
