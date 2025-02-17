import React, { createContext, useState, useContext } from 'react';
import { apiService } from '../utils/apiService';
import { recipePrompt, techniquePrompt } from '../utils/promptTemplates';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const detectQueryType = (query) => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('recipe') || lowerQuery.includes('make') || lowerQuery.includes('cook')) {
      return 'recipe';
    }
    if (lowerQuery.includes('how to') || lowerQuery.includes('technique')) {
      return 'technique';
    }
    return 'general';
  };

  const processRecipeResponse = (response) => {
    try {
      const recipeData = JSON.parse(response);
      setActiveRecipe(recipeData);
      return {
        type: 'recipe',
        data: recipeData,
        display: `I found a recipe for ${recipeData.title}. Would you like me to guide you through it?`
      };
    } catch (error) {
      console.error('Error parsing recipe:', error);
      return {
        type: 'text',
        display: response
      };
    }
  };

  const askAI = async (query, forcedType = null) => {
    setLoading(true);
    try {
      const queryType = forcedType || detectQueryType(query);
      let promptTemplate;
      
      switch (queryType) {
        case 'recipe':
          promptTemplate = recipePrompt;
          break;
        case 'technique':
          promptTemplate = techniquePrompt;
          break;
        default:
          promptTemplate = (query) => query;
      }

      const formattedPrompt = promptTemplate(query);
      const response = await apiService.askAI(formattedPrompt, queryType);
      
      const processedResponse = queryType === 'recipe' 
        ? processRecipeResponse(response)
        : { type: 'text', display: response };
      
      setLastResponse(processedResponse);
      setHistory(prev => [...prev, { 
        query, 
        response: processedResponse,
        timestamp: new Date()
      }]);
      
      return processedResponse;
    } catch (error) {
      console.error('Error asking AI:', error);
      return {
        type: 'text',
        display: 'Sorry, I had trouble processing that request.'
      };
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = (recipe) => {
    setSavedRecipes(prev => [...prev, { ...recipe, savedAt: new Date() }]);
  };

  const startCooking = (recipe) => {
    setActiveRecipe(recipe);
  };

  return (
    <AIContext.Provider value={{ 
      askAI, 
      loading, 
      lastResponse, 
      history,
      activeRecipe,
      savedRecipes,
      saveRecipe,
      startCooking
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);