const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    try {
        console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set');
        console.log("Attempting to connect to MongoDB...");

        const connection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/FTC-master', {
            // Recommended options for serverless
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
        });

        cachedDb = connection;
        console.log("Connected to MongoDB!");
        console.log("Connected to database: ", mongoose.connection.db.databaseName);
        return connection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

router.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ message: 'Database connection failed' });
    }
});