import { PieceType, PieceColor, Square, ChessPiece, GameState } from '../types/chess';

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const parseSquare = (square: Square): [number, number] => {
  const file = FILES.indexOf(square[0]);
  const rank = parseInt(square[1]) - 1;
  return [file, rank];
};

export const squareToString = (file: number, rank: number): Square => {
  return `${FILES[file]}${rank + 1}`;
};

export const getInitialBoard = (): Map<Square, ChessPiece> => {
  const board = new Map<Square, ChessPiece>();
  
  // Create shuffled back row pieces (excluding king)
  const backRowPieces: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'bishop', 'knight', 'rook'];
  const shuffledPieces = [...backRowPieces].sort(() => Math.random() - 0.5);
  
  // Place king in the middle somewhere
  const kingPosition = Math.floor(Math.random() * 8);
  const finalBackRow = [...shuffledPieces];
  finalBackRow.splice(kingPosition, 0, 'king');
  
  // Remove one piece to make room for king
  if (finalBackRow.length > 8) {
    finalBackRow.pop();
  }
  
  // Set up white pieces (rank 1)
  finalBackRow.forEach((pieceType, index) => {
    const square = squareToString(index, 0);
    board.set(square, {
      type: pieceType,
      color: 'white',
      position: square,
      hasMoved: false
    });
  });
  
  // Set up black pieces (rank 8) - mirror white setup
  finalBackRow.forEach((pieceType, index) => {
    const square = squareToString(index, 7);
    board.set(square, {
      type: pieceType,
      color: 'black',
      position: square,
      hasMoved: false
    });
  });
  
  // Set up pawns
  for (let file = 0; file < 8; file++) {
    // White pawns
    const whitePawnSquare = squareToString(file, 1);
    board.set(whitePawnSquare, {
      type: 'pawn',
      color: 'white',
      position: whitePawnSquare,
      hasMoved: false
    });
    
    // Black pawns
    const blackPawnSquare = squareToString(file, 6);
    board.set(blackPawnSquare, {
      type: 'pawn',
      color: 'black',
      position: blackPawnSquare,
      hasMoved: false
    });
  }
  
  return board;
};

export const selectJokerPawns = (board: Map<Square, ChessPiece>): { white: Square; black: Square } => {
  const whitePawns = [];
  const blackPawns = [];
  
  for (const [square, piece] of board.entries()) {
    if (piece.type === 'pawn') {
      if (piece.color === 'white') {
        whitePawns.push(square);
      } else {
        blackPawns.push(square);
      }
    }
  }
  
  let whiteJoker, blackJoker;
  
  // Ensure joker pawns don't face each other directly
  do {
    whiteJoker = whitePawns[Math.floor(Math.random() * whitePawns.length)];
    blackJoker = blackPawns[Math.floor(Math.random() * blackPawns.length)];
  } while (whiteJoker[0] === blackJoker[0]); // Same file
  
  return { white: whiteJoker, black: blackJoker };
};

export const isValidMove = (from: Square, to: Square, board: Map<Square, ChessPiece>): boolean => {
  const piece = board.get(from);
  if (!piece) return false;
  
  const [fromFile, fromRank] = parseSquare(from);
  const [toFile, toRank] = parseSquare(to);
  const targetPiece = board.get(to);
  
  // Can't capture own piece
  if (targetPiece && targetPiece.color === piece.color) return false;
  
  // Can't move to same square
  if (from === to) return false;
  
  const fileDiff = Math.abs(toFile - fromFile);
  const rankDiff = Math.abs(toRank - fromRank);
  
  let isValidPieceMove = false;
  
  switch (piece.type) {
    case 'pawn':
      isValidPieceMove = isValidPawnMove(piece, fromFile, fromRank, toFile, toRank, !!targetPiece, board);
      break;
    case 'rook':
      isValidPieceMove = (fileDiff === 0 || rankDiff === 0) && isPathClear(from, to, board);
      break;
    case 'knight':
      isValidPieceMove = (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);
      break;
    case 'bishop':
      isValidPieceMove = fileDiff === rankDiff && isPathClear(from, to, board);
      break;
    case 'queen':
      isValidPieceMove = (fileDiff === 0 || rankDiff === 0 || fileDiff === rankDiff) && isPathClear(from, to, board);
      break;
    case 'king':
      isValidPieceMove = fileDiff <= 1 && rankDiff <= 1;
      break;
    default:
      isValidPieceMove = false;
  }
  
  if (!isValidPieceMove) return false;
  
  // Check if this move would put own king in check
  return !wouldBeInCheck(from, to, board);
};

const isValidPawnMove = (piece: ChessPiece, fromFile: number, fromRank: number, toFile: number, toRank: number, isCapture: boolean, board: Map<Square, ChessPiece>): boolean => {
  const direction = piece.color === 'white' ? 1 : -1;
  const startRank = piece.color === 'white' ? 1 : 6;
  
  // Forward move
  if (fromFile === toFile && !isCapture) {
    if (toRank === fromRank + direction) return true;
    if (fromRank === startRank && toRank === fromRank + 2 * direction) {
      // Check if path is clear for double move
      const middleSquare = squareToString(fromFile, fromRank + direction);
      return !board.has(middleSquare);
    }
  }
  
  // Capture move
  if (Math.abs(fromFile - toFile) === 1 && toRank === fromRank + direction && isCapture) {
    return true;
  }
  
  return false;
};

const isPathClear = (from: Square, to: Square, board: Map<Square, ChessPiece>): boolean => {
  const [fromFile, fromRank] = parseSquare(from);
  const [toFile, toRank] = parseSquare(to);
  
  const fileStep = toFile > fromFile ? 1 : toFile < fromFile ? -1 : 0;
  const rankStep = toRank > fromRank ? 1 : toRank < fromRank ? -1 : 0;
  
  let currentFile = fromFile + fileStep;
  let currentRank = fromRank + rankStep;
  
  while (currentFile !== toFile || currentRank !== toRank) {
    const currentSquare = squareToString(currentFile, currentRank);
    if (board.has(currentSquare)) return false;
    
    currentFile += fileStep;
    currentRank += rankStep;
  }
  
  return true;
};

export const isPawnPromotion = (from: Square, to: Square, piece: ChessPiece): boolean => {
  if (piece.type !== 'pawn') return false;
  
  const [, toRank] = parseSquare(to);
  
  if (piece.color === 'white' && toRank === 7) return true;
  if (piece.color === 'black' && toRank === 0) return true;
  
  return false;
};

export const isStalemate = (color: PieceColor, board: Map<Square, ChessPiece>): boolean => {
  if (isInCheck(color, board)) return false; // Can't be stalemate if in check
  
  // Check if player has any legal moves
  for (const [fromSquare, piece] of board.entries()) {
    if (piece.color !== color) continue;
    
    // Try all possible destination squares
    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        const toSquare = squareToString(file, rank);
        
        if (isValidMove(fromSquare, toSquare, board)) {
          return false; // Found a legal move, not stalemate
        }
      }
    }
  }
  
  return true; // No legal moves found, it's stalemate
};

export const getPossibleMoves = (square: Square, board: Map<Square, ChessPiece>): Square[] => {
  const moves: Square[] = [];
  const piece = board.get(square);
  
  if (!piece) return moves;
  
  // Try all possible destination squares
  for (let file = 0; file < 8; file++) {
    for (let rank = 0; rank < 8; rank++) {
      const toSquare = squareToString(file, rank);
      
      if (isValidMove(square, toSquare, board)) {
        moves.push(toSquare);
      }
    }
  }
  
  return moves;
};

export const isInCheck = (color: PieceColor, board: Map<Square, ChessPiece>): boolean => {
  // Find king
  let kingSquare: Square | null = null;
  for (const [square, piece] of board.entries()) {
    if (piece.type === 'king' && piece.color === color) {
      kingSquare = square;
      break;
    }
  }
  
  if (!kingSquare) return false;
  
  // Check if any opponent piece can attack the king
  for (const [square, piece] of board.entries()) {
    if (piece.color !== color && isValidMove(square, kingSquare, board)) {
      return true;
    }
  }
  
  return false;
};

export const isCheckmate = (color: PieceColor, board: Map<Square, ChessPiece>): boolean => {
  if (!isInCheck(color, board)) return false;
  
  // Try all possible moves for the player in check
  for (const [fromSquare, piece] of board.entries()) {
    if (piece.color !== color) continue;
    
    // Try all possible destination squares
    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        const toSquare = squareToString(file, rank);
        
        if (isValidMove(fromSquare, toSquare, board)) {
          // Simulate the move
          const newBoard = new Map(board);
          const movingPiece = newBoard.get(fromSquare)!;
          newBoard.delete(fromSquare);
          newBoard.set(toSquare, { ...movingPiece, position: toSquare });
          
          // Check if this move gets the king out of check
          if (!isInCheck(color, newBoard)) {
            return false; // Found a legal move, not checkmate
          }
        }
      }
    }
  }
  
  return true; // No legal moves found, it's checkmate
};

export const wouldBeInCheck = (from: Square, to: Square, board: Map<Square, ChessPiece>): boolean => {
  const piece = board.get(from);
  if (!piece) return false;
  
  // Simulate the move
  const newBoard = new Map(board);
  newBoard.delete(from);
  newBoard.set(to, { ...piece, position: to });
  
  return isInCheck(piece.color, newBoard);
};

export const getTimeBonus = (capturedPiece: ChessPiece): number => {
  switch (capturedPiece.type) {
    case 'pawn': return 30;
    case 'rook': return 90;
    case 'bishop':
    case 'knight': return 60;
    case 'queen': return 120;
    default: return 0;
  }
};