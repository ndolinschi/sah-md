import { create } from 'zustand';
import { Chess, type Square, type PieceSymbol, type Color } from 'chess.js';
import type {
  Language,
  Difficulty,
  BoardTheme,
  GameStatus,
  MoveRecord,
  CapturedPieces,
} from '../types';
import { evaluateBoard, getMaterialDifference } from '../ai/evaluation';
import { computeAiMove, cancelPendingAi } from '../ai/engine';
import { playSound } from '../sounds';

const STORAGE_KEY = 'sah_md_prefs_v1';
const PGN_STORAGE_KEY = 'sah_md_last_pgn_v1';

const INITIAL_PIECES_COUNT: Record<PieceSymbol, number> = {
  p: 8,
  n: 2,
  b: 2,
  r: 2,
  q: 1,
  k: 1,
};

function computeCapturedPieces(chess: Chess): CapturedPieces {
  const currentWhiteCount: Record<PieceSymbol, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
  const currentBlackCount: Record<PieceSymbol, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };

  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) {
        if (p.color === 'w') {
          currentWhiteCount[p.type]++;
        } else {
          currentBlackCount[p.type]++;
        }
      }
    }
  }

  const capturedByWhite: PieceSymbol[] = []; // Black pieces taken
  const capturedByBlack: PieceSymbol[] = []; // White pieces taken

  const pieceOrder: PieceSymbol[] = ['q', 'r', 'b', 'n', 'p'];

  for (const piece of pieceOrder) {
    const missingWhite = Math.max(0, INITIAL_PIECES_COUNT[piece] - currentWhiteCount[piece]);
    for (let i = 0; i < missingWhite; i++) {
      capturedByBlack.push(piece);
    }

    const missingBlack = Math.max(0, INITIAL_PIECES_COUNT[piece] - currentBlackCount[piece]);
    for (let i = 0; i < missingBlack; i++) {
      capturedByWhite.push(piece);
    }
  }

  return {
    w: capturedByWhite,
    b: capturedByBlack,
  };
}

function determineGameStatus(chess: Chess): GameStatus {
  if (chess.isCheckmate()) return 'checkmate';
  if (chess.isStalemate()) return 'stalemate';
  if (chess.isThreefoldRepetition()) return 'draw_threefold';
  if (chess.isInsufficientMaterial()) return 'draw_insufficient_material';
  if (chess.isDraw()) return 'draw_fifty_moves';
  if (chess.inCheck()) return 'check';
  return 'in_progress';
}

function loadPersistedSettings(): {
  language: Language;
  difficulty: Difficulty;
  boardTheme: BoardTheme;
  soundEnabled: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      language: 'ro',
      difficulty: 'medium',
      boardTheme: 'emerald',
      soundEnabled: true,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        language: parsed.language === 'ru' ? 'ru' : 'ro',
        difficulty: ['easy', 'medium', 'hard'].includes(parsed.difficulty)
          ? parsed.difficulty
          : 'medium',
        boardTheme: ['emerald', 'wood', 'tournament'].includes(parsed.boardTheme)
          ? parsed.boardTheme
          : 'emerald',
        soundEnabled: parsed.soundEnabled !== false,
      };
    }
  } catch {}

  return {
    language: 'ro',
    difficulty: 'medium',
    boardTheme: 'emerald',
    soundEnabled: true,
  };
}

function loadPersistedPgn(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(PGN_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export interface ChessState {
  chess: Chess;
  fen: string;
  history: MoveRecord[];
  orientation: 'white' | 'black';
  difficulty: Difficulty;
  language: Language;
  boardTheme: BoardTheme;
  soundEnabled: boolean;
  status: GameStatus;
  capturedPieces: CapturedPieces;
  materialAdvantage: number;
  evalScore: number;
  isAiThinking: boolean;
  lastMove: { from: Square; to: Square } | null;
  lastPgn: string;

  // Actions
  makeMove: (from: Square, to: Square, promotion?: PieceSymbol) => boolean;
  undoMove: () => void;
  resetGame: (newDifficulty?: Difficulty) => void;
  resignGame: () => void;
  flipBoard: () => void;
  setDifficulty: (diff: Difficulty) => void;
  setLanguage: (lang: Language) => void;
  setBoardTheme: (theme: BoardTheme) => void;
  toggleSound: () => void;
  clearSavedPgn: () => void;
  exportPgn: () => string;
  exportFen: () => string;
  triggerAiMove: () => Promise<void>;
}

const initialSettings = loadPersistedSettings();
const initialPgn = loadPersistedPgn();
const initialChess = new Chess();

export const useChessStore = create<ChessState>((set, get) => ({
  chess: initialChess,
  fen: initialChess.fen(),
  history: [],
  orientation: 'white',
  difficulty: initialSettings.difficulty,
  language: initialSettings.language,
  boardTheme: initialSettings.boardTheme,
  soundEnabled: initialSettings.soundEnabled,
  status: 'in_progress',
  capturedPieces: { w: [], b: [] },
  materialAdvantage: 0,
  evalScore: 0,
  isAiThinking: false,
  lastMove: null,
  lastPgn: initialPgn,

  makeMove: (from: Square, to: Square, promotion: PieceSymbol = 'q') => {
    const { chess, soundEnabled, history, isAiThinking, status } = get();

    // Do not allow moves if AI is thinking or game is over
    if (isAiThinking || ['checkmate', 'stalemate', 'draw_fifty_moves', 'draw_threefold', 'draw_insufficient_material', 'resigned_white', 'resigned_black'].includes(status)) {
      return false;
    }

    const fenBefore = chess.fen();

    try {
      const move = chess.move({ from, to, promotion });
      if (!move) return false;

      const fenAfter = chess.fen();
      const newStatus = determineGameStatus(chess);
      const captured = computeCapturedPieces(chess);
      const { whiteAdvantage } = getMaterialDifference(chess);
      const evalScore = evaluateBoard(chess);

      const record: MoveRecord = {
        san: move.san,
        from: move.from,
        to: move.to,
        piece: move.piece,
        captured: move.captured,
        color: move.color,
        fenBefore,
        fenAfter,
      };

      const updatedHistory = [...history, record];
      const currentPgn = chess.pgn();

      // Sound
      if (newStatus === 'checkmate') {
        if (move.color === 'w') playSound.victory(soundEnabled);
        else playSound.defeat(soundEnabled);
      } else if (newStatus === 'check') {
        playSound.check(soundEnabled);
      } else if (move.captured) {
        playSound.capture(soundEnabled);
      } else {
        playSound.move(soundEnabled);
      }

      // Persist PGN
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(PGN_STORAGE_KEY, currentPgn);
        } catch {}
      }

      set({
        fen: fenAfter,
        history: updatedHistory,
        status: newStatus,
        capturedPieces: captured,
        materialAdvantage: whiteAdvantage,
        evalScore,
        lastMove: { from: move.from, to: move.to },
        lastPgn: currentPgn,
      });

      // If it's now Black's turn (AI), trigger AI
      if (chess.turn() === 'b' && !chess.isGameOver()) {
        get().triggerAiMove();
      }

      return true;
    } catch {
      return false;
    }
  },

  triggerAiMove: async () => {
    const { chess, difficulty, soundEnabled, history, status } = get();

    if (chess.isGameOver() || chess.turn() !== 'b' || ['resigned_white', 'resigned_black'].includes(status)) {
      return;
    }

    set({ isAiThinking: true });

    try {
      const currentFen = chess.fen();
      const result = await computeAiMove(currentFen, difficulty);

      // Verify that the game hasn't changed or reset while thinking
      const freshChess = get().chess;
      if (freshChess.fen() !== currentFen || freshChess.turn() !== 'b') {
        set({ isAiThinking: false });
        return;
      }

      if (result) {
        const fenBefore = freshChess.fen();
        const move = freshChess.move({
          from: result.from,
          to: result.to,
          promotion: (result.promotion as PieceSymbol) || 'q',
        });

        if (move) {
          const fenAfter = freshChess.fen();
          const newStatus = determineGameStatus(freshChess);
          const captured = computeCapturedPieces(freshChess);
          const { whiteAdvantage } = getMaterialDifference(freshChess);
          const evalScore = evaluateBoard(freshChess);

          const record: MoveRecord = {
            san: move.san,
            from: move.from,
            to: move.to,
            piece: move.piece,
            captured: move.captured,
            color: move.color,
            fenBefore,
            fenAfter,
          };

          const updatedHistory = [...get().history, record];
          const currentPgn = freshChess.pgn();

          if (newStatus === 'checkmate') {
            playSound.defeat(soundEnabled);
          } else if (newStatus === 'check') {
            playSound.check(soundEnabled);
          } else if (move.captured) {
            playSound.capture(soundEnabled);
          } else {
            playSound.move(soundEnabled);
          }

          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(PGN_STORAGE_KEY, currentPgn);
            } catch {}
          }

          set({
            fen: fenAfter,
            history: updatedHistory,
            status: newStatus,
            capturedPieces: captured,
            materialAdvantage: whiteAdvantage,
            evalScore,
            lastMove: { from: move.from, to: move.to },
            lastPgn: currentPgn,
            isAiThinking: false,
          });
          return;
        }
      }
    } catch (e) {
      console.error('Error during AI move:', e);
    }

    set({ isAiThinking: false });
  },

  undoMove: () => {
    cancelPendingAi();
    const { chess, soundEnabled, history } = get();

    if (history.length === 0) return;

    // If it's White's turn and Black just moved, undo 2 moves (Black + White) so human can retry.
    // If Black was thinking or it's Black's turn, undo 1 move.
    const movesToUndo = chess.turn() === 'w' && history.length >= 2 ? 2 : 1;

    for (let i = 0; i < movesToUndo; i++) {
      chess.undo();
    }

    const newHistory = history.slice(0, -movesToUndo);
    const lastRecord = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;
    const newStatus = determineGameStatus(chess);
    const captured = computeCapturedPieces(chess);
    const { whiteAdvantage } = getMaterialDifference(chess);
    const evalScore = evaluateBoard(chess);
    const currentPgn = chess.pgn();

    playSound.move(soundEnabled);

    set({
      fen: chess.fen(),
      history: newHistory,
      status: newStatus,
      capturedPieces: captured,
      materialAdvantage: whiteAdvantage,
      evalScore,
      isAiThinking: false,
      lastMove: lastRecord ? { from: lastRecord.from, to: lastRecord.to } : null,
      lastPgn: currentPgn,
    });
  },

  resetGame: (newDifficulty?: Difficulty) => {
    cancelPendingAi();
    const newChess = new Chess();
    const diff = newDifficulty || get().difficulty;

    set({
      chess: newChess,
      fen: newChess.fen(),
      history: [],
      difficulty: diff,
      status: 'in_progress',
      capturedPieces: { w: [], b: [] },
      materialAdvantage: 0,
      evalScore: 0,
      isAiThinking: false,
      lastMove: null,
    });
  },

  resignGame: () => {
    cancelPendingAi();
    const { status, soundEnabled } = get();
    if (['checkmate', 'stalemate', 'draw_fifty_moves', 'draw_threefold', 'draw_insufficient_material', 'resigned_white', 'resigned_black'].includes(status)) {
      return;
    }

    playSound.defeat(soundEnabled);
    set({
      status: 'resigned_white',
      isAiThinking: false,
    });
  },

  flipBoard: () => {
    set((state) => ({
      orientation: state.orientation === 'white' ? 'black' : 'white',
    }));
  },

  setDifficulty: (difficulty: Difficulty) => {
    set({ difficulty });
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const curr = raw ? JSON.parse(raw) : {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...curr, difficulty }));
      } catch {}
    }
  },

  setLanguage: (language: Language) => {
    set({ language });
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const curr = raw ? JSON.parse(raw) : {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...curr, language }));
      } catch {}
    }
  },

  setBoardTheme: (boardTheme: BoardTheme) => {
    set({ boardTheme });
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const curr = raw ? JSON.parse(raw) : {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...curr, boardTheme }));
      } catch {}
    }
  },

  toggleSound: () => {
    const next = !get().soundEnabled;
    set({ soundEnabled: next });
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const curr = raw ? JSON.parse(raw) : {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...curr, soundEnabled: next }));
      } catch {}
    }
  },

  clearSavedPgn: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(PGN_STORAGE_KEY);
      } catch {}
    }
    set({ lastPgn: '' });
  },

  exportPgn: () => {
    return get().chess.pgn();
  },

  exportFen: () => {
    return get().chess.fen();
  },
}));
