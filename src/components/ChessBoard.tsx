import React, { useState } from 'react';
import { ChessPiece } from './ChessPiece';
import { GameState, Square } from '../types/chess';
import { FILES, RANKS, findKing } from '../utils/chessLogic';
import { getTheme } from '../styles/themes';

interface ChessBoardProps {
  gameState: GameState;
  selectedSquare: Square | null;
  onSquareClick: (square: Square) => void;
  onMove: (from: Square, to: Square) => void;
  jokerRevealComplete: boolean;
  globalTheme: string;
  showPossibleMoves: boolean;
  possibleMoves: Square[];
  invalidMoveSquare: Square | null;
  whiteKingInCheck: boolean;
  blackKingInCheck: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  gameState,
  selectedSquare,
  onSquareClick,
  onMove,
  jokerRevealComplete,
  globalTheme,
  showPossibleMoves,
  possibleMoves,
  invalidMoveSquare
}) => {
  const [draggedPiece, setDraggedPiece] = useState<{ square: Square; piece: any } | null>(null);
  const [dragOverSquare, setDragOverSquare] = useState<Square | null>(null);
  const [captureAnimation, setCaptureAnimation] = useState<string | null>(null);
  
  const theme = getTheme(globalTheme);

  const playMoveSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const playCaptureSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const triggerCaptureAnimation = () => {
    const animations = ['stab', 'decapitate', 'blast', 'thunder', 'arrows'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    setCaptureAnimation(randomAnimation);
    
    setTimeout(() => {
      setCaptureAnimation(null);
    }, 1500);
  };

  const handleDragStart = (square: Square) => (e: React.DragEvent) => {
    const piece = gameState.board.get(square);
    if (piece && piece.color === gameState.currentPlayer && jokerRevealComplete) {
      setDraggedPiece({ square, piece });
      e.dataTransfer.effectAllowed = 'move';
    } else {
      e.preventDefault();
    }
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
    setDragOverSquare(null);
  };

  const handleDragOver = (square: Square) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSquare(square);
  };

  const handleDragLeave = () => {
    setDragOverSquare(null);
  };

  const handleDrop = (square: Square) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSquare(null);
    
    if (draggedPiece && draggedPiece.square !== square) {
      onMove(draggedPiece.square, square);
    }
    setDraggedPiece(null);
  };

  const isLightSquare = (file: number, rank: number): boolean => {
    return (file + rank) % 2 === 0;
  };

  const getSquareColor = (file: number, rank: number): string => {
    const isLight = isLightSquare(file, rank);
    return isLight ? theme.boardLight : theme.boardDark;
  };

  const whiteKingSquare = findKing('white', gameState.board);
  const blackKingSquare = findKing('black', gameState.board);
  
  const isKingInCheck = (square: Square): boolean => {
    return (square === whiteKingSquare && whiteKingInCheck) || 
           (square === blackKingSquare && blackKingInCheck);
  };

  return (
    <div className="relative">
      {/* Board */}
      <div 
        className="grid grid-cols-8 gap-0 border-2 sm:border-4 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl relative mx-auto"
        style={{ 
          borderColor: theme.border,
          width: 'min(90vw, 600px)',
          height: 'min(90vw, 600px)',
          maxWidth: '600px',
          maxHeight: '600px'
        }}
      >
        {RANKS.slice().reverse().map((rank, rankIndex) =>
          FILES.map((file, fileIndex) => {
            const square = `${file}${rank}` as Square;
            const piece = gameState.board.get(square);
            const isSelected = selectedSquare === square;
            const isDragOver = dragOverSquare === square;
            const actualRank = 7 - rankIndex;
            const isDragging = draggedPiece?.square === square;
            const isPossibleMove = possibleMoves.includes(square);
            const isKingUnderCheck = isKingInCheck(square);
            
            return (
              <div
                key={square}
                onClick={() => onSquareClick(square)}
                onDragOver={handleDragOver(square)}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop(square)}
                className={`
                  aspect-square flex items-center justify-center cursor-pointer
                  transition-all duration-200 relative
                  ${isSelected ? 'ring-4 ring-yellow-400 ring-inset z-10' : ''}
                  ${isDragOver ? 'ring-4 ring-green-400 ring-inset' : ''}
                  ${isKingUnderCheck ? 'ring-4 ring-red-500 ring-inset animate-pulse' : ''}
                  hover:brightness-110
                `}
                style={{ 
                  backgroundColor: isKingUnderCheck ? '#fca5a5' : getSquareColor(fileIndex, actualRank),
                  boxShadow: isDragOver ? 'inset 0 0 20px rgba(34, 197, 94, 0.3)' : undefined
                }}
              >
                {/* Possible Move Indicator */}
                {isPossibleMove && showPossibleMoves && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full animate-pulse"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                )}
                
                {piece && (
                  <ChessPiece
                    piece={piece}
                    isSelected={isSelected}
                    onClick={() => onSquareClick(square)}
                    onDragStart={handleDragStart(square)}
                    onDragEnd={handleDragEnd}
                    isJokerRevealed={!jokerRevealComplete}
                    isDragging={isDragging}
                    globalTheme={globalTheme}
                    isInvalid={invalidMoveSquare === square}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* File Labels (bottom) */}
      <div className="flex justify-center mt-2">
        {FILES.map((file) => (
          <div key={file} className="flex-1 text-center font-bold text-xs sm:text-sm" style={{ color: theme.text, maxWidth: 'calc(min(90vw, 600px) / 8)' }}>
            {file}
          </div>
        ))}
      </div>
      
      {/* Rank Labels (left) */}
      <div className="absolute left-0 top-0 h-full flex flex-col-reverse justify-center -ml-4 sm:-ml-6 md:-ml-8">
        {RANKS.map((rank) => (
          <div key={rank} className="flex-1 flex items-center justify-center font-bold text-xs sm:text-sm" style={{ color: theme.text, height: 'calc(min(90vw, 600px) / 8)' }}>
            {rank}
          </div>
        ))}
      </div>
    </div>
  );
};