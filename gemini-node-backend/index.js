require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Example Gemini API endpoint and payload — adjust as per actual Gemini API docs
const GEMINI_API_URL = 'https://generativeai.googleapis.com/v1beta2/models/gemini-pro:generateText';

app.post('/chat', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    // Build request payload for Gemini API - adjust to the actual API spec
    const requestBody = {
      prompt: {
        text: prompt
      },
      // Add other Gemini API parameters if needed
    };

    // Call Gemini API
    const response = await axios.post(
      GEMINI_API_URL,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
        }
      }
    );

    // Extract response text from Gemini response
    const reply = response.data?.candidates?.[0]?.output || 'No reply from Gemini';

    res.json({ reply });
  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch response from Gemini API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
