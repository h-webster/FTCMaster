const express = require('express');

const router = express.Router();

router.get('/allteams/:page', async (req, res) => {
    const page = req.params.page;
    if (!page) {
        console.error("Page parameter is missing");
        return res.status(400).json({ message: "Page parameter is required" });
    }
    const url = `http://ftc-api.firstinspires.org/v2.0/2024/teams?page=${page}`;
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": "Basic " + Buffer.from(`${username}:${token}`).toString("base64")
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching team data:", error);
        res.status(500).json({ message: "Error fetching team data" });
    }
});

const username = process.env.FTC_USERNAME;
const token = process.env.FTC_TOKEN;