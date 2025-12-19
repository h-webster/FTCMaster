
const express = require('express');
const { insertEvents } = require('../utils/batchInsert');
const { IndexEvent } = require('../schemas/massSchema');
const databaseMiddleware = require('../middleware/database'); // Import shared middleware

const router = express.Router();

// Use shared database middleware
router.use(databaseMiddleware);
router.post('/allevents', async (req, res) => {
    try {
        const { events } = req.body;
        console.log(`Processing ${events.length} events`);
        
        if (!Array.isArray(events) || events.length == 0) {
            return res.status(400).json({ error: 'Events array is required' });
        }

        // Validate events have code field
        const invalidEvents = events.filter(e => !e.code);
        if (invalidEvents.length > 0) {
            console.error('Events missing code field:', invalidEvents.length);
            return res.status(400).json({ 
                error: 'All events must have a code field',
                invalidCount: invalidEvents.length 
            });
        }

        // Use bulkWrite for efficient upserts
        const bulkOps = events.map(event => ({
            updateOne: {
                filter: { code: event.code }, // Match by event code
                update: { $set: event },       // Update all fields
                upsert: true                   // Insert if doesn't exist
            }
        }));

        const result = await IndexEvent.bulkWrite(bulkOps, { ordered: false });

        console.log(`Upsert complete: ${result.upsertedCount} new, ${result.modifiedCount} updated`);

        res.json({
            message: 'Events updated successfully',
            count: events.length,
            upserted: result.upsertedCount,
            modified: result.modifiedCount,
            matched: result.matchedCount
        });
    } catch (error) {
        console.error('All event save failed:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Database operation failed', 
            error: error.message,
            details: error.writeErrors ? error.writeErrors.map(e => e.errmsg) : null
        });
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
            "teams.number": teamNumber
        });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
});

module.exports = router;