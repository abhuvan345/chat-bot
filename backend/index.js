require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Initialize Gemini with correct API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    gemini: 'connected',
    apiVersion: 'v1beta' // Confirm this matches your API access
  });
});

app.post('/answer-mcq', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Use the correct model name for your API version
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.0-pro", // Updated model name
      generationConfig: {
        maxOutputTokens: 1000
      }
    });

    const prompt = `Answer the following question concisely:
    Question: ${question}
    
    Provide a direct answer with 1-2 sentence explanation if needed.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      answer: text.trim(),
      status: "success"
    });
    
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      status: error.status,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Failed to process question',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});