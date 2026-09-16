'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Volume2, VolumeX, Palette, Brain, Globe } from 'lucide-react';
import { useChessStore } from '@/lib/store/useChessStore';
import type { Language, Difficulty, BoardTheme } from '@/lib/types';

export default function SettingsPage() {
  const {
    language,
    setLanguage,
    difficulty,
    setDifficulty,
    boardTheme,
    setBoardTheme,
    soundEnabled,
    toggleSound,
    clearSavedPgn,
    lastPgn,
  } = useChessStore();

  const [gameCleared, setGameCleared] = useState(false);

  const t = language === 'ru'
    ? {
        title: 'Основные настройки',
        subtitle: 'Настройка параметров игры и поведения ИИ',
        language: 'Язык интерфейса',
        languageDesc: 'Выберите язык интерфейса, сообщений и меню.',
        difficulty: 'Сложность ИИ по умолчанию',
        difficultyDesc: 'Выберите глубину расчёта для алгоритма Минимакс с альфа-бета отсечением.',
        easyDesc: 'Глубина 2 с вариативностью. Подходит для начинающих и спокойной игры.',
        mediumDesc: 'Глубина 3 с надёжной позиционной оценкой. Клубный уровень.',
        hardDesc: 'Глубина 3–4 с тактическим расчётом и форсированным анализом. Серьёзный соперник.',
        boardTheme: 'Стиль шахматной доски',
        boardThemeDesc: 'Выберите оформление клеток и деревянного обрамления.',
        themeEmerald: 'Изумруд и благородный бук (Классика)',
        themeWood: 'Традиционный орех и клён',
        themeTournament: 'Турнирный сланец и нефрит',
        sounds: 'Звуковые эффекты',
        soundsDesc: 'Воспроизведение звуков при ходах, взятиях и шахах.',
        savedGame: 'Последняя сохранённая партия (PGN)',
        savedGameDesc: 'Запись последней сыгранной партии, сохранённая локально в браузере.',
        noSavedGame: 'Нет недавно сохранённых партий.',
        clearSavedGame: 'Очистить партию',
        gameCleared: 'Сохранённая партия удалена.',
        backToGame: 'Вернуться к игре',
        autoSaved: 'Все параметры сохраняются автоматически в локальном хранилище.',
      }
    : {
        title: 'Setări Generale',
        subtitle: 'Personalizează preferințele de joc și comportamentul AI',
        language: 'Limba interfeței',
        languageDesc: 'Alege limba folosită pentru mesaje, butoane și notații.',
        difficulty: 'Dificultate implicită AI',
        difficultyDesc: 'Selectează nivelul de profunzime pentru algoritmul Minimax Alpha-Beta.',
        easyDesc: 'Adâncime 2 cu variație casuală. Ideal pentru începători și joc relaxat.',
        mediumDesc: 'Adâncime 3 cu evaluare pozițională solidă. Nivel de club.',
        hardDesc: 'Adâncime 3–4 cu căutare tactică și ordonare optimă a mutărilor. O provocare serioasă.',
        boardTheme: 'Stil vizual tablă',
        boardThemeDesc: 'Personalizează paleta de culori a câmpurilor de joc.',
        themeEmerald: 'Smarald & Lemn Nobil (Clasic)',
        themeWood: 'Nuc & Paltin Tradițional',
        themeTournament: 'Turneu Ardezie & Jad',
        sounds: 'Efecte sonore',
        soundsDesc: 'Activează semnalele audio la mutări, capturi și șah.',
        savedGame: 'Ultima partidă salvată (PGN)',
        savedGameDesc: 'Istoricul ultimei partide jucate, salvat local în navigator.',
        noSavedGame: 'Nu există nicio partidă salvată recent.',
        clearSavedGame: 'Șterge partida salvată',
        gameCleared: 'Partida salvată a fost ștearsă.',
        backToGame: 'Înapoi la partidă',
        autoSaved: 'Toate preferințele sunt salvate automat în spațiul local.',
      };

  const handleClearSavedGame = () => {
    clearSavedPgn();
    setGameCleared(true);
    setTimeout(() => setGameCleared(false), 3000);
  };

  const renderThemePreview = (theme: BoardTheme) => {
    const themes: Record<BoardTheme, { light: string; dark: string; border: string }> = {
      emerald: { light: '#e8f5e9', dark: '#2e7d32', border: '#1b5e20' },
      wood: { light: '#f5deb3', dark: '#8b5a2b', border: '#5d3a1a' },
      tournament: { light: '#d4d4d4', dark: '#708090', border: '#2f4f4f' },
    };
    const { light, dark, border } = themes[theme];
    return (
      <div className="relative w-full aspect-square rounded-lg border-2" style={{ borderColor: border }}>
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
          {[...Array(64)].map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: (Math.floor(i / 8) + (i % 8)) % 2 === 0 ? light : dark,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg">
      <header className="bg-theme-header border-b border-theme-border px-4 py-3 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-theme-text hover:text-theme-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t.backToGame}</span>
          </a>
          <h1 className="font-serif text-xl font-bold text-theme-text">{t.title}</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-serif font-bold text-theme-text">{t.title}</h2>
            <p className="text-theme-text-muted mt-1">{t.subtitle}</p>
          </div>

          <section className="bg-theme-card border border-theme-border rounded-xl p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-theme-accent/10 rounded-lg text-theme-accent flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-theme-text mb-1">{t.language}</label>
                <p className="text-sm text-theme-text-muted mb-3">{t.languageDesc}</p>
                <div className="flex gap-2">
                  {(['ro', 'ru'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        language === lang
                          ? 'border-theme-accent bg-theme-accent/10 text-theme-accent'
                          : 'border-theme-border bg-theme-bg hover:border-theme-accent/50'
                      }`}
                    >
                      <span className="font-medium">{lang === 'ro' ? 'Română' : 'Русский'}</span>
                      <span className="text-xs text-theme-text-muted block mt-0.5">
                        {lang === 'ro' ? 'Română' : 'Русский'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-theme-border pt-6 flex items-start gap-4">
              <div className="p-2 bg-theme-accent/10 rounded-lg text-theme-accent flex-shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-theme-text mb-1">{t.difficulty}</label>
                <p className="text-sm text-theme-text-muted mb-3">{t.difficultyDesc}</p>
                <div className="space-y-2">
                  {([
                    { value: 'easy', label: language === 'ru' ? 'Лёгкий' : 'Ușor', desc: language === 'ru' ? t.easyDesc : t.easyDesc },
                    { value: 'medium', label: language === 'ru' ? 'Средний' : 'Mediu', desc: language === 'ru' ? t.mediumDesc : t.mediumDesc },
                    { value: 'hard', label: language === 'ru' ? 'Сложный' : 'Dificil', desc: language === 'ru' ? t.hardDesc : t.hardDesc },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDifficulty(opt.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        difficulty === opt.value
                          ? 'border-theme-accent bg-theme-accent/10'
                          : 'border-theme-border bg-theme-bg hover:border-theme-accent/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-theme-text">{opt.label}</span>
                        {difficulty === opt.value && <Check className="w-5 h-5 text-theme-accent flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-theme-text-muted mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-theme-border pt-6 flex items-start gap-4">
              <div className="p-2 bg-theme-accent/10 rounded-lg text-theme-accent flex-shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-theme-text mb-1">{t.boardTheme}</label>
                <p className="text-sm text-theme-text-muted mb-3">{t.boardThemeDesc}</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['emerald', 'wood', 'tournament'] as BoardTheme[]).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setBoardTheme(theme)}
                      className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                        boardTheme === theme
                          ? 'border-theme-accent ring-2 ring-theme-accent/50'
                          : 'border-theme-border hover:border-theme-accent/50'
                      }`}
                    >
                      {renderThemePreview(theme)}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs font-medium">
                        {theme === 'emerald' && t.themeEmerald}
                        {theme === 'wood' && t.themeWood}
                        {theme === 'tournament' && t.themeTournament}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-theme-border pt-6 flex items-center gap-4">
              <div className="p-2 bg-theme-accent/10 rounded-lg text-theme-accent flex-shrink-0">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-theme-text mb-1">{t.sounds}</label>
                <p className="text-sm text-theme-text-muted">{t.soundsDesc}</p>
              </div>
              <button
                onClick={toggleSound}
                className={`relative w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
                  soundEnabled ? 'bg-theme-accent' : 'bg-theme-border'
                }`}
                aria-label={soundEnabled ? t.soundsDesc : t.soundsDesc}
              >
                <span
                  className={`absolute w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </section>

          <section className="bg-theme-card border border-theme-border rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-theme-accent/10 rounded-lg text-theme-accent flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-theme-text mb-1">{t.savedGame}</label>
                <p className="text-sm text-theme-text-muted mb-3">{t.savedGameDesc}</p>
                {lastPgn ? (
                  <div className="bg-theme-bg border border-theme-border rounded-lg p-3 font-mono text-xs overflow-x-auto max-h-32">
                    {lastPgn.split('\n').slice(0, 10).join('\n')}
                    {lastPgn.split('\n').length > 10 && <span className="text-theme-text-muted">...</span>}
                  </div>
                ) : (
                  <p className="text-theme-text-muted italic">{t.noSavedGame}</p>
                )}
                {lastPgn && (
                  <button
                    onClick={handleClearSavedGame}
                    className="mt-3 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {t.clearSavedGame}
                  </button>
                )}
                {gameCleared && (
                  <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{t.gameCleared}</p>
                )}
              </div>
            </div>
          </section>

          <p className="text-center text-xs text-theme-text-muted">{t.autoSaved}</p>
        </div>
      </main>

      <footer className="bg-theme-footer border-t border-theme-border px-4 py-3">
        <div className="max-w-2xl mx-auto text-center text-sm text-theme-text-muted">
          {language === 'ru' ? 'Шахматы MD — Классические шахматы с ИИ' : 'Șah MD — Șah clasic cu AI'}
        </div>
      </footer>
    </div>
  );
}