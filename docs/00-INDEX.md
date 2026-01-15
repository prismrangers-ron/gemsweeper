# Minesweeper Moki - Documentation Index

## Tech Stack
- **TypeScript** + **React** (Vite)
- Repository pattern + Service layer
- Functional components only

---

## Documents

| # | Document | Description |
|---|----------|-------------|
| 01 | [Design System](01-DESIGN-SYSTEM.md) | Colors, typography, spacing |
| 02 | [Game Grid](02-GAME-GRID.md) | 30×16 grid, CSS Grid layout |
| 03 | [Tile System](03-TILE-SYSTEM.md) | Tile component, states, styles |
| 04 | [Game Logic](04-GAME-LOGIC.md) | Repository + Service layers |
| 05 | [Moki Status](05-MOKI-STATUS.md) | Mascot button component |
| 06 | [Win Popup](06-WIN-POPUP.md) | Victory modal component |
| 07 | [Technical Stack](07-TECHNICAL-STACK.md) | Project structure, setup |

---

## Architecture

```
src/
├── components/     # React functional components (presentation)
├── services/       # Business logic
├── repositories/   # Data/state management
├── hooks/          # Custom React hooks
└── types/          # TypeScript interfaces
```

---

## Build Order

1. **Setup** → Vite + React + TypeScript
2. **Types** → `game.types.ts`
3. **Repository** → `boardRepository.ts`
4. **Services** → `gameService.ts`, `timerService.ts`
5. **Hook** → `useGame.ts`
6. **Components** → Tile, GameBoard, HeaderBar, WinModal
7. **Styling** → CSS variables, component styles
8. **Integration** → App.tsx

---

## Quick Reference

```
Grid:       30 rows × 16 cols
Mines:      99
Background: #FFD753
Purple:     #8F68FC
Pink:       #FF66CC
Teal:       #1ABF9E
Blue:       #2673E8
```

---

## Naming Convention

| Context | Convention |
|---------|------------|
| Database columns | `snake_case` |
| TypeScript interfaces | `PascalCase` |
| Variables/functions | `snake_case` for props, `camelCase` for internal |
| Components | `PascalCase` |
| CSS classes | `camelCase` (CSS Modules) |
