# Moki Status Indicator Specification

## Assets

| File | State |
|------|-------|
| `assets/moki.png` | Normal / Playing / Won |
| `assets/dead.png` | Lost |

---

## MokiButton Component

```typescript
// components/MokiButton.tsx
import type { GameStatus } from '../types/game.types';
import styles from './MokiButton.module.css';

interface MokiButtonProps {
  status: GameStatus;
  on_reset: () => void;
}

export const MokiButton: React.FC<MokiButtonProps> = ({ status, on_reset }) => {
  const image_src = status === 'lost' 
    ? '/assets/dead.png' 
    : '/assets/moki.png';

  return (
    <button className={styles.button} onClick={on_reset} title="New Game">
      <img src={image_src} alt="Moki" />
    </button>
  );
};
```

---

## CSS Module

```css
/* components/MokiButton.module.css */
.button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid var(--color-black);
  background-color: var(--color-white);
  padding: 4px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.button:active {
  transform: scale(0.95);
}

.button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
```

---

## HeaderBar Component

```typescript
// components/HeaderBar.tsx
import { MokiButton } from './MokiButton';
import { Counter } from './Counter';
import { Timer } from './Timer';
import type { GameStatus } from '../types/game.types';
import styles from './HeaderBar.module.css';

interface HeaderBarProps {
  remaining_mines: number;
  elapsed_time: number;
  status: GameStatus;
  on_reset: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  remaining_mines,
  elapsed_time,
  status,
  on_reset,
}) => {
  return (
    <header className={styles.header}>
      <Counter value={remaining_mines} />
      <MokiButton status={status} on_reset={on_reset} />
      <Timer value={elapsed_time} />
    </header>
  );
};
```

---

## Implementation Checklist

- [ ] Create `MokiButton.tsx` functional component
- [ ] Create `HeaderBar.tsx` functional component
- [ ] Create `Counter.tsx` and `Timer.tsx` components
- [ ] Style header bar layout
- [ ] Connect to game state
