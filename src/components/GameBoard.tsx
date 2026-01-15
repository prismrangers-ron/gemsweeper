import { Tile } from './Tile';
import type { Board, GameStatus } from '../types/game.types';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  board: Board;
  status: GameStatus;
  on_tile_click: (row: number, col: number) => void;
  on_tile_right_click: (row: number, col: number) => void;
  on_chord: (row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  status,
  on_tile_click,
  on_tile_right_click,
  on_chord,
}) => {
  const game_over = status === 'lost';

  return (
    <div className={styles.grid}>
      {board.map((row, row_idx) =>
        row.map((tile, col_idx) => (
          <Tile
            key={`${row_idx}-${col_idx}`}
            tile={tile}
            game_over={game_over}
            on_click={() => on_tile_click(row_idx, col_idx)}
            on_right_click={(e) => {
              e.preventDefault();
              on_tile_right_click(row_idx, col_idx);
            }}
            on_chord={() => on_chord(row_idx, col_idx)}
          />
        ))
      )}
    </div>
  );
};

