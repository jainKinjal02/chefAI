import React, { useState } from 'react';
import { ChefHat, ArrowRight } from 'lucide-react';
import cookingBackground from '../assets/bg-photo.jpeg';

const LandingPage = ({ onStartChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onStartChat(searchQuery);
    }
  };

  const popularQuestions = [
    "How do I make perfect pasta?",
    "What's a quick dinner recipe?",
    "How to store fresh herbs?",
    "Best substitutes for eggs?"
  ];

  const categories = [
    "Recipes", "Techniques", "Ingredients", 
    "Kitchen Tips", "Meal Planning", "Nutrition"
  ];

  return (
    <div className="min-h-screen font-poppins flex flex-col"
         style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${cookingBackground})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Chef hat logo */}
        <div className="bg-white p-4 rounded-full mb-6">
          <ChefHat size={36} className="text-gray-800" />
        </div>
        
        {/* Main title and tagline */}
        <h2 className="text-white text-2xl mb-2">Pan it out</h2>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-red-400">
          ChefBot
        </h1>
        
        {/* Subtitle */}
        <p className="text-white text-lg md:text-xl mb-10 max-w-2xl">
          Ask anything about cooking, recipes, ingredients, or kitchen tips
        </p>
        
        {/* Search box */}
        <form onSubmit={handleSubmit} className="w-full max-w-lg mb-10">
          <div className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask your culinary question..."
              className="w-full py-3 pl-10 pr-12 text-gray-800 bg-gray-200 bg-opacity-90 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-red-400 hover:bg-red-500 text-white rounded-full transition-colors duration-200"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
        
        {/* Popular questions */}
        <div className="mb-10">
          <h3 className="text-white uppercase tracking-wider mb-4 text-sm font-semibold">
            Popular Questions
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {popularQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => onStartChat(question)}
                className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-4 py-2 rounded-full text-sm transition-all duration-200 border border-gray-600"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
        
        {/* Browse by category */}
        <div>
          <h3 className="text-white uppercase tracking-wider mb-4 text-sm font-semibold">
            Browse by Category
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => onStartChat(`Tell me about ${category.toLowerCase()}`)}
                className="bg-red-400 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-full text-sm transition-all duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <footer className="text-center text-white py-4 text-sm">
        <p>© 2025 ChefBot | Pan it Out</p>
      </footer>
    </div>
  );
};

export default LandingPage;