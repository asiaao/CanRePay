const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config(); // Loads API key from Railway environment variables

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// OpenAI API Config
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Do NOT hardcode your key!

// Health Check Route
app.get("/", (req, res) => {
    res.json({ status: "Server is running on Railway" });
});

// Generate Financial Tips Route
app.post("/generateMessage", async (req, res) => {
    try {
        console.log("Received request:", req.body);

        // Ensure requestType is "general_tips"
        if (req.body.requestType !== "general_tips") {
            return res.status(400).json({ error: "Invalid request type" });
        }

        // Generate a general financial tip
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-4",
                messages: [
                    {
                        role: "user",
                        content: "Give me a helpful and supportive financial tip with 2-3 actionable steps.",
                    },
                ],
                max_tokens: 150,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const message = response.data.choices[0].message.content.trim();
        console.log("Generated message successfully");
        res.json({ message });
    } catch (error) {
        console.error("Error details:", error.response?.data || error);
        res.status(500).json({
            error: "Failed to generate message",
            details: error.message,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});