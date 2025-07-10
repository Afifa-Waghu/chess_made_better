import React from 'react';
import { PieceColor, ChessPiece } from '../types/chess';
import { Clock } from 'lucide-react';
import { getTheme } from '../styles/themes';

interface PlayerInfoProps {
  color: PieceColor;
  name: string;
  time: number;
  isActive: boolean;
  theme: string;
  capturedPieces: ChessPiece[];
  isTop: boolean;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  color,
  name,
  time,
  isActive,
  theme,
  capturedPieces,
  isTop
}) => {
  const playerTheme = getTheme(theme);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPieceEmoji = (piece: ChessPiece): string => {
    const symbols = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };
    
    return symbols[piece.color][piece.type];
  };

  const isLowTime = time < 30;
  const isCriticalTime = time < 10;
  const capturedByColor = capturedPieces.filter(piece => piece.color !== color);

  return (
    <div className={`
      flex items-center gap-6 px-6 py-3 rounded-2xl border-2 transition-all duration-200 backdrop-blur-sm
      ${isActive ? 'scale-105 shadow-lg' : ''}
      ${isCriticalTime ? 'animate-pulse' : ''}
    `}
    style={{ 
      backgroundColor: `${playerTheme.background}90`,
      borderColor: isActive ? playerTheme.accent : playerTheme.border,
      boxShadow: isActive ? `0 8px 25px ${playerTheme.accent}40` : undefined
    }}>
      {/* Player Color Indicator */}
      <div className={`w-4 h-4 rounded-full border-2 ${color === 'white' ? 'bg-white border-gray-400' : 'bg-gray-800 border-gray-600'}`} />
      
      {/* Player Name */}
      <div className="text-lg font-bold" style={{ color: playerTheme.text }}>
        {name}
      </div>
      
      {/* Timer */}
      <div className="flex items-center gap-2">
        <Clock size={18} className={`${isLowTime ? 'text-red-500' : ''}`} style={{ color: isLowTime ? '#ef4444' : playerTheme.accent }} />
        <span className={`text-xl font-bold ${
          isCriticalTime ? 'text-red-600' : 
          isLowTime ? 'text-orange-600' : ''
        }`}
        style={{ color: isCriticalTime ? '#dc2626' : isLowTime ? '#ea580c' : playerTheme.text }}>
          {formatTime(time)}
        </span>
      </div>
      
      {/* Captured Pieces */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium" style={{ color: playerTheme.text }}>Captured:</span>
        <div className="flex gap-1 min-w-[100px]">
          {capturedByColor.map((piece, index) => (
            <span key={index} className="text-lg opacity-70">
              {getPieceEmoji(piece)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};