import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAI } from '../../context/AIContext';

// Using styled messages directly instead of importing the Message component
const MessageBubble = styled.div`
  max-width: 80%;
  background: ${props => props.isUser ? 'rgba(239, 68, 68, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  color: ${props => props.isUser ? 'white' : '#333'};
  padding: 0.75rem 1rem;
  border-radius: 18px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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

// Styled components
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: auto;
  background-image: url(${require('../../assets/jason-briscoe-GrdJp16CPk8-unsplash.jpg')});  
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  
  /* Add overlay to improve readability */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 1;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: transparent;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  position: relative;
  z-index: 2;
`;

const InputArea = styled.div`
  display: flex;
  padding: 1rem;
  position: relative;
  z-index: 2;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(224, 224, 224, 0.8);
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  
  &:focus {
    border-color: #f8a4a4;
    box-shadow: 0 0 0 2px rgba(248, 164, 164, 0.2);
  }
`;

const SendButton = styled.button`
  margin-left: 0.5rem;
  width: 50px;
  height: 49px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    background: #fca5a5;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const PlayButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  
  &:hover {
    background: #dc2626;
  }
  
  &:disabled {
    background: #fca5a5;
    cursor: not-allowed;
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  width: 100%;
`;

// Loading indicator component
const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  .dot {
    width: 8px;
    height: 8px;
    background-color: #888;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  
  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  .dot:nth-child(2) {
    animation-delay: -0.16s;
  }
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

// Icon component for the send button
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

// ElevenLabs integration
const ELEVENLABS_API_KEY = '';
const BILINGUAL_VOICES = [
  { 
    id: 'hGb0Exk8cp4vQEnwolxa',
    name: 'Ayesha - Energetic Hindi Voice',
    languages: ['Hindi', 'English', 'Multilingual'],
    isIndian: true
  },
  { 
    id: 'fEJqMD6Jp1JFP8T1BZpd',
    name: 'Bhavna',
    languages: ['Hindi','English', 'Multilingual'],
    isIndian: true
  },
  { 
    id: '3gsg3cxXyFLcGIfNbM6C',
    name: 'Varun',
    languages: ['Hindi', 'English'],
    isIndian: true
  },
  { 
    id: 'CwhRBWXzGAHq8TQ4Fs17',
    name: 'Roger',
    languages: ['Hindi', 'English', 'Multilingual'],
    isIndian: false
  }
];

const ChatInterface = ({ initialQuery }) => {
  const [input, setInput] = useState('');
  const { askAI, loading } = useAI();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [initialQueryHandled, setInitialQueryHandled] = useState(false);
  
  // ElevenLabs TTS state
  const [selectedVoice, setSelectedVoice] = useState('hGb0Exk8cp4vQEnwolxa'); // Default to Ayesha
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  // Detect language in text (simple heuristic)
  const detectLanguage = (text) => {
    // Hindi characters in Unicode range
    const hindiPattern = /[\u0900-\u097F]/;
    
    // If text contains Devanagari script, it's Hindi
    if (hindiPattern.test(text)) {
      return 'Hindi';
    }
    
    // Check for common Hindi words written in Roman script
    const romanHindiWords = [
      'namaste', 'aap', 'kaise', 'hai', 'dhanyavaad', 'theek', 'haan', 'nahi',
      'khana', 'acha', 'bahut', 'kya', 'maine', 'humne', 'tum', 'pyaaz', 'masala'
    ];
    
    // Count Hindi words
    let hindiWordCount = 0;
    const words = text.toLowerCase().split(/\s+/);
    
    for (const word of words) {
      if (romanHindiWords.includes(word)) {
        hindiWordCount++;
      }
    }
    
    // If more than 15% of words are Hindi, consider it Hindi in Roman script
    if (hindiWordCount / words.length > 0.15) {
      return 'Hindi-Roman';
    }
    
    return 'English';
  };
  
  // ElevenLabs TTS function
  const speakWithElevenLabs = async (text) => {
    try {
      // Stop any current speech
      if (speaking) {
        stopSpeaking();
      }
      
      // Detect language
      const detectedLanguage = detectLanguage(text);
      
      // Get optimal voice settings for the language
      const voiceSettings = {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.25,
        speaker_boost: true
      };
      
      // For Hindi, increase stability for better pronunciation
      if (detectedLanguage === 'Hindi' || detectedLanguage === 'Hindi-Roman') {
        voiceSettings.stability = 0.7; // More stable for better Hindi pronunciation
        voiceSettings.style = 0.3; // Slightly more expressive for Hindi
      }
      
      // Check if API key is set
      if (!ELEVENLABS_API_KEY) {
        console.warn("ElevenLabs API Key not set");
        return;
      }

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: voiceSettings
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }
      
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      setAudioElement(audio);
      
      audio.onplay = () => {
        setSpeaking(true);
      };
      audio.onended = () => {
        setSpeaking(false);
        if (audio.src) URL.revokeObjectURL(audio.src);
      };
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setSpeaking(false);
        if (audio.src) URL.revokeObjectURL(audio.src);
      };
      
      try {
        await audio.play();
      } catch (playError) {
        console.error("Error playing audio:", playError);
        // The play buttons will handle this case
      }
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
    }
  };
  
  const stopSpeaking = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      if (audioElement.src) URL.revokeObjectURL(audioElement.src);
      setSpeaking(false);
    }
  };
  
  // Handle play button click
  const handlePlay = (text) => {
    speakWithElevenLabs(text);
  };

  useEffect(() => {
    const handleInitialQuery = async () => {
      if (initialQuery && !initialQueryHandled && messages.length === 0) {
        setInitialQueryHandled(true);
        let aiResponseText = '';
        
        // Immediately show the user's message
        const userMessage = { 
          text: initialQuery, 
          isUser: true,
          id: Date.now(),
          timestamp: new Date().toISOString()
        };
        setMessages([userMessage]);
        
        try {
          // Show loading message with dots animation
          setMessages(prev => [...prev, {
            text: "",
            isUser: false,
            id: Date.now() + 1,
            isLoading: true,
            timestamp: new Date().toISOString()
          }]);

          const response = await askAI(initialQuery);
          aiResponseText = typeof response === 'object' ? response.display : response;
          
          // Replace loading message with actual response
          setMessages(prev => [
            prev[0],
            {
              text: aiResponseText,
              isUser: false,
              id: Date.now() + 2,
              timestamp: new Date().toISOString()
            }
          ]);
          
          if (ttsEnabled) {
            await speakWithElevenLabs(aiResponseText);
          }
          
        } catch (error) {
          console.error('Error processing initial query:', error);
          aiResponseText = "Sorry, I had trouble processing that request. Please try again.";
          
          // Replace loading message with error message
          setMessages(prev => [
            prev[0],
            {
              text: aiResponseText,
              isUser: false,
              id: Date.now() + 2,
              timestamp: new Date().toISOString()
            }
          ]);
        }
      }
    };
    
    handleInitialQuery();
  }, [initialQuery, initialQueryHandled, askAI, ttsEnabled]); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
  
    const userMessage = { 
      text: input, 
      isUser: true,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    // Immediately show user message
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Add loading message with dots animation
    setMessages(prev => [...prev, {
      text: "",
      isUser: false,
      id: Date.now() + 1,
      isLoading: true,
      timestamp: new Date().toISOString()
    }]);
  
    try {
      const response = await askAI(input);
      const responseText = typeof response === 'object' ? response.display : response;
      
      // Replace loading message with actual response
      setMessages(prev => [...prev.slice(0, -1), { 
        text: responseText, 
        isUser: false,
        id: Date.now() + 2,
        timestamp: new Date().toISOString()
      }]);
      
      if (ttsEnabled) {
        await speakWithElevenLabs(responseText);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      // Replace loading message with error message
      setMessages(prev => [...prev.slice(0, -1), { 
        text: "Sorry, I had trouble processing that request. Please try again.", 
        isUser: false,
        id: Date.now() + 2,
        timestamp: new Date().toISOString()
      }]);
    }
  };
  
  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg) => (
          <MessageWrapper key={msg.id || Math.random()} isUser={msg.isUser}>
            <MessageBubble 
              isUser={msg.isUser}
              isLoading={msg.isLoading}
            >
              {msg.isLoading ? (
                <LoadingIndicator>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </LoadingIndicator>
              ) : (
                <>
                  {msg.text}
                  {msg.timestamp && (
                    <Timestamp isUser={msg.isUser}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Timestamp>
                  )}
                </>
              )}
            </MessageBubble>
            {!msg.isLoading && !msg.isUser && (
              <PlayButton 
                onClick={() => handlePlay(msg.text)}
                disabled={speaking}
                title="Play message"
              >
                ▶
              </PlayButton>
            )}
          </MessageWrapper>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputArea as="form" onSubmit={handleSubmit}>
        <TextInput
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about recipes, cooking techniques, or ingredients..."
          disabled={loading}
        />
        <SendButton 
          type="submit" 
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          <SendIcon />
        </SendButton>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatInterface;