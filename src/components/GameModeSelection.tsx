import React from 'react';
import { Crown, Sparkles, Shuffle, Check as Chess } from 'lucide-react';

interface GameModeSelectionProps {
  onSelectMode: (mode: 'standard' | 'chess960' | 'joker') => void;
}

export const GameModeSelection: React.FC<GameModeSelectionProps> = ({ onSelectMode }) => {
  const gameModes = [
    {
      id: 'standard' as const,
      title: 'Standard Chess',
      icon: <Chess className="text-blue-500" size={48} />,
      description: 'Classic chess with traditional piece placement',
      features: ['Traditional setup', 'All standard rules', 'Perfect for beginners'],
      color: 'blue'
    },
    {
      id: 'chess960' as const,
      title: 'Chess 960',
      icon: <Shuffle className="text-purple-500" size={48} />,
      description: 'Fischer Random Chess with shuffled back row',
      features: ['Randomized back row', 'Same for both players', '960 possible setups'],
      color: 'purple'
    },
    {
      id: 'joker' as const,
      title: 'Joker Variant',
      icon: <Sparkles className="text-pink-500" size={48} />,
      description: 'Our special variant with secret joker pawns!',
      features: ['Randomized back row', 'Secret joker pawns', 'Capture = instant loss!'],
      color: 'pink'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'from-blue-100 to-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          button: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
        };
      case 'purple':
        return {
          bg: 'from-purple-100 to-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
          button: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
        };
      case 'pink':
        return {
          bg: 'from-pink-100 to-pink-50',
          border: 'border-pink-200',
          text: 'text-pink-700',
          button: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
        };
      default:
        return {
          bg: 'from-gray-100 to-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          button: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-4xl w-full shadow-2xl border-4 border-pink-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
            <Crown className="text-pink-500" />
            Chess Made Better
            <Sparkles className="text-pink-500" />
          </h1>
          <p className="text-pink-400 text-lg">✨ Choose Your Chess Adventure ✨</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {gameModes.map((mode) => {
            const colors = getColorClasses(mode.color);
            
            return (
              <div
                key={mode.id}
                className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-6 border-2 ${colors.border} transition-all duration-200 hover:scale-105 hover:shadow-lg`}
              >
                <div className="text-center mb-4">
                  <div className="mb-3">
                    {mode.icon}
                  </div>
                  <h3 className={`text-2xl font-bold ${colors.text} mb-2`}>
                    {mode.title}
                  </h3>
                  <p className={`${colors.text} opacity-80 text-sm mb-4`}>
                    {mode.description}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {mode.features.map((feature, index) => (
                    <div key={index} className={`flex items-center gap-2 ${colors.text} text-sm`}>
                      <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onSelectMode(mode.id)}
                  className={`w-full py-3 rounded-2xl font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r ${colors.button} transform hover:scale-105`}
                >
                  Play {mode.title}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200 inline-block">
            <p className="text-yellow-800 text-sm">
              <strong>New to Chess Made Better?</strong> Try our special Joker Variant for a unique twist on the classic game!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};