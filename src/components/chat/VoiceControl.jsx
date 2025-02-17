import React from 'react';
import styled from 'styled-components';
import { Mic, MicOff } from 'lucide-react';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';

const VoiceControlContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-top: 1px solid #e0e0e0;
`;

const MicButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: ${props => props.isListening ? '#ff4444' : '#4285f4'};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const StatusText = styled.span`
  margin-left: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const VoiceControl = ({ onQuerySubmit }) => {
  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        onQuerySubmit(transcript);
      }
    } else {
      startListening();
    }
  };

  return (
    <VoiceControlContainer>
      <MicButton
        onClick={handleMicClick}
        isListening={isListening}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </MicButton>
      <StatusText>
        {isListening ? 'Listening...' : 'Click to speak'}
      </StatusText>
    </VoiceControlContainer>
  );
};

export default VoiceControl;