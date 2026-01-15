# Tile System Specification

## Types

```typescript
export interface TileData {
  row: number;
  col: number;
  is_mine: boolean;
  is_revealed: boolean;
  is_flagged: boolean;
  adjacent_mines: number;
}
```

---

## Tile Component

```typescript
// components/Tile.tsx
import type { TileData } from '../types/game.types';
import styles from './Tile.module.css';

interface TileProps {
  tile: TileData;
  game_over: boolean;
  on_click: () => void;
  on_right_click: (e: React.MouseEvent) => void;
}

export const Tile: React.FC<TileProps> = ({ 
  tile, 
  game_over, 
  on_click, 
  on_right_click 
}) => {
  const getClassName = (): string => {
    const classes = [styles.tile];
    
    if (tile.is_revealed) {
      classes.push(styles.revealed);
      if (tile.adjacent_mines > 0) {
        classes.push(styles[`number${tile.adjacent_mines}`]);
      }
    }
    if (tile.is_flagged) classes.push(styles.flagged);
    if (tile.is_mine && game_over) classes.push(styles.mine);
    
    return classes.join(' ');
  };

  const renderContent = () => {
    if (tile.is_flagged && !game_over) return '🚩';
    if (tile.is_mine && game_over) {
      return <img src="/assets/butthole.png" alt="mine" />;
    }
    if (tile.is_revealed && tile.adjacent_mines > 0) {
      return tile.adjacent_mines;
    }
    return null;
  };

  return (
    <button
      className={getClassName()}
      onClick={on_click}
      onContextMenu={on_right_click}
      disabled={tile.is_revealed}
    >
      {renderContent()}
    </button>
  );
};
```

---

## CSS Module

```css
/* components/Tile.module.css */
.tile {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background-color: var(--color-purple);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  transition: transform 0.1s, background-color 0.1s;
}

.tile:hover:not(:disabled) {
  background-color: var(--color-pink);
  transform: scale(1.05);
}

.tile:active:not(:disabled) {
  transform: scale(0.95);
}

.revealed {
  background-color: var(--color-white);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: default;
}

.flagged {
  font-size: 12px;
}

.mine {
  background-color: #ff4444;
  padding: 2px;
}

.mine img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

/* Number colors */
.number1 { color: #2673E8; }
.number2 { color: #1ABF9E; }
.number3 { color: #FF66CC; }
.number4 { color: #8F68FC; }
.number5 { color: #B22222; }
.number6 { color: #008B8B; }
.number7 { color: #000000; }
.number8 { color: #808080; }
```

---

## Tile States Matrix

| State | Background | Content | Cursor |
|-------|------------|---------|--------|
| Unrevealed | `#8F68FC` | — | pointer |
| Hover | `#FF66CC` | — | pointer |
| Revealed (empty) | `#FFFFFF` | — | default |
| Revealed (number) | `#FFFFFF` | 1-8 | default |
| Flagged | `#8F68FC` | 🚩 | pointer |
| Mine (game over) | `#FF4444` | butthole.png | default |

---

## Implementation Checklist

- [ ] Create `Tile.tsx` functional component
- [ ] Create `Tile.module.css`
- [ ] Handle click events
- [ ] Handle right-click (flag)
- [ ] Render numbers with correct colors
- [ ] Render mine image on game over
- [ ] Add hover/active animations
