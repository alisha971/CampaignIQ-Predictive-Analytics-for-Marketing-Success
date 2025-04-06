const WORQHAT_API_KEY = import.meta.env.VITE_WORQHAT_API_KEY;
const WORQHAT_ENDPOINT = "https://api.worqhat.com/api/ai/content/v4";

console.log('API Key:', WORQHAT_API_KEY);
console.log('Endpoint:', WORQHAT_ENDPOINT);

// Add function to fetch campaign insights
const fetchCampaignInsights = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/general/campaign-insights`);
    if (!response.ok) throw new Error('Failed to fetch campaign insights');
    return await response.json();
  } catch (error) {
    console.error('Error fetching campaign insights:', error);
    return [];
  }
};

export const generateAiResponse = async (question, previousMessages = []) => {
  try {
    // Fetch campaign data
    const campaignInsights = await fetchCampaignInsights();
    
    const formData = new FormData();
    formData.append('question', question);
    formData.append('model', 'aicon-v4-large-160824');
    formData.append('training_data', `You are an AI assistant for a business analytics dashboard. You have access to data about:
- Sales performance and metrics
- Customer information and demographics
- Transaction history and patterns
- Geographic distribution of sales
- Daily and monthly trends
- Product performance and inventory
- Marketing campaign results and predictions

Current Campaign Data:
${JSON.stringify(campaignInsights, null, 2)}

When answering questions about campaigns:
- Use the actual campaign data provided above
- Reference specific campaign success predictions
- Provide confidence levels when available
- Give data-driven recommendations based on historical performance

Please provide helpful, business-focused responses to help users understand their data and make data-driven decisions.

Current context:
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}`);
    
    formData.append('stream_data', 'false');
    formData.append('response_type', 'text');

    console.log('Sending request:', {
      url: WORQHAT_ENDPOINT,
      headers: {
        'Authorization': `Bearer ${WORQHAT_API_KEY}`,
      },
      body: formData
    });

    const response = await fetch(WORQHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WORQHAT_API_KEY}`
      },
      body: formData
    });

    const rawResponse = await response.text();
    console.log('Raw response:', rawResponse);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${rawResponse}`);
    }

    const data = JSON.parse(rawResponse);
    return { content: data.content || "I apologize, but I couldn't process that request." };
  } catch (error) {
    console.error('WorqHat API Error:', error);
    throw error;
  }
}; 