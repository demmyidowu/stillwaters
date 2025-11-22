const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // For v1beta, we might need to access the model list differently if the SDK exposes it.
        // The error message suggested calling ListModels. 
        // In the Node SDK, it's usually not directly exposed on the main class in older versions,
        // but let's try to see if we can just make a raw request or if the SDK has a method.
        // Actually, the SDK doesn't have a direct `listModels` method on `GoogleGenerativeAI` instance in all versions.
        // Let's try to use a simple fetch to the API endpoint to list models to be sure, 
        // bypassing the SDK for this check if the SDK doesn't make it obvious.

        // Using fetch to list models
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(model => {
                console.log(`- ${model.name} (${model.supportedGenerationMethods.join(', ')})`);
            });
        } else {
            console.log("No models found or error:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
