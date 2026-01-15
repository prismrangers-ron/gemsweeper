import { Tile } from './Tile';
import type { Board, GameStatus, GameMode } from '../types/game.types';
import { GRID_CONFIG } from '../types/game.types';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  board: Board;
  status: GameStatus;
  mode: GameMode;
  on_tile_click: (row: number, col: number) => void;
  on_tile_right_click: (row: number, col: number) => void;
  on_chord: (row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  status,
  mode,
  on_tile_click,
  on_tile_right_click,
  on_chord,
}) => {
  const game_over = status === 'lost';
  const config = GRID_CONFIG[mode];

  const gridStyle = {
    '--grid-cols': config.cols,
    '--grid-rows': config.rows,
  } as React.CSSProperties;

  const gridClassName = `${styles.grid} ${mode === 'hell' ? styles.hellGrid : ''}`;

  return (
    <div className={gridClassName} style={gridStyle}>
      {board.map((row, row_idx) =>
        row.map((tile, col_idx) => (
          <Tile
            key={`${row_idx}-${col_idx}`}
            tile={tile}
            game_over={game_over}
            mode={mode}
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
