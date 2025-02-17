// src/hooks/useSpeechSynthesis.js
import { useState, useEffect } from 'react';

const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [preferredVoice, setPreferredVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Find a preferred female voice (prioritizing natural-sounding ones)
      const femaleVoice = availableVoices.find(voice => 
        // Look for specific high-quality female voices
        voice.name.includes('Samantha') ||        // macOS female voice
        voice.name.includes('Microsoft Zira') ||  // Windows female voice
        voice.name.includes('Google UK English Female') ||
        // If none of the above, find any female voice
        (voice.name.toLowerCase().includes('female') || 
         voice.name.includes('woman') ||
         voice.name.includes('girl'))
      );
      
      setPreferredVoice(femaleVoice || availableVoices[0]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice preferences
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Adjust for more natural-sounding speech
      utterance.rate = 1.0;      // Normal speed
      utterance.pitch = 1.1;     // Slightly higher pitch for female voice
      utterance.volume = 1.0;    // Full volume
      
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const cancel = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  // Utility function to preview available voices
  const listAvailableVoices = () => {
    console.log('Available voices:', voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      gender: voice.name.toLowerCase().includes('female') ? 'female' : 'male'
    })));
  };

  return { 
    speak, 
    cancel, 
    speaking, 
    voices,
    currentVoice: preferredVoice,
    listAvailableVoices 
  };
};

export default useSpeechSynthesis;