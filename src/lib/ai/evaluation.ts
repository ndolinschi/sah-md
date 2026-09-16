import type { Chess, PieceSymbol, Color, Square } from 'chess.js';

export const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 335,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-Square Tables (White's perspective: rank 8 down to rank 1, file a to h)
// Rows: index 0 is rank 8 (black side), index 7 is rank 1 (white side)
const PAWN_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_PST = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_PST = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_PST = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_MIDDLE_PST = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -20, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

const PST_MAP: Record<PieceSymbol, number[][]> = {
  p: PAWN_PST,
  n: KNIGHT_PST,
  b: BISHOP_PST,
  r: ROOK_PST,
  q: QUEEN_PST,
  k: KING_MIDDLE_PST,
};

/**
 * Returns positional evaluation score.
 * Positive score = White has advantage, negative score = Black has advantage.
 */
export function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -99999 : 99999;
  }
  if (chess.isDraw()) {
    return 0;
  }

  let material = 0;
  let positional = 0;
  let whiteBishops = 0;
  let blackBishops = 0;

  const board = chess.board();

  for (let rankIdx = 0; rankIdx < 8; rankIdx++) {
    for (let fileIdx = 0; fileIdx < 8; fileIdx++) {
      const piece = board[rankIdx][fileIdx];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type];
      const pst = PST_MAP[piece.type];

      // White's table row is rankIdx; Black's is mirrored (7 - rankIdx)
      const pstRow = piece.color === 'w' ? rankIdx : 7 - rankIdx;
      const pstVal = pst ? pst[pstRow][fileIdx] : 0;

      if (piece.color === 'w') {
        material += val;
        positional += pstVal;
        if (piece.type === 'b') whiteBishops++;
      } else {
        material -= val;
        positional -= pstVal;
        if (piece.type === 'b') blackBishops++;
      }
    }
  }

  // Bishop pair bonus
  if (whiteBishops >= 2) positional += 25;
  if (blackBishops >= 2) positional -= 25;

  // Check bonus
  if (chess.inCheck()) {
    positional += chess.turn() === 'w' ? -35 : 35;
  }

  return material + positional;
}

/**
 * Quick material count calculation for captured pieces breakdown
 */
export function getMaterialDifference(chess: Chess): { whiteAdvantage: number } {
  const board = chess.board();
  let whiteMaterial = 0;
  let blackMaterial = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.type === 'k') continue;
      if (p.color === 'w') {
        whiteMaterial += PIECE_VALUES[p.type];
      } else {
        blackMaterial += PIECE_VALUES[p.type];
      }
    }
  }

  return { whiteAdvantage: Math.round((whiteMaterial - blackMaterial) / 100) };
}
