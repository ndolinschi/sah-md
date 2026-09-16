'use client';

import { useChessStore } from '@/lib/store/useChessStore';
import type { PieceSymbol } from 'chess.js';

const PIECE_UNICODE: Record<PieceSymbol, { white: string; black: string }> = {
  p: { white: '♙', black: '♟' },
  n: { white: '♘', black: '♞' },
  b: { white: '♗', black: '♝' },
  r: { white: '♖', black: '♜' },
  q: { white: '♕', black: '♛' },
  k: { white: '♔', black: '♚' },
};

const PIECE_LABELS_RO: Record<PieceSymbol, string> = {
  p: 'Pion',
  n: 'Cal',
  b: 'Nebun',
  r: 'Turn',
  q: 'Regina',
  k: 'Rege',
};

const PIECE_LABELS_RU: Record<PieceSymbol, string> = {
  p: 'Пешка',
  n: 'Конь',
  b: 'Слон',
  r: 'Ладья',
  q: 'Ферзь',
  k: 'Король',
};

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export function CapturedPieces() {
  const { capturedPieces, materialAdvantage, language } = useChessStore();

  const labels = language === 'ru' ? PIECE_LABELS_RU : PIECE_LABELS_RO;
  const capturedTitle = language === 'ru' ? 'Взятые фигуры' : 'Piese capturate';
  const advantageTitle = language === 'ru' ? 'Материальное преимущество' : 'Avantaj material';
  const whiteAdvantageText = language === 'ru' ? 'Перевес Белых' : 'Avantaj Alb';
  const blackAdvantageText = language === 'ru' ? 'Перевес Чёрных' : 'Avantaj Negru';
  const equalText = language === 'ru' ? 'Равная позиция' : 'Poziție egală';

  const getAdvantageText = () => {
    if (materialAdvantage > 0) return `+${materialAdvantage} (${whiteAdvantageText})`;
    if (materialAdvantage < 0) return `${materialAdvantage} (${blackAdvantageText})`;
    return equalText;
  };

  const renderCapturedRow = (pieces: PieceSymbol[], color: 'w' | 'b') => {
    const counts: Record<PieceSymbol, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
    for (const p of pieces) {
      counts[p]++;
    }

    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {(['q', 'r', 'b', 'n', 'p'] as PieceSymbol[]).map((piece) => {
          const count = counts[piece];
          if (count === 0) return null;
          return (
            <span
              key={piece}
              className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-full text-xs font-medium"
              title={`${labels[piece]} × ${count}`}
            >
              <span className="text-lg" style={{ fontFamily: 'system-ui' }}>
                {PIECE_UNICODE[piece][color === 'w' ? 'black' : 'white']}
              </span>
              {count > 1 && <span className="text-zinc-600 dark:text-zinc-300">×{count}</span>}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">{capturedTitle}</h3>

      <div className="mb-4">
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
          {language === 'ru' ? 'Белые взяли (чёрные фигуры):' : 'Albele au luat (piese negre):'}
        </div>
        {capturedPieces.w.length === 0 ? (
          <p className="text-zinc-400 dark:text-zinc-500 text-sm italic">
            {language === 'ru' ? 'Нет взятых фигур' : 'Nicio piesă capturată'}
          </p>
        ) : (
          renderCapturedRow(capturedPieces.w, 'w')
        )}
      </div>

      <div className="mb-4">
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
          {language === 'ru' ? 'Чёрные взяли (белые фигуры):' : 'Negrele au luat (piese albe):'}
        </div>
        {capturedPieces.b.length === 0 ? (
          <p className="text-zinc-400 dark:text-zinc-500 text-sm italic">
            {language === 'ru' ? 'Нет взятых фигур' : 'Nicio piesă capturată'}
          </p>
        ) : (
          renderCapturedRow(capturedPieces.b, 'b')
        )}
      </div>

      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{advantageTitle}</div>
        <div className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">
          {getAdvantageText()}
        </div>
      </div>
    </div>
  );
}