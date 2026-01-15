import { useEffect, useRef } from 'react';
import styles from './WinModal.module.css';

interface WinModalProps {
  is_visible: boolean;
  clue: string | null;
  on_close: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ is_visible, clue, on_close }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (is_visible) {
      buttonRef.current?.focus();
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
        {clue ? (
          <>
            <p>Here is your clue:</p>
            <blockquote>
              {clue.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < clue.split('\n').length - 1 && <br />}
                </span>
              ))}
            </blockquote>
          </>
        ) : (
          <p>Loading your reward...</p>
        )}
        <button ref={buttonRef} className={styles.button} onClick={on_close}>
          OK
        </button>
      </div>
    </div>
  );
};
