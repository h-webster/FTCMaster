const express = require('express');
const { insertEvents } = require('../utils/batchInsert');
const { IndexEvent } = require('../schemas/massSchema');
const databaseMiddleware = require('../middleware/database'); // Import shared middleware

const router = express.Router();

// Use shared database middleware
router.use(databaseMiddleware);

// POST
router.post('/allevents', async (req, res) => {
    try {
        const { events } = req.body;

        if (!Array.isArray(events) || events.length == 0) {
            return res.status(400).json({ error: 'Events array is required' });
        }

        await insertEvents(events);
        res.json({
            message: 'Events updated successfully',
            count: events.length
        });
    } catch (error) {
        console.error('All event save failed:', error);
        res.status(500).json({ message: 'Database connection failed' });
    }
});

// DELETE
router.delete('/allevents', async (req, res) => {
    try {
        const result = await IndexEvent.deleteMany({});
        res.json({
            message: 'Events deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('All event clear failed:', error);
        res.status(500).json({ error: error.message});
    }
});

// GET
router.get('/eventlist', async (req, res) => {
    try {
        const result = await IndexEvent.find({});
        res.json(result);
    } catch (error) {
        console.error('Event list retrieval failed:', error);
        res.status(500).json({ error: error.message});
    }
});

router.get('/eventlist/:team', async (req, res) => {
    try {
        const teamNumber = parseInt(req.params.team);
        const events = await IndexEvent.find({
            "rankings.number": teamNumber
        });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
});

module.exports = router;