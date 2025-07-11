import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

interface SavePromptModalProps {
  isOpen: boolean;
  onSave: (filename: string) => void;
  onSkip: () => void;
  player1Name: string;
  player2Name: string;
  theme: any;
}

export const SavePromptModal: React.FC<SavePromptModalProps> = ({
  isOpen,
  onSave,
  onSkip,
  player1Name,
  player2Name,
  theme
}) => {
  const [filename, setFilename] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const timestamp = new Date().toLocaleDateString();
    const finalFilename = filename || `${player1Name} vs ${player2Name} ${timestamp}`;
    onSave(finalFilename);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center">
        <h3 className="text-xl font-bold mb-4" style={{ color: theme.primary }}>
          💾 Save This Game?
        </h3>
        
        <p className="text-gray-600 mb-4">
          Would you like to save this game for later replay?
        </p>
        
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder={`${player1Name} vs ${player2Name} ${new Date().toLocaleDateString()}`}
          className="w-full px-3 py-2 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none mb-4"
        />
        
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-purple-500 text-white py-2 rounded-xl font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Save Game
          </button>
        </div>
      </div>
    </div>
  );
};