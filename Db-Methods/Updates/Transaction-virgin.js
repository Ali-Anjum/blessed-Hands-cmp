const {Transaction} = require('../../Helpers/TransactionSchema');

// Function to save a transaction
async function saveTransaction(user_id, project_id, amount, status, payment_method, comment) {
    try {
        console.log(user_id, project_id, amount, status, payment_method, comment)
        const newTransaction = new Transaction({
            user_id,
            project_id,
            amount,
            status,
            payment_method,
            comment
        });

        const savedTransaction = await newTransaction.save();
        console.log('Transaction saved successfully:', savedTransaction);
        return savedTransaction; // Return the saved transaction for further use
    } catch (err) {
        console.error('Error saving transaction:', err);
        throw err; // Rethrow the error to handle it later
    }
}
module.exports= saveTransaction
