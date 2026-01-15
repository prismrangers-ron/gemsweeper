# Win Popup Specification

## Trigger
Displayed when `status === 'won'` (all 381 safe tiles revealed).

---

## Content

```
Congratulations on beating the game!

Here is your clue:

"Luck stretches wide from end to end,
Where seven colors gently bend."
```

---

## WinModal Component

```typescript
// components/WinModal.tsx
import { useEffect, useRef } from 'react';
import styles from './WinModal.module.css';

interface WinModalProps {
  is_visible: boolean;
  on_close: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ is_visible, on_close }) => {
  const button_ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (is_visible) {
      button_ref.current?.focus();
    }
  }, [is_visible]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && is_visible) on_close();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [is_visible, on_close]);

  if (!is_visible) return null;

  return (
    <div className={styles.overlay} onClick={on_close}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>🎉 Congratulations on beating the game!</h2>
        <p>Here is your clue:</p>
        <blockquote>
          "Luck stretches wide from end to end,
          <br />
          Where seven colors gently bend."
        </blockquote>
        <button ref={button_ref} className={styles.button} onClick={on_close}>
          OK
        </button>
      </div>
    </div>
  );
};
```

---

## CSS Module

```css
/* components/WinModal.module.css */
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background-color: var(--color-white);
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal h2 {
  color: var(--color-black);
  font-size: 24px;
  margin-bottom: 16px;
}

.modal p {
  color: var(--color-black);
  font-size: 16px;
  margin-bottom: 12px;
}

.modal blockquote {
  font-style: italic;
  font-size: 18px;
  color: var(--color-purple);
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid var(--color-teal);
  margin: 20px 0;
}

.button {
  background-color: var(--color-teal);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.button:hover {
  background-color: #15a085;
  transform: scale(1.05);
}

.button:active {
  transform: scale(0.98);
}
```

---

## Usage in App

```typescript
// App.tsx
import { useState } from 'react';
import { useGame } from './hooks/useGame';
import { WinModal } from './components/WinModal';

export const App: React.FC = () => {
  const game = useGame();
  const [modal_dismissed, setModalDismissed] = useState(false);

  const handleReset = () => {
    setModalDismissed(false);
    game.resetGame();
  };

  return (
    <main>
      <HeaderBar {...game} on_reset={handleReset} />
      <GameBoard {...game} />
      <WinModal
        is_visible={game.status === 'won' && !modal_dismissed}
        on_close={() => setModalDismissed(true)}
      />
    </main>
  );
};
```

---

## Implementation Checklist

- [ ] Create `WinModal.tsx` functional component
- [ ] Create `WinModal.module.css`
- [ ] Handle close on button click
- [ ] Handle close on overlay click
- [ ] Handle close on Escape key
- [ ] Add entry animations
- [ ] Connect to game status
