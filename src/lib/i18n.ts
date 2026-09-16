import { Language } from './types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  nav: {
    play: string;
    settings: string;
    sourceCode: string;
  };
  game: {
    white: string;
    black: string;
    player: string;
    aiOpponent: string;
    thinking: string;
    yourTurn: string;
    aiTurn: string;
    newGame: string;
    undo: string;
    flipBoard: string;
    resign: string;
    resignConfirm: string;
    confirm: string;
    cancel: string;
    difficulty: string;
    easy: string;
    medium: string;
    hard: string;
    capturedPieces: string;
    materialAdvantage: string;
    moveHistory: string;
    noMovesYet: string;
    copyPgn: string;
    pgnCopied: string;
    copyFen: string;
    fenCopied: string;
    downloadPgn: string;
    soundOn: string;
    soundOff: string;
    evaluation: string;
    evalWhiteAdvantage: string;
    evalBlackAdvantage: string;
    evalEqual: string;
    promoteTo: string;
    queen: string;
    rook: string;
    bishop: string;
    knight: string;
  };
  status: {
    check: string;
    checkmateWin: string;
    checkmateLoss: string;
    stalemate: string;
    drawFifty: string;
    drawThreefold: string;
    drawMaterial: string;
    resignedYou: string;
    resignedAi: string;
    inProgress: string;
  };
  settings: {
    title: string;
    subtitle: string;
    language: string;
    languageDesc: string;
    difficulty: string;
    difficultyDesc: string;
    easyDesc: string;
    mediumDesc: string;
    hardDesc: string;
    boardTheme: string;
    boardThemeDesc: string;
    themeEmerald: string;
    themeWood: string;
    themeTournament: string;
    sounds: string;
    soundsDesc: string;
    savedGame: string;
    savedGameDesc: string;
    noSavedGame: string;
    clearSavedGame: string;
    gameCleared: string;
    backToGame: string;
    autoSaved: string;
  };
}

export const translations: Record<Language, Translations> = {
  ro: {
    appName: 'Șah MD',
    appSubtitle: 'Șah Clasica & Inteligență Artificială',
    nav: {
      play: 'Joc',
      settings: 'Setări',
      sourceCode: 'Cod sursă',
    },
    game: {
      white: 'Alb',
      black: 'Negru',
      player: 'Jucător (Alb)',
      aiOpponent: 'Computer (Negru)',
      thinking: 'Gândește...',
      yourTurn: 'Rândul tău',
      aiTurn: 'Rândul computerului',
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
      capturedPieces: 'Piese capturate',
      materialAdvantage: 'Avantaj material',
      moveHistory: 'Istoric mutări',
      noMovesYet: 'Partida nu a început încă. Fă prima mutare!',
      copyPgn: 'Copiază PGN',
      pgnCopied: 'PGN copiat în clipboard!',
      copyFen: 'Copiază FEN',
      fenCopied: 'FEN copiat în clipboard!',
      downloadPgn: 'Descarcă PGN',
      soundOn: 'Sunet activat',
      soundOff: 'Sunet dezactivat',
      evaluation: 'Evaluare poziție',
      evalWhiteAdvantage: 'Avantaj Alb',
      evalBlackAdvantage: 'Avantaj Negru',
      evalEqual: 'Poziție egală',
      promoteTo: 'Promovează pionul la:',
      queen: 'Regină',
      rook: 'Turn',
      bishop: 'Nebun',
      knight: 'Cal',
    },
    status: {
      check: 'Șah!',
      checkmateWin: 'Șah Mat! Ai câștigat! Felicitări!',
      checkmateLoss: 'Șah Mat! Computerul a câștigat partida.',
      stalemate: 'Remiză prin pat! Niciun jucător nu are mutări legale.',
      drawFifty: 'Remiză — Regula celor 50 de mutări fără captură sau mutare de pion.',
      drawThreefold: 'Remiză prin repetiția aceleiași poziții de 3 ori.',
      drawMaterial: 'Remiză — Material insuficient pentru a da mat.',
      resignedYou: 'Ai cedat partida. Computerul a câștigat.',
      resignedAi: 'Computerul a cedat partida. Felicitări!',
      inProgress: 'Partidă în desfășurare',
    },
    settings: {
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
    },
  },
  ru: {
    appName: 'Шахматы MD',
    appSubtitle: 'Классические шахматы и искусственный интеллект',
    nav: {
      play: 'Игра',
      settings: 'Настройки',
      sourceCode: 'Исходный код',
    },
    game: {
      white: 'Белые',
      black: 'Чёрные',
      player: 'Игрок (Белые)',
      aiOpponent: 'Компьютер (Чёрные)',
      thinking: 'Думает...',
      yourTurn: 'Ваш ход',
      aiTurn: 'Ход компьютера',
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
      capturedPieces: 'Взятые фигуры',
      materialAdvantage: 'Материальное преимущество',
      moveHistory: 'История ходов',
      noMovesYet: 'Партия ещё не началась. Сделайте первый ход!',
      copyPgn: 'Скопировать PGN',
      pgnCopied: 'PGN скопирован в буфер!',
      copyFen: 'Скопировать FEN',
      fenCopied: 'FEN скопирован в буфер!',
      downloadPgn: 'Скачать PGN',
      soundOn: 'Звук включен',
      soundOff: 'Звук выключен',
      evaluation: 'Оценка позиции',
      evalWhiteAdvantage: 'Перевес Белых',
      evalBlackAdvantage: 'Перевес Чёрных',
      evalEqual: 'Равная позиция',
      promoteTo: 'Превратить пешку в:',
      queen: 'Ферзь',
      rook: 'Ладья',
      bishop: 'Слон',
      knight: 'Конь',
    },
    status: {
      check: 'Шах!',
      checkmateWin: 'Шах и мат! Вы победили! Поздравляем!',
      checkmateLoss: 'Шах и мат! Компьютер победил.',
      stalemate: 'Ничья (пат)! У игрока нет возможных ходов.',
      drawFifty: 'Ничья — правило 50 ходов без взятий и движения пешек.',
      drawThreefold: 'Ничья из-за троекратного повторения позиции.',
      drawMaterial: 'Ничья — недостаточно материала для мата.',
      resignedYou: 'Вы сдались. Компьютер одержал победу.',
      resignedAi: 'Компьютер сдался. Поздравляем с победой!',
      inProgress: 'Партия продолжается',
    },
    settings: {
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
    },
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.ro;
}
