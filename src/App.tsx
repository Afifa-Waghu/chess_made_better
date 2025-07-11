import React, { useState } from 'react';
import { GameSetup } from './components/GameSetup';
import { ChessBoard } from './components/ChessBoard';
import { HelpModal } from './components/HelpModal';
import { JokerReveal } from './components/JokerReveal';
import { GameSaver } from './components/GameSaver';
import { GameEndModal } from './components/GameEndModal';
import { SettingsModal } from './components/SettingsModal';
import { PawnPromotionModal } from './components/PawnPromotionModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SaveGameModal } from './components/SaveGameModal';
import { useChessGame } from './hooks/useChessGame';
import { getTheme } from './styles/themes';
import { HelpCircle, Home, Settings, RotateCcw, Rotate3D as RotateRight, Flag, HandHeart } from 'lucide-react';
import { PlayerInfo } from './components/PlayerInfo';
import { PieceType } from './types/chess';

function App() {
  const {
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
  } = useChessGame();

  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGameEnd, setShowGameEnd] = useState(false);
  const [showSaveGame, setShowSaveGame] = useState(false);
  const [globalTheme, setGlobalTheme] = useState('Princess Pink');
  const [confirmAction, setConfirmAction] = useState<{
    type: 'resign' | 'quit';
    player?: 'white' | 'black';
  } | null>(null);

  const handleNewGame = () => {
    window.location.reload();
  };

  const handleStartGame = (whitePlayer: any, blackPlayer: any, timeControl: any, theme: string) => {
    setGlobalTheme(theme);
    startGame(whitePlayer, blackPlayer, timeControl);
  };

  const handleQuitGame = () => {
    setConfirmAction({ type: 'quit' });
  };

  const handleResign = (player: 'white' | 'black') => {
    setConfirmAction({ type: 'resign', player });
  };

  const handleConfirmAction = () => {
    if (confirmAction?.type === 'resign' && confirmAction.player) {
      resignGame(confirmAction.player);
    } else if (confirmAction?.type === 'quit') {
      handleNewGame();
    }
    setConfirmAction(null);
  };

  const handlePawnPromotion = (pieceType: PieceType) => {
    if (pendingPromotion) {
      makeMove(pendingPromotion.from, pendingPromotion.to, pieceType);
    }
  };

  const handleModalOpen = () => {
    if (gameState.gameStatus === 'playing') {
      pauseGame();
    }
  };

  const handleModalClose = () => {
    if (gameState.gameStatus === 'playing' && isPaused) {
      pauseGame();
    }
  };

  React.useEffect(() => {
    if (gameState.gameStatus === 'ended' && !showGameEnd) {
      setShowGameEnd(true);
      setShowSaveGame(true);
    }
  }, [gameState.gameStatus, showGameEnd]);

  if (gameState.gameStatus === 'setup') {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  const theme = getTheme(globalTheme);
  const currentPlayerName = gameState.currentPlayer === 'white' ? players.white.name : players.black.name;
  const isInCheck = gameState.board && (() => {
    // Simple check detection for UI
    const kingSquare = Array.from(gameState.board.entries()).find(
      ([, piece]) => piece.type === 'king' && piece.color === gameState.currentPlayer
    )?.[0];
    return kingSquare && Array.from(gameState.board.entries()).some(
      ([square, piece]) => piece.color !== gameState.currentPlayer && 
      square !== kingSquare // Basic check - in real implementation would use proper logic
    );
  })();

  return (
    <div 
      className="min-h-screen p-4 transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.secondary} 100%)` 
      }}
    >
      <div 
        className="max-w-6xl mx-auto"
        style={{ 
          background: `linear-gradient(135deg, ${theme.background}80 0%, ${theme.secondary}80 100%)`,
          borderRadius: '2rem',
          padding: '2rem',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${theme.border}40`
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 
            className="text-3xl font-bold flex items-center gap-2"
            style={{ color: theme.primary }}
          >
            ✨ Chess Made Better ✨
          </h1>
          <div className="flex gap-2">
            {/* Undo/Redo */}
            <button
              onClick={undoMove}
              disabled={gameState.moves.length === 0}
              className="text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
              style={{ 
                backgroundColor: theme.accent,
                boxShadow: `0 4px 12px ${theme.accent}40`
              }}
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={redoMove}
              disabled={true} // Simplified for now
              className="text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
              style={{ 
                backgroundColor: theme.accent,
                boxShadow: `0 4px 12px ${theme.accent}40`
              }}
            >
              <RotateRight size={16} />
            </button>

            {/* Resign/Draw */}
            <button
              onClick={() => handleResign(gameState.currentPlayer)}
              className="text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: '#ef4444',
                boxShadow: '0 4px 12px #ef444440'
              }}
            >
              <Flag size={16} />
            </button>
            <button
              onClick={() => offerDraw(gameState.currentPlayer)}
              className="text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: '#f59e0b',
                boxShadow: '0 4px 12px #f59e0b40'
              }}
            >
              <HandHeart size={16} />
            </button>

            <GameSaver
              onSave={saveGame}
              onLoad={loadGame}
              getSavedGames={getSavedGames}
              player1Name={players.white.name}
              player2Name={players.black.name}
            />
            <button
              onClick={() => { setShowSettings(true); handleModalOpen(); }}
              className="text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: theme.accent,
                boxShadow: `0 4px 12px ${theme.accent}40`
              }}
            >
              <Settings size={16} />
              Settings
            </button>
            <button
              onClick={() => { setShowHelp(true); handleModalOpen(); }}
              className="text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: theme.accent,
                boxShadow: `0 4px 12px ${theme.accent}40`
              }}
            >
              <HelpCircle size={16} />
              Help
            </button>
            <button
              onClick={handleQuitGame}
              className="text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: theme.primary,
                boxShadow: `0 4px 12px ${theme.primary}40`
              }}
            >
              <Home size={16} />
              New Game
            </button>
          </div>
        </div>

        {/* Game Layout */}
        <div className="flex flex-col items-center gap-4">
          {/* Top Player (Black) */}
          <PlayerInfo
            color="black"
            name={players.black.name}
            time={gameState.blackTime}
            isActive={gameState.currentPlayer === 'black'}
            theme={globalTheme}
            capturedPieces={gameState.capturedPieces}
            isTop={true}
            isInCheck={gameState.currentPlayer === 'black' && isInCheck}
          />

          {/* Chess Board */}
          <div className="flex justify-center">
            <ChessBoard
              gameState={gameState}
              selectedSquare={selectedSquare}
              onSquareClick={selectSquare}
              onMove={makeMove}
              jokerRevealComplete={jokerRevealComplete}
              globalTheme={globalTheme}
              showPossibleMoves={showPossibleMoves}
              possibleMoves={possibleMoves}
              invalidMoveSquare={invalidMoveSquare}
            />
          </div>

          {/* Bottom Player (White) */}
          <PlayerInfo
            color="white"
            name={players.white.name}
            time={gameState.whiteTime}
            isActive={gameState.currentPlayer === 'white'}
            theme={globalTheme}
            capturedPieces={gameState.capturedPieces}
            isTop={false}
            isInCheck={gameState.currentPlayer === 'white' && isInCheck}
          />
        </div>

        {/* Game Status */}
        <div className="mt-6 text-center">
          <div 
            className="backdrop-blur-sm rounded-2xl p-4 border-2 inline-block"
            style={{ 
              backgroundColor: `${theme.background}80`,
              borderColor: theme.border
            }}
          >
            <p className="font-semibold" style={{ color: theme.text }}>
              {isPaused ? '⏸️ Game Paused' :
               gameState.gameStatus === 'playing' ? 
                `${currentPlayerName}'s turn` :
                'Game Over'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {gameState.gameStatus === 'playing' && !jokerRevealComplete && (
        <JokerReveal
          gameState={gameState}
          onRevealComplete={handleJokerRevealComplete}
        />
      )}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => { setShowSettings(false); handleModalClose(); }}
        showPossibleMoves={showPossibleMoves}
        onToggleShowMoves={() => setShowPossibleMoves(!showPossibleMoves)}
        onPauseGame={pauseGame}
        onQuitGame={handleQuitGame}
        isPaused={isPaused}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => { setShowHelp(false); handleModalClose(); }}
      />

      <PawnPromotionModal
        isOpen={!!pendingPromotion}
        color={pendingPromotion ? gameState.board.get(pendingPromotion.from)?.color || 'white' : 'white'}
        onPromote={handlePawnPromotion}
      />

      <ConfirmationModal
        isOpen={!!confirmAction}
        title={confirmAction?.type === 'resign' ? 'Resign Game?' : 'Quit Game?'}
        message={confirmAction?.type === 'resign' ? 
          'Are you sure you want to resign? You will lose the game.' :
          'Are you sure you want to quit? The current game will be lost.'
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
        confirmText={confirmAction?.type === 'resign' ? 'Resign' : 'Quit'}
        type="danger"
      />

      {drawOffer && (
        <ConfirmationModal
          isOpen={true}
          title="Draw Offer"
          message={`${drawOffer === 'white' ? players.white.name : players.black.name} is offering a draw. Do you accept?`}
          onConfirm={() => respondToDraw(true)}
          onCancel={() => respondToDraw(false)}
          confirmText="Accept Draw"
          cancelText="Decline"
          type="info"
        />
      )}

      {showSaveGame && gameState.gameStatus === 'ended' && (
        <SaveGameModal
          isOpen={showSaveGame}
          onSave={(filename) => {
            saveGame(filename);
            setShowSaveGame(false);
          }}
          onSkip={() => setShowSaveGame(false)}
          player1Name={players.white.name}
          player2Name={players.black.name}
          winner={gameState.winner ? (gameState.winner === 'white' ? players.white.name : players.black.name) : undefined}
        />
      )}

      {showGameEnd && gameState.gameStatus === 'ended' && (
        <GameEndModal
          winner={gameState.winner}
          reason={gameState.endReason || 'checkmate'}
          onNewGame={handleNewGame}
          winnerName={gameState.winner ? (gameState.winner === 'white' ? players.white.name : players.black.name) : ''}
          isDraw={!gameState.winner}
        />
      )}
    </div>
  );
}

export default App;