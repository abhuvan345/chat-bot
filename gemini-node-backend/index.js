require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize client with API key from env
const client = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    // Call Gemini's chat completion (adjust model name as per your access)
    const response = await client.chat.completions.create({
      model: 'gemini-1a', // Use your actual available model name here
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = response.choices?.[0]?.message?.content || 'No reply from Gemini';
    res.json({ reply });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to fetch response from Gemini API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
