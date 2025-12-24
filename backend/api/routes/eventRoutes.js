
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
        console.log("All events: " + JSON.stringify(events[0]));
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

// PUT 
router.put('/allevents', async (req, res) => {
  try {
    const { events } = req.body;

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Events array is required' });
    }

    if (events.length > 10) {
      return res.status(400).json({ error: 'Max 10 events per request' });
    }

    const bulkOps = events.map(event => ({
      updateOne: {
        filter: { code: event.code }, // UNIQUE EVENT ID
        update: { $set: event },
        upsert: true
      }
    }));

    const result = await IndexEvent.bulkWrite(bulkOps, { ordered: false });

    res.json({
      message: 'Events upserted successfully',
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount
    });

  } catch (error) {
    console.error('Event upsert failed:', error);
    res.status(500).json({ error: 'Database error' });
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