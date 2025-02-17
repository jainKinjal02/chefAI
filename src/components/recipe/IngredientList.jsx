import React, { useState } from 'react';
import styled from 'styled-components';
import { Users } from 'lucide-react';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ServingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const Amount = styled.span`
  color: #666;
  min-width: 80px;
`;

const IngredientList = ({ ingredients, servings: defaultServings }) => {
  const [servings, setServings] = useState(defaultServings);

  const calculateAmount = (amount) => {
    const ratio = servings / defaultServings;
    return (amount * ratio).toFixed(1).replace(/\.0$/, '');
  };

  return (
    <Container>
      <Header>
        <h3>Ingredients</h3>
        <ServingControl>
          <Users size={16} />
          <select
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
          >
            {[1, 2, 4, 6, 8, 10, 12].map(num => (
              <option key={num} value={num}>
                {num} servings
              </option>
            ))}
          </select>
        </ServingControl>
      </Header>

      <List>
        {ingredients.map((ingredient, index) => (
          <ListItem key={index}>
            <Amount>
              {calculateAmount(ingredient.amount)} {ingredient.unit}
            </Amount>
            <span>{ingredient.name}</span>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default IngredientList;