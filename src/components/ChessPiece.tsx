import React from 'react';
import { ChessPiece as ChessPieceType } from '../types/chess';
import { getTheme } from '../styles/themes';

interface ChessPieceProps {
  piece: ChessPieceType;
  isSelected: boolean;
  isInvalidMove?: boolean;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isJokerRevealed?: boolean;
  playerThemes?: { white: string; black: string };
  isDragging?: boolean;
  globalTheme?: string;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({ 
  piece, 
  isSelected, 
  isInvalidMove = false,
  onClick,
  onDragStart,
  onDragEnd,
  isJokerRevealed = false,
  playerThemes = { white: 'Princess Pink', black: 'Princess Pink' },
  isDragging = false,
  globalTheme = 'Princess Pink'
}) => {
  const theme = getTheme(globalTheme);
  
  // Check if this king is in check for red coloring
  const isKingInCheck = piece.type === 'king' && isInvalidMove;
  
  const getPieceSymbol = (piece: ChessPieceType): string => {
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

  const isJokerPawn = piece.type === 'pawn' && piece.isJoker;
  const showJokerEffect = isJokerPawn && isJokerRevealed;

  // Make white pieces white and black pieces lighter gray for better contrast
  const pieceColor = piece.color === 'white' ? '#ffffff' : '#9ca3af'; // Lighter gray for black pieces
  const shadowColor = piece.color === 'white' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)';
  const bgColor = isKingInCheck ? '#fca5a5' : (piece.color === 'white' ? theme.boardLight : theme.boardDark); // Red tint for king in check

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`
        relative w-full h-full flex items-center justify-center cursor-grab
        transition-all duration-300 transform
        ${isSelected ? 'scale-125 z-20 animate-bounce' : 'hover:scale-110'}
        ${showJokerEffect ? 'animate-pulse' : ''}
        ${isDragging ? 'opacity-50 scale-110 z-30' : ''}
        ${isInvalidMove ? 'animate-bounce text-red-500' : ''}
      `}
      style={{
        filter: `drop-shadow(0 4px 8px ${shadowColor})`
      }}
    >
      {/* Joker Effect */}
      {showJokerEffect && (
        <div className="absolute inset-0 bg-red-500 rounded-full opacity-30 animate-ping" />
      )}
      
      {/* Cute Background Circle */}
      <div 
        className="absolute inset-1 rounded-full opacity-90"
        style={{ 
          backgroundColor: bgColor,
          boxShadow: `inset 0 2px 4px rgba(255,255,255,0.3), 0 2px 8px ${bgColor}40`
        }}
      />
      
      {/* Piece Symbol */}
      <div className={`
        text-5xl select-none relative z-10 font-bold
        ${isSelected ? 'animate-bounce' : ''}
        ${showJokerEffect ? 'animate-pulse' : ''}
        ${isInvalidMove ? 'animate-pulse text-red-600' : ''}
      `}
      style={{ 
        color: pieceColor,
        textShadow: piece.color === 'white' ? '0 2px 4px rgba(0,0,0,0.5)' : '0 2px 4px rgba(255,255,255,0.5)'
      }}>
        {getPieceSymbol(piece)}
      </div>
      
      {/* Joker Warning */}
      {showJokerEffect && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce z-20">
          ⚠
        </div>
      )}
    </div>
  );
};