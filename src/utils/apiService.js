// src/utils/apiService.js
import axios from 'axios';

const API_CONFIG = {
  baseURL: 'https://api.anthropic.com/v1',
  apiKey: 'YOUR_ANTHROPIC_API_KEY_HERE',
  model: 'claude-3-opus-20240229'  // or your preferred Claude model
};

// const API_CONFIG = {   // for using Open AI
//     baseURL: 'https://api.openai.com/v1',
//     apiKey: 'sk-yourActualAPIKeyHere123456789',
//     model: 'gpt-3.5-turbo'
//   };

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_CONFIG.apiKey,
    'anthropic-version': '2023-06-01'
  }
});

export const apiService = {
  askAI: async (prompt, type = 'general') => {
    try {
      const response = await apiClient.post('/messages', {
        model: API_CONFIG.model,
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }],
        system: 'You are a helpful cooking assistant that provides recipes and cooking advice.'
      });

      // Extract the response from the API result
      const aiResponse = response.data.content[0].text;
      return aiResponse;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export default apiService;