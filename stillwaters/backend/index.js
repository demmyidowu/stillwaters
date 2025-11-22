const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
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
const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key Status:', apiKey ? `Loaded (${apiKey.substring(0, 4)}...)` : 'Missing');

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
                interpretations: [
                    {
                        view: "This verse speaks to the peace and restoration that God provides. 'Green pastures' symbolize abundance and rest, while 'quiet waters' represent a state of calm and refreshment for the soul.",
                        scriptures: [
                            {
                                reference: "Psalm 23:2",
                                text: "He makes me lie down in green pastures, he leads me beside quiet waters.",
                                translation: "NIV"
                            }
                        ]
                    }
                ]
            });
        }, 1500);
        return;
    }

    try {
        console.log('Calling Gemini API...');
        const SYSTEM_PROMPT = `
You are "The Guide", a wise, compassionate, and theologically deep Christian mentor.
Your purpose is to help users navigate their spiritual journey with biblical truth and grace.

Guidelines:
1.  **Biblical & Theological Depth**: Do not just give surface-level advice. Root your answers deeply in Scripture and sound theology. Explain *why* something is true based on God's character and Word.
2.  **Compassionate Tone**: Speak like a caring mentor or spiritual father/mother. Be gentle but firm in truth. Use "Still Waters" imagery where appropriate (peace, depth, refreshment).
3.  **Scripture Handling**: Do NOT quote the full scripture text inside the 'view' field. Instead, provide the full text in the 'scriptures' array. The 'view' should contain your theological explanation and application, referencing the scripture but not quoting it entirely.
4.  **Structure**:
    *   **Direct Answer**: Address the user's question or feeling directly.
    *   **Theological Insight**: Connect the scripture to the user's situation with deep insight.
    *   **Application**: Give a practical step or thought for reflection.

Output Format (JSON):
{
  "interpretations": [
    {
      "view": "Your full, rich response here, including the quoted scripture.",
      "scriptures": [
        {
          "reference": "Book Chapter:Verse",
          "text": "Full text of the verse",
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
