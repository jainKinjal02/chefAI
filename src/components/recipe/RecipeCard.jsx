// RecipeCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAI } from '../../context/AIContext';
import useSpeechSynthesis from '../../hooks/useSpeechSynthesis';

const RecipeContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const RecipeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StepContainer = styled.div`
  margin: 1rem 0;
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.active ? '#ff5252' : '#666'};
`;

const RecipeCard = ({ recipe }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [timers, setTimers] = useState({});
  const { speak, cancel } = useSpeechSynthesis();
  const { askAI } = useAI();

  const startTimer = (stepIndex, duration) => {
    const timerId = setInterval(() => {
      setTimers(prev => {
        const timeLeft = (prev[stepIndex] || duration) - 1;
        if (timeLeft <= 0) {
          clearInterval(timerId);
          speak(`Timer for step ${stepIndex + 1} is complete!`);
          return { ...prev, [stepIndex]: 0 };
        }
        return { ...prev, [stepIndex]: timeLeft };
      });
    }, 1000);

    setTimers(prev => ({ ...prev, [stepIndex]: duration }));
    return timerId;
  };

  const handleStepComplete = async (stepIndex) => {
    setActiveStep(stepIndex + 1);
    const nextStep = recipe.steps[stepIndex + 1];
    if (nextStep) {
      speak(`Next step: ${nextStep.instruction}`);
    } else {
      const feedback = await askAI("What should I look for to know if my dish is properly cooked?");
      speak(feedback);
    }
  };

  return (
    <RecipeContainer>
      <RecipeHeader>
        <h2>{recipe.title}</h2>
        <div>
          <span>Prep: {recipe.prepTime}</span>
          <span>Cook: {recipe.cookTime}</span>
        </div>
      </RecipeHeader>

      <div>
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Instructions</h3>
        {recipe.steps.map((step, index) => (
          <StepContainer key={index}>
            <div style={{ opacity: index === activeStep ? 1 : 0.6 }}>
              <h4>Step {index + 1}</h4>
              <p>{step.instruction}</p>
              {step.timer && (
                <Timer active={timers[index] > 0}>
                  <button onClick={() => startTimer(index, step.timer)}>
                    {timers[index] ? `${timers[index]}s` : `Start ${step.timer}s timer`}
                  </button>
                </Timer>
              )}
            </div>
            {index === activeStep && (
              <button onClick={() => handleStepComplete(index)}>
                Complete Step
              </button>
            )}
          </StepContainer>
        ))}
      </div>
    </RecipeContainer>
  );
};

// promptTemplates.js
export const recipePrompt = (query) => `
You are a cooking assistant. Please provide a detailed recipe with the following structure:
{
  "title": "Recipe Name",
  "prepTime": "preparation time",
  "cookTime": "cooking time",
  "ingredients": [
    { "amount": number, "unit": "unit", "name": "ingredient name" }
  ],
  "steps": [
    { 
      "instruction": "step instruction",
      "timer": optional_time_in_seconds
    }
  ]
}

Recipe request: ${query}
`;

export const techniquePrompt = (query) => `
You are a cooking expert. Please explain the following cooking technique:
- What it is
- When to use it
- Step-by-step instructions
- Common mistakes to avoid
- Pro tips

Technique: ${query}
`;

// CookingTechnique.jsx
import React from 'react';
import styled from 'styled-components';

const TechniqueContainer = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 1rem 0;
`;

const TechniqueSection = styled.div`
  margin: 1rem 0;
`;

const CookingTechnique = ({ technique }) => {
  return (
    <TechniqueContainer>
      <h2>{technique.name}</h2>
      <TechniqueSection>
        <h3>Description</h3>
        <p>{technique.description}</p>
      </TechniqueSection>
      
      <TechniqueSection>
        <h3>Step-by-Step Instructions</h3>
        <ol>
          {technique.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </TechniqueSection>
      
      <TechniqueSection>
        <h3>Common Mistakes</h3>
        <ul>
          {technique.mistakes.map((mistake, index) => (
            <li key={index}>{mistake}</li>
          ))}
        </ul>
      </TechniqueSection>
      
      <TechniqueSection>
        <h3>Pro Tips</h3>
        <ul>
          {technique.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </TechniqueSection>
    </TechniqueContainer>
  );
};

export default CookingTechnique;