import React from 'react';
import { PieceType } from '../types/chess';

interface PawnPromotionModalProps {
  isOpen: boolean;
  onPromote: (pieceType: PieceType) => void;
  color: 'white' | 'black';
  theme: any;
}

export const PawnPromotionModal: React.FC<PawnPromotionModalProps> = ({
  isOpen,
  onPromote,
  color,
  theme
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
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primary }}>
          🎉 Pawn Promotion! 🎉
        </h2>
        <p className="text-gray-600 mb-6">
          Choose what piece your pawn becomes:
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {pieces.map((piece) => (
            <button
              key={piece.type}
              onClick={() => onPromote(piece.type)}
              className="p-6 rounded-2xl border-2 hover:scale-105 transition-all duration-200"
              style={{ 
                backgroundColor: `${theme.background}40`,
                borderColor: theme.border,
                boxShadow: `0 4px 12px ${theme.primary}20`
              }}
            >
              <div className="text-4xl mb-2">{piece.symbol}</div>
              <div className="font-semibold" style={{ color: theme.text }}>
                {piece.name}
              </div>
            </button>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          💡 If this was a joker pawn, it loses its special status after promotion!
        </p>
      </div>
    </div>
  );
};