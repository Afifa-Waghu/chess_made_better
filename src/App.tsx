import React, { useState } from 'react';
import { GameModeSelection } from './components/GameModeSelection';
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
  const [gameMode, setGameMode] = useState<'standard' | 'chess960' | 'joker' | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'resign' | 'quit';
    player?: 'white' | 'black';
  } | null>(null);

  const handleNewGame = () => {
    window.location.reload();
  };

  const handleStartGame = (whitePlayer: any, blackPlayer: any, timeControl: any, theme: string) => {
    setGlobalTheme(theme);
    startGame(whitePlayer, blackPlayer, timeControl, gameMode || 'joker');
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

  if (!gameMode) {
    return <GameModeSelection onSelectMode={setGameMode} />;
  }

  if (gameState.gameStatus === 'setup') {
    return (
      <GameSetup 
        onStartGame={handleStartGame} 
        gameMode={gameMode}
        onBack={() => setGameMode(null)}
      />
    );
  }

  const theme = getTheme(globalTheme);
  const currentPlayerName = gameState.currentPlayer === 'white' ? players.white.name : players.black.name;
  
  // Check if current player is in check
  const isCurrentPlayerInCheck = gameState.board ? isInCheck(gameState.currentPlayer, gameState.board) : false;
  const whiteKingInCheck = gameState.board ? isInCheck('white', gameState.board) : false;
  const blackKingInCheck = gameState.board ? isInCheck('black', gameState.board) : false;

  return (
    <div 
      className="min-h-screen p-2 sm:p-4 transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.secondary} 100%)` 
      }}
    >
      <div 
        className="max-w-7xl mx-auto"
        style={{ 
          background: `linear-gradient(135deg, ${theme.background}80 0%, ${theme.secondary}80 100%)`,
          borderRadius: '1rem',
          padding: '1rem',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${theme.border}40`
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
          <h1 
            className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 text-center"
            style={{ color: theme.primary }}
          >
            ✨ Chess Made Better ✨
          </h1>
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
            {/* Undo/Redo */}
            <button
              onClick={undoMove}
              disabled={gameState.moves.length === 0}
              className="text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50 text-xs sm:text-sm"
              style={{ 
                backgroundColor: theme.accent,
                boxShadow: `0 4px 12px ${theme.accent}40`
              }}
            >
              <RotateCcw size={14} className="sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={redoMove}
              disabled={true} // Simplified for now
              className="text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50 text-xs sm:text-sm"
              style={{ 
                backgroundColor: theme.accent,
                boxShadow: `0 4px 12px ${theme.accent}40`
              }}
            >
              <RotateRight size={14} className="sm:w-4 sm:h-4" />
            </button>

            {/* Resign/Draw */}
            <button
              onClick={() => handleResign(gameState.currentPlayer)}
              className="text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              style={{ 
                backgroundColor: '#ef4444',
                boxShadow: '0 4px 12px #ef444440'
              }}
            >
              <Flag size={14} className="sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => offerDraw(gameState.currentPlayer)}
              className="text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              style={{ 
                backgroundColor: '#f59e0b',
                boxShadow: '0 4px 12px #f59e0b40'
              }}
            >
              <HandHeart size={14} className="sm:w-4 sm:h-4" />
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
              className="text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              style={{ 
                backgroundColor: theme.accent,
                boxShadow: `0 4px 12px ${theme.accent}40`
              }}
            >
              <Settings size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={() => { setShowHelp(true); handleModalOpen(); }}
              className="text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              style={{ 
                backgroundColor: theme.accent,
                boxShadow: `0 4px 12px ${theme.accent}40`
              }}
            >
              <HelpCircle size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Help</span>
            </button>
            <button
              onClick={handleQuitGame}
              className="text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              style={{ 
                backgroundColor: theme.primary,
                boxShadow: `0 4px 12px ${theme.primary}40`
              }}
            >
              <Home size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New Game</span>
            </button>
          </div>
        </div>

        {/* Game Layout */}
        <div className="flex flex-col items-center gap-2 sm:gap-4">
          {/* Top Player (Black) */}
          <PlayerInfo
            color="black"
            name={players.black.name}
            time={gameState.blackTime}
            isActive={gameState.currentPlayer === 'black'}
            theme={globalTheme}
            capturedPieces={gameState.capturedPieces}
            isTop={true}
            isInCheck={blackKingInCheck}
          />

          {/* Chess Board */}
          <div className="flex justify-center w-full">
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
              whiteKingInCheck={whiteKingInCheck}
              blackKingInCheck={blackKingInCheck}
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
            isInCheck={whiteKingInCheck}
          />
        </div>

        {/* Game Status */}
        <div className="mt-4 sm:mt-6 text-center">
          <div 
            className="backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 inline-block"
            style={{ 
              backgroundColor: `${theme.background}80`,
              borderColor: theme.border
            }}
          >
            <p className="font-semibold text-sm sm:text-base" style={{ color: theme.text }}>
              {isPaused ? '⏸️ Game Paused' :
               gameState.gameStatus === 'playing' ? 
                `${currentPlayerName}'s turn${isCurrentPlayerInCheck ? ' (In Check!)' : ''}` :
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