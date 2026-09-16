'use client';

import { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { useChessStore } from '@/lib/store/useChessStore';

export function MoveHistory() {
  const { history, language, exportPgn, exportFen, lastPgn } = useChessStore();

  const t = language === 'ru'
    ? {
        moveHistory: 'История ходов',
        noMovesYet: 'Партия ещё не началась. Сделайте первый ход!',
        copyPgn: 'Скопировать PGN',
        pgnCopied: 'PGN скопирован в буфер!',
        copyFen: 'Скопировать FEN',
        fenCopied: 'FEN скопирован в буфер!',
        downloadPgn: 'Скачать PGN',
      }
    : {
        moveHistory: 'Istoric mutări',
        noMovesYet: 'Partida nu a început încă. Fă prima mutare!',
        copyPgn: 'Copiază PGN',
        pgnCopied: 'PGN copiat în clipboard!',
        copyFen: 'Copiază FEN',
        fenCopied: 'FEN copiat în clipboard!',
        downloadPgn: 'Descarcă PGN',
      };

  const [copied, setCopied] = useState<'pgn' | 'fen' | null>(null);

  const handleCopyPgn = async () => {
    const pgn = exportPgn();
    await navigator.clipboard.writeText(pgn);
    setCopied('pgn');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyFen = async () => {
    const fen = exportFen();
    await navigator.clipboard.writeText(fen);
    setCopied('fen');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadPgn = () => {
    const pgn = exportPgn();
    const blob = new Blob([pgn], { type: 'application/x-chess-pgn' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-${new Date().toISOString().slice(0, 10)}.pgn`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{t.moveHistory}</h3>
        <div className="flex gap-1">
          <button
            onClick={handleCopyPgn}
            className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded"
            title={t.copyPgn}
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyFen}
            className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded"
            title={t.copyFen}
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadPgn}
            className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded"
            title={t.downloadPgn}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center py-8">{t.noMovesYet}</p>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-1">
          {history.map((move, index) => {
            const moveNumber = Math.floor(index / 2) + 1;
            const isWhiteMove = index % 2 === 0;

            return (
              <div
                key={index}
                className="flex items-baseline gap-1 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                {isWhiteMove && (
                  <span className="w-8 text-right text-zinc-500 dark:text-zinc-400 text-xs font-mono">
                    {moveNumber}.
                  </span>
                )}
                {!isWhiteMove && <span className="w-8" />}
                <span
                  className={`flex-1 text-sm font-mono ${
                    move.color === 'w' ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {move.san}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {copied && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-up">
          {copied === 'pgn' ? t.pgnCopied : t.fenCopied}
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}