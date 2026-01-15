export interface Tile {
  row: number;
  col: number;
  is_mine: boolean;
  is_revealed: boolean;
  is_flagged: boolean;
  adjacent_mines: number;
}

export type Board = Tile[][];

export type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

export type GameMode = 'normal' | 'hell';

export interface GameState {
  board: Board;
  status: GameStatus;
  flag_count: number;
  elapsed_time: number;
}

export const GRID_CONFIG = {
  normal: {
    rows: 16,
    cols: 16,
    mine_count: 53,
  },
  hell: {
    rows: 25,
    cols: 25,
    mine_count: 205,
  },
} as const;
