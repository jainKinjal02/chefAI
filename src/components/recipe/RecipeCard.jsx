import React, { useState } from 'react';
import styled from 'styled-components';
import { Clock, Users, Save, PlayCircle } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import RecipeStep from './RecipeStep';
import IngredientList from './IngredientList';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 1rem 0;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: ${props => props.primary ? '#4285f4' : '#e9ecef'};
  color: ${props => props.primary ? 'white' : '#666'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const RecipeCard = ({ recipe }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { saveRecipe, startCooking } = useAI();

  const handleStartCooking = () => {
    startCooking(recipe);
    setCurrentStep(0);
  };

  const handleSave = () => {
    saveRecipe(recipe);
  };

  return (
    <Card>
      <Header>
        <Title>{recipe.title}</Title>
        <MetaInfo>
          <span>
            <Clock size={16} />
            {recipe.prepTime} prep • {recipe.cookTime} cook
          </span>
          <span>
            <Users size={16} />
            Serves {recipe.servings}
          </span>
        </MetaInfo>
      </Header>

      <Content>
        <IngredientList ingredients={recipe.ingredients} servings={recipe.servings} />
        
        <div>
          <h3>Instructions</h3>
          {recipe.steps.map((step, index) => (
            <RecipeStep
              key={index}
              step={step}
              stepNumber={index + 1}
              isActive={index === currentStep}
              onComplete={() => setCurrentStep(index + 1)}
            />
          ))}
        </div>
      </Content>

      <ActionBar>
        <ActionButton primary onClick={handleStartCooking}>
          <PlayCircle size={20} />
          Start Cooking
        </ActionButton>
        <ActionButton onClick={handleSave}>
          <Save size={20} />
          Save Recipe
        </ActionButton>
      </ActionBar>
    </Card>
  );
};

export default RecipeCard;