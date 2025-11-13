const express = require('express');
const { insertTeams } = require('../utils/batchInsert');
const { IndexTeam } = require('../schemas/massSchema');
const { Team } = require('../schemas/teamSchema');
const databaseMiddleware = require('../middleware/database');

const router = express.Router();

// Use shared database middleware
router.use(databaseMiddleware);

// GET teamlist - with error handling for missing DB
router.get('/teamlist', async (req, res) => {
    try {
        console.log('Database connection state:', req.db ? 'Connected' : 'Not connected');
        

        const result = await IndexTeam.find({});
        console.log(`Found ${result.length} teams`);
        res.json(result);
    } catch (error) {
        console.error('Team list retrieval failed:', error);
        res.status(500).json({ 
            error: 'Database query failed',
            details: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
});

// POST allteams - with DB check
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
        res.status(500).json({ message: 'Database operation failed' });
    }
});

// Keep your other routes with similar DB checks...
router.post('/teamcache', async (req, res) => {
    try {
        const teamData = req.body;
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
});

// DELETE allteams
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

router.delete('/teamcache', async (req, res) => {
    try {
        const result = await Team.deleteMany({});
        res.json({
            message: 'Team cache cleared successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Team cache clear failed:', error);
        res.status(500).json({ error: error.message});
    }
});

router.get('/teamcache/:number', async (req, res) => {
    try {
        const teamNumber = parseInt(req.params.number);
        const team = await Team.findOne({ number: teamNumber });
        res.json(team);
    } catch (error) {
        console.error('Error fetching team cache:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;