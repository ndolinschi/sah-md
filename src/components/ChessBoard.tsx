'use client';

import dynamic from 'next/dynamic';
import { useCallback, useMemo } from 'react';
import { Square } from 'chess.js';
import type { PieceDropHandlerArgs, PieceHandlerArgs } from 'react-chessboard';
import { useChessStore } from '@/lib/store/useChessStore';
import type { BoardTheme } from '@/lib/types';

const Chessboard = dynamic(
  () => import('react-chessboard').then((mod) => mod.Chessboard),
  { ssr: false }
);

const THEME_STYLES: Record<BoardTheme, { light: React.CSSProperties; dark: React.CSSProperties; border: string }> = {
  emerald: {
    light: { backgroundColor: '#e8f5e9' },
    dark: { backgroundColor: '#2e7d32' },
    border: '#1b5e20',
  },
  wood: {
    light: { backgroundColor: '#f5deb3' },
    dark: { backgroundColor: '#8b5a2b' },
    border: '#5d3a1a',
  },
  tournament: {
    light: { backgroundColor: '#d4d4d4' },
    dark: { backgroundColor: '#708090' },
    border: '#2f4f4f',
  },
};

export function ChessBoard() {
  const {
    fen,
    orientation,
    boardTheme,
    makeMove,
    isAiThinking,
    lastMove,
    language,
  } = useChessStore();

  const { light, dark, border } = useMemo(() => THEME_STYLES[boardTheme], [boardTheme]);

  const boardStyle = useMemo(
    () => ({
      width: '100%',
      maxWidth: '560px',
      aspectRatio: '1 / 1',
      border: `8px solid ${border}`,
      borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2)',
    }),
    [border]
  );

  const squareStyle = useMemo(
    () => ({
      width: '12.5%',
      height: '12.5%',
    }),
    []
  );

  const squareStyles = useMemo(() => {
    if (!lastMove) return {};
    return {
      [lastMove.from]: { backgroundColor: 'rgba(255, 215, 0, 0.4)' },
      [lastMove.to]: { backgroundColor: 'rgba(255, 215, 0, 0.4)' },
    };
  }, [lastMove]);

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
      if (!targetSquare || sourceSquare === targetSquare) return false;
      if (isAiThinking) return false;
      return makeMove(sourceSquare as Square, targetSquare as Square);
    },
    [makeMove, isAiThinking]
  );

  const canDragPiece = useCallback(
    ({ piece }: PieceHandlerArgs) => {
      if (isAiThinking) return false;
      // White pieces are 'wP', 'wN', ... — human plays White
      return piece.pieceType.startsWith('w');
    },
    [isAiThinking]
  );

  const options = useMemo(
    () => ({
      position: fen,
      boardOrientation: orientation,
      showNotation: true,
      darkSquareStyle: dark,
      lightSquareStyle: light,
      squareStyle,
      squareStyles,
      boardStyle: { ...boardStyle, border: 'none', boxShadow: 'none', backgroundColor: 'transparent' },
      onPieceDrop,
      canDragPiece,
      allowDragging: true,
      allowDragOffBoard: false,
      showAnimations: true,
      animationDurationInMs: 200,
    }),
    [
      fen,
      orientation,
      dark,
      light,
      squareStyle,
      squareStyles,
      boardStyle,
      onPieceDrop,
      canDragPiece,
    ]
  );

  if (!Chessboard) {
    return (
      <div style={boardStyle} className="flex items-center justify-center bg-zinc-900 text-zinc-300">
        Loading board...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        style={{
          ...boardStyle,
          backgroundColor: dark.backgroundColor,
        }}
        className="relative"
      >
        <Chessboard options={options} />
      </div>
      {isAiThinking && (
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 animate-pulse">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{language === 'ru' ? 'Компьютер думает...' : 'Computer gândește...'}</span>
        </div>
      )}
    </div>
  );
}
