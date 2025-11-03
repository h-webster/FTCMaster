const express = require('express');
const { insertTeams } = require('../utils/batchInsert');
const { IndexTeam } = require('../schemas/massSchema');
const { Team } = require('../schemas/teamSchema');
const databaseMiddleware = require('../middleware/database'); // Import shared middleware

const router = express.Router();

// Use shared database middleware
router.use(databaseMiddleware);

// POST
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
});

router.post('/teamcache', async (req, res) => {
    try {
        const teamData = req.body;
        
        // Check if team already exists
        const existingTeam = await Team.findOne({ number: teamData.number });
        if (existingTeam) {
            return res.status(409).json({ error: "Team already exists" });
        }

        const savedTeam = await Team.create(teamData);
        res.status(201).json(savedTeam);
    } catch (error) {
        console.error('team save failed:', error);
        res.status(500).json({error: error.message});
    }
})
// DELETE
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
});

// GET
router.get('/teamlist', async (req, res) => {
    try {
        console.log('Teamlist endpoint called'); // Debug log
        
        // Check if database connection is available
        if (!req.db) {
            console.error('No database connection in request');
            return res.status(500).json({ error: 'Database connection not available' });
        }

        const result = await IndexTeam.find({});
        console.log(`Found ${result.length} teams`); // Debug log
        res.json(result);
    } catch (error) {
        console.error('Team list retrieval failed:', error);
        // Make sure to return the response
        return res.status(500).json({ 
            error: 'Database query failed',
            details: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
});

router.get('/teamcache/:number', async (req, res) => {
    try {
        const teamNumber = parseInt(req.params.number);
        const team = await Team.findOne({ number: teamNumber });
        res.json(team);
    } catch (error) {
        console.error('Error fetching team cache:', error);
        throw error;
    }
});


module.exports = router;