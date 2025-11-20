const express = require('express');
const { extraData } = require('../schemas/massSchema');
const databaseMiddleware = require('../middleware/database');

const router = express.Router();

// Use shared database middleware
router.use(databaseMiddleware);

// GET
router.get('/extra/:name', async (req, res) => {
    const name = req.params.name;

    if (!name) {
        console.error("Name parameter is missing");
        return res.status(400).json({ message: "Name parameter is required" });
    }

    try {
        const dataVal = await extraData.findOne({ name: name });
        res.json(dataVal);
    } catch (error) {
        console.error('Extra data retrieval failed:', error);
        res.status(500).json({ error: error.message });
    }
});

// PATCH
router.patch('/extra/:name/:val', async (req, res) => {
    try {
        const extra = await extraData.findOneAndUpdate(
            { name: req.params.name },
            { $set: { val: req.params.val } },
            { new: true, runValidators: true}
        );
        if (!extra) {
            return res.status(404).json({ error: 'Extra not found' });
        }
        res.json(extra);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;