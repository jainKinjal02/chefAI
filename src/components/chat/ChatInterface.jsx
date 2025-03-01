import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAI } from '../../context/AIContext';


// Styled components with improved visual hierarchy and readability
const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ef4444;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: ${slideIn} 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 90%;
  
  & .close-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    margin-left: 8px;
    opacity: 0.8;
    
    &:hover {
      opacity: 1;
    }
  }
`;

const Timestamp = styled.div`
  font-size: 0.6rem;
  color: ${props => props.isUser ? 'rgba(255,255,255,0.7)' : '#666'};
  text-align: right;
  display: inline-block;
  float: right;
  margin-left: 8px;
  margin-top: 15px; /* Reduced from 4px */
`;

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
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.65); /* Slightly increased opacity for better readability */
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
  gap: 1.25rem; /* Added gap for better spacing between messages */
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0; /* Removed margin-bottom since we're using gap */
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  width: 100%;
  max-width: ${props => props.isUser ? '85%' : '90%'}; /* Adjusted max-width */
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

// Improved message bubble with better formatting for recipes
const MessageBubble = styled.div`
  max-width: 95%;
  background: ${props => props.isUser ? 'rgba(239, 68, 68, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  color: ${props => props.isUser ? 'white' : '#333'};
  padding: 1rem;
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.isLoading ? 0.7 : 1};
  
  /* Added better typography */
  font-size: 15px;
  line-height: 1.5;

    /* Reduce space between message content and timestamp */
  & > *:last-child:not(${Timestamp}) {
    margin-bottom: 0.25rem; /* Reduced from default spacing */
  }
  
  /* Format recipe content when detected */
  & .recipe-title {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: ${props => props.isUser ? 'white' : '#111'};
  }
  
  & .recipe-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
    color: ${props => props.isUser ? 'rgba(255,255,255,0.8)' : '#555'};
  }
  
  & .recipe-section {
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  & .recipe-ingredient {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0;
    border-bottom: 1px dotted ${props => props.isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
  }
  
  & .recipe-instruction {
    display: flex;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
    
    & .step-number {
      background: ${props => props.isUser ? 'rgba(255,255,255,0.2)' : 'rgba(239, 68, 68, 0.1)'};
      color: ${props => props.isUser ? 'white' : '#ef4444'};
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      flex-shrink: 0;
    }
  }
  
  & .tips-section {
    background: ${props => props.isUser ? 'rgba(255,255,255,0.15)' : 'rgba(239, 68, 68, 0.08)'};
    padding: 0.75rem;
    border-radius: 8px;
    margin-top: 0.75rem;
    font-size: 0.9rem;
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 0.8; }
    100% { opacity: 0.6; }
  }
  
  animation: ${props => props.isLoading ? 'pulse 1.5s infinite' : 'none'};
`;


const InputArea = styled.div`
  display: flex;
  padding: 1rem;
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.8);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

const TextInput = styled.input`
  flex: 1;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(224, 224, 224, 0.8);
  border-radius: 24px; /* More rounded for a friendlier look */
  font-size: 1rem;
  outline: none;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:focus {
    border-color: #f8a4a4;
    box-shadow: 0 0 0 2px rgba(248, 164, 164, 0.2);
  }
`;

const SendButton = styled.button`
  margin-left: 0.5rem;
  width: 46px;
  height: 46px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%; /* Circular button for better aesthetics */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:disabled {
    background: #fca5a5;
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
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
  width: clamp(24px, 2vw, 28px); /* Responsive width */
  height: clamp(24px, 2vw, 28px); /* Responsive height */
  font-size: clamp(8px, 1vw, 10px); /* Responsive font size */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem; /* Reduced from 8px */
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 8px;
    margin-left: 0.35rem;
  }
  
  &:hover {
    background: #dc2626;
    transform: scale(1.05);
  }
  
  &:disabled {
    background: #fca5a5;
    cursor: not-allowed;
  }
`;

// Loading indicator component
const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0.5rem 0;
  
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

// Function to parse and format recipe data from JSON
const formatRecipeContent = (text) => {
  // Try to detect if the message contains a recipe JSON
  if (text.includes('"title":') && text.includes('"ingredients":') && text.includes('"steps":')) {
    try {
      // Extract the JSON part - this regex looks for a JSON-like structure
      const jsonMatch = text.match(/\{.*"title".*"ingredients".*"steps".*\}/s);
      
      if (jsonMatch) {
        const recipeData = JSON.parse(jsonMatch[0]);
        
        // Create formatted HTML structure
        return (
          <div className="recipe-formatted">
            <div className="recipe-title">{recipeData.title}</div>
            
            <div className="recipe-meta">
              {recipeData.prepTime && <span>Prep: {recipeData.prepTime}</span>}
              {recipeData.cookTime && <span>Cook: {recipeData.cookTime}</span>}
              {recipeData.servings && <span>Servings: {recipeData.servings}</span>}
            </div>
            
            <div className="recipe-section">Ingredients</div>
            <div className="ingredients-list">
              {recipeData.ingredients.map((ingredient, idx) => (
                <div key={idx} className="recipe-ingredient">
                  <span>{ingredient.name}</span>
                  <span>{ingredient.amount} {ingredient.unit}</span>
                </div>
              ))}
            </div>
            
            <div className="recipe-section">Instructions</div>
            <div className="instructions-list">
              {recipeData.steps.map((step, idx) => (
                <div key={idx} className="recipe-instruction">
                  <div className="step-number">{idx + 1}</div>
                  <div>{step.instruction}</div>
                </div>
              ))}
            </div>
            
            {recipeData.tips && (
              <div className="tips-section">
                <strong>Chef's Tips:</strong> {recipeData.tips}
              </div>
            )}
          </div>
        );
      }
    } catch (e) {
      console.log("Not a valid recipe JSON, displaying as regular text");
    }
  }
  
  // If not a recipe or parsing failed, return the original text
  return text;
};


const ChatInterface = ({ initialQuery }) => {
  const [input, setInput] = useState('');
  const { askAI, loading } = useAI();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [initialQueryHandled, setInitialQueryHandled] = useState(false);
  const [errorToast, setErrorToast] = useState(null);
  
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

  const handleError = (error) => {
    let errorMessage = "Something went wrong. Please try again.";
    
    if (error.message?.includes('network')) {
      errorMessage = "Network error. Please check your internet connection.";
    } else if (error.message?.includes('timeout')) {
      errorMessage = "Request timed out. Please try again.";
    } else if (error.response?.status === 429) {
      errorMessage = "Too many requests. Please wait a moment before trying again.";
    } else if (error.response?.status === 401) {
      errorMessage = "Authentication error. Please check your API key.";
    }
    
    setErrorToast(errorMessage);
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setErrorToast(null);
    }, 5000);
  };
  
  // ElevenLabs TTS function
  const speakWithElevenLabs = async (text) => {
    try {
      // Stop any current speech
      if (speaking) {
        stopSpeaking();
      }
      
      // Extract plain text if it's HTML content
      let plainText = text;
      if (typeof text !== 'string') {
        plainText = "Here's your recipe. Please check the chat for formatted details.";
      }
      
      // Check if API key is set
      if (!ELEVENLABS_API_KEY) {
        throw new Error('ElevenLabs API Key not configured');
      }

      const detectedLanguage = detectLanguage(plainText);
      const voiceSettings = {
        stability: detectedLanguage.includes('Hindi') ? 0.7 : 0.5,
        similarity_boost: 0.75,
        style: detectedLanguage.includes('Hindi') ? 0.3 : 0.25,
        speaker_boost: true
      };

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
            text: plainText,
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
      
      audio.onplay = () => setSpeaking(true);
      audio.onended = () => {
        setSpeaking(false);
        URL.revokeObjectURL(audio.src);
      };
      audio.onerror = (error) => {
        handleError(new Error('Audio playback failed'));
        setSpeaking(false);
        URL.revokeObjectURL(audio.src);
      };
      
      await audio.play();
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      let errorMessage;
      
      switch(true) {
        case error.message.includes('API Key not configured'):
          errorMessage = "Text-to-speech is not configured. Please check API settings.";
          break;
        case error.message.includes('API error: 429'):
          errorMessage = "Text-to-speech quota exceeded. Please try again later.";
          break;
        case error.message.includes('API error: 401'):
          errorMessage = "Text-to-speech authentication failed. Please check API key.";
          break;
        case error.message.includes('playback failed'):
          errorMessage = "Audio playback failed. Please try again.";
          break;
        default:
          errorMessage = "Text-to-speech service unavailable. Please try again later.";
      }
      
      handleError({ message: errorMessage });
      setSpeaking(false);
    }
  };
  
const stopSpeaking = () => {
  if (audioElement) {
    try {
      audioElement.pause();
      audioElement.currentTime = 0;
      if (audioElement.src) {
        URL.revokeObjectURL(audioElement.src);
      }
    } catch (error) {
      handleError({ message: "Error stopping audio playback" });
    } finally {
      setSpeaking(false);
    }
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
          
          // Format response if it's a recipe
          const formattedResponse = formatRecipeContent(aiResponseText);
          
          // Replace loading message with actual response
          setMessages(prev => [
            prev[0],
            {
              text: formattedResponse,
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
          handleError(error);
          // Replace loading message with error message
          setMessages(prev => [prev[0]]);
        }
      }
    };
    
    handleInitialQuery();
  }, [initialQuery, initialQueryHandled, askAI, ttsEnabled]); 
  
  const handleSubmit = async (e) => {
    e && e.preventDefault();
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
      
      // Format response if it's a recipe
      const formattedResponse = formatRecipeContent(responseText);
      
      // Replace loading message with actual response
      setMessages(prev => [...prev.slice(0, -1), { 
        text: formattedResponse, 
        isUser: false,
        id: Date.now() + 2,
        timestamp: new Date().toISOString()
      }]);
      
      if (ttsEnabled) {
        await speakWithElevenLabs(responseText);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      handleError(error);
      // Replace loading message with error message
      setMessages(prev => prev.filter(msg => !msg.isLoading));
    }
  };
  
  // Handle quick reply click
  const handleQuickReplyClick = (reply) => {
    setInput(reply);
    handleSubmit();
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
    <>
    {errorToast && (
      <Toast>
        <span>⚠️ {errorToast}</span>
        <button 
          className="close-button"
          onClick={() => setErrorToast(null)}
        >
          ✕
        </button>
      </Toast>
    )}
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
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
    </>
  );
};

export default ChatInterface;