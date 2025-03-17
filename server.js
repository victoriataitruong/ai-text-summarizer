import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser"); router.use(bodyParser.json());

// Enable CORS with specific configuration
const allowedOrigins = [
  'http://localhost:3000', // for local development
  'https://ai-text-summarizer-nfk5.onrender.com', // Render frontend URL
];

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from specific origins (local or production)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'), false);  // Deny the request
    }
  },
  methods: ['GET', 'POST'],  // Allow only these methods
  credentials: true,  // Allow credentials (cookies, authorization headers)
}));

// Enable JSON parsing for requests
app.use(express.json());

// TextRazor API setup using environment variable
const TEXTRAZOR_API_URL = 'https://api.textrazor.com/';
const TEXTRAZOR_API_KEY = process.env.TEXTRAZOR_API_KEY; 

// Endpoint to summarize text
app.post('/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Prepare the request to TextRazor API
    const response = await fetch(TEXTRAZOR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-TextRazor-Key': TEXTRAZOR_API_KEY, // API key in header
      },
      body: new URLSearchParams({
        'text': text,
        'extractors': 'entities,topics,sentiment', // Add extractors for summarization
      }),
    });

    const data = await response.json();

    // Check for error in the API response
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    // Create a summary based on extracted information (you can refine this logic)
    const summary = data.response.entities ? data.response.entities.map(entity => entity.entityId).join(', ') : 'No summary available';

    // Send the summary back to the frontend
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while summarizing the text.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
