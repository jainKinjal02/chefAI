import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAI } from '../../context/AIContext';
import VoiceControl from './VoiceControl';
import useSpeechSynthesis from '../../hooks/useSpeechSynthesis';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 70vh;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f9f9f9;
`;

const InputArea = styled.div`
  display: flex;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e0e0e0;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const SendButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #3367d6;
  }
`;

const Message = styled.div`
  margin-bottom: 1rem;
  max-width: 80%;
  
  ${props => props.isUser ? `
    align-self: flex-end;
    background: #4285f4;
    color: white;
    margin-left: auto;
  ` : `
    align-self: flex-start;
    background: white;
    color: #333;
  `}
  
  padding: 0.75rem 1rem;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const { askAI, loading } = useAI();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const { speak, cancel } = useSpeechSynthesis();
  
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const query = input || e;
    if (!query.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: query, isUser: true }]);
    setInput('');
    
    // Get AI response
    const response = await askAI(query);
    
    // Add AI response - use the display property from the response object
    setMessages(prev => [...prev, { text: response.display, isUser: false }]);
    
    // Speak the response - use the display property
    speak(response.display);
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.isUser}>
            {msg.text}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputArea as="form" onSubmit={handleSubmit}>
        <TextInput
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about recipes, cooking techniques, or kitchen tips..."
          disabled={loading}
        />
        <SendButton type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </SendButton>
      </InputArea>
      
      <VoiceControl onQuerySubmit={handleSubmit} />
    </ChatContainer>
  );
};

export default ChatInterface;