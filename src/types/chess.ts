export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';
export type Square = string; // e.g., 'a1', 'h8'

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  position: Square;
  isJoker?: boolean;
  hasMoved?: boolean;
}

export interface Move {
  from: Square;
  to: Square;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  isCapture: boolean;
  timestamp: number;
}

export interface GameState {
  board: Map<Square, ChessPiece>;
  currentPlayer: PieceColor;
  moves: Move[];
  gameStatus: 'setup' | 'playing' | 'ended';
  winner?: PieceColor;
  whiteTime: number;
  blackTime: number;
  lastMoveTime: number;
  capturedPieces: ChessPiece[];
  jokerPawns: { white: Square; black: Square };
  gameId?: string;
}

export interface PlayerInfo {
  name: string;
  color: PieceColor;
  theme: string;
}

export interface TimeControl {
  minutes: number;
  seconds: number;
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  boardLight: string;
  boardDark: string;
  text: string;
  border: string;
}