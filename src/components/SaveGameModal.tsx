import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface SaveGameModalProps {
  isOpen: boolean;
  onSave: (filename: string) => void;
  onSkip: () => void;
  player1Name: string;
  player2Name: string;
  winner?: string;
}

export const SaveGameModal: React.FC<SaveGameModalProps> = ({
  isOpen,
  onSave,
  onSkip,
  player1Name,
  player2Name,
  winner
}) => {
  const [filename, setFilename] = useState('');

  if (!isOpen) return null;

  const defaultFilename = `${player1Name} vs ${player2Name} - ${new Date().toLocaleDateString()}`;

  const handleSave = () => {
    const finalFilename = filename.trim() || defaultFilename;
    onSave(finalFilename);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-pink-600 mb-2">
            💾 Save This Game?
          </h2>
          {winner && (
            <p className="text-pink-500">
              {winner} won this amazing game!
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-pink-600 font-medium mb-2">Game Name</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder={defaultFilename}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onSkip}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 bg-pink-500 text-white rounded-2xl font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};