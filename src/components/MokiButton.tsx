import type { GameStatus, GameMode } from '../types/game.types';
import styles from './MokiButton.module.css';

interface MokiButtonProps {
  status: GameStatus;
  mode: GameMode;
  on_reset: () => void;
}

export const MokiButton: React.FC<MokiButtonProps> = ({ status, mode, on_reset }) => {
  const getImageSrc = () => {
    if (status === 'lost') {
      return '/assets/dead.png';
    }
    if (status === 'won') {
      return '/assets/win.png';
    }
    // Default playing/ready state
    return mode === 'hell' ? '/assets/darklord.png' : '/assets/moki.png';
  };

  return (
    <button className={styles.button} onClick={on_reset} title="New Game">
      <img src={getImageSrc()} alt={mode === 'hell' ? 'Dark Lord' : 'Moki'} />
    </button>
  );
};
