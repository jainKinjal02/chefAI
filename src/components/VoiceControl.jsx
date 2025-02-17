import React, { useState, useEffect } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import styled from 'styled-components';

const VoiceControlContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const MicButton = styled.button`
  background: ${props => props.isListening ? '#ff5252' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const VoiceStatus = styled.div`
  margin-left: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

const VoiceControl = ({ onQuerySubmit }) => {
  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();
  const { speak, speaking, cancel } = useSpeechSynthesis();
  
  useEffect(() => {
    if (transcript && !isListening) {
      onQuerySubmit(transcript);
    }
  }, [transcript, isListening, onQuerySubmit]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      if (speaking) cancel();
      startListening();
    }
  };

  const speakResponse = (response) => {
    // Extract just the text content from the response
    const plainText = response.replace(/<[^>]*>/g, '');
    speak(plainText);
  };

  return (
    <VoiceControlContainer>
      <MicButton 
        onClick={toggleListening} 
        isListening={isListening}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        <i className={isListening ? 'fas fa-stop' : 'fas fa-microphone'} />
      </MicButton>
      <VoiceStatus>
        {isListening ? 'Listening...' : speaking ? 'Speaking...' : 'Click to speak'}
      </VoiceStatus>
    </VoiceControlContainer>
  );
};

export default VoiceControl;