import { boardRepository } from '../repositories/boardRepository';
import type { Board, GameMode } from '../types/game.types';
import { GRID_CONFIG } from '../types/game.types';

export const gameService = {
  placeMines(board: Board, exclude_row: number, exclude_col: number, mode: GameMode): Board {
    const config = GRID_CONFIG[mode];
    const new_board = boardRepository.clone(board);
    let placed = 0;

    while (placed < config.mine_count) {
      const row = Math.floor(Math.random() * config.rows);
      const col = Math.floor(Math.random() * config.cols);

      if (new_board[row][col].is_mine) continue;
      if (row === exclude_row && col === exclude_col) continue;

      new_board[row][col].is_mine = true;
      placed++;
    }

    return this.calculateAdjacent(new_board);
  },

  calculateAdjacent(board: Board): Board {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        if (board[row][col].is_mine) continue;
        const adjacent = boardRepository.getAdjacentTiles(board, row, col);
        board[row][col].adjacent_mines = adjacent.filter(t => t.is_mine).length;
      }
    }
    return board;
  },

  revealTile(board: Board, row: number, col: number): Board {
    const new_board = boardRepository.clone(board);
    const tile = new_board[row][col];

    if (tile.is_revealed || tile.is_flagged) return new_board;

    tile.is_revealed = true;

    if (!tile.is_mine && tile.adjacent_mines === 0) {
      return this.cascadeReveal(new_board, row, col);
    }

    return new_board;
  },

  cascadeReveal(board: Board, row: number, col: number): Board {
    const adjacent = boardRepository.getAdjacentTiles(board, row, col);

    for (const tile of adjacent) {
      if (!tile.is_revealed && !tile.is_flagged) {
        board[tile.row][tile.col].is_revealed = true;
        if (tile.adjacent_mines === 0) {
          this.cascadeReveal(board, tile.row, tile.col);
        }
      }
    }

    return board;
  },

  toggleFlag(board: Board, row: number, col: number): Board {
    const new_board = boardRepository.clone(board);
    const tile = new_board[row][col];

    if (tile.is_revealed) return new_board;

    tile.is_flagged = !tile.is_flagged;
    return new_board;
  },

  checkWin(board: Board, mode: GameMode): boolean {
    const config = GRID_CONFIG[mode];
    const totalTiles = config.rows * config.cols;
    const safeTiles = totalTiles - config.mine_count;
    let revealed = 0;

    for (const row of board) {
      for (const tile of row) {
        if (tile.is_revealed && !tile.is_mine) revealed++;
      }
    }

    return revealed === safeTiles;
  },

  isMineHit(board: Board, row: number, col: number): boolean {
    return board[row][col].is_mine;
  },

  revealAllMines(board: Board): Board {
    const new_board = boardRepository.clone(board);
    for (const row of new_board) {
      for (const tile of row) {
        if (tile.is_mine) {
          tile.is_revealed = true;
        }
      }
    }
    return new_board;
  },

  chordReveal(board: Board, row: number, col: number): { board: Board; hitMine: boolean } {
    const tile = board[row][col];
    
    if (!tile.is_revealed || tile.adjacent_mines === 0) {
      return { board, hitMine: false };
    }

    const adjacent = boardRepository.getAdjacentTiles(board, row, col);
    const flaggedCount = adjacent.filter(t => t.is_flagged).length;

    if (flaggedCount !== tile.adjacent_mines) {
      return { board, hitMine: false };
    }

    let new_board = boardRepository.clone(board);
    let hitMine = false;

    for (const adj of adjacent) {
      if (!adj.is_revealed && !adj.is_flagged) {
        if (new_board[adj.row][adj.col].is_mine) {
          hitMine = true;
        }
        new_board[adj.row][adj.col].is_revealed = true;
        
        if (!adj.is_mine && adj.adjacent_mines === 0) {
          new_board = this.cascadeReveal(new_board, adj.row, adj.col);
        }
      }
    }

    return { board: new_board, hitMine };
  },
};
