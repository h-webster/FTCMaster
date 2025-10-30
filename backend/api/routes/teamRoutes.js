const express = require('express');
const { insertTeams } = require('../utils/batchInsert');
const { IndexTeam } = require('../schemas/massSchema');
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
        const result = await IndexTeam.find({});
        res.json(result);
    } catch (error) {
        console.error('Team list retrieval failed:', error);
        res.status(500).json({ error: error.message});
    }
});

module.exports = router;