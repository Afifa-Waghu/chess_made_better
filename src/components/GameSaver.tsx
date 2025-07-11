import React, { useState } from 'react';
import { Save, Upload, Trash2, X } from 'lucide-react';

interface GameSaverProps {
  onSave: (filename: string) => void;
  onLoad: (filename: string) => void;
  getSavedGames: () => string[];
  player1Name: string;
  player2Name: string;
}

export const GameSaver: React.FC<GameSaverProps> = ({
  onSave,
  onLoad,
  getSavedGames,
  player1Name,
  player2Name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customFilename, setCustomFilename] = useState('');
  const [savedGames, setSavedGames] = useState<string[]>([]);

  const openModal = () => {
    setIsOpen(true);
    setSavedGames(getSavedGames());
  };

  const closeModal = () => {
    setIsOpen(false);
    setCustomFilename('');
  };

  const handleSave = () => {
    const timestamp = new Date().toLocaleDateString();
    const filename = customFilename || `${player1Name} vs ${player2Name} ${timestamp}`;
    onSave(filename);
    closeModal();
    setSavedGames(getSavedGames());
  };

  const handleLoad = (filename: string) => {
    try {
      onLoad(filename);
      closeModal();
    } catch (error) {
      alert('Failed to load game. The save file might be corrupted.');
    }
  };

  const handleDelete = (filename: string) => {
    localStorage.removeItem(`chess_game_${filename}`);
    setSavedGames(getSavedGames());
  };

  if (!isOpen) {
    return (
      <button
        onClick={openModal}
        className="text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
        style={{ 
          backgroundColor: '#8b5cf6',
          boxShadow: '0 4px 12px #8b5cf640'
        }}
      >
        <Save size={16} />
        Save/Load
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-600">Game Manager</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Save Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Save Current Game</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder={`${player1Name} vs ${player2Name} ${new Date().toLocaleDateString()}`}
              className="w-full px-3 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none"
            />
            <button
              onClick={handleSave}
              className="w-full bg-purple-500 text-white py-2 rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Game
            </button>
          </div>
        </div>

        {/* Load Section */}
        <div>
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Load Saved Game</h3>
          {savedGames.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No saved games found</p>
          ) : (
            <div className="space-y-2">
              {savedGames.map((filename) => (
                <div key={filename} className="flex items-center gap-2 p-2 bg-purple-50 rounded-xl">
                  <span className="flex-1 text-sm text-purple-700 truncate">{filename}</span>
                  <button
                    onClick={() => handleLoad(filename)}
                    className="text-green-600 hover:text-green-800 p-1"
                    title="Load game"
                  >
                    <Upload size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(filename)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete game"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};