import type { Square, PieceSymbol, Color } from 'chess.js';

export type Language = 'ro' | 'ru';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type BoardTheme = 'emerald' | 'wood' | 'tournament';

export type GameStatus =
  | 'in_progress'
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'draw_fifty_moves'
  | 'draw_threefold'
  | 'draw_insufficient_material'
  | 'resigned_white'
  | 'resigned_black';

export interface MoveRecord {
  san: string;
  from: Square;
  to: Square;
  piece: PieceSymbol;
  captured?: PieceSymbol;
  color: Color;
  fenBefore: string;
  fenAfter: string;
}

export interface CapturedPieces {
  w: PieceSymbol[]; // Pieces captured by White (i.e. black pieces taken)
  b: PieceSymbol[]; // Pieces captured by Black (i.e. white pieces taken)
}

export interface MoveEvaluation {
  score: number;
  bestMove?: {
    from: Square;
    to: Square;
    promotion?: PieceSymbol;
    san?: string;
  };
  depth: number;
  nodes: number;
}
