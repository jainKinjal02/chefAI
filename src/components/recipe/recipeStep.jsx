import React, { useState } from 'react';
import styled from 'styled-components';
import { Clock, CheckCircle } from 'lucide-react';
import Timer from './Timer';

const StepContainer = styled.div`
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  background: ${props => props.isActive ? '#f8f9fa' : 'transparent'};
  border: 1px solid ${props => props.isActive ? '#e9ecef' : 'transparent'};
  transition: all 0.2s ease;
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StepNumber = styled.span`
  font-weight: bold;
  color: #4285f4;
`;

const StepInstructions = styled.p`
  margin: 0;
  color: ${props => props.isCompleted ? '#666' : '#333'};
  text-decoration: ${props => props.isCompleted ? 'line-through' : 'none'};
`;

const RecipeStep = ({ step, stepNumber, isActive, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <StepContainer isActive={isActive}>
      <StepHeader>
        <StepNumber>Step {stepNumber}</StepNumber>
        {step.timer && <Timer duration={step.timer} />}
        {isCompleted && <CheckCircle size={16} color="#4CAF50" />}
      </StepHeader>
      
      <StepInstructions isCompleted={isCompleted}>
        {step.instruction}
      </StepInstructions>

      {isActive && !isCompleted && (
        <button onClick={handleComplete}>
          Mark as Complete
        </button>
      )}
    </StepContainer>
  );
};

export default RecipeStep;