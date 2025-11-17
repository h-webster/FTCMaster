const express = require('express');

const router = express.Router();

const year = 2025;

router.get('/scout/:number', async (req, res) => {
    const number = req.params.number;
    
    if (!number) {
        console.error("Number parameter is missing");
        return res.status(400).json({ message: "Number parameter is required" });
    }
    const q = `
        teamByNumber(number: ${number}) {
            quickStats(season: ${year}) {
                auto {
                    rank
                    value
                }
                count
                dc {
                    rank
                    value
                }
                eg {
                    rank
                    value
                }
                tot {
                    rank
                    value
                }
            }
            number
        }
    `;

    const url = `https://api.ftcscout.org/graphql`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({query: q})
        });
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error("Error fetching team data:", error);
        res.status(500).json({ message: "Error fetching team data", error: error.message });
    }
});

module.exports = router