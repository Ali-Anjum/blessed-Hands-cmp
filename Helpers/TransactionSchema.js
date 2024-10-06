const mongoose = require('mongoose');

// Full Transaction Schema
const TransactionSchema = new mongoose.Schema({

    user_id: {
        type: String,
        ref: 'User_Basic_Data',
        required: true
    },
    project_id: {
        type: String,
        ref: 'Project',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transaction_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'payment-received', 'verified'] // Limit to specific statuses
    },
    payment_method: {
        type: Number,
        required: true,
        enum:[1,2,3]
    },
    comment: {
        type: String
    }
});

// Update Transaction Schema
const UpdateTransactionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'payment-received', 'verified'] // Limit to specific statuses
    },

});

// Exporting both schemas
module.exports = {
    Transaction: mongoose.model('Transaction', TransactionSchema,"Transactions"),
    UpdateTransaction: mongoose.model('UpdateTransaction', UpdateTransactionSchema,"Transactions")
};
