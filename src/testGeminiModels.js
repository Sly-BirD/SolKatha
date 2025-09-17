import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.VITE_GEMINI_API_KEY}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Available models:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();