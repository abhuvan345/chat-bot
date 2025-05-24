require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const timeout = require('connect-timeout'); // Add this package

const app = express();
const port = process.env.PORT || 3000;

// Add timeout middleware (8 seconds)
app.use(timeout('8s'));
app.use((req, res, next) => {
  if (!req.timedout) next();
});

// Enhanced CORS configuration
app.use(cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Gemini with better error handling
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("Gemini AI initialized successfully");
} catch (err) {
  console.error("Failed to initialize Gemini:", err);
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.post('/answer-mcq', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request',
        details: 'Question must be a non-empty string'
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        maxOutputTokens: 1000 // Limit response size
      }
    });
    
    const prompt = `Answer the following question concisely:
    Question: ${question}
    
    Provide a direct answer with 1-2 sentence explanation if needed.`;
    
    // Add timeout for Gemini API call
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Gemini API timeout')), 7000)
      )
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      answer: text.trim(),
      status: "success"
    });
    
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).json({ 
      error: 'Failed to process question',
      details: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});