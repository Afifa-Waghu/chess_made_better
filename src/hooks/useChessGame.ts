import { useState, useCallback, useEffect } from 'react';
import { GameState, ChessPiece, Move, Square, PieceColor, PlayerInfo, TimeControl } from '../types/chess';
import { getInitialBoard, selectJokerPawns, isValidMove, getTimeBonus, isCheckmate, isInCheck, isStalemate, needsPromotion } from '../utils/chessLogic';

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
  const [isPaused, setIsPaused] = useState(false);
  const [showPossibleMoves, setShowPossibleMoves] = useState(false);
  const [moveHistory, setMoveHistory] = useState<GameState[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [pendingPromotion, setPendingPromotion] = useState<{from: Square, to: Square} | null>(null);
  const [drawOffer, setDrawOffer] = useState<{from: PieceColor} | null>(null);
  const [gameEndReason, setGameEndReason] = useState<'checkmate' | 'timeout' | 'joker' | 'resignation' | 'draw' | 'stalemate' | null>(null);

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
    setIsPaused(false);
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    
    // Clear any existing timer
    if (gameTimer) clearInterval(gameTimer);
  }, [gameTimer]);

  const startGameTimer = useCallback(() => {
    if (gameTimer) clearInterval(gameTimer);
    
    // Start the timer immediately
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.gameStatus !== 'playing' || isPaused) return prev;
        
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
  }, [gameTimer, isPaused]);

  const handleJokerRevealComplete = useCallback(() => {
    setJokerRevealComplete(true);
    setGameState(prev => ({ ...prev, lastMoveTime: Date.now() }));
    // Start timer immediately when joker reveal is complete
    startGameTimer();
  }, []);

  const pauseGame = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeGame = useCallback(() => {
    setIsPaused(false);
  }, []);

  const undoMove = useCallback(() => {
    if (currentMoveIndex >= 0 && moveHistory.length > 0) {
      const previousState = moveHistory[currentMoveIndex];
      setGameState(previousState);
      setCurrentMoveIndex(prev => prev - 1);
    }
  }, [currentMoveIndex, moveHistory]);

  const redoMove = useCallback(() => {
    if (currentMoveIndex < moveHistory.length - 1) {
      const nextState = moveHistory[currentMoveIndex + 1];
      setGameState(nextState);
      setCurrentMoveIndex(prev => prev + 1);
    }
  }, [currentMoveIndex, moveHistory]);

  const offerDraw = useCallback(() => {
    setDrawOffer({ from: gameState.currentPlayer });
  }, [gameState.currentPlayer]);

  const acceptDraw = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'ended',
      winner: undefined // Draw
    }));
    setDrawOffer(null);
    if (gameTimer) clearInterval(gameTimer);
  }, [gameTimer]);

  const declineDraw = useCallback(() => {
    setDrawOffer(null);
  }, []);

  const resign = useCallback(() => {
    const winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
    setGameEndReason('resignation');
    setGameState(prev => ({
      ...prev,
      gameStatus: 'ended',
      winner
    }));
    if (gameTimer) clearInterval(gameTimer);
  }, [gameState.currentPlayer, gameTimer]);

  // Clean up timer when game ends
  useEffect(() => {
    if (gameState.gameStatus === 'ended' && gameTimer) {
      clearInterval(gameTimer);
      setGameTimer(null);
    }
  }, [gameState.gameStatus, gameTimer]);

  const promotePawn = useCallback((pieceType: any) => {
    if (!pendingPromotion) return;
    
    const { from, to } = pendingPromotion;
    
    setGameState(prev => {
      const newBoard = new Map(prev.board);
      const piece = newBoard.get(from);
      if (!piece) return prev;
      
      // Save current state to history
      const newHistory = [...moveHistory.slice(0, currentMoveIndex + 1), prev];
      setMoveHistory(newHistory);
      setCurrentMoveIndex(newHistory.length - 1);
      
      // Remove joker status if promoting a joker pawn
      const promotedPiece = { 
        ...piece, 
        type: pieceType, 
        position: to, 
        hasMoved: true,
        isJoker: false // Lose joker status on promotion
      };
      
      newBoard.delete(from);
      newBoard.set(to, promotedPiece);
      
      const nextPlayer = prev.currentPlayer === 'white' ? 'black' : 'white';
      
      // Check for game end conditions
      let gameStatus = prev.gameStatus;
      let winner = prev.winner;
      
      if (isCheckmate(nextPlayer, newBoard)) {
        gameStatus = 'ended';
        winner = prev.currentPlayer;
      } else if (isStalemate(nextPlayer, newBoard)) {
        gameStatus = 'ended';
        winner = undefined; // Draw
      }
      
      return {
        ...prev,
        board: newBoard,
        currentPlayer: nextPlayer,
        gameStatus,
        winner
      };
    });
    
    setPendingPromotion(null);
  }, [pendingPromotion, moveHistory, currentMoveIndex]);

  const makeMove = useCallback((from: Square, to: Square) => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      
      const piece = prev.board.get(from);
      if (!piece || piece.color !== prev.currentPlayer) return prev;
      
      if (!isValidMove(from, to, prev.board)) return prev;
      
      // Check if this move needs pawn promotion
      if (needsPromotion(piece, to)) {
        setPendingPromotion({ from, to });
        return prev; // Don't make the move yet, wait for promotion choice
      }
      
      // Save current state to history
      const newHistory = [...moveHistory.slice(0, currentMoveIndex + 1), prev];
      setMoveHistory(newHistory);
      setCurrentMoveIndex(newHistory.length - 1);
      
      const newBoard = new Map(prev.board);
      const capturedPiece = newBoard.get(to);
      
      // Check if capturing joker pawn
      if (capturedPiece?.isJoker) {
        // Capturing player loses immediately
        setGameEndReason('joker');
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
      } else if (isStalemate(nextPlayer, newBoard)) {
        gameStatus = 'ended';
        winner = undefined; // Draw
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
  }, [gameTimer, moveHistory, currentMoveIndex]);

  const selectSquare = useCallback((square: Square) => {
    if (gameState.gameStatus !== 'playing' || !jokerRevealComplete || isPaused) return;
    
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
  }, [gameState, selectedSquare, makeMove, jokerRevealComplete, isPaused]);

  const getPossibleMoves = useCallback((square: Square): Square[] => {
    if (!showPossibleMoves) return [];
    
    const piece = gameState.board.get(square);
    if (!piece || piece.color !== gameState.currentPlayer) return [];
    
    const possibleMoves: Square[] = [];
    
    // Check all possible destination squares
    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        const toSquare = `${String.fromCharCode(97 + file)}${rank + 1}` as Square;
        if (isValidMove(square, toSquare, gameState.board)) {
          possibleMoves.push(toSquare);
        }
      }
    }
    
    return possibleMoves;
  }, [gameState.board, gameState.currentPlayer, showPossibleMoves]);

  const saveGame = useCallback((filename: string) => {
    const gameData = {
      gameState,
      players,
      timestamp: Date.now()
    };
    
    localStorage.setItem(`chess_game_${filename}`, JSON.stringify(gameData));
  }, [gameState, players, moveHistory, currentMoveIndex]);
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
    isPaused,
    showPossibleMoves,
    pendingPromotion,
    drawOffer,
    handleJokerRevealComplete,
    startGame,
    makeMove,
    selectSquare,
    pauseGame,
    resumeGame,
    undoMove,
    redoMove,
    canUndo: currentMoveIndex >= 0,
    canRedo: currentMoveIndex < moveHistory.length - 1,
    offerDraw,
    acceptDraw,
    declineDraw,
    resign,
    promotePawn,
    getPossibleMoves,
    setShowPossibleMoves,
    saveGame,
    loadGame,
    getSavedGames
    gameEndReason,
    setGameEndReason
  };
};