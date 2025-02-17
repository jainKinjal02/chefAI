const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const StepNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  border-radius: 12px;
  background: #4285f4;
  color: white;
  font-size: 0.875rem;
`;

const CookingTechnique = ({ technique }) => {
  return (
    <TechniqueContainer>
      <Header>
        <h2>{technique.name}</h2>
        <p>{technique.description}</p>
      </Header>

      <Content>
        <Section>
          <SectionTitle>
            <BookOpen size={20} />
            Step-by-Step Instructions
          </SectionTitle>
          <List>
            {technique.steps.map((step, index) => (
              <ListItem key={index}>
                <StepNumber>{index + 1}</StepNumber>
                <span>{step}</span>
              </ListItem>
            ))}
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <AlertTriangle size={20} />
            Common Mistakes to Avoid
          </SectionTitle>
          <List>
            {technique.mistakes.map((mistake, index) => (
              <ListItem key={index}>
                <AlertTriangle size={16} color="#ff4444" />
                <span>{mistake}</span>
              </ListItem>
            ))}
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <Lightbulb size={20} />
            Pro Tips
          </SectionTitle>
          <List>
            {technique.tips.map((tip, index) => (
              <ListItem key={index}>
                <Lightbulb size={16} color="#4CAF50" />
                <span>{tip}</span>
              </ListItem>
            ))}
          </List>
        </Section>
      </Content>
    </TechniqueContainer>
  );
};

export default CookingTechnique;