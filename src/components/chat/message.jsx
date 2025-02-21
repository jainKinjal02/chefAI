import React, { memo } from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  margin-bottom: 1rem;
  max-width: 80%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.isUser ? '#4285f4' : 'white'};
  color: ${props => props.isUser ? 'white' : '#333'};
  padding: 0.75rem 1rem;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  opacity: ${props => props.isLoading ? 0.7 : 1};
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 0.8; }
    100% { opacity: 0.6; }
  }
  
  animation: ${props => props.isLoading ? 'pulse 1.5s infinite' : 'none'};
`;

const Timestamp = styled.div`
  font-size: 0.75rem;
  color: ${props => props.isUser ? 'rgba(255,255,255,0.7)' : '#666'};
  margin-top: 0.25rem;
`;

// Memoize the Message component to prevent unnecessary re-renders
const Message = memo(({ text, isUser, timestamp, isLoading }) => (
  <MessageContainer isUser={isUser} isLoading={isLoading}>
    {text}
    {timestamp && (
      <Timestamp isUser={isUser}>
        {new Date(timestamp).toLocaleTimeString()}
      </Timestamp>
    )}
  </MessageContainer>
));

Message.displayName = 'Message';

export default Message;