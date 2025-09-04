
import React, { useState, useEffect, useCallback } from 'react';
import Wheel from './components/Wheel';
import { RESTAURANTS, SPIN_DURATION_MS } from './constants';

const App: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const handleSpin = useCallback(() => {
    if (spinning) return;

    setSpinning(true);
    setWinner(null);
    
    const newWinnerIndex = Math.floor(Math.random() * RESTAURANTS.length);
    const segmentAngle = 360 / RESTAURANTS.length;
    
    const randomAngleInSegment = (newWinnerIndex * segmentAngle) + (segmentAngle / 2);
    
    // Pointer is at the top (270 degrees). We want the middle of the winning segment to land there.
    const targetRotation = 270 - randomAngleInSegment;
    
    // Add multiple full spins for effect and make it additive
    const fullSpins = 8 * 360;
    const currentOffset = rotation % 360;
    const newRotation = rotation - currentOffset + fullSpins + targetRotation;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setWinner(RESTAURANTS[newWinnerIndex]);
    }, SPIN_DURATION_MS);
  }, [spinning, rotation]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        handleSpin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSpin]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white font-sans p-4 overflow-hidden">
      <header className="text-center mb-6 z-20">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Roue des Restaurants
        </h1>
        <p className="text-slate-400 mt-2">Où allons-nous manger aujourd'hui ?</p>
      </header>
      
      <main className="relative flex flex-col items-center justify-center">
        <div className="absolute top-0 -translate-y-2.5 left-1/2 -translate-x-1/2 z-10">
            <div className="w-0 h-0 
              border-l-[15px] border-l-transparent
              border-t-[25px] border-t-yellow-400
              border-r-[15px] border-r-transparent
              drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            </div>
             <div className="w-4 h-4 bg-yellow-400 rounded-full absolute -top-4 left-1/2 -translate-x-1/2"></div>
        </div>
        
        <Wheel
          restaurants={RESTAURANTS}
          rotation={rotation}
        />
        
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full border-8 border-slate-900 shadow-lg text-slate-800 font-bold text-lg
          flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out
          hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {spinning ? '...' : 'Tourner'}
        </button>
      </main>

      <footer className="text-center mt-8 h-24">
        {!spinning && winner && (
          <div className="animate-bounce">
            <p className="text-slate-300">Le gagnant est...</p>
            <p className="text-4xl font-bold text-yellow-400 mt-1 drop-shadow-lg">{winner}</p>
          </div>
        )}
        {!spinning && !winner && (
           <p className="text-slate-500 text-lg">Appuyez sur <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg shadow-sm">Espace</kbd> pour tourner</p>
        )}
      </footer>
    </div>
  );
};

export default App;
