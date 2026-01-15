# Minesweeper Moki - Implementation Checklist

> Last Updated: January 10, 2026

---

## Phase 0: Planning & Prep ✅
- [x] **Confirm assets** — Verify `moki.png`, `dead.png`, `butthole.png` exist in `/assets/`
- [x] **Finalize tech decisions:**
  - [x] Styling approach: CSS Modules
  - [x] State: `useState` + `useCallback`
- [x] **Review architecture:**
  - [x] Repository: `boardRepository.ts` (CRUD for board state)
  - [x] Services: `gameService.ts` (logic), `timerService.ts` (timer)
  - [x] Hook: `useGame.ts` (orchestrates everything)
  - [x] Components: presentation only, no business logic
- [x] **Confirm naming conventions:**
  - [x] Props: `snake_case` (`on_click`, `is_revealed`)
  - [x] Interfaces: `PascalCase` (`Tile`, `GameState`)
  - [x] CSS classes: `camelCase` via CSS Modules
- [x] **Review game rules:**
  - [x] Grid: 30 cols × 16 rows = 480 tiles (landscape)
  - [x] Mines: 99 (first click always safe)
  - [x] Win: reveal all 381 safe tiles
  - [x] Lose: click any mine → show all mines with `butthole.png`
- [x] **Confirm UI requirements:**
  - [x] No header/title — game only
  - [x] No difficulty menu — hardest level by default
  - [x] No instructions — users figure it out
  - [x] Moki resets game on click
  - [x] Win popup shows clue text

---

## Phase 1: Project Setup ✅
- [x] Initialize Vite + React + TypeScript project
- [x] Configure `tsconfig.json`
- [x] Set up folder structure (`components/`, `services/`, `repositories/`, `hooks/`, `types/`)
- [x] Add assets (`moki.png`, `dead.png`, `butthole.png`) to `public/assets/`
- [x] Create CSS variables in `src/styles/variables.css`

## Phase 2: Core Types & Data Layer ✅
- [x] Define types in `types/game.types.ts` (Tile, Board, GameStatus, GRID_CONFIG)
- [x] Implement `repositories/boardRepository.ts` (create, getTile, getAdjacentTiles, clone)
- [x] Implement `services/gameService.ts` (placeMines, revealTile, cascadeReveal, toggleFlag, checkWin)
- [x] Implement `services/timerService.ts` (start, stop)

## Phase 3: Game Hook ✅
- [x] Create `hooks/useGame.ts`
- [x] Wire up board state management
- [x] Handle first-click mine placement
- [x] Implement tile click → reveal logic
- [x] Implement right-click → flag logic
- [x] Add win/lose detection
- [x] Integrate timer
- [x] Add chord reveal (middle-click or left+right click)

## Phase 4: UI Components ✅
- [x] `Tile.tsx` — tile states, number colors, mine image, chord support
- [x] `GameBoard.tsx` — 30×16 CSS Grid (landscape), render tiles
- [x] `Counter.tsx` — remaining mines display
- [x] `Timer.tsx` — elapsed time display
- [x] `MokiButton.tsx` — moki.png / dead.png swap, reset on click
- [x] `HeaderBar.tsx` — layout counter, moki, timer

## Phase 5: Win Modal ✅
- [x] `WinModal.tsx` — congratulations message with clue
- [x] Backdrop blur overlay
- [x] Close on button / overlay click / Escape key
- [x] Entry animation

## Phase 6: Styling & Polish ✅
- [x] Apply brand colors (#FFD753 background, #8F68FC tiles, etc.)
- [x] Rounded corners on all elements
- [x] Hover/active states on tiles and buttons
- [x] Tile reveal animation
- [x] Responsive centering

## Phase 7: Integration & Testing ✅
- [x] Wire all components in `App.tsx`
- [x] Test first-click safety
- [x] Test cascade reveal
- [x] Test win condition → modal appears
- [x] Test lose condition → dead.png + mines revealed
- [x] Test reset via Moki button
- [x] Test chord reveal (middle-click & left+right)

## Phase 8: Deployment ← CURRENT
- [ ] Build production bundle (`npm run build`)
- [ ] Deploy to hosting (Netlify / Vercel / GitHub Pages)
- [ ] Verify assets load correctly
- [ ] Final playtest

---

## Progress Tracker

| Phase | Status |
|-------|--------|
| 0. Planning | ✅ Complete |
| 1. Setup | ✅ Complete |
| 2. Data Layer | ✅ Complete |
| 3. Game Hook | ✅ Complete |
| 4. UI Components | ✅ Complete |
| 5. Win Modal | ✅ Complete |
| 6. Styling | ✅ Complete |
| 7. Testing | ✅ Complete |
| 8. Deployment | 🟡 In Progress |

---

*Status: ⬜ Not Started | 🟡 In Progress | ✅ Complete*
