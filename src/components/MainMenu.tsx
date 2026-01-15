import type { GameMode } from '../types/game.types';
import styles from './MainMenu.module.css';

interface MainMenuProps {
  on_select_mode: (mode: GameMode) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ on_select_mode }) => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <img 
          src="/assets/gemsweeper.svg" 
          alt="Gemsweeper" 
          className={styles.logo}
        />
        <div className={styles.buttons}>
          <button 
            className={styles.normalButton}
            onClick={() => on_select_mode('normal')}
          >
            NORMAL MODE
          </button>
          <button 
            className={styles.hellButton}
            onClick={() => on_select_mode('hell')}
          >
            HELL MODE
          </button>
        </div>
      </div>
    </div>
  );
};

