import { useState, useCallback, useEffect } from 'react';
import { GameState, ChessPiece, Move, Square, PieceColor, PlayerInfo, TimeControl } from '../types/chess';
import { getInitialBoard, selectJokerPawns, isValidMove, getTimeBonus, isCheckmate, isInCheck } from '../utils/chessLogic';

export const useChessGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: new Map(),
    currentPlayer: 'white',
    moves: [],
    gameStatus: 'setup',
    whiteTime: 0,
    blackTime: 0,
    lastMoveTime: 0,
    capturedPieces: [],
    jokerPawns: { white: '', black: '' }
  });

  const [players, setPlayers] = useState<{ white: PlayerInfo; black: PlayerInfo }>({
    white: { name: '', color: 'white', theme: 'Princess Pink' },
    black: { name: '', color: 'black', theme: 'Princess Pink' }
  });

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [gameTimer, setGameTimer] = useState<NodeJS.Timeout | null>(null);
  const [jokerRevealComplete, setJokerRevealComplete] = useState(false);

  const startGame = useCallback((whitePlayer: PlayerInfo, blackPlayer: PlayerInfo, timeControl: TimeControl) => {
    const board = getInitialBoard();
    const jokerPawns = selectJokerPawns(board);
    
    // Mark joker pawns
    const whitePawn = board.get(jokerPawns.white);
    const blackPawn = board.get(jokerPawns.black);
    
    if (whitePawn) {
      whitePawn.isJoker = true;
      board.set(jokerPawns.white, whitePawn);
    }
    
    if (blackPawn) {
      blackPawn.isJoker = true;
      board.set(jokerPawns.black, blackPawn);
    }

    const totalTime = timeControl.minutes * 60 + timeControl.seconds;
    
    setGameState({
      board,
      currentPlayer: 'white',
      moves: [],
      gameStatus: 'playing',
      whiteTime: totalTime,
      blackTime: totalTime,
      lastMoveTime: Date.now(),
      capturedPieces: [],
      jokerPawns
    });

    setPlayers({ white: whitePlayer, black: blackPlayer });
    setJokerRevealComplete(false);
    
    // Clear any existing timer
    if (gameTimer) clearInterval(gameTimer);
  }, [gameTimer]);

  const startGameTimer = useCallback(() => {
    if (gameTimer) clearInterval(gameTimer);
    
    // Start the timer immediately
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.gameStatus !== 'playing') return prev;
        
        // Decrease time by 1 second for current player
        let newWhiteTime = prev.whiteTime;
        let newBlackTime = prev.blackTime;
        
        if (prev.currentPlayer === 'white') {
          newWhiteTime = Math.max(0, prev.whiteTime - 1);
          if (newWhiteTime === 0) {
            return { ...prev, gameStatus: 'ended', winner: 'black' };
          }
        } else {
          newBlackTime = Math.max(0, prev.blackTime - 1);
          if (newBlackTime === 0) {
            return { ...prev, gameStatus: 'ended', winner: 'white' };
          }
        }
        
        return { 
          ...prev, 
          whiteTime: newWhiteTime, 
          blackTime: newBlackTime,
          lastMoveTime: Date.now()
        };
      });
    }, 1000);
    
    setGameTimer(timer);
  }, [gameTimer]);

  const handleJokerRevealComplete = useCallback(() => {
    setJokerRevealComplete(true);
    setGameState(prev => ({ ...prev, lastMoveTime: Date.now() }));
    // Start timer immediately when joker reveal is complete
    startGameTimer();
  }, []);

  // Clean up timer when game ends
  useEffect(() => {
    if (gameState.gameStatus === 'ended' && gameTimer) {
      clearInterval(gameTimer);
      setGameTimer(null);
    }
  }, [gameState.gameStatus, gameTimer]);

  const makeMove = useCallback((from: Square, to: Square) => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      
      const piece = prev.board.get(from);
      if (!piece || piece.color !== prev.currentPlayer) return prev;
      
      if (!isValidMove(from, to, prev.board)) return prev;
      
      const newBoard = new Map(prev.board);
      const capturedPiece = newBoard.get(to);
      
      // Check if capturing joker pawn
      if (capturedPiece?.isJoker) {
        // Capturing player loses immediately
        if (gameTimer) clearInterval(gameTimer);
        return {
          ...prev,
          gameStatus: 'ended',
          winner: capturedPiece.color // The joker's owner wins
        };
      }
      
      // Make the move
      newBoard.delete(from);
      const movedPiece = { ...piece, position: to, hasMoved: true };
      newBoard.set(to, movedPiece);
      
      const move: Move = {
        from,
        to,
        piece: movedPiece,
        capturedPiece,
        isCapture: !!capturedPiece,
        timestamp: Date.now()
      };
      
      // Add time bonus for capture
      let whiteTime = prev.whiteTime;
      let blackTime = prev.blackTime;
      
      if (capturedPiece) {
        const bonus = getTimeBonus(capturedPiece);
        if (prev.currentPlayer === 'white') {
          whiteTime += bonus;
        } else {
          blackTime += bonus;
        }
      }
      
      const nextPlayer = prev.currentPlayer === 'white' ? 'black' : 'white';
      
      // Check for checkmate
      let gameStatus = prev.gameStatus;
      let winner = prev.winner;
      
      if (isCheckmate(nextPlayer, newBoard)) {
        gameStatus = 'ended';
        winner = prev.currentPlayer;
      }
      
      return {
        ...prev,
        board: newBoard,
        currentPlayer: nextPlayer,
        moves: [...prev.moves, move],
        whiteTime,
        blackTime,
        lastMoveTime: Date.now(),
        capturedPieces: capturedPiece ? [...prev.capturedPieces, capturedPiece] : prev.capturedPieces,
        gameStatus,
        winner
      };
    });
    
    setSelectedSquare(null);
  }, [gameTimer]);

  const selectSquare = useCallback((square: Square) => {
    if (gameState.gameStatus !== 'playing' || !jokerRevealComplete) return;
    
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
      } else {
        makeMove(selectedSquare, square);
      }
    } else {
      const piece = gameState.board.get(square);
      if (piece && piece.color === gameState.currentPlayer) {
        setSelectedSquare(square);
      }
    }
  }, [gameState, selectedSquare, makeMove, jokerRevealComplete]);

  const saveGame = useCallback((filename: string) => {
    const gameData = {
      gameState,
      players,
      timestamp: Date.now()
    };
    
    localStorage.setItem(`chess_game_${filename}`, JSON.stringify(gameData));
  }, [gameState, players]);

  const loadGame = useCallback((filename: string) => {
    const savedData = localStorage.getItem(`chess_game_${filename}`);
    if (savedData) {
      const { gameState: savedGameState, players: savedPlayers } = JSON.parse(savedData);
      setGameState(savedGameState);
      setPlayers(savedPlayers);
    }
  }, []);

  const getSavedGames = useCallback(() => {
    const games = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('chess_game_')) {
        games.push(key.replace('chess_game_', ''));
      }
    }
    return games;
  }, []);

  useEffect(() => {
    return () => {
      if (gameTimer) clearInterval(gameTimer);
    };
  }, [gameTimer]);

  return {
    gameState,
    players,
    selectedSquare,
    jokerRevealComplete,
    handleJokerRevealComplete,
    startGame,
    makeMove,
    selectSquare,
    saveGame,
    loadGame,
    getSavedGames
  };
};