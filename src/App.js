import React from 'react';
import styled from 'styled-components';
import { AIProvider } from './context/AIContext';
import Header from './components/common/Header';
import ChatInterface from './components/chat/ChatInterface';
import ErrorBoundary from './components/common/ErrorBoundary';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const App = () => {
  return (
    <AIProvider>
      <ErrorBoundary>
        <AppContainer>
          <Header />
          <ChatInterface />
        </AppContainer>
      </ErrorBoundary>
    </AIProvider>
  );
};

export default App;