import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';  // <-- Fixed import statement

// Load environment variables from the .env file
dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 5000;

// Enable body parsing for JSON
app.use(bodyParser.json());  // <-- Fixed body parser usage

// Enable CORS with specific configuration
const allowedOrigins = [
  'http://localhost:3000', // for local development
  'https://ai-text-summarizer-nfk5.onrender.com', // Render frontend URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// TextRazor API setup using environment variable
const TEXTRAZOR_API_URL = 'https://api.textrazor.com/';
const TEXTRAZOR_API_KEY = process.env.TEXTRAZOR_API_KEY; 

app.post('/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await fetch(TEXTRAZOR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-TextRazor-Key': TEXTRAZOR_API_KEY,
      },
      body: new URLSearchParams({
        'text': text,
        'extractors': 'entities,topics,sentiment',
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const summary = data.response.entities 
      ? data.response.entities.map(entity => entity.entityId).join(', ')
      : 'No summary available';

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
