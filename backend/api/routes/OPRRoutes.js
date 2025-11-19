const express = require('express');
const { insertOPRs } = require('../utils/batchInsert');
const { IndexOPR } = require('../schemas/massSchema');
const databaseMiddleware = require('../middleware/database');

const router = express.Router();

// Use shared database middleware
router.use(databaseMiddleware);

// GET
router.get('/oprlist:number', async (req, res) => {
    const teamNumber = req.params.number;

    if (!teamNumber) {
        console.error("Number parameter is missing");
        return res.status(400).json({ message: "Number parameter is required" });
    }

    try {
        const team = await IndexOPR.findOne({ number: teamNumber });
        res.json(team);
    } catch (error) {
        console.error('OPR retrieval failed:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST
router.post('/oprlist', async (req, res) => {
    try {
        const { teams } = req.body;
        
        if (!Array.isArray(teams) || teams.length == 0) {
            return res.status(400).json({ error: 'Teams array is required' });
        }

        await insertOPRs(teams);
        res.json({
            message: 'OPRs updated successfully',
            count: teams.length
        });
    } catch (error) {
        console.error('All OPR save failed:', error);
        res.status(500).json({ message: 'Database operation failed' });
    }
});

// DELETE
router.delete('/oprlist', async (req, res) => {
    try {
        const result = await IndexOPR.deleteMany({});
        res.json({
            message: 'OPRs deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('All OPR clear failed:', error);
        res.status(500).json({ error: error.message});
    }
});

module.exports = router;