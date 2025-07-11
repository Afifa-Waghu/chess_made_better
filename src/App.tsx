import React, { useState } from 'react';
import { GameSetup } from './components/GameSetup';
import { ChessBoard } from './components/ChessBoard';
import { JokerReveal } from './components/JokerReveal';
import { GameSaver } from './components/GameSaver';
import { GameEndModal } from './components/GameEndModal';
import { TopBar } from './components/TopBar';
import { PawnPromotionModal } from './components/PawnPromotionModal';
import { DrawOfferModal } from './components/DrawOfferModal';
import { useChessGame } from './hooks/useChessGame';
import { getTheme } from './styles/themes';
import { PlayerInfo } from './components/PlayerInfo';

function App() {
  const {
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
    canUndo,
    canRedo,
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
  } = useChessGame();

  const [showGameEnd, setShowGameEnd] = useState(false);
  const [globalTheme, setGlobalTheme] = useState('Princess Pink');

  const handleStartGame = (whitePlayer: any, blackPlayer: any, timeControl: any, theme: string) => {
    setGlobalTheme(theme);
    startGame(whitePlayer, blackPlayer, timeControl);
  };

  React.useEffect(() => {
    if (gameState.gameStatus === 'ended' && !showGameEnd) {
      setShowGameEnd(true);
    }
  }, [gameState.gameStatus, showGameEnd]);

  const possibleMoves = selectedSquare ? getPossibleMoves(selectedSquare) : [];
  const currentPlayerName = gameState.currentPlayer === 'white' ? players.white.name : players.black.name;

  if (gameState.gameStatus === 'setup') {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  const theme = getTheme(globalTheme);

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
        {/* Top Bar */}
        <TopBar
          onUndo={undoMove}
          onRedo={redoMove}
          onResign={resign}
          onOfferDraw={offerDraw}
          onPause={pauseGame}
          onResume={resumeGame}
          canUndo={canUndo}
          canRedo={canRedo}
          isPaused={isPaused}
          showPossibleMoves={showPossibleMoves}
          onTogglePossibleMoves={setShowPossibleMoves}
          currentPlayerName={currentPlayerName}
          theme={theme}
        />

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
          />

          {/* Chess Board */}
          <div className="flex justify-center">
            <ChessBoard
              gameState={gameState}
              selectedSquare={selectedSquare}
              onSquareClick={selectSquare}
              onMove={makeMove}
              playerThemes={{
                white: globalTheme,
                black: globalTheme
              }}
              jokerRevealComplete={jokerRevealComplete}
              globalTheme={globalTheme}
              possibleMoves={possibleMoves}
              isPaused={isPaused}
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
          />
        </div>

        {/* Save/Load Button */}
        <div className="mt-4 text-center">
          <GameSaver
            onSave={saveGame}
            onLoad={loadGame}
            getSavedGames={getSavedGames}
            player1Name={players.white.name}
            player2Name={players.black.name}
          />
        </div>
      </div>

      {/* Modals */}
      {gameState.gameStatus === 'playing' && !jokerRevealComplete && (
        <JokerReveal
          gameState={gameState}
          onRevealComplete={handleJokerRevealComplete}
        />
      )}

      {/* Pawn Promotion Modal */}
      <PawnPromotionModal
        isOpen={!!pendingPromotion}
        onPromote={promotePawn}
        color={gameState.currentPlayer}
        theme={theme}
      />

      {/* Draw Offer Modal */}
      {drawOffer && (
        <DrawOfferModal
          isOpen={true}
          onAccept={acceptDraw}
          onDecline={declineDraw}
          offeringPlayerName={drawOffer.from === 'white' ? players.white.name : players.black.name}
          theme={theme}
        />
      )}

      {/* Game End Modal */}
      {showGameEnd && (
        <GameEndModal
          winner={gameState.winner}
          reason={gameEndReason || (gameState.winner === undefined ? 'draw' : 'checkmate')}
          onNewGame={() => window.location.reload()}
          winnerName={gameState.winner ? (gameState.winner === 'white' ? players.white.name : players.black.name) : 'Draw'}
        />
      )}
      
      {/* Save Prompt Modal */}
      <SavePromptModal
        isOpen={showSavePrompt}
        onSave={(filename) => handleSavePrompt(true, filename)}
        onSkip={() => handleSavePrompt(false)}
        player1Name={players.white.name}
        player2Name={players.black.name}
        theme={theme}
      />
    </div>
  );
}

export default App;