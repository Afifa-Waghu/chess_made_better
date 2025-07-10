import React from 'react';
import { X, Heart, Zap, Clock, Crown } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-pink-500 hover:text-pink-700 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-pink-600 mb-2">
            ✨ How to Play Chess Made Better ✨
          </h2>
          <p className="text-pink-400">The cutest chess game ever!</p>
        </div>

        <div className="space-y-6">
          <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
            <h3 className="text-xl font-semibold text-pink-700 mb-2 flex items-center gap-2">
              <Crown className="text-pink-500" size={20} />
              Randomized Setup
            </h3>
            <p className="text-pink-600">
              The back row pieces are shuffled randomly at the start of each game! 
              Both players get the same arrangement, so it's still fair. 
              All pieces move exactly like in regular chess.
            </p>
          </div>

          <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
            <h3 className="text-xl font-semibold text-red-700 mb-2 flex items-center gap-2">
              <Heart className="text-red-500" size={20} />
              Joker Pawn Rule
            </h3>
            <p className="text-red-600 mb-2">
              <strong>⚠️ WARNING:</strong> One pawn on each side is secretly a "joker pawn"!
            </p>
            <ul className="text-red-600 text-sm space-y-1 ml-4">
              <li>• If you capture your opponent's joker pawn, YOU LOSE immediately!</li>
              <li>• Joker pawns are revealed briefly at the start, then hidden</li>
              <li>• They move exactly like normal pawns</li>
              <li>• Choose your captures wisely!</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
            <h3 className="text-xl font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <Clock className="text-blue-500" size={20} />
              Time Controls
            </h3>
            <p className="text-blue-600 mb-2">
              Each player gets the same amount of time. But here's the twist:
            </p>
            <ul className="text-blue-600 text-sm space-y-1 ml-4">
              <li>• Capture a pawn: +30 seconds</li>
              <li>• Capture a rook: +1.5 minutes</li>
              <li>• Capture a bishop or knight: +1 minute</li>
              <li>• Capture a queen: +2 minutes</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-2 flex items-center gap-2">
              <Zap className="text-purple-500" size={20} />
              Special Features
            </h3>
            <ul className="text-purple-600 text-sm space-y-1 ml-4">
              <li>• Dramatic capture animations with screen effects</li>
              <li>• Cute bouncy animations for regular moves</li>
              <li>• Customizable themes for each player</li>
              <li>• Save and replay your games</li>
              <li>• Adorable retro-cute aesthetic</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Win Conditions
            </h3>
            <ul className="text-green-600 text-sm space-y-1 ml-4">
              <li>• Checkmate your opponent's king</li>
              <li>• Your opponent runs out of time</li>
              <li>• Your opponent captures YOUR joker pawn</li>
              <li>• Your opponent resigns</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
          >
            Got it! Let's play! 💖
          </button>
        </div>
      </div>
    </div>
  );
};