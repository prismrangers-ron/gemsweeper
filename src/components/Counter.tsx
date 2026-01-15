import styles from './Display.module.css';

interface CounterProps {
  value: number;
}

export const Counter: React.FC<CounterProps> = ({ value }) => {
  const display = String(Math.max(0, value)).padStart(3, '0');

  return (
    <div className={styles.displayWrapper}>
      <img src="/assets/butthole.png" alt="mines" className={styles.icon} />
      <div className={styles.display}>
        {display}
      </div>
    </div>
  );
};
