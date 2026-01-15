# Game Logic Specification

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

export const GRID_CONFIG = {
  rows: 30,
  cols: 16,
  mine_count: 99,
} as const;
```

---

## Repository Layer

```typescript
// repositories/boardRepository.ts
import type { Board, Tile } from '../types/game.types';
import { GRID_CONFIG } from '../types/game.types';

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const;

export const boardRepository = {
  create(): Board {
    const board: Board = [];
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
      board[row] = [];
      for (let col = 0; col < GRID_CONFIG.cols; col++) {
        board[row][col] = {
          row,
          col,
          is_mine: false,
          is_revealed: false,
          is_flagged: false,
          adjacent_mines: 0,
        };
      }
    }
    return board;
  },

  getTile(board: Board, row: number, col: number): Tile | null {
    if (row < 0 || row >= GRID_CONFIG.rows) return null;
    if (col < 0 || col >= GRID_CONFIG.cols) return null;
    return board[row][col];
  },

  getAdjacentTiles(board: Board, row: number, col: number): Tile[] {
    return DIRECTIONS
      .map(([dr, dc]) => this.getTile(board, row + dr, col + dc))
      .filter((t): t is Tile => t !== null);
  },

  clone(board: Board): Board {
    return board.map(row => row.map(tile => ({ ...tile })));
  },
};
```

---

## Service Layer

```typescript
// services/gameService.ts
import { boardRepository } from '../repositories/boardRepository';
import type { Board } from '../types/game.types';
import { GRID_CONFIG } from '../types/game.types';

export const gameService = {
  placeMines(board: Board, exclude_row: number, exclude_col: number): Board {
    const new_board = boardRepository.clone(board);
    let placed = 0;

    while (placed < GRID_CONFIG.mine_count) {
      const row = Math.floor(Math.random() * GRID_CONFIG.rows);
      const col = Math.floor(Math.random() * GRID_CONFIG.cols);

      if (new_board[row][col].is_mine) continue;
      if (row === exclude_row && col === exclude_col) continue;

      new_board[row][col].is_mine = true;
      placed++;
    }

    return this.calculateAdjacent(new_board);
  },

  calculateAdjacent(board: Board): Board {
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
      for (let col = 0; col < GRID_CONFIG.cols; col++) {
        if (board[row][col].is_mine) continue;
        const adjacent = boardRepository.getAdjacentTiles(board, row, col);
        board[row][col].adjacent_mines = adjacent.filter(t => t.is_mine).length;
      }
    }
    return board;
  },

  revealTile(board: Board, row: number, col: number): Board {
    const new_board = boardRepository.clone(board);
    const tile = new_board[row][col];

    if (tile.is_revealed || tile.is_flagged) return new_board;

    tile.is_revealed = true;

    if (!tile.is_mine && tile.adjacent_mines === 0) {
      return this.cascadeReveal(new_board, row, col);
    }

    return new_board;
  },

  cascadeReveal(board: Board, row: number, col: number): Board {
    const adjacent = boardRepository.getAdjacentTiles(board, row, col);
    
    for (const tile of adjacent) {
      if (!tile.is_revealed && !tile.is_flagged) {
        board[tile.row][tile.col].is_revealed = true;
        if (tile.adjacent_mines === 0) {
          this.cascadeReveal(board, tile.row, tile.col);
        }
      }
    }

    return board;
  },

  toggleFlag(board: Board, row: number, col: number): Board {
    const new_board = boardRepository.clone(board);
    const tile = new_board[row][col];

    if (tile.is_revealed) return new_board;

    tile.is_flagged = !tile.is_flagged;
    return new_board;
  },

  checkWin(board: Board): boolean {
    const safe_tiles = GRID_CONFIG.rows * GRID_CONFIG.cols - GRID_CONFIG.mine_count;
    let revealed = 0;

    for (const row of board) {
      for (const tile of row) {
        if (tile.is_revealed && !tile.is_mine) revealed++;
      }
    }

    return revealed === safe_tiles;
  },

  isMineHit(board: Board, row: number, col: number): boolean {
    return board[row][col].is_mine;
  },
};
```

---

## Timer Service

```typescript
// services/timerService.ts
export const timerService = {
  start(callback: () => void): number {
    return window.setInterval(callback, 1000);
  },

  stop(interval_id: number): void {
    clearInterval(interval_id);
  },
};
```

---

## Custom Hook

```typescript
// hooks/useGame.ts
import { useState, useCallback, useRef } from 'react';
import { gameService } from '../services/gameService';
import { boardRepository } from '../repositories/boardRepository';
import { timerService } from '../services/timerService';
import type { Board, GameStatus } from '../types/game.types';
import { GRID_CONFIG } from '../types/game.types';

interface GameState {
  board: Board;
  status: GameStatus;
  elapsed_time: number;
  flag_count: number;
}

export const useGame = () => {
  const [state, setState] = useState<GameState>({
    board: boardRepository.create(),
    status: 'ready',
    elapsed_time: 0,
    flag_count: 0,
  });

  const timer_ref = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (timer_ref.current) return;
    timer_ref.current = timerService.start(() => {
      setState(prev => ({ ...prev, elapsed_time: prev.elapsed_time + 1 }));
    });
  }, []);

  const stopTimer = useCallback(() => {
    if (timer_ref.current) {
      timerService.stop(timer_ref.current);
      timer_ref.current = null;
    }
  }, []);

  const handleTileClick = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.status === 'won' || prev.status === 'lost') return prev;

      let board = prev.board;
      let status = prev.status;

      // First click: place mines
      if (status === 'ready') {
        board = gameService.placeMines(board, row, col);
        status = 'playing';
        startTimer();
      }

      // Check mine hit
      if (gameService.isMineHit(board, row, col)) {
        stopTimer();
        return { ...prev, board, status: 'lost' };
      }

      // Reveal tile
      board = gameService.revealTile(board, row, col);

      // Check win
      if (gameService.checkWin(board)) {
        stopTimer();
        return { ...prev, board, status: 'won' };
      }

      return { ...prev, board, status };
    });
  }, [startTimer, stopTimer]);

  const handleRightClick = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.status === 'won' || prev.status === 'lost') return prev;

      const board = gameService.toggleFlag(prev.board, row, col);
      const flag_count = board.flat().filter(t => t.is_flagged).length;

      return { ...prev, board, flag_count };
    });
  }, []);

  const resetGame = useCallback(() => {
    stopTimer();
    setState({
      board: boardRepository.create(),
      status: 'ready',
      elapsed_time: 0,
      flag_count: 0,
    });
  }, [stopTimer]);

  return {
    ...state,
    remaining_mines: GRID_CONFIG.mine_count - state.flag_count,
    handleTileClick,
    handleRightClick,
    resetGame,
  };
};
```

---

## Implementation Checklist

- [ ] Create `types/game.types.ts`
- [ ] Implement `repositories/boardRepository.ts`
- [ ] Implement `services/gameService.ts`
- [ ] Implement `services/timerService.ts`
- [ ] Create `hooks/useGame.ts`
- [ ] Test all game logic
