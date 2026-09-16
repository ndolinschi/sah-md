import { Chess, type Move } from 'chess.js';
import { findBestMove } from './minimax';
import type { Difficulty } from '../types';

export interface AiMoveResponse {
  from: string;
  to: string;
  promotion?: string;
  san: string;
  score: number;
  depth: number;
  nodes: number;
}

let activeRequestId = 0;

/**
 * Computes AI move asynchronously.
 * Uses a slight delay yielding to the browser event loop so the UI updates
 * (thinking spinner, sound, board highlight) before heavy computation begins.
 */
export async function computeAiMove(
  fen: string,
  difficulty: Difficulty,
  signal?: AbortSignal
): Promise<AiMoveResponse | null> {
  const currentId = ++activeRequestId;

  return new Promise<AiMoveResponse | null>((resolve) => {
    // Yield to browser event loop to let UI render the thinking state
    setTimeout(() => {
      if (signal?.aborted || currentId !== activeRequestId) {
        resolve(null);
        return;
      }

      try {
        const chess = new Chess(fen);
        if (chess.isGameOver()) {
          resolve(null);
          return;
        }

        const result = findBestMove(fen, difficulty);

        if (signal?.aborted || currentId !== activeRequestId) {
          resolve(null);
          return;
        }

        if (!result.move) {
          // Fallback to first legal move if minimax didn't return one
          const fallbackMoves = chess.moves({ verbose: true });
          if (fallbackMoves.length > 0) {
            const fb = fallbackMoves[0];
            resolve({
              from: fb.from,
              to: fb.to,
              promotion: fb.promotion,
              san: fb.san,
              score: result.score,
              depth: result.depth,
              nodes: result.nodes,
            });
            return;
          }
          resolve(null);
          return;
        }

        resolve({
          from: result.move.from,
          to: result.move.to,
          promotion: result.move.promotion,
          san: result.move.san,
          score: result.score,
          depth: result.depth,
          nodes: result.nodes,
        });
      } catch (err) {
        console.error('Error calculating AI move:', err);
        // Fallback emergency legal move
        try {
          const emergencyChess = new Chess(fen);
          const legal = emergencyChess.moves({ verbose: true });
          if (legal.length > 0) {
            const m = legal[Math.floor(Math.random() * legal.length)];
            resolve({
              from: m.from,
              to: m.to,
              promotion: m.promotion,
              san: m.san,
              score: 0,
              depth: 1,
              nodes: 1,
            });
            return;
          }
        } catch {}
        resolve(null);
      }
    }, 120);
  });
}

export function cancelPendingAi(): void {
  activeRequestId++;
}
