import { Chess, type Move } from 'chess.js';
import { evaluateBoard, PIECE_VALUES } from './evaluation';
import type { Difficulty } from '../types';

interface SearchResult {
  move: Move | null;
  score: number;
  depth: number;
  nodes: number;
}

/**
 * Score a move for move ordering (MVV-LVA + checks + promotions)
 */
function scoreMoveForOrdering(move: Move): number {
  let score = 0;

  // Most Valuable Victim - Least Valuable Attacker (MVV-LVA)
  if (move.captured) {
    const victimVal = PIECE_VALUES[move.captured] || 100;
    const attackerVal = PIECE_VALUES[move.piece] || 100;
    score += 10000 + victimVal * 10 - attackerVal;
  }

  // Promotion bonus
  if (move.promotion) {
    score += PIECE_VALUES[move.promotion] || 900;
  }

  // Check giving bonus
  if (move.san.includes('+') || move.san.includes('#')) {
    score += 500;
  }

  return score;
}

/**
 * Order moves to maximize alpha-beta cutoffs
 */
function orderMoves(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => scoreMoveForOrdering(b) - scoreMoveForOrdering(a));
}

/**
 * Quiescence search: evaluate quiet positions to prevent horizon effect
 */
function quiescence(
  chess: Chess,
  alpha: number,
  beta: number,
  maxPly: number,
  nodeCounter: { count: number }
): number {
  nodeCounter.count++;
  const standPat = evaluateBoard(chess);

  const isWhiteTurn = chess.turn() === 'w';

  if (maxPly <= 0 || chess.isGameOver()) {
    return standPat;
  }

  if (isWhiteTurn) {
    if (standPat >= beta) return beta;
    if (standPat > alpha) alpha = standPat;

    // Only consider captures in quiescence
    const legalCaptures = chess
      .moves({ verbose: true })
      .filter((m) => m.captured !== undefined);
    const orderedCaptures = orderMoves(legalCaptures);

    for (const move of orderedCaptures) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, maxPly - 1, nodeCounter);
      chess.undo();

      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  } else {
    if (standPat <= alpha) return alpha;
    if (standPat < beta) beta = standPat;

    const legalCaptures = chess
      .moves({ verbose: true })
      .filter((m) => m.captured !== undefined);
    const orderedCaptures = orderMoves(legalCaptures);

    for (const move of orderedCaptures) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, maxPly - 1, nodeCounter);
      chess.undo();

      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
    return beta;
  }
}

/**
 * Minimax with Alpha-Beta pruning
 */
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  useQuiescence: boolean,
  nodeCounter: { count: number }
): { score: number; move: Move | null } {
  nodeCounter.count++;

  if (depth <= 0) {
    const score = useQuiescence
      ? quiescence(chess, alpha, beta, 2, nodeCounter)
      : evaluateBoard(chess);
    return { score, move: null };
  }

  if (chess.isGameOver()) {
    return { score: evaluateBoard(chess), move: null };
  }

  const isMaximizing = chess.turn() === 'w';
  const moves = orderMoves(chess.moves({ verbose: true }));

  if (moves.length === 0) {
    return { score: evaluateBoard(chess), move: null };
  }

  let bestMove: Move = moves[0];

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, useQuiescence, nodeCounter);
      chess.undo();

      if (evaluation.score > maxEval) {
        maxEval = evaluation.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, evaluation.score);
      if (beta <= alpha) {
        break; // Alpha-beta cutoff
      }
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, useQuiescence, nodeCounter);
      chess.undo();

      if (evaluation.score < minEval) {
        minEval = evaluation.score;
        bestMove = move;
      }
      beta = Math.min(beta, evaluation.score);
      if (beta <= alpha) {
        break; // Alpha-beta cutoff
      }
    }
    return { score: minEval, move: bestMove };
  }
}

/**
 * Finds the best move for current position according to difficulty
 */
export function findBestMove(
  fen: string,
  difficulty: Difficulty = 'medium'
): SearchResult {
  const chess = new Chess(fen);
  const legalMoves = chess.moves({ verbose: true });

  if (legalMoves.length === 0) {
    return { move: null, score: 0, depth: 0, nodes: 0 };
  }

  const isWhite = chess.turn() === 'w';
  const nodeCounter = { count: 0 };

  let targetDepth = 3;
  let useQuiescence = false;

  if (difficulty === 'easy') {
    targetDepth = 2;
    useQuiescence = false;
  } else if (difficulty === 'medium') {
    targetDepth = 3;
    useQuiescence = false;
  } else {
    // Hard: depth 3 with quiescence or depth 4 if low branching
    targetDepth = legalMoves.length > 28 ? 3 : 4;
    useQuiescence = true;
  }

  // Root move search with move ordering
  const orderedRootMoves = orderMoves(legalMoves);
  const scoredMoves: { move: Move; score: number }[] = [];

  let alpha = -Infinity;
  let beta = Infinity;

  let bestMove: Move = orderedRootMoves[0];
  let bestScore = isWhite ? -Infinity : Infinity;

  for (const move of orderedRootMoves) {
    chess.move(move);
    const result = minimax(
      chess,
      targetDepth - 1,
      alpha,
      beta,
      useQuiescence,
      nodeCounter
    );
    chess.undo();

    scoredMoves.push({ move, score: result.score });

    if (isWhite) {
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, result.score);
    } else {
      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, result.score);
    }
  }

  // If easy mode: add intentional human-like imperfection
  if (difficulty === 'easy') {
    // Sort scored moves
    scoredMoves.sort((a, b) => (isWhite ? b.score - a.score : a.score - b.score));

    // 35% chance to pick second or third best move if available
    if (scoredMoves.length > 1 && Math.random() < 0.35) {
      const pickIdx = Math.min(
        Math.floor(Math.random() * Math.min(3, scoredMoves.length)),
        scoredMoves.length - 1
      );
      bestMove = scoredMoves[pickIdx].move;
      bestScore = scoredMoves[pickIdx].score;
    }
  }

  return {
    move: bestMove,
    score: bestScore,
    depth: targetDepth,
    nodes: nodeCounter.count,
  };
}
