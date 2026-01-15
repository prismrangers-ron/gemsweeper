import { MokiButton } from './MokiButton';
import { Counter } from './Counter';
import { Timer } from './Timer';
import type { GameStatus, GameMode } from '../types/game.types';
import styles from './HeaderBar.module.css';

interface HeaderBarProps {
  remaining_mines: number;
  elapsed_time: number;
  status: GameStatus;
  mode: GameMode;
  on_reset: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  remaining_mines,
  elapsed_time,
  status,
  mode,
  on_reset,
}) => {
  return (
    <header className={styles.header}>
      <Counter value={remaining_mines} />
      <MokiButton status={status} mode={mode} on_reset={on_reset} />
      <Timer value={elapsed_time} />
    </header>
  );
};
