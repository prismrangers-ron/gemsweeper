import type { GameStatus } from '../types/game.types';
import styles from './MokiButton.module.css';

interface MokiButtonProps {
  status: GameStatus;
  on_reset: () => void;
}

export const MokiButton: React.FC<MokiButtonProps> = ({ status, on_reset }) => {
  const getImageSrc = () => {
    switch (status) {
      case 'lost':
        return '/assets/dead.png';
      case 'won':
        return '/assets/win.png';
      default:
        return '/assets/moki.png';
    }
  };

  return (
    <button className={styles.button} onClick={on_reset} title="New Game">
      <img src={getImageSrc()} alt="Moki" />
    </button>
  );
};
