'use client';

import { useEffect } from 'react';
import { ChessBoard } from '@/components/ChessBoard';
import { GameControls } from '@/components/GameControls';
import { MoveHistory } from '@/components/MoveHistory';
import { CapturedPieces } from '@/components/CapturedPieces';
import { StatusBanner } from '@/components/StatusBanner';
import { useChessStore } from '@/lib/store/useChessStore';
import type { BoardTheme } from '@/lib/types';

export default function GamePage() {
  const { boardTheme, language, setLanguage, setBoardTheme, soundEnabled, toggleSound } = useChessStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-emerald', 'theme-wood', 'theme-tournament');
    root.classList.add(`theme-${boardTheme}`);
  }, [boardTheme]);

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg">
      <header className="bg-theme-header border-b border-theme-border px-4 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-theme-accent" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
              <path d="M20 8 L20 32 M8 20 L32 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="20" cy="20" r="6" fill="currentColor" />
            </svg>
            <div>
              <h1 className="font-serif text-xl font-bold text-theme-text">{language === 'ru' ? 'Шахматы MD' : 'Șah MD'}</h1>
              <p className="text-xs text-theme-text-muted">{language === 'ru' ? 'Классические шахматы и ИИ' : 'Șah Clasica & Inteligență Artificială'}</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <a
              href="/settings"
              className="px-3 py-1.5 text-sm font-medium text-theme-text hover:text-theme-accent transition-colors rounded-lg hover:bg-theme-hover"
            >
              {language === 'ru' ? 'Настройки' : 'Setări'}
            </a>
            <button
              onClick={toggleSound}
              className="p-2 text-theme-text hover:text-theme-accent transition-colors rounded-lg hover:bg-theme-hover"
              aria-label={soundEnabled ? (language === 'ru' ? 'Выключить звук' : 'Dezactivează sunetul') : (language === 'ru' ? 'Включить звук' : 'Activează sunetul')}
            >
              {soundEnabled ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-6 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col items-center gap-6 min-w-0">
          <ChessBoard />
          <GameControls />
        </div>

        <aside className="lg:w-72 flex flex-col gap-6 shrink-0 min-w-0">
          <StatusBanner />
          <MoveHistory />
          <CapturedPieces />
        </aside>
      </main>

      <footer className="bg-theme-footer border-t border-theme-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-theme-text-muted">
          <p>{language === 'ru' ? 'Шахматы MD — Классические шахматы с ИИ' : 'Șah MD — Șah clasic cu AI'}</p>
          <a
            href="https://github.com/ndolinschi/sah-md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-theme-accent transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}