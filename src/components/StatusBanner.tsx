'use client';

import { AlertCircle, Trophy, MinusCircle, XCircle } from 'lucide-react';
import { useChessStore } from '@/lib/store/useChessStore';
import type { GameStatus } from '@/lib/types';

const STATUS_CONFIG: Record<GameStatus, { icon: typeof AlertCircle; color: string; bgColor: string }> = {
  check: { icon: AlertCircle, color: 'text-amber-700 dark:text-amber-300', bgColor: 'bg-amber-50 dark:bg-amber-900/30' },
  checkmate: { icon: Trophy, color: 'text-emerald-700 dark:text-emerald-300', bgColor: 'bg-emerald-50 dark:bg-emerald-900/30' },
  stalemate: { icon: MinusCircle, color: 'text-blue-700 dark:text-blue-300', bgColor: 'bg-blue-50 dark:bg-blue-900/30' },
  draw_fifty_moves: { icon: MinusCircle, color: 'text-blue-700 dark:text-blue-300', bgColor: 'bg-blue-50 dark:bg-blue-900/30' },
  draw_threefold: { icon: MinusCircle, color: 'text-blue-700 dark:text-blue-300', bgColor: 'bg-blue-50 dark:bg-blue-900/30' },
  draw_insufficient_material: { icon: MinusCircle, color: 'text-blue-700 dark:text-blue-300', bgColor: 'bg-blue-50 dark:bg-blue-900/30' },
  resigned_white: { icon: XCircle, color: 'text-red-700 dark:text-red-300', bgColor: 'bg-red-50 dark:bg-red-900/30' },
  resigned_black: { icon: Trophy, color: 'text-emerald-700 dark:text-emerald-300', bgColor: 'bg-emerald-50 dark:bg-emerald-900/30' },
  in_progress: { icon: AlertCircle, color: 'text-zinc-500 dark:text-zinc-400', bgColor: 'bg-zinc-50 dark:bg-zinc-800' },
};

export function StatusBanner() {
  const { status, language, resetGame } = useChessStore();

  if (status === 'in_progress') return null;

  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  const messages: Record<GameStatus, { ro: string; ru: string }> = {
    check: { ro: 'Șah!', ru: 'Шах!' },
    checkmate: {
      ro: 'Șah Mat! Ai câștigat! Felicitări!',
      ru: 'Шах и мат! Вы победили! Поздравляем!',
    },
    stalemate: {
      ro: 'Remiză prin pat! Niciun jucător nu are mutări legale.',
      ru: 'Ничья (пат)! У игрока нет возможных ходов.',
    },
    draw_fifty_moves: {
      ro: 'Remiză — Regula celor 50 de mutări fără captură sau mutare de pion.',
      ru: 'Ничья — правило 50 ходов без взятий и движения пешек.',
    },
    draw_threefold: {
      ro: 'Remiză prin repetiția aceleiași poziții de 3 ori.',
      ru: 'Ничья из-за троекратного повторения позиции.',
    },
    draw_insufficient_material: {
      ro: 'Remiză — Material insuficient pentru a da mat.',
      ru: 'Ничья — недостаточно материала для мата.',
    },
    resigned_white: {
      ro: 'Ai cedat partida. Computerul a câștigat.',
      ru: 'Вы сдались. Компьютер одержал победу.',
    },
    resigned_black: {
      ro: 'Computerul a cedat partida. Felicitări!',
      ru: 'Компьютер сдался. Поздравляем с победой!',
    },
    in_progress: { ro: 'Partidă în desfășurare', ru: 'Партия продолжается' },
  };

  const message = messages[status]?.[language] || messages[status]?.ro || '';

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-xl border animate-slide-down ${config.bgColor} ${config.color} max-w-md text-center`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-2">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="font-semibold text-base">{message}</p>
      </div>
      {['checkmate', 'stalemate', 'draw_fifty_moves', 'draw_threefold', 'draw_insufficient_material', 'resigned_white', 'resigned_black'].includes(status) && (
        <button
          onClick={() => resetGame()}
          className="mt-2 px-4 py-1.5 text-sm font-medium rounded-lg border transition-colors hover:bg-white/20 dark:hover:bg-black/20"
        >
          {language === 'ru' ? 'Новая игра' : 'Joc Nou'}
        </button>
      )}
    </div>
  );
}