import React, { useState, useCallback, useEffect } from 'react';
import { GameState, GameCategory, Player } from './types';
import LoginScreen from './components/LoginScreen';
import CategorySelectionScreen from './components/CategorySelectionScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import LeaderboardScreen from './components/LeaderboardScreen';

const PLAYER_KEY = 'mathWhizPlayer';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameCategory, setGameCategory] = useState<GameCategory>('Integers');
  const [lastScore, setLastScore] = useState<number>(0);

  useEffect(() => {
    try {
      const savedPlayerJSON = localStorage.getItem(PLAYER_KEY);
      if (savedPlayerJSON) {
        const savedPlayer = JSON.parse(savedPlayerJSON);
        setPlayer(savedPlayer);
        setGameState('category');
      } else {
        setGameState('login');
      }
    } catch (error) {
      console.error("Failed to load player data", error);
      setGameState('login');
    }
  }, []);

  const handleLogin = useCallback((loggedInPlayer: Player) => {
    try {
      localStorage.setItem(PLAYER_KEY, JSON.stringify(loggedInPlayer));
    } catch (error) {
      console.error("Failed to save player data", error);
    }
    setPlayer(loggedInPlayer);
    setGameState('category');
  }, []);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem(PLAYER_KEY);
    } catch (error) {
      console.error("Failed to remove player data", error);
    }
    setPlayer(null);
    setGameState('login');
  }, []);

  const handleCategorySelect = useCallback((category: GameCategory) => {
    setGameCategory(category);
    setGameState('playing');
  }, []);

  const handleGameOver = useCallback((score: number) => {
    setLastScore(score);
    setGameState('gameover');
  }, []);
  
  const handlePlayAgain = useCallback(() => {
    setGameState('category');
  }, []);
  
  const handleViewLeaderboard = useCallback(() => {
    setGameState('leaderboard');
  }, []);
  
  const handleBackToMenu = useCallback(() => {
    setGameState('category');
  }, []);
  
  const handleExitLeaderboard = useCallback(() => {
     setGameState('category');
  }, []);


  const renderContent = () => {
    if (gameState === 'loading') {
      return <div className="text-center text-2xl font-orbitron">Loading...</div>;
    }

    switch (gameState) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'category':
        return <CategorySelectionScreen onSelectCategory={handleCategorySelect} onViewLeaderboard={handleViewLeaderboard} playerName={player?.name || ''} onLogout={handleLogout} />;
      case 'playing':
        return <GameScreen category={gameCategory} onGameOver={handleGameOver} />;
      case 'gameover':
        if (!player) return <LoginScreen onLogin={handleLogin} />;
        return <GameOverScreen score={lastScore} category={gameCategory} player={player} onPlayAgain={handlePlayAgain} onViewLeaderboard={handleViewLeaderboard} />;
      case 'leaderboard':
        return <LeaderboardScreen onExit={handleExitLeaderboard} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;