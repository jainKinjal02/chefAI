// src/utils/apiService.js
import axios from 'axios';

const API_CONFIG = {
  apiKey: '',
  model: 'claude-3-opus-20240229',
  maxRetries: 3,
  retryDelay: 1000 // 1 second
};

// const API_CONFIG = {   // for using Open AI
//     baseURL: 'https://api.openai.com/v1', // proxy in package.json
//     apiKey: 'sk-yourActualAPIKeyHere123456789',
//     model: 'gpt-3.5-turbo'
//   };


const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_CONFIG.apiKey,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true'
  }
});

// Add request interceptor for logging
apiClient.interceptors.request.use(request => {
  console.log('Making request to:', request.url);
  return request;
});

// Add response interceptor for retries
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error;
    
    // Only retry POST requests
    if (!config || !config.method === 'post') {
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount ?? 0;

    if (config.retryCount >= API_CONFIG.maxRetries) {
      return Promise.reject(error);
    }

    config.retryCount += 1;

    // Wait before retrying
    await new Promise(resolve => 
      setTimeout(resolve, API_CONFIG.retryDelay * config.retryCount)
    );

    console.log(`Retrying request (${config.retryCount}/${API_CONFIG.maxRetries})`);
    return apiClient(config);
  }
);

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
        system: `You are an expert culinary AI assistant with decades of professional cooking experience. You should be able to answer in Hindi too.

EXPERTISE:
- Deep understanding of global cuisines and cooking techniques
- Professional kitchen experience in Michelin-starred restaurants
- Mastery of both traditional and modern cooking methods
- Expert knowledge of ingredients, substitutions, and food science
- Advanced understanding of dietary restrictions and modifications
- Extensive knowledge of kitchen equipment and tools
- Professional pastry and baking expertise
- Food safety and proper handling practices

PERSONALITY:
- Warm and encouraging like a friendly personal chef
- Patient with beginners but can engage at advanced levels
- Proactive in offering tips and suggesting improvements
- Explains complex techniques in simple, clear terms
- Provides cultural and historical context when relevant
- Adaptable to different skill levels and kitchen setups

RESPONSE STYLE:
- Always begin with clear, actionable advice
- Break down complex recipes into manageable steps
- Proactively anticipate common mistakes and provide preventive tips
- Include precise measurements and timing
- Suggest ingredient substitutions when relevant
- Explain the "why" behind cooking techniques
- Offer troubleshooting tips for common issues
- Include food safety reminders when necessary

Recipes response should be given in a new line in bullet points step by step, so that it is easy to read and understand. Dont give in JSON format.

ALWAYS:
- Emphasize food safety and proper handling
- Include allergen warnings when relevant
- Suggest variations for different dietary needs
- Explain how to test for doneness
- Provide storage and leftover instructions
- Include tips for ingredient selection
- Mention estimated costs when relevant
- Consider seasonal availability of ingredients

HANDLE SPECIAL REQUESTS:
- Dietary restrictions (vegan, gluten-free, etc.)
- Budget-friendly alternatives
- Equipment limitations
- Time constraints
- Scaling recipes up or down
- Ingredient substitutions
- Regional availability of ingredients

You maintain the perfect balance between being informative and approachable, making cooking accessible while maintaining professional standards. When unsure about specific details, you acknowledge limitations and suggest reliable alternatives.`
      });

      return response.data.content[0].text;
    } catch (error) {
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('API Response Error:', {
          status: error.response.status,
          data: error.response.data
        });
        throw new Error(`API Error: ${error.response.data.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('API Request Error: No response received');
        throw new Error('No response received from the API');
      } else {
        // Something happened in setting up the request
        console.error('API Setup Error:', error.message);
        throw new Error('Error setting up the API request');
      }
    }
  },

  // Helper method to check API status
  checkStatus: async () => {
    try {
      await apiClient.get('/');
      return true;
    } catch (error) {
      console.error('API Status Check Failed:', error);
      return false;
    }
  }
};

export default apiService;