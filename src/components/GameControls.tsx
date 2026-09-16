'use client';

import { useState } from 'react';
import { Plus, RotateCcw, FlipHorizontal2, Flag, X } from 'lucide-react';
import { useChessStore } from '@/lib/store/useChessStore';
import type { Difficulty } from '@/lib/types';

export function GameControls() {
  const {
    resetGame,
    undoMove,
    flipBoard,
    resignGame,
    difficulty,
    setDifficulty,
    status,
    language,
  } = useChessStore();

  const [showResignConfirm, setShowResignConfirm] = useState(false);

  const t = useChessStore.getState().language === 'ru'
    ? {
        newGame: 'Новая игра',
        undo: 'Отменить ход',
        flipBoard: 'Повернуть доску',
        resign: 'Сдаться',
        resignConfirm: 'Вы уверены, что хотите сдаться?',
        confirm: 'Подтвердить',
        cancel: 'Отмена',
        difficulty: 'Сложность',
        easy: 'Лёгкий',
        medium: 'Средний',
        hard: 'Сложный',
      }
    : {
        newGame: 'Joc Nou',
        undo: 'Anulează',
        flipBoard: 'Rotește tabla',
        resign: 'Cedează',
        resignConfirm: 'Ești sigur că vrei să cedezi partida?',
        confirm: 'Confirmă',
        cancel: 'Anulează',
        difficulty: 'Dificultate',
        easy: 'Ușor',
        medium: 'Mediu',
        hard: 'Dificil',
      };

  const isGameOver = [
    'checkmate',
    'stalemate',
    'draw_fifty_moves',
    'draw_threefold',
    'draw_insufficient_material',
    'resigned_white',
    'resigned_black',
  ].includes(status);

  const handleNewGame = () => {
    if (showResignConfirm) {
      setShowResignConfirm(false);
    }
    resetGame(difficulty);
  };

  const handleResign = () => {
    if (isGameOver) return;
    setShowResignConfirm(true);
  };

  const confirmResign = () => {
    resignGame();
    setShowResignConfirm(false);
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={handleNewGame}
          disabled={showResignConfirm}
          className="flex-1 min-w-[100px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.newGame}
        </button>
        <button
          onClick={undoMove}
          disabled={isGameOver || showResignConfirm}
          className="flex-1 min-w-[100px] px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {t.undo}
        </button>
        <button
          onClick={flipBoard}
          disabled={showResignConfirm}
          className="flex-1 min-w-[100px] px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FlipHorizontal2 className="w-4 h-4" />
          {t.flipBoard}
        </button>
        <button
          onClick={handleResign}
          disabled={isGameOver || showResignConfirm}
          className="flex-1 min-w-[100px] px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Flag className="w-4 h-4" />
          {t.resign}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 w-full">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{t.difficulty}</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          disabled={showResignConfirm}
          className="flex-1 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="easy">{t.easy}</option>
          <option value="medium">{t.medium}</option>
          <option value="hard">{t.hard}</option>
        </select>
      </div>

      {showResignConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-md w-full text-center">
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">{t.resignConfirm}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmResign}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                {t.confirm}
              </button>
              <button
                onClick={() => setShowResignConfirm(false)}
                className="px-6 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-medium rounded-lg transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}