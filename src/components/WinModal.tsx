import { useEffect, useRef } from 'react';
import type { GameMode } from '../types/game.types';
import styles from './WinModal.module.css';

interface WinModalProps {
  is_visible: boolean;
  reward: string | null;
  mode: GameMode;
  on_close: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ is_visible, reward, mode, on_close }) => {
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

  const renderReward = () => {
    if (!reward) {
      return <p>Loading your reward...</p>;
    }

    if (mode === 'hell') {
      // Hell mode shows the entire message from server (includes password)
      return (
        <div className={styles.rewardText}>
          {reward.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      );
    }

    // Normal mode shows clue format
    return (
      <>
        <p>Here is your clue:</p>
        <blockquote>
          {reward.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < reward.split('\n').length - 1 && <br />}
            </span>
          ))}
        </blockquote>
      </>
    );
  };

  return (
    <div className={styles.overlay} onClick={on_close}>
      <div 
        className={`${styles.modal} ${mode === 'hell' ? styles.hellModal : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <h2>
          {mode === 'hell' 
            ? '🔥 You conquered Hell! 🔥' 
            : '🎉 Congratulations on beating the game!'
          }
        </h2>
        {renderReward()}
        <button ref={buttonRef} className={styles.button} onClick={on_close}>
          OK
        </button>
      </div>
    </div>
  );
};
