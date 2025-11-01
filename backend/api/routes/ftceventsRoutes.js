const express = require('express');

const router = express.Router();

const year = 2024;

router.get('/allteams/:page', async (req, res) => {
    const page = req.params.page;
    const username = process.env.FTC_USERNAME;
    const token = process.env.FTC_TOKEN;
    
    if (!page) {
        console.error("Page parameter is missing");
        return res.status(400).json({ message: "Page parameter is required" });
    }
    
    // Use HTTPS to avoid redirects that can strip Authorization headers
    const url = `https://ftc-api.firstinspires.org/v2.0/${year}/teams?page=${page}`;
    
    // Debug the exact values
    console.log('Username raw:', JSON.stringify(username));
    console.log('Token raw (first 20 chars):', JSON.stringify(token?.substring(0, 20)));
    console.log('Token length:', token?.length);
    
    const authString = `${username}:${token}`;
    const base64Auth = Buffer.from(authString).toString("base64");
    
    console.log('Auth string length:', authString.length);
    console.log('Base64 auth (first 50 chars):', base64Auth.substring(0, 50));
    
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": "Basic " + base64Auth,
            },
            // follow redirects (default) but using HTTPS avoids the common redirect -> auth drop
        });

        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error("Error fetching team data:", error);
        res.status(500).json({ message: "Error fetching team data", error: error.message });
    }
});

router.get('/events', async (req, res) => {
    const username = process.env.FTC_USERNAME;
    const token = process.env.FTC_TOKEN;
    const url = `https://ftc-api.firstinspires.org/v2.0/${year}/events`;
    const authString = `${username}:${token}`;
    const base64Auth = Buffer.from(authString).toString("base64");

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": "Basic " + base64Auth,
            },
            // follow redirects (default) but using HTTPS avoids the common redirect -> auth drop
        });

        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error("Error fetching event data:", error);
        res.status(500).json({ message: "Error fetching event data", error: error.message });
    }
})

router.get('/events/:id', async (req, res) => {
    const eventId = req.params.id;
    if (!eventId) {
        console.error("Event ID is missing");
        return res.status(400).json({ message: "Event ID is required" });
    }
    const username = process.env.FTC_USERNAME;
    const token = process.env.FTC_TOKEN;
    const url = `https://ftc-api.firstinspires.org/v2.0/${year}/teams?eventCode=${eventId}`;
    const authString = `${username}:${token}`;
    const base64Auth = Buffer.from(authString).toString("base64");

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": "Basic " + base64Auth,
            },
            // follow redirects (default) but using HTTPS avoids the common redirect -> auth drop
        });

        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error("Error fetching event data:", error);
        res.status(500).json({ message: "Error fetching event data", error: error.message });
    }
})

module.exports = router;