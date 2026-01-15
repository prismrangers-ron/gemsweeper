import type { Board, Tile, GameMode } from '../types/game.types';
import { GRID_CONFIG } from '../types/game.types';

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const;

export const boardRepository = {
  create(mode: GameMode): Board {
    const config = GRID_CONFIG[mode];
    const board: Board = [];
    for (let row = 0; row < config.rows; row++) {
      board[row] = [];
      for (let col = 0; col < config.cols; col++) {
        board[row][col] = {
          row,
          col,
          is_mine: false,
          is_revealed: false,
          is_flagged: false,
          adjacent_mines: 0,
        };
      }
    }
    return board;
  },

  getTile(board: Board, row: number, col: number): Tile | null {
    if (row < 0 || row >= board.length) return null;
    if (col < 0 || col >= board[0].length) return null;
    return board[row][col];
  },

  getAdjacentTiles(board: Board, row: number, col: number): Tile[] {
    return DIRECTIONS
      .map(([dr, dc]) => this.getTile(board, row + dr, col + dc))
      .filter((t): t is Tile => t !== null);
  },

  clone(board: Board): Board {
    return board.map(row => row.map(tile => ({ ...tile })));
  },
};
