import React from 'react';
import { X, Eye, EyeOff, Pause, Home } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showPossibleMoves: boolean;
  onTogglePossibleMoves: (show: boolean) => void;
  onPause: () => void;
  onQuit: () => void;
  theme: any;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  showPossibleMoves,
  onTogglePossibleMoves,
  onPause,
  onQuit,
  theme
}) => {
  if (!isOpen) return null;

  const handleQuit = () => {
    if (window.confirm('Are you sure you want to quit the game? All progress will be lost.')) {
      onQuit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: theme.primary }}>
            ⚙️ Game Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Show Possible Moves Toggle */}
          <div className="flex items-center justify-between p-4 bg-pink-50 rounded-2xl border-2 border-pink-200">
            <div className="flex items-center gap-3">
              {showPossibleMoves ? <Eye size={20} /> : <EyeOff size={20} />}
              <div>
                <h3 className="font-semibold text-pink-700">Show Possible Moves</h3>
                <p className="text-sm text-pink-600">Display cute dots on legal moves</p>
              </div>
            </div>
            <button
              onClick={() => onTogglePossibleMoves(!showPossibleMoves)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                showPossibleMoves ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  showPossibleMoves ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Pause Game */}
          <button
            onClick={() => {
              onPause();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <Pause size={20} className="text-blue-600" />
            <div className="text-left">
              <h3 className="font-semibold text-blue-700">Pause Game</h3>
              <p className="text-sm text-blue-600">Pause both timers</p>
            </div>
          </button>

          {/* Quit Game */}
          <button
            onClick={handleQuit}
            className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-2xl border-2 border-red-200 hover:bg-red-100 transition-colors"
          >
            <Home size={20} className="text-red-600" />
            <div className="text-left">
              <h3 className="font-semibold text-red-700">Quit Game</h3>
              <p className="text-sm text-red-600">Return to main menu</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};