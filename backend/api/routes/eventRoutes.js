
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

    if (!Array.isArray(events) || events.length === 0) {
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

    let upsertedCount = 0;
    let modifiedCount = 0;
    const failedEvents = [];

    // Upsert one event at a time
    for (const event of events) {
      try {
        const result = await IndexEvent.updateOne(
          { code: event.code },
          { $set: event },
          { upsert: true }
        );

        if (result.upsertedCount > 0) upsertedCount++;
        if (result.modifiedCount > 0) modifiedCount++;
      } catch (err) {
        console.error(`Failed to upsert event ${event.code}:`, err.message);
        failedEvents.push({ code: event.code, error: err.message });
      }
    }

    console.log(`Upsert complete: ${upsertedCount} new, ${modifiedCount} updated`);
    if (failedEvents.length > 0) {
      console.warn(`${failedEvents.length} events failed to upsert`);
    }

    res.json({
      message: 'Events processed',
      count: events.length,
      upserted: upsertedCount,
      modified: modifiedCount,
      failed: failedEvents
    });
  } catch (error) {
    console.error('All event save failed:', error);
    res.status(500).json({
      message: 'Database operation failed',
      error: error.message
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