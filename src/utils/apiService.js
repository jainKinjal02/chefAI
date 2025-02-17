import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export const apiService = {
  askAI: async (prompt, type = 'general') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ask`, {
        prompt,
        type
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};