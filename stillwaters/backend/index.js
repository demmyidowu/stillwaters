require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const chatLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again after an hour' },
});

// Mock Chat Endpoint (Fallback if no key)
app.post('/api/chat', chatLimiter, async (req, res) => {
    const { question } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        console.log('Using Mock Response (No API Key)');
        // Simulate network delay
        setTimeout(() => {
            res.json({
                question,
                primary_scripture: {
                    reference: "Psalm 23:2",
                    text: "He makes me lie down in green pastures, he leads me beside quiet waters.",
                    translation: "NIV"
                },
                interpretations: [
                    {
                        tradition: "General",
                        view: "This verse speaks to the peace and restoration that God provides. 'Green pastures' symbolize abundance and rest, while 'quiet waters' represent a state of calm and refreshment for the soul."
                    }
                ],
                context: "David, the shepherd king, writes this psalm expressing trust in God's provision and protection.",
                application: "Take a moment today to pause and allow God to restore your soul, trusting that He knows what you need for rest.",
                related_verses: ["Philippians 4:7", "Matthew 11:28"]
            });
        }, 1500);
        return;
    }

    try {
        console.log('Calling Gemini API...');
        const prompt = `
      You are a wise, compassionate, and biblically grounded theological assistant named "StillWaters".
      User Question: "${question}"
      
      Please provide a response in the following JSON format ONLY (no markdown code blocks):
      {
        "question": "${question}",
        "primary_scripture": {
          "reference": "Book Chapter:Verse",
          "text": "Full text of the verse",
          "translation": "NIV or ESV"
        },
        "interpretations": [
          {
            "tradition": "General/Historical/Theological",
            "view": "A concise explanation of the meaning."
          }
        ],
        "context": "Brief historical or literary context.",
        "application": "A practical application for the user's life.",
        "related_verses": ["Book Chapter:Verse", "Book Chapter:Verse"]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown formatting from AI
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResponse = JSON.parse(cleanJson);

        res.json(jsonResponse);
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to fetch wisdom from the waters.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
