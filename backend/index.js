require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/answer-mcq', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const model = genAI.getGenerativeAI({ model: "gemini-pro" });
        
        const prompt = `Answer the following question in a clear and concise manner:
        
        Question: ${question}
        
        Provide a direct answer with a brief explanation if needed.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ answer: text.trim() });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to process question',
            details: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});