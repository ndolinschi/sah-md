# Șah MD — Complex Spec
Playable chess with local AI — not a static diagram.

## Stack
Next.js 16 + TS + Tailwind + **chess.js** + **react-chessboard** (or equivalent) + Zustand.
RO default + RU.

## Features
1. Legal move generation/validation via chess.js
2. Interactive board: click/drag pieces (human plays White by default)
3. AI opponent: minimax + alpha-beta at least depth 2–3, or use a small wasm engine if easy; must make legal moves and not hang UI (async)
4. Game controls: new game, undo, flip board, resign
5. Move history (SAN), captured pieces, check/checkmate/stalemate banners
6. Difficulty: Easy / Medium / Hard (depth or randomness)
7. Distinct visual: wood/emerald chess aesthetic — not kanban/tracker chrome
8. Optional: localStorage save of last game PGN

## Routes
`/` play; `/settings` language + difficulty default.

## Success
`npm run build`=0; push https://github.com/ndolinschi/sah-md.git
