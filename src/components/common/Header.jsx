import React from 'react';
import styled from 'styled-components';
import { ChefHat, Book, Clock } from 'lucide-react';
import { useAI } from '../../context/AIContext';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #4285f4;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const Header = () => {
  const { activeRecipe, savedRecipes } = useAI();

  return (
    <HeaderContainer>
      <Logo>
        <ChefHat size={28} />
        <Title>AI Cooking Assistant</Title>
      </Logo>

      <Stats>
        {activeRecipe && (
          <StatItem>
            <Clock size={18} />
            <span>Cooking: {activeRecipe.title}</span>
          </StatItem>
        )}
        <StatItem>
          <Book size={18} />
          <span>{savedRecipes.length} Saved Recipes</span>
        </StatItem>
      </Stats>
    </HeaderContainer>
  );
};

export default Header;
