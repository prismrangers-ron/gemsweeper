# Game Grid Specification

## Configuration

```typescript
export const GRID_CONFIG = {
  rows: 30,
  cols: 16,
  mine_count: 99,
} as const;
```

| Property | Value |
|----------|-------|
| Rows | 30 |
| Columns | 16 |
| Total Tiles | 480 |
| Mines | 99 |

---

## GameBoard Component

```typescript
// components/GameBoard.tsx
import { Tile } from './Tile';
import type { Board, GameStatus } from '../types/game.types';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  board: Board;
  status: GameStatus;
  on_tile_click: (row: number, col: number) => void;
  on_tile_right_click: (row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  status,
  on_tile_click,
  on_tile_right_click,
}) => {
  const game_over = status === 'lost';

  return (
    <div className={styles.grid}>
      {board.map((row, row_idx) =>
        row.map((tile, col_idx) => (
          <Tile
            key={`${row_idx}-${col_idx}`}
            tile={tile}
            game_over={game_over}
            on_click={() => on_tile_click(row_idx, col_idx)}
            on_right_click={(e) => {
              e.preventDefault();
              on_tile_right_click(row_idx, col_idx);
            }}
          />
        ))
      )}
    </div>
  );
};
```

---

## CSS Module

```css
/* components/GameBoard.module.css */
.grid {
  display: grid;
  grid-template-columns: repeat(16, 24px);
  grid-template-rows: repeat(30, 24px);
  gap: 2px;
  background-color: var(--color-black);
  padding: 2px;
  border-radius: 12px;
}
```

---

## Calculated Dimensions

| Tile Size | Gap | Grid Width | Grid Height |
|-----------|-----|------------|-------------|
| 24px | 2px | 414px | 778px |

---

## Implementation Checklist

- [ ] Create `GameBoard.tsx` functional component
- [ ] Create `GameBoard.module.css`
- [ ] Render 30×16 grid of Tile components
- [ ] Pass click handlers to tiles
- [ ] Center grid in viewport
