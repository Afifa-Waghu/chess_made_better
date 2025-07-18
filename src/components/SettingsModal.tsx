import React from 'react';
import { X, Eye, Pause, LogOut } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showPossibleMoves: boolean;
  onToggleShowMoves: () => void;
  onPauseGame: () => void;
  onQuitGame: () => void;
  isPaused: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  showPossibleMoves,
  onToggleShowMoves,
  onPauseGame,
  onQuitGame,
  isPaused
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-pink-500 hover:text-pink-700 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-pink-600 mb-2">
            ⚙️ Game Settings
          </h2>
        </div>

        <div className="space-y-4">
          {/* Show Possible Moves */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-pink-50 rounded-xl sm:rounded-2xl border-2 border-pink-200">
            <div className="flex items-center gap-3">
              <Eye className="text-pink-500" size={18} />
              <span className="font-medium text-pink-700 text-sm sm:text-base">Show Possible Moves</span>
            </div>
            <button
              onClick={onToggleShowMoves}
              className={`
                relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors duration-200
                ${showPossibleMoves ? 'bg-pink-500' : 'bg-gray-300'}
              `}
            >
              <div className={`
                absolute top-0.5 w-4 h-4 sm:top-1 sm:w-4 sm:h-4 bg-white rounded-full transition-transform duration-200
                ${showPossibleMoves ? 'translate-x-5 sm:translate-x-7' : 'translate-x-0.5 sm:translate-x-1'}
              `} />
            </button>
          </div>

          {/* Pause Game */}
          <button
            onClick={() => { onPauseGame(); onClose(); }}
            className="w-full flex items-center gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl sm:rounded-2xl border-2 border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <Pause className="text-blue-500" size={18} />
            <span className="font-medium text-blue-700 text-sm sm:text-base">
              {isPaused ? 'Resume Game' : 'Pause Game'}
            </span>
          </button>

          {/* Quit Game */}
          <button
            onClick={() => { onQuitGame(); onClose(); }}
            className="w-full flex items-center gap-3 p-3 sm:p-4 bg-red-50 rounded-xl sm:rounded-2xl border-2 border-red-200 hover:bg-red-100 transition-colors"
          >
            <LogOut className="text-red-500" size={18} />
            <span className="font-medium text-red-700 text-sm sm:text-base">Quit Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};