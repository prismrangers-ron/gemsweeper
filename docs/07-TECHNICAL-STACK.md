# Technical Stack Specification

## Technology Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript |
| Framework | React 18+ (Vite) |
| Styling | CSS Modules or Tailwind |
| State | React hooks (useState, useReducer) |

---

## File Structure

```
Moki Minesweeper/
├── assets/
│   ├── moki.png
│   ├── dead.png
│   └── butthole.png
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx
│   │   ├── Tile.tsx
│   │   ├── HeaderBar.tsx
│   │   ├── MokiButton.tsx
│   │   ├── Counter.tsx
│   │   ├── Timer.tsx
│   │   └── WinModal.tsx
│   ├── services/
│   │   ├── gameService.ts      # Business logic
│   │   └── timerService.ts
│   ├── repositories/
│   │   └── boardRepository.ts  # Board state management
│   ├── types/
│   │   └── game.types.ts
│   ├── hooks/
│   │   ├── useGame.ts
│   │   └── useTimer.ts
│   ├── styles/
│   │   ├── variables.css
│   │   └── components/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Architecture Pattern

### Repository Layer
Handles board state CRUD operations:

```typescript
// repositories/boardRepository.ts
import type { Board, Tile } from '../types/game.types';

export const boardRepository = {
  create: (rows: number, cols: number): Board => { ... },
  getTile: (board: Board, row: number, col: number): Tile => { ... },
  updateTile: (board: Board, row: number, col: number, updates: Partial<Tile>): Board => { ... },
  getAdjacentTiles: (board: Board, row: number, col: number): Tile[] => { ... },
};
```

### Service Layer
Contains business logic:

```typescript
// services/gameService.ts
import { boardRepository } from '../repositories/boardRepository';
import type { Board, GameState } from '../types/game.types';

export const gameService = {
  placeMines: (board: Board, excludeRow: number, excludeCol: number, count: number): Board => { ... },
  revealTile: (board: Board, row: number, col: number): { board: Board; hitMine: boolean } => { ... },
  cascadeReveal: (board: Board, row: number, col: number): Board => { ... },
  checkWin: (board: Board, mineCount: number): boolean => { ... },
  toggleFlag: (board: Board, row: number, col: number): Board => { ... },
};
```

### Component Layer
React functional components (presentation only):

```typescript
// components/Tile.tsx
import type { TileData } from '../types/game.types';

interface TileProps {
  tile: TileData;
  on_click: () => void;
  on_right_click: (e: React.MouseEvent) => void;
}

export const Tile: React.FC<TileProps> = ({ tile, on_click, on_right_click }) => {
  return (
    <button
      className={`tile ${tile.is_revealed ? 'revealed' : ''}`}
      onClick={on_click}
      onContextMenu={on_right_click}
    >
      {/* tile content */}
    </button>
  );
};
```

---

## Types

```typescript
// types/game.types.ts
export interface Tile {
  row: number;
  col: number;
  is_mine: boolean;
  is_revealed: boolean;
  is_flagged: boolean;
  adjacent_mines: number;
}

export type Board = Tile[][];

export type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

export interface GameState {
  board: Board;
  status: GameStatus;
  flag_count: number;
  revealed_count: number;
}

export const GRID_CONFIG = {
  rows: 30,
  cols: 16,
  mine_count: 99,
} as const;
```

---

## Custom Hooks

```typescript
// hooks/useGame.ts
import { useState, useCallback } from 'react';
import { gameService } from '../services/gameService';
import { boardRepository } from '../repositories/boardRepository';
import type { GameState } from '../types/game.types';

export const useGame = () => {
  const [state, setState] = useState<GameState>(initialState);
  
  const handleTileClick = useCallback((row: number, col: number) => {
    // Delegates to service layer
  }, [state]);
  
  const resetGame = useCallback(() => { ... }, []);
  
  return { state, handleTileClick, resetGame };
};
```

---

## Setup Commands

```bash
npm create vite@latest moki-minesweeper -- --template react-ts
cd moki-minesweeper
npm install
npm run dev
```

---

## Implementation Checklist

- [ ] Initialize Vite + React + TypeScript project
- [ ] Define types in `game.types.ts`
- [ ] Implement `boardRepository.ts`
- [ ] Implement `gameService.ts`
- [ ] Create functional components
- [ ] Build custom hooks
- [ ] Wire up App.tsx
- [ ] Add styling
- [ ] Test & deploy
