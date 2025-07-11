import React, { useState } from 'react';
import { Settings, Undo, Redo, HelpCircle, Flag, Handshake, Play, Pause } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { HelpModal } from './HelpModal';

interface TopBarProps {
  onUndo: () => void;
  onRedo: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  onPause: () => void;
  onResume: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isPaused: boolean;
  showPossibleMoves: boolean;
  onTogglePossibleMoves: (show: boolean) => void;
  currentPlayerName: string;
  theme: any;
}

export const TopBar: React.FC<TopBarProps> = ({
  onUndo,
  onRedo,
  onResign,
  onOfferDraw,
  onPause,
  onResume,
  canUndo,
  canRedo,
  isPaused,
  showPossibleMoves,
  onTogglePossibleMoves,
  currentPlayerName,
  theme
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showResignConfirm, setShowResignConfirm] = useState(false);

  const handleResign = () => {
    setShowResignConfirm(true);
  };

  const confirmResign = () => {
    onResign();
    setShowResignConfirm(false);
  };

  return (
    <>
      <div 
        className="flex justify-between items-center mb-4 p-4 rounded-2xl border-2"
        style={{ 
          backgroundColor: `${theme.background}80`,
          borderColor: theme.border,
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Left Side - Game Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
            style={{ 
              backgroundColor: theme.accent,
              boxShadow: `0 4px 12px ${theme.accent}40`
            }}
          >
            <Settings size={16} />
            Settings
          </button>
          
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              !canUndo ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ 
              backgroundColor: theme.primary,
              boxShadow: `0 4px 12px ${theme.primary}40`
            }}
          >
            <Undo size={16} />
          </button>
          
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              !canRedo ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ 
              backgroundColor: theme.primary,
              boxShadow: `0 4px 12px ${theme.primary}40`
            }}
          >
            <Redo size={16} />
          </button>
        </div>

        {/* Center - Current Player */}
        <div className="text-center">
          <h2 className="text-xl font-bold" style={{ color: theme.text }}>
            {currentPlayerName}'s Turn
          </h2>
          {isPaused && (
            <div className="text-sm" style={{ color: theme.accent }}>
              Game Paused
            </div>
          )}
        </div>

        {/* Right Side - Game Actions */}
        <div className="flex gap-2">
          <button
            onClick={isPaused ? onResume : onPause}
            className="text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
            style={{ 
              backgroundColor: theme.secondary,
              boxShadow: `0 4px 12px ${theme.secondary}40`
            }}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button
            onClick={() => setShowHelp(true)}
            className="text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
            style={{ 
              backgroundColor: theme.accent,
              boxShadow: `0 4px 12px ${theme.accent}40`
            }}
          >
            <HelpCircle size={16} />
            Help
          </button>
          
          <button
            onClick={onOfferDraw}
            className="text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
            style={{ 
              backgroundColor: '#10b981',
              boxShadow: '0 4px 12px #10b98140'
            }}
          >
            <Handshake size={16} />
            Draw
          </button>
          
          <button
            onClick={handleResign}
            className="text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
            style={{ 
              backgroundColor: '#ef4444',
              boxShadow: '0 4px 12px #ef444440'
            }}
          >
            <Flag size={16} />
            Resign
          </button>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        showPossibleMoves={showPossibleMoves}
        onTogglePossibleMoves={onTogglePossibleMoves}
        onPause={onPause}
        onQuit={() => window.location.reload()}
        theme={theme}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        onOpen={onPause}
      />

      {/* Resign Confirmation */}
      {showResignConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-red-600 mb-4">Confirm Resignation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to resign? This will end the game and you will lose.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResignConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmResign}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold"
              >
                Resign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};