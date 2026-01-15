// Board state management - to be implemented in Phase 2
import type { Board, Tile } from '../types/game.types';
import { GRID_CONFIG } from '../types/game.types';

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const;

export const boardRepository = {
  create(): Board {
    const board: Board = [];
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
      board[row] = [];
      for (let col = 0; col < GRID_CONFIG.cols; col++) {
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
    if (row < 0 || row >= GRID_CONFIG.rows) return null;
    if (col < 0 || col >= GRID_CONFIG.cols) return null;
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





