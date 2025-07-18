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
  isInCheck?: boolean;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  color,
  name,
  time,
  isActive,
  theme,
  capturedPieces,
  isTop,
  isInCheck = false
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
      flex flex-col sm:flex-row items-center gap-2 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 backdrop-blur-sm w-full max-w-4xl
      ${isActive ? 'scale-105 shadow-lg' : ''}
      ${isCriticalTime ? 'animate-pulse' : ''}
      ${isInCheck ? 'ring-2 ring-red-500' : ''}
    `}
    style={{ 
      backgroundColor: isInCheck ? '#fef2f2' : `${playerTheme.background}90`,
      borderColor: isActive ? playerTheme.accent : playerTheme.border,
      boxShadow: isActive ? `0 8px 25px ${playerTheme.accent}40` : undefined
    }}>
      {/* Player Color Indicator */}
      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 flex-shrink-0 ${color === 'white' ? 'bg-white border-gray-400' : 'bg-gray-800 border-gray-600'}`} />
      
      {/* Player Name */}
      <div className="text-sm sm:text-base lg:text-lg font-bold text-center sm:text-left" style={{ color: playerTheme.text }}>
        {name} {isInCheck && '👑⚠️'}
      </div>
      
      {/* Timer */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Clock size={16} className={`sm:w-[18px] sm:h-[18px] ${isLowTime ? 'text-red-500' : ''}`} style={{ color: isLowTime ? '#ef4444' : playerTheme.accent }} />
        <span className={`text-lg sm:text-xl font-bold ${
          isCriticalTime ? 'text-red-600' : 
          isLowTime ? 'text-orange-600' : ''
        }`}
        style={{ color: isCriticalTime ? '#dc2626' : isLowTime ? '#ea580c' : playerTheme.text }}>
          {formatTime(time)}
        </span>
      </div>
      
      {/* Captured Pieces */}
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 w-full sm:w-auto">
        <span className="text-xs sm:text-sm font-medium" style={{ color: playerTheme.text }}>Captured:</span>
        <div className="flex gap-1 min-w-[60px] sm:min-w-[100px] flex-wrap justify-center sm:justify-start">
          {capturedByColor.map((piece, index) => (
            <span key={index} className="text-sm sm:text-base lg:text-lg opacity-70">
              {getPieceEmoji(piece)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};