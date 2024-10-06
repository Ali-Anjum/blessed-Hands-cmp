const express = require('express');
const createCampaign = require('../Helpers/ProjectSchema'); // Adjust the path as necessary
const middleware = require('../Middleware/auth')
const router = express.Router();
const connectToDatabase = require('../Db-Methods/DbConnect')
const UpdateSchema = require('../Helpers/UpdatesSchema');
const { /*Jazzcash, CryptoPayment, cardPayment */ } = require('../PaymentintegrationHelper/SendCryptoHelpers');
const TransactioninDb = require('../Db-Methods/Updates/Transaction-virgin');
const { Transaction } = require('../Helpers/TransactionSchema');



router.get('/show', async (req, res) => {
    try {
        // Connect to the database (only once at the start)
        await connectToDatabase();

        // Fetch campaigns from the database
        const campaigns = await createCampaign.find(); // Adjust the query as needed
        console.log(campaigns)
        // Send the fetched data as a response
        res.status(200).json({
            status: 200,
            campaigns,
        });
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
        });
    }
});
router.post('/add', middleware, async (req, res) => {
    try {
        await connectToDatabase()
        if (req.IsTokenProvided) {
            const { goal_amount, category, title, description } = req.body;
            let id = req.userId, current_amount = 0, start_date = new Date(), status = 'Active', creator_id = id, end_date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

            if (goal_amount && category && title && description && id && category) {
                if (title.text && title.img && description.text && description.img) {

                    const newCampaign = new createCampaign({ creator_id, title, description, goal_amount, current_amount, start_date, end_date, status, category });
                    await newCampaign.save();

                    res.status(201).json(newCampaign);

                } else {
                    throw new Error('Object fields are missing')
                }

            } else {
                throw new Error('parameters are not given')
            }
        } else {
            console.log('login first')
            throw new Error('Not logged in')
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("internal server error")

    }
}
)
router.post('/update/:id', middleware, async (req, res) => {
    const campaignId = req.params.id
    const text = req.body.text
    const created_at = new Date()

    try {
        await connectToDatabase()
        if (req.IsTokenProvided) {
            if (campaignId && text) {
                const campaign = await createCampaign.findById(campaignId)
                console.log(campaign)
                if (campaign) {
                    console.log(campaign)
                    if (campaign.creator_id == req.userId) {
                        const newUpdate = new UpdateSchema({
                            project_id: campaign._id,
                            user_id: campaign.creator_id,
                            text,
                            photo_url: (req.body.photoUrl) ? (req.body.url) : '1'  // Optional
                        });
                        newUpdate.save()
                        res.status(201).send({ newUpdate })


                    } else {
                        res.status(200).send({ message: "please login first" })
                    }

                } else {
                    res.status(400).send({ message: "invalid params" })
                }

            }
            else {
                res.status(400).send({ message: "invalids params" })
            }
        } else {
            console.log('login first')
            throw new Error('Not logged in')
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send("internal server error")

    }
})
router.get('/:id/donate', middleware, async (req, res) => {
    try {
        await connectToDatabase();

        const campaignId = req.params.id;  // Get campaign ID from the request parameters
        const paymentType = (Number.isInteger(req.body.type) && req.body.type < 4) ? req.body.type : 1; // Default to type 1 if invalid
        const amount = req.body.amount || 10;  // Default amount if not provided
        const comment = req.body.comment || ''; // Default comment if not provided
        let status = 'pending';  // Default status

        // Fetch the campaign by ID
        const campaign = await createCampaign.findById(campaignId);

        if (campaign && req.IsTokenProvided) {
            let paymentredirectlink = '';

            // Send the payment API request to get the request to pay
            switch (paymentType) {
                case 1:
                    // Call card payment function
                    // paymentredirectlink = await cardPayment();
                    break;
                case 2:
                    // Call crypto payment function
                    // paymentredirectlink = await CryptoPayment();
                    break;
                case 3:
                    // Call Jazzcash payment function
                    // paymentredirectlink = await Jazzcash();
                    break;
                default:
                    throw new Error('Invalid payment type'); // Handle unexpected payment type
            }

            console.log(campaign);  // Log the campaign details

            // Add logic for sending data to API request and return to user
            var savingDataInDB = new Transaction({
                user_id: req.userId,
                project_id: campaign._id, // Correctly reference the campaign ID
                amount: amount,
                status, // Ensure this is one of the allowed values
                payment_method: paymentType,
                comment
            });
            savingDataInDB.save()

            // Check if transaction was saved successfully
            if (savingDataInDB) { 
                res.status(200).send({ savingDataInDB });
            } else {
                throw new Error('Request failed to save transaction');
            }  
        } else {
            res.status(404).send('Login first or campaign not found');  // Improved error message
        }
    } catch (err) {
        console.error(err);  // Log the error
        res.status(500).send({ error: err.message });  // Send error response
    }
});
router.get('/:id/updates',  async (req, res) => {
    try {
        await connectToDatabase();

        const campaignId = req.params.id;  // Get campaign ID from the request parameters
       


        // Fetch the campaign by ID
        const campaign = await UpdateSchema.find({ project_id: campaignId });

        if (campaign) {
                res.status(200).send({ campaign });
        } else {
            res.status(404).send('Invalid campaign');  // Improved error message
        }
    } catch (err) {
        console.error(err);  // Log the error
        res.status(500).send({ error: err.message });  // Send error response
    }
});
router.get('/:id/Transactions',  async (req, res) => {
    try {
        await connectToDatabase();

        const campaignId = req.params.id;  // Get campaign ID from the request parameters
       


        // Fetch the campaign by ID
        const campaign = await Transaction.find({project_id:campaignId});
        let NewTransactionArray=[]
        for(let x=0; campaign.length>x;x++){
            if(campaign[x].status=='completed'){
                NewTransactionArray.push(campaign[x])
                console.log(campaign.length)
            }
            console.log('outer')
        }

        if (campaign) {
                res.status(200).send({ NewTransactionArray });
        } else {
            res.status(404).send('Invalid campaign');  // Improved error message
        }
    } catch (err) {
        console.error(err);  // Log the error
        res.status(500).send({ error: err.message });  // Send error response
    }
});

module.exports = router;
