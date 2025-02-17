// AIContext.jsx
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { recipePrompt, techniquePrompt, equipmentPrompt } from '../utils/promptTemplates';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const [history, setHistory] = useState([]);

  const askAI = async (query, queryType = 'general') => {
    setLoading(true);
    try {
      // Select the appropriate prompt template based on query type
      let promptTemplate;
      switch (queryType) {
        case 'recipe':
          promptTemplate = recipePrompt;
          break;
        case 'technique':
          promptTemplate = techniquePrompt;
          break;
        case 'equipment':
          promptTemplate = equipmentPrompt;
          break;
        default:
          promptTemplate = (query) => query;
      }

      const formattedPrompt = promptTemplate(query);
      
      // This is where you'd call your AI API
      const response = await axios.post('/api/ask', { prompt: formattedPrompt });
      
      const aiResponse = response.data.response;
      setLastResponse(aiResponse);
      setHistory(prev => [...prev, { query, response: aiResponse }]);
      return aiResponse;
    } catch (error) {
      console.error('Error asking AI:', error);
      return 'Sorry, I had trouble processing that request.';
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIContext.Provider value={{ askAI, loading, lastResponse, history }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);