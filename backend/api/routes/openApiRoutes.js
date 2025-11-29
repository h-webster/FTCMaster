const express = require('express');
const { OpenAI } = require('openai');

const router = express.Router();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const rateLimit = require('express-rate-limit');

const openaiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 2,
    message: {error: 'Request limit reached. Try again in an hour.'}
})

// POST 
router.post('/openai', openaiLimiter, async (req, res) => {
    try {
        const { data } = req.body;
        const completion = await client.chat.completions.create({
            model: "gpt-5-nano",
            messages: [
                { role: "system", content: 
                    `You are an expert FIRST Tech Challenge (FTC) robotics scout and analyst. 
Analyze team performance data and provide:
1. A performance score (0.0-10.0) based on wins, losses, point averages, OPR, and consistency
2. Key strengths (what they excel at)
3. Key weaknesses (areas for improvement)
4. Strategic insights for competing against or with this team

Scoring criteria:
- 9.0-10.0: Elite team, dominant performance, high OPR, consistent high scores
- 7.0-8.9: Strong team, good win rate, above-average performance
- 5.0-6.9: Average team, inconsistent performance, mid-tier OPR
- 3.0-4.9: Developing team, struggling performance, needs improvement
- 0.0-2.9: Weak team, minimal scoring, requires major work

Consider: win/loss ratio, point consistency, auto vs teleop performance, tournament level performance differences, OPR ratings, and match score trends.`
                },
                { role: "user", content: `Analyze this FTC team's performance data and provide a comprehensive scouting report:\n\n${JSON.stringify(data, null, 2)}`}
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "user_info",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            score: {
                                type: "number",
                                description: "Overall performance score from 0.0 to 10.0"
                            },
                            strengths: {
                                type: "array",
                                items: { type: "string" },
                                description: "List of 3-5 key strengths"
                            },
                            weaknesses: {
                                type: "array",
                                items: { type: "string" },
                                description: "List of 3-5 key weaknesses"
                            },
                            insights: {
                                type: "array",
                                items: { type: "string" },
                                description: "2-4 strategic insights or recommendations"
                            },
                            summary: {
                                type: "string",
                                description: "Brief 2-3 sentence overall assessment"
                            }
                        },
                        required: ["score", "strengths", "weaknesses", "insights", "summary"],
                        additionalProperties: false
                    }
                }
            }
        });
        const parse = JSON.parse(completion.choices[0].message.content);
        res.json({ analysis: parse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;