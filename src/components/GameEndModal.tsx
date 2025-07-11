import React from 'react';
import { PieceColor } from '../types/chess';
import { Crown, Trophy, Skull } from 'lucide-react';

interface GameEndModalProps {
  winner?: PieceColor;
  reason: 'checkmate' | 'timeout' | 'joker' | 'resignation' | 'draw';
  onNewGame: () => void;
  winnerName: string;
}

export const GameEndModal: React.FC<GameEndModalProps> = ({
  winner,
  reason,
  onNewGame,
  winnerName
}) => {
  const getWinMessage = () => {
    if (winner === undefined) {
      return "🤝 It's a draw! Great game!";
    }
    
    switch (reason) {
      case 'joker':
        return `💀 ${winnerName} wins! Their opponent captured the joker pawn!`;
      case 'timeout':
        return `⏰ ${winnerName} wins! Their opponent ran out of time!`;
      case 'checkmate':
        return `♔ ${winnerName} wins by checkmate!`;
      default:
        return `🎉 ${winnerName} wins!`;
    }
  };

  const getIcon = () => {
    switch (reason) {
      case 'draw':
        return <Handshake className="text-green-500 animate-bounce" size={48} />;
      case 'joker':
        return <Skull className="text-red-500 animate-bounce" size={48} />;
      case 'timeout':
        return <Crown className="text-yellow-500 animate-bounce" size={48} />;
      default:
        return <Trophy className="text-gold-500 animate-bounce" size={48} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center relative overflow-hidden">
        {/* Confetti Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 animate-pulse" />
        
        <div className="relative z-10">
          <div className="mb-6">
            {getIcon()}
          </div>
          
          <h2 className="text-3xl font-bold text-purple-600 mb-4">
            {winner === undefined ? 'Draw!' : 'Game Over!'}
          </h2>
          
          <p className="text-lg text-purple-700 mb-6">
            {getWinMessage()}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={onNewGame}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
            >
              🎮 Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};