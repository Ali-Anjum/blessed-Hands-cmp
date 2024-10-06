const express = require('express');
const routes= require('./Routes/Route')
const app = express();
const cors = require('cors')
const campaignRoute=require('./Routes/CampaignRoute')
const paymentCallback = require('./Routes/PaymentCallback')

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// defining routes to get data
app.use('/user',routes)
app.use('/campaign', campaignRoute);
app.use('/payment/status', paymentCallback);


// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
};
app.use(errorHandler)
