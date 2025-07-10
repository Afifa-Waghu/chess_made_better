import React, { useEffect, useState } from 'react';
import { GameState } from '../types/chess';
import { Skull, AlertTriangle } from 'lucide-react';

interface JokerRevealProps {
  gameState: GameState;
  onRevealComplete: () => void;
}

export const JokerReveal: React.FC<JokerRevealProps> = ({ gameState, onRevealComplete }) => {
  const [showReveal, setShowReveal] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReveal(false);
      onRevealComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onRevealComplete]);

  if (!showReveal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 animate-pulse" />
        
        <div className="relative z-10">
          <div className="mb-6">
            <Skull className="mx-auto text-red-500 animate-bounce" size={48} />
          </div>
          
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            ⚠️ JOKER PAWNS REVEALED! ⚠️
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="text-red-500" size={20} />
                <span className="font-semibold text-red-700">White's Joker Pawn</span>
              </div>
              <span className="text-lg font-bold text-red-600">
                {gameState.jokerPawns.white.toUpperCase()}
              </span>
            </div>
            
            <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="text-red-500" size={20} />
                <span className="font-semibold text-red-700">Black's Joker Pawn</span>
              </div>
              <span className="text-lg font-bold text-red-600">
                {gameState.jokerPawns.black.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200 mb-4">
            <p className="text-yellow-800 font-medium text-sm">
              <strong>Remember:</strong> If you capture your opponent's joker pawn, 
              YOU LOSE immediately! They will disappear after this warning.
            </p>
          </div>
          
          <div className="text-pink-500 text-sm animate-pulse">
            Starting game in a few seconds...
          </div>
        </div>
      </div>
    </div>
  );
};