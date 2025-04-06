import fetch from 'node-fetch';

const API_KEY = process.env.WORQHAT_API_KEY;
const ENDPOINT = process.env.WORQHAT_ENDPOINT || 'https://api.worqhat.com/api/ai/content/v4';

console.log('API Key:', API_KEY);
console.log('Endpoint:', ENDPOINT);

export const worqhatService = {
  getResponse: async (message) => {
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: message,
          randomness: 0.4
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Worqhat API Error:', error);
      throw error;
    }
  }
}; 