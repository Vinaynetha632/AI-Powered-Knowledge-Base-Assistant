const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Sends a prompt containing document context and user question to the Gemini API.
 * Ensures the response is strictly constrained to the document contents.
 * 
 * @param {string} documentContent - The extracted text from the document
 * @param {string} question - The user's query
 * @returns {Promise<string>} - The response answer from Gemini
 */
const askGemini = async (documentContent, question) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the server environment configuration.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using gemini-2.5-flash as the standard, fast, and highly capable model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an AI-powered Knowledge Base Assistant.
You have been provided with the text content of a document.
Your task is to answer the user's question based ONLY on the provided document content.

Constraints:
1. Your answer must be directly supported by the document text. Do not make assumptions, extrapolate, or use outside knowledge.
2. If the answer to the user's question is NOT found in the provided document content, you must respond with exactly: "I couldn't find this information in the uploaded document." Do not include any other text or explanation.

Document Content:
"""
${documentContent}
"""

User Question: ${question}

Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    return answer.trim();
  } catch (error) {
    console.error('Gemini API Error:', error.message || error);
    throw new Error(`Gemini API error: ${error.message || 'Failed to generate response'}`);
  }
};

module.exports = { askGemini };
