import React from 'react';
import { PieceType } from '../types/chess';

interface PawnPromotionModalProps {
  isOpen: boolean;
  color: 'white' | 'black';
  onPromote: (pieceType: PieceType) => void;
}

export const PawnPromotionModal: React.FC<PawnPromotionModalProps> = ({
  isOpen,
  color,
  onPromote
}) => {
  if (!isOpen) return null;

  const pieces: { type: PieceType; symbol: string; name: string }[] = [
    { type: 'queen', symbol: color === 'white' ? '♕' : '♛', name: 'Queen' },
    { type: 'rook', symbol: color === 'white' ? '♖' : '♜', name: 'Rook' },
    { type: 'bishop', symbol: color === 'white' ? '♗' : '♝', name: 'Bishop' },
    { type: 'knight', symbol: color === 'white' ? '♘' : '♞', name: 'Knight' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full mx-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4">
          👑 Promote Your Pawn!
        </h2>
        <p className="text-pink-500 mb-4 sm:mb-6 text-sm sm:text-base">Choose what piece your pawn becomes:</p>
        
        <div className="grid grid-cols-2 gap-4">
          {pieces.map((piece) => (
            <button
              key={piece.type}
              onClick={() => onPromote(piece.type)}
              className="p-3 sm:p-4 bg-pink-50 rounded-xl sm:rounded-2xl border-2 border-pink-200 hover:bg-pink-100 hover:border-pink-400 transition-all duration-200 hover:scale-105"
            >
              <div className="text-3xl sm:text-4xl mb-2">{piece.symbol}</div>
              <div className="font-semibold text-pink-700 text-sm sm:text-base">{piece.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};