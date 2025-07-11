import React, { useState } from 'react';
import { GameSetup } from './components/GameSetup';
import { ChessBoard } from './components/ChessBoard';
import { PlayerClock } from './components/PlayerClock';
import { CapturedPieces } from './components/CapturedPieces';
import { HelpModal } from './components/HelpModal';
import { JokerReveal } from './components/JokerReveal';
import { GameSaver } from './components/GameSaver';
import { GameEndModal } from './components/GameEndModal';
import { useChessGame } from './hooks/useChessGame';
import { getTheme } from './styles/themes';
import { HelpCircle, Home } from 'lucide-react';
import { PlayerInfo } from './components/PlayerInfo';

function App() {
  const {
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
  } = useChessGame();

  const [showHelp, setShowHelp] = useState(false);
  const [showGameEnd, setShowGameEnd] = useState(false);
  const [globalTheme, setGlobalTheme] = useState('Princess Pink');

  const handleNewGame = () => {
    window.location.reload();
  };

  const handleStartGame = (whitePlayer: any, blackPlayer: any, timeControl: any, theme: string) => {
    setGlobalTheme(theme);
    startGame(whitePlayer, blackPlayer, timeControl);
  };

  React.useEffect(() => {
    if (gameState.gameStatus === 'ended' && !showGameEnd) {
      setShowGameEnd(true);
    }
  }, [gameState.gameStatus, showGameEnd]);

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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 
            className="text-3xl font-bold flex items-center gap-2"
            style={{ color: theme.primary }}
          >
            ✨ Chess Made Better ✨
          </h1>
          <div className="flex gap-2">
            <GameSaver
              onSave={saveGame}
              onLoad={loadGame}
              getSavedGames={getSavedGames}
              player1Name={players.white.name}
              player2Name={players.black.name}
            />
            <button
              onClick={() => setShowHelp(true)}
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
              onClick={handleNewGame}
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
              {gameState.gameStatus === 'playing' ? 
                `${gameState.currentPlayer === 'white' ? players.white.name : players.black.name}'s turn` :
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

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {showGameEnd && gameState.winner && (
        <GameEndModal
          winner={gameState.winner}
          reason="checkmate"
          onNewGame={handleNewGame}
          winnerName={gameState.winner === 'white' ? players.white.name : players.black.name}
        />
      )}
    </div>
  );
}

export default App;