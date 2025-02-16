const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Add this - it was missing
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// OpenAI API config
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = 'API_KEY'; // Add your OpenAI API Key

app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.post('/generateMessage', async (req, res) => {
    try {
        console.log('Received request:', req.body);
        const { monthlyIncome, totalDebt } = req.body;

        // Input validation
        if (!monthlyIncome || !totalDebt) {
            console.log('Missing data:', { monthlyIncome, totalDebt });
            return res.status(400).json({ error: 'Missing required financial data' });
        }

        const debtToIncomeRatio = (totalDebt / (monthlyIncome * 12)).toFixed(2);

        const response = await axios.post(OPENAI_API_URL, {
            model: "gpt-4",
            messages: [{
                role: "user",
                content: `Generate a supportive and practical financial advice message for someone with a monthly income of $${monthlyIncome} and total debt of $${totalDebt} (debt-to-annual-income ratio of ${debtToIncomeRatio}). Include 2-3 specific actionable steps for improvement.`
            }],
            max_tokens: 150,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const message = response.data.choices[0].message.content.trim();
        console.log('Generated message successfully');
        res.json({ message });
    } catch (error) {
        console.error('Error details:', error.response?.data || error);
        res.status(500).json({ 
            error: 'Failed to generate message',
            details: error.message 
        });
    }
});

// Starts server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});