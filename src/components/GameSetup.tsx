import React, { useState } from 'react';
import { PlayerInfo, TimeControl } from '../types/chess';
import { themes } from '../styles/themes';
import { Heart, Sparkles, Crown } from 'lucide-react';

interface GameSetupProps {
  onStartGame: (whitePlayer: PlayerInfo, blackPlayer: PlayerInfo, timeControl: TimeControl, globalTheme: string) => void;
  gameMode: 'standard' | 'chess960' | 'joker';
  onBack: () => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, gameMode, onBack }) => {
  const [whitePlayer, setWhitePlayer] = useState<PlayerInfo>({
    name: '',
    color: 'white',
    theme: 'Princess Pink'
  });
  
  const [blackPlayer, setBlackPlayer] = useState<PlayerInfo>({
    name: '',
    color: 'black',
    theme: 'Princess Pink'
  });
  
  const [timeControl, setTimeControl] = useState<TimeControl>({
    minutes: 15,
    seconds: 0
  });

  const [globalTheme, setGlobalTheme] = useState('Princess Pink');

  const handleStartGame = () => {
    if (whitePlayer.name && blackPlayer.name) {
      onStartGame(whitePlayer, blackPlayer, timeControl, globalTheme);
    }
  };

  const handleTimeChange = (minutes: number) => {
    setTimeControl({ minutes, seconds: 0 });
  };

  const getGameModeTitle = () => {
    switch (gameMode) {
      case 'standard':
        return 'Standard Chess';
      case 'chess960':
        return 'Chess 960';
      case 'joker':
        return 'Joker Variant';
      default:
        return 'Chess Made Better';
    }
  };

  const getGameModeDescription = () => {
    switch (gameMode) {
      case 'standard':
        return '♔ Classic chess with traditional setup';
      case 'chess960':
        return '🔀 Fischer Random with shuffled back row';
      case 'joker':
        return '💀 Special variant with secret joker pawns';
      default:
        return '✨ Cute • Retro • Magical ✨';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-2xl w-full shadow-2xl border-4 border-pink-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
            <Crown className="text-pink-500" />
            {getGameModeTitle()}
            <Sparkles className="text-pink-500" />
          </h1>
          <p className="text-pink-400 text-lg">{getGameModeDescription()}</p>
          <button
            onClick={onBack}
            className="mt-2 text-pink-500 hover:text-pink-700 text-sm underline"
          >
            ← Back to Game Mode Selection
          </button>
        </div>

        <div className="space-y-6">
          {/* Player 1 Setup */}
          <div className="bg-pink-50 rounded-2xl p-6 border-2 border-pink-200">
            <h3 className="text-xl font-semibold text-pink-700 mb-4 flex items-center gap-2">
              <Heart className="text-pink-500" size={20} />
              Player 1 (White)
            </h3>
            <div>
              <label className="block text-pink-600 font-medium mb-2">Name</label>
              <input
                type="text"
                value={whitePlayer.name}
                onChange={(e) => setWhitePlayer(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none bg-white/80"
                placeholder="Enter your name..."
              />
            </div>
          </div>

          {/* Player 2 Setup */}
          <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
              <Heart className="text-purple-500" size={20} />
              Player 2 (Black)
            </h3>
            <div>
              <label className="block text-purple-600 font-medium mb-2">Name</label>
              <input
                type="text"
                value={blackPlayer.name}
                onChange={(e) => setBlackPlayer(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none bg-white/80"
                placeholder="Enter your name..."
              />
            </div>
          </div>

          {/* Time Control */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
            <h3 className="text-xl font-semibold text-pink-700 mb-4">Time Control</h3>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-2xl font-bold text-pink-600">{timeControl.minutes} minute{timeControl.minutes !== 1 ? 's' : ''}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={timeControl.minutes}
                  onChange={(e) => handleTimeChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((timeControl.minutes - 1) / 59) * 100}%, #fce7f3 ${((timeControl.minutes - 1) / 59) * 100}%, #fce7f3 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-pink-500 mt-1">
                  <span>1 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Theme Selection */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
            <h3 className="text-xl font-semibold text-pink-700 mb-4">Choose Color Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map(theme => (
                <button
                  key={theme.name}
                  onClick={() => setGlobalTheme(theme.name)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${globalTheme === theme.name ? 'border-pink-500 shadow-lg scale-105' : 'border-gray-200 hover:border-pink-300'}
                  `}
                  style={{
                    background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.secondary} 100%)`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div>
                      <div className="font-semibold" style={{ color: theme.text }}>
                        {theme.name}
                      </div>
                      <div className="flex gap-1 mt-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.boardLight }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.boardDark }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Game Button */}
          <button
            onClick={handleStartGame}
            disabled={!whitePlayer.name || !blackPlayer.name}
            className={`w-full py-4 rounded-2xl font-bold text-xl transition-all duration-200 ${
              whitePlayer.name && blackPlayer.name
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            ✨ Start ✨
          </button>
        </div>
      </div>
    </div>
  );
};