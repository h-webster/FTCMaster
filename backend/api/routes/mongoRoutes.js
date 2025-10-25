const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const { insertTeams } = require('../utils/batchInsert');
const { IndexTeam } = require('../schemas/mongoSchema');

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

router.post('/allteams', async (req, res) => {
    try {
        const { teams } = req.body;

        if (!Array.isArray(teams) || teams.length == 0) {
            return res.status(400).json({ error: 'Teams array is required' });
        }

        await insertTeams(teams);
        res.json({
            message: 'Teams updated successfully',
            count: teams.length
        });
    } catch (error) {
        console.error('All team save failed:', error);
        res.status(500).json({ message: 'Database connection failed' });
    }
})

router.delete('/allteams', async (req, res) => {
  try {
    const result = await IndexTeam.deleteMany({});
    res.json({
        message: 'Teams deleted successfully',
        deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('All team clear failed:', error);
    res.status(500).json({ error: error.message});
  }
})

module.exports = router;