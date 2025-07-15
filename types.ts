export type GameState = 'login' | 'category' | 'playing' | 'gameover' | 'leaderboard' | 'loading';

export type GameCategory = 'Integers' | 'Mixed Fractions' | 'Improper Fractions' | 'Decimals';

export interface Player {
  name: string;
  className: string;
}

export interface ScoreEntry {
  player: Player;
  score: number;
  category: GameCategory;
  date: string;
}

export interface Fraction {
  n: number; // numerator
  d: number; // denominator
}

// A question can have an answer that is a simple number (for Integers/Decimals) or a Fraction object
export interface Question {
  text: string;
  answer: number | Fraction;
}