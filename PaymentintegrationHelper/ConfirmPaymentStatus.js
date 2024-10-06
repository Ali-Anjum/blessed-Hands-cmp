const { UpdateTransaction } = require('../Helpers/TransactionSchema');
const DbConnect = require('../Db-Methods/DbConnect');


const UpdatePaymentStatus = async (id, status) => {
    try {
        // Connect to the database
        await DbConnect();
        console.log(id)

        // Find the transaction by id and update its status
        const updatedTransaction = await UpdateTransaction.findOneAndUpdate(
            { _id:id },                 // Find the transaction with this id
            { $set: { status } },    // Update only the status field
            { new: true }            // Return the updated document
        );

        if (!updatedTransaction) {
            return 0
        }

        // Log and return the updated transaction
        console.log('Transaction status updated:', updatedTransaction);
        return updatedTransaction;
        

    } catch (err) {
        // Catch and rethrow the error with a custom message
        throw new Error(`Error updating transaction status: ${err.message}`);
    }
};

module.exports = UpdatePaymentStatus;
