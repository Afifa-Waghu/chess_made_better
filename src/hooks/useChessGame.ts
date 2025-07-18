import { useState, useCallback, useEffect } from 'react';
import { GameState, ChessPiece, Move, Square, PieceColor, PlayerInfo, TimeControl, PieceType } from '../types/chess';
import { getInitialBoard, selectJokerPawns, isValidMove, getTimeBonus, isCheckmate, isInCheck, isPawnPromotion, isStalemate, getPossibleMoves } from '../utils/chessLogic';

export const useChessGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: new Map(),
    currentPlayer: 'white',
    moves: [],
    gameStatus: 'setup',
    gameMode: 'joker',
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
  const [showPossibleMoves, setShowPossibleMoves] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [invalidMoveSquare, setInvalidMoveSquare] = useState<Square | null>(null);
  const [drawOffer, setDrawOffer] = useState<PieceColor | null>(null);

  const startGame = useCallback((whitePlayer: PlayerInfo, blackPlayer: PlayerInfo, timeControl: TimeControl, gameMode: 'standard' | 'chess960' | 'joker' = 'joker') => {
    const board = getInitialBoard(gameMode);
    const jokerPawns = gameMode === 'joker' ? selectJokerPawns(board) : { white: '', black: '' };
    
    // Mark joker pawns only for joker variant
    if (gameMode === 'joker') {
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
    }

    const totalTime = timeControl.minutes * 60 + timeControl.seconds;
    
    setGameState({
      board,
      currentPlayer: 'white',
      moves: [],
      gameStatus: 'playing',
      gameMode,
      whiteTime: totalTime,
      blackTime: totalTime,
      lastMoveTime: Date.now(),
      capturedPieces: [],
      jokerPawns
    });

    setPlayers({ white: whitePlayer, black: blackPlayer });
    setJokerRevealComplete(false);
    setIsPaused(false);
    
    // Clear any existing timer
    if (gameTimer) clearInterval(gameTimer);
  }, [gameTimer]);

  const startGameTimer = useCallback(() => {
    if (gameTimer) clearInterval(gameTimer);
    
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.gameStatus !== 'playing' || isPaused) return prev;
        
        let newWhiteTime = prev.whiteTime;
        let newBlackTime = prev.blackTime;
        
        if (prev.currentPlayer === 'white') {
          newWhiteTime = Math.max(0, prev.whiteTime - 1);
          if (newWhiteTime === 0) {
            return { ...prev, gameStatus: 'ended', winner: 'black', endReason: 'timeout' };
          }
        } else {
          newBlackTime = Math.max(0, prev.blackTime - 1);
          if (newBlackTime === 0) {
            return { ...prev, gameStatus: 'ended', winner: 'white', endReason: 'timeout' };
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
  }, [isPaused]);

  const handleJokerRevealComplete = useCallback(() => {
    setJokerRevealComplete(true);
    setGameState(prev => ({ ...prev, lastMoveTime: Date.now() }));
    startGameTimer();
  }, [startGameTimer]);

  const playSound = useCallback((type: 'move' | 'capture' | 'check' | 'checkmate' | 'invalid') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'move':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'capture':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'check':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'checkmate':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.6);
        break;
      case 'invalid':
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(250, audioContext.currentTime + 0.05);
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        break;
    }
  }, []);

  const makeMove = useCallback((from: Square, to: Square, promotionPiece?: PieceType) => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing' || isPaused) return prev;
      
      const piece = prev.board.get(from);
      if (!piece || piece.color !== prev.currentPlayer) return prev;
      
      if (!isValidMove(from, to, prev.board)) {
        setInvalidMoveSquare(from);
        playSound('invalid');
        setTimeout(() => setInvalidMoveSquare(null), 500);
        return prev;
      }
      
      // Check for pawn promotion
      if (isPawnPromotion(from, to, piece) && !promotionPiece) {
        setPendingPromotion({ from, to });
        return prev;
      }
      
      const newBoard = new Map(prev.board);
      const capturedPiece = newBoard.get(to);
      
      // Check if capturing joker pawn (but not if it's promoted) - only in joker variant
      if (prev.gameMode === 'joker' && capturedPiece?.isJoker && capturedPiece.type === 'pawn') {
        if (gameTimer) clearInterval(gameTimer);
        playSound('checkmate');
        return {
          ...prev,
          gameStatus: 'ended',
          winner: capturedPiece.color,
          endReason: 'joker'
        };
      }
      
      // Make the move
      newBoard.delete(from);
      let movedPiece = { ...piece, position: to, hasMoved: true };
      
      // Handle pawn promotion
      if (promotionPiece) {
        movedPiece = { ...movedPiece, type: promotionPiece, isJoker: false }; // Promoted pieces lose joker status
      }
      
      newBoard.set(to, movedPiece);
      
      const move: Move = {
        from,
        to,
        piece: movedPiece,
        capturedPiece,
        isCapture: !!capturedPiece,
        timestamp: Date.now(),
        promotionPiece
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
        playSound('capture');
      } else {
        playSound('move');
      }
      
      const nextPlayer = prev.currentPlayer === 'white' ? 'black' : 'white';
      
      // Check game end conditions
      let gameStatus = prev.gameStatus;
      let winner = prev.winner;
      let endReason = prev.endReason;
      
      if (isInCheck(nextPlayer, newBoard)) {
        playSound('check');
        if (isCheckmate(nextPlayer, newBoard)) {
          gameStatus = 'ended';
          winner = prev.currentPlayer;
          endReason = 'checkmate';
          playSound('checkmate');
        }
      } else if (isStalemate(nextPlayer, newBoard)) {
        gameStatus = 'ended';
        endReason = 'stalemate';
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
        winner,
        endReason
      };
    });
    
    setSelectedSquare(null);
    setPossibleMoves([]);
    setPendingPromotion(null);
  }, [gameTimer, isPaused, playSound]);

  const selectSquare = useCallback((square: Square) => {
    if (gameState.gameStatus !== 'playing' || !jokerRevealComplete || isPaused) return;
    
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        makeMove(selectedSquare, square);
      }
    } else {
      const piece = gameState.board.get(square);
      if (piece && piece.color === gameState.currentPlayer) {
        setSelectedSquare(square);
        if (showPossibleMoves) {
          setPossibleMoves(getPossibleMoves(square, gameState.board));
        }
      }
    }
  }, [gameState, selectedSquare, makeMove, jokerRevealComplete, isPaused, showPossibleMoves]);

  const undoMove = useCallback(() => {
    setGameState(prev => {
      if (prev.moves.length === 0 || prev.gameStatus !== 'playing') return prev;
      
      const lastMove = prev.moves[prev.moves.length - 1];
      const newBoard = new Map(prev.board);
      
      // Restore the piece to its original position
      const originalPiece = { ...lastMove.piece, position: lastMove.from, hasMoved: false };
      if (lastMove.promotionPiece) {
        originalPiece.type = 'pawn'; // Revert promotion
        if (prev.jokerPawns.white === lastMove.from || prev.jokerPawns.black === lastMove.from) {
          originalPiece.isJoker = true; // Restore joker status if applicable
        }
      }
      
      newBoard.delete(lastMove.to);
      newBoard.set(lastMove.from, originalPiece);
      
      // Restore captured piece
      if (lastMove.capturedPiece) {
        newBoard.set(lastMove.to, lastMove.capturedPiece);
      }
      
      // Revert time bonus
      let whiteTime = prev.whiteTime;
      let blackTime = prev.blackTime;
      
      if (lastMove.capturedPiece) {
        const bonus = getTimeBonus(lastMove.capturedPiece);
        if (lastMove.piece.color === 'white') {
          whiteTime -= bonus;
        } else {
          blackTime -= bonus;
        }
      }
      
      return {
        ...prev,
        board: newBoard,
        currentPlayer: lastMove.piece.color,
        moves: prev.moves.slice(0, -1),
        whiteTime: Math.max(0, whiteTime),
        blackTime: Math.max(0, blackTime),
        capturedPieces: lastMove.capturedPiece 
          ? prev.capturedPieces.filter((_, index) => index !== prev.capturedPieces.length - 1)
          : prev.capturedPieces,
        gameStatus: 'playing',
        winner: undefined,
        endReason: undefined
      };
    });
    
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, []);

  const redoMove = useCallback(() => {
    // For now, we'll implement a simple version that doesn't support redo
    // In a full implementation, you'd need to store undone moves separately
  }, []);

  const pauseGame = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const resignGame = useCallback((player: PieceColor) => {
    if (gameTimer) clearInterval(gameTimer);
    setGameState(prev => ({
      ...prev,
      gameStatus: 'ended',
      winner: player === 'white' ? 'black' : 'white',
      endReason: 'resignation'
    }));
  }, [gameTimer]);

  const offerDraw = useCallback((player: PieceColor) => {
    setDrawOffer(player);
  }, []);

  const respondToDraw = useCallback((accept: boolean) => {
    if (accept) {
      if (gameTimer) clearInterval(gameTimer);
      setGameState(prev => ({
        ...prev,
        gameStatus: 'ended',
        endReason: 'draw'
      }));
    }
    setDrawOffer(null);
  }, [gameTimer]);

  const saveGame = useCallback((filename: string) => {
    const gameData = {
      gameState,
      players,
      timestamp: Date.now(),
      moves: gameState.moves.map(move => ({
        from: move.from,
        to: move.to,
        piece: move.piece.type,
        color: move.piece.color,
        isCapture: move.isCapture,
        capturedPiece: move.capturedPiece?.type,
        promotionPiece: move.promotionPiece,
        timestamp: move.timestamp
      }))
    };
    
    localStorage.setItem(`chess_game_${filename}`, JSON.stringify(gameData));
  }, [gameState, players]);

  const loadGame = useCallback((filename: string) => {
    const savedData = localStorage.getItem(`chess_game_${filename}`);
    if (savedData) {
      const { gameState: savedGameState, players: savedPlayers } = JSON.parse(savedData);
      
      // Reconstruct the board from moves
      const board = getInitialBoard();
      const jokerPawns = savedGameState.jokerPawns;
      
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
      
      // Apply all moves to reconstruct the current position
      savedGameState.moves.forEach((move: any) => {
        const piece = board.get(move.from);
        if (piece) {
          board.delete(move.from);
          let movedPiece = { ...piece, position: move.to, hasMoved: true };
          if (move.promotionPiece) {
            movedPiece.type = move.promotionPiece;
            movedPiece.isJoker = false;
          }
          board.set(move.to, movedPiece);
        }
      });
      
      setGameState({ ...savedGameState, board });
      setPlayers(savedPlayers);
      setJokerRevealComplete(true);
      
      if (savedGameState.gameStatus === 'playing') {
        startGameTimer();
      }
    }
  }, [startGameTimer]);

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

  // Clean up timer when game ends
  useEffect(() => {
    if (gameState.gameStatus === 'ended' && gameTimer) {
      clearInterval(gameTimer);
      setGameTimer(null);
    }
  }, [gameState.gameStatus, gameTimer]);

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
    showPossibleMoves,
    possibleMoves,
    isPaused,
    pendingPromotion,
    invalidMoveSquare,
    drawOffer,
    handleJokerRevealComplete,
    startGame,
    makeMove,
    selectSquare,
    undoMove,
    redoMove,
    pauseGame,
    resignGame,
    offerDraw,
    respondToDraw,
    setShowPossibleMoves,
    saveGame,
    loadGame,
    getSavedGames
  };
};