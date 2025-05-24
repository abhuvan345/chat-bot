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
        const { question, options } = req.body;
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `
        You are an expert at answering multiple choice questions. 
        Given the following question and options, provide the most likely correct answer.
        Only respond with the letter of the correct option (A, B, C, etc.) and a very brief explanation.
        
        Question: ${question}
        Options:
        ${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}
        `;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ answer: text.trim() });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process question' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});