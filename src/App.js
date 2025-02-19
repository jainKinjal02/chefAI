// App.jsx
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/chat/ChatInterface';
import { AIProvider } from './context/AIContext';

const App = () => {
  const [view, setView] = useState('landing');
  const [initialQuery, setInitialQuery] = useState('');

  const handleStartChat = (query) => {
    setInitialQuery(query);
    setView('chat');
  };

  const handleBackToHome = () => {
    setView('landing');
  };

  return (
    <AIProvider>
      <div className="min-h-screen font-poppins">
        {view === 'landing' ? (
          <LandingPage onStartChat={handleStartChat} />
        ) : (
          <div className="h-screen flex flex-col">
            <header className="bg-red-400 text-white p-3 shadow-md flex items-center">
              <button 
                onClick={handleBackToHome}
                className="mr-3 hover:bg-red-500 p-1 rounded transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="flex items-center">
                <span className="text-white bg-white p-1 rounded-full mr-2">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <h1 className="font-semibold">ChefBot</h1>
              </div>
            </header>
            <div className="flex-1 overflow-hidden">
              <ChatInterface initialQuery={initialQuery} />
            </div>
          </div>
        )}
      </div>
    </AIProvider>
  );
};

export default App;