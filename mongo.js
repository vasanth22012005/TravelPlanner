const express = require('express');
const router = express.Router();
const { connectDB } = require('./db');

router.get('/', async (req, res) => {
    try {
        const database = await connectDB(); // Get the database instance
        const tripCollection = database.collection('Trips'); // Access the collection
        const trips = await tripCollection.find().toArray(); // Retrieve trips for the specified user ID
        res.json(trips); // Send the trips as a JSON response
        console.log(trips)
    } catch (error) {
        console.error('Error retrieving trips:', error);
        res.status(500).json({ message: 'Error retrieving trips' });
    }
});
router.post('/', async(req, res) => {
    try {
      const { fromDate, toDate, location } = req.body;
      const trip = {
        "FromDate": fromDate,
        "ToDate": toDate,
        "Location": location
    }; // Assuming req.user contains the authenticated user details
      console.log(trip)
      const database = await connectDB();
      const tripCollection = database.collection('Trips');
      await tripCollection.insertOne(trip);
  
      res.status(201).send('Trip added successfully');
    } catch (error) {
      console.error('Error adding trip:', error);
      res.status(500).send('Error adding trip');
    }
  });
module.exports = router;
