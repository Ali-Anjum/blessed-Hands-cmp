const express = require('express');
const createCampaign = require('../Helpers/ProjectSchema'); // Adjust the path as necessary
const middleware = require('../Middleware/auth')
const router = express.Router();
const connectToDatabase = require('../Db-Methods/DbConnect')
const UpdateSchema = require('../Helpers/UpdatesSchema');
const { /*Jazzcash, CryptoPayment, cardPayment */ } = require('../PaymentintegrationHelper/SendCryptoHelpers');
const TransactioninDb = require('../Db-Methods/Updates/Transaction-virgin');
const { Transaction, UpdateTransaction } = require('../Helpers/TransactionSchema');
const UpdatePaymentStatus = require('../PaymentintegrationHelper/ConfirmPaymentStatus');



router.post('/update', async (req, res) => {
    try {
        let {id,status}=req.body
        // Connect to the database (only once at the start)
        await connectToDatabase()
       const dbUpdate=await UpdatePaymentStatus(id,status)
       if(dbUpdate !=0){
        res.status(200).send('success')
       }
       else{
        res.status(500).send('req recieved ')
       }
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
        });
    }
});
router.get('/send',async(req,res)=>{
    console.log(req.body)
    res.status(200).send('success')
})


module.exports = router;
