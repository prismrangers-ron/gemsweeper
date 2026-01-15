import styles from './Display.module.css';

interface TimerProps {
  value: number;
}

export const Timer: React.FC<TimerProps> = ({ value }) => {
  const display = String(Math.min(999, value)).padStart(3, '0');

  return (
    <div className={styles.displayWrapper}>
      <div className={styles.display}>
        {display}
      </div>
      <span className={styles.emoji}>⏱️</span>
    </div>
  );
};
