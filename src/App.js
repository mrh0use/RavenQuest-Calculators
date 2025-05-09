import React, { useState } from 'react';
import QuestCalculator from './QuestCalculator';
import MoaBreedingCalculator from './MoaBreedingCalculator';
import ProfessionOptimizer from './ProfessionOptimizer';
import LandCalculator from './LandCalculator';

function App() {
  const [activeTool, setActiveTool] = useState('quest');
  
  // Handle responsive navigation for mobile
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-2 sm:p-4">
      {/* Mobile menu button */}
      <div className="w-full flex md:hidden justify-center mb-2">
        <button
          onClick={toggleMenu}
          className="text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 p-2 rounded"
        >
          {menuOpen ? 'Hide Menu' : 'Show Menu'} ▼
        </button>
      </div>
      
      {/* Navigation tabs - responsive */}
      <div className={`w-full flex flex-col md:flex-row border-b border-teal-800 mb-4 ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
        <button
          className={`px-4 py-2 font-medium ${
            activeTool === 'quest'
              ? 'text-teal-300 border-b-2 border-teal-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => {setActiveTool('quest'); setMenuOpen(false);}}
        >
          Quest Calculator
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTool === 'moa'
              ? 'text-teal-300 border-b-2 border-teal-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => {setActiveTool('moa'); setMenuOpen(false);}}
        >
          Moa Breeding Calculator
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTool === 'profession'
              ? 'text-teal-300 border-b-2 border-teal-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => {setActiveTool('profession'); setMenuOpen(false);}}
        >
          Profession Optimizer
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTool === 'land'
              ? 'text-teal-300 border-b-2 border-teal-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => {setActiveTool('land'); setMenuOpen(false);}}
        >
          Land Calculator
        </button>
      </div>
      
      {/* Content area - responsive width */}
      <div className="w-full max-w-4xl mx-auto overflow-auto px-1">
        {activeTool === 'quest' && <QuestCalculator />}
        {activeTool === 'moa' && <MoaBreedingCalculator />}
        {activeTool === 'profession' && <ProfessionOptimizer />}
        {activeTool === 'land' && <LandCalculator />}
      </div>
    </div>
  );
}

export default App;
