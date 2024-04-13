// app.js
const express = require('express');
const { connectDB } = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');
const tripRoutes = require('./mongo');
const { mongo } = require('mongoose');
const app = express();
const port = 3001;

// Middleware to log HTTP requests
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log("HTTP Method - " + req.method + "\nURL - " + req.url);
    next();
});
app.use('/auth', authRoutes);
app.use('/trips',tripRoutes);


connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
