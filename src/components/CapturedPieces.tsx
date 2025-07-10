import React from 'react';
import { ChessPiece } from '../types/chess';

interface CapturedPiecesProps {
  pieces: ChessPiece[];
  color: 'white' | 'black';
}

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, color }) => {
  const getPieceSymbol = (piece: ChessPiece): string => {
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

  const capturedByColor = pieces.filter(piece => piece.color !== color);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border-2 border-pink-200 min-h-[60px]">
      <h4 className="text-sm font-semibold text-pink-700 mb-2">Captured</h4>
      <div className="flex flex-wrap gap-1">
        {capturedByColor.map((piece, index) => (
          <span key={index} className="text-lg opacity-70">
            {getPieceSymbol(piece)}
          </span>
        ))}
      </div>
    </div>
  );
};