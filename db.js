const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Narayanan:admin@cluster0.kjju3.mongodb.net/PlanMyTrip';
const client = new MongoClient(uri);

let cachedDb = null;

async function connectDB() {
    try {
        if (cachedDb) {
            return cachedDb;
        }
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        cachedDb = client.db();
        return cachedDb;
    } catch (error) {
        console.error('Failed to connect to MongoDB Atlas', error);
        throw error;
    }
}

module.exports = { connectDB };
