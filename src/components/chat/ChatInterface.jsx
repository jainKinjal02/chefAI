import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAI } from '../../context/AIContext';
import VoiceControl from './VoiceControl';

// Styled components
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
  display: flex;
  flex-direction: column;
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

  &:disabled {
    background: #a0c0f0;
    cursor: not-allowed;
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

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const PlayButton = styled.button`
  background: #4285f4;
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
    background: #3367d6;
  }
  
  &:disabled {
    background: #a0c0f0;
    cursor: not-allowed;
  }
`;

const VoiceSettingsContainer = styled.div`
  padding: 0.5rem 1rem;
  background: #f0f8ff;
  border-top: 1px solid #e0e0e0;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const VoiceSelector = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-right: 0.5rem;
`;

const VoiceToggle = styled.button`
  padding: 0.5rem;
  background: ${props => props.active ? '#4285f4' : '#e0e0e0'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    opacity: 0.9;
  }
`;

const SettingsToggle = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 0.9rem;
  text-decoration: underline;
  margin-left: auto;
  
  &:hover {
    color: #4285f4;
  }
`;

// Bilingual-friendly ElevenLabs voices with correct IDs
const BILINGUAL_VOICES = [
  { 
    id: 'hGb0Exk8cp4vQEnwolxa',  // Removed 'premade/' prefix
    name: 'Ayesha - Energetic Hindi Voice',
    languages: ['Hindi', 'English', 'Multilingual'],
    isIndian: true
  },
  { 
    id: 'fEJqMD6Jp1JFP8T1BZpd',  // Removed 'premade/' prefix
    name: 'Bhavna',
    languages: ['Hindi','English', 'Multilingual'],
    isIndian: true
  },
  { 
    id: '3gsg3cxXyFLcGIfNbM6C',  // Removed 'premade/' prefix
    name: 'Varun',
    languages: ['Hindi', 'English'],
    isIndian: true
  },
  { 
    id: 'CwhRBWXzGAHq8TQ4Fs17',  // Removed 'premade/' prefix
    name: 'Roger',
    languages: ['Hindi', 'English', 'Multilingual'],
    isIndian: false
  }
];

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const { askAI, loading } = useAI();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  
  // ElevenLabs integration
  const ELEVENLABS_API_KEY = 'sk_9b6480e22b2fa9d069468b51f5b67ed15641e39a0bb1524f';
  const [selectedVoice, setSelectedVoice] = useState('Ayesha'); // Updated default voice ID
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  
  // Fetch available voices from ElevenLabs
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY
          }
        });
        console.log('Available ElevenLabs voices:', response.data.voices);
        setAvailableVoices(response.data.voices);
      } catch (error) {
        console.error('Failed to fetch voices:', error);
      }
    };
    
    if (ELEVENLABS_API_KEY && ELEVENLABS_API_KEY !== 'YOUR_ELEVENLABS_API_KEY') {
      fetchVoices();
    }
  }, [ELEVENLABS_API_KEY]);
  
  // Function to detect language in text (simple heuristic)
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
  
  const speakWithElevenLabs = async (text) => {
    try {
      console.log("Starting speech synthesis...");
      // Stop any current speech
      if (speaking) {
        stopSpeaking();
      }
      
      // Detect language
      const detectedLanguage = detectLanguage(text);
      console.log(`Detected language: ${detectedLanguage}`);
      
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
      
      console.log("Making API request to ElevenLabs...");
      console.log(`Using voice ID: ${selectedVoice}`);
      
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
        {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: voiceSettings
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          responseType: 'blob'
        }
      );
      
      console.log("API response received, creating audio...");
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      setAudioElement(audio);
      
      console.log("Setting up audio event handlers...");
      audio.onplay = () => {
        console.log("Audio playback started");
        setSpeaking(true);
      };
      audio.onended = () => {
        console.log("Audio playback ended");
        setSpeaking(false);
        if (audio.src) URL.revokeObjectURL(audio.src);
      };
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setSpeaking(false);
        if (audio.src) URL.revokeObjectURL(audio.src);
      };
      
      console.log("Attempting to play audio...");
      try {
        await audio.play();
        console.log("Audio playback successfully started");
      } catch (playError) {
        console.error("Error playing audio:", playError);
        // Handle autoplay restrictions
        if (playError.name === 'NotAllowedError') {
          console.log("Autoplay prevented by browser. User interaction required.");
          // The play buttons will handle this case
        }
      }
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
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
  
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const query = input || e;
    if (!query.trim() || loading) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: query, isUser: true }]);
    setInput('');
    
    try {
      // Get AI response
      const response = await askAI(query);
      
      // Add AI response
      const responseText = typeof response === 'object' ? response.display : response;
      setMessages(prev => [...prev, { 
        text: responseText, 
        isUser: false,
        id: Date.now() // Add unique id for each message
      }]);
      
      // Speak with ElevenLabs if enabled
      if (ttsEnabled) {
        await speakWithElevenLabs(responseText);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I had trouble processing that request. Please try again.", 
        isUser: false,
        id: Date.now()
      }]);
    }
  };
  
  // Voice settings toggle
  const toggleVoiceSettings = () => {
    setShowVoiceSettings(prev => !prev);
  };
  
  // Handle play button click
  const handlePlay = (text) => {
    speakWithElevenLabs(text);
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);
  
  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg) => (
          <MessageContainer key={msg.id || Math.random()}>
            <Message isUser={msg.isUser}>
              {msg.text}
            </Message>
            {!msg.isUser && ttsEnabled && (
              <PlayButton 
                onClick={() => handlePlay(msg.text)}
                disabled={speaking}
                title="Play message"
              >
                ▶
              </PlayButton>
            )}
          </MessageContainer>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <VoiceSettingsContainer visible={showVoiceSettings}>
        <div style={{ marginBottom: '0.5rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Voice Settings</h4>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label>Select Voice:</label>
            <VoiceSelector
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              disabled={speaking}
            >
              <optgroup label="Indian Voices (Best for Hindi)">
                {BILINGUAL_VOICES
                  .filter(voice => voice.isIndian)
                  .map(voice => (
                    <option key={voice.id} value={voice.id}>{voice.name}</option>
                  ))
                }
              </optgroup>
              <optgroup label="Multilingual Voices">
                {BILINGUAL_VOICES
                  .filter(voice => !voice.isIndian)
                  .map(voice => (
                    <option key={voice.id} value={voice.id}>{voice.name}</option>
                  ))
                }
              </optgroup>
            </VoiceSelector>
            
            <VoiceToggle 
              active={ttsEnabled}
              onClick={() => setTtsEnabled(prev => !prev)}
            >
              {ttsEnabled ? 'Voice On' : 'Voice Off'}
            </VoiceToggle>
            
            {speaking && (
              <button
                onClick={stopSpeaking}
                style={{
                  padding: '0.5rem',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Stop
              </button>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0', color: '#666' }}>
            Note: All voices can read both Hindi (in Roman or Devanagari script) and English.
            Indian voices provide more authentic Hindi pronunciation.
          </p>
        </div>
      </VoiceSettingsContainer>
      
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
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '0.5rem 1rem',
        borderTop: '1px solid #e0e0e0',
        background: 'white'
      }}>
        <VoiceControl onQuerySubmit={handleSubmit} />
        <SettingsToggle onClick={toggleVoiceSettings}>
          {showVoiceSettings ? 'Hide Voice Settings' : 'Show Voice Settings'}
        </SettingsToggle>
      </div>
    </ChatContainer>
  );
};

export default ChatInterface;