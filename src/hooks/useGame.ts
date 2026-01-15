import { useState, useCallback, useRef } from 'react';
import { gameService } from '../services/gameService';
import { boardRepository } from '../repositories/boardRepository';
import { timerService } from '../services/timerService';
import { clueService } from '../services/clueService';
import type { Board, GameStatus, GameMode } from '../types/game.types';
import { GRID_CONFIG } from '../types/game.types';

interface UseGameReturn {
  board: Board;
  status: GameStatus;
  elapsed_time: number;
  remaining_mines: number;
  reward: string | null;
  handleTileClick: (row: number, col: number) => void;
  handleRightClick: (row: number, col: number) => void;
  handleChord: (row: number, col: number) => void;
  resetGame: () => void;
}

export const useGame = (mode: GameMode): UseGameReturn => {
  const config = GRID_CONFIG[mode];
  
  const [board, setBoard] = useState<Board>(() => boardRepository.create(mode));
  const [status, setStatus] = useState<GameStatus>('ready');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [reward, setReward] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = timerService.start(() => {
      setElapsedTime(prev => prev + 1);
    });
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      timerService.stop(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleWin = useCallback(async (newBoard: Board) => {
    stopTimer();
    setBoard(newBoard);
    setStatus('won');
    
    const serverReward = await clueService.claimReward(mode);
    if (serverReward) {
      setReward(serverReward);
    }
  }, [stopTimer, mode]);

  const handleTileClick = useCallback(async (row: number, col: number) => {
    if (status === 'won' || status === 'lost') return;

    let currentBoard = board;
    let currentStatus = status;

    if (currentStatus === 'ready') {
      clueService.startSession();
      currentBoard = gameService.placeMines(currentBoard, row, col, mode);
      currentStatus = 'playing';
      startTimer();
    }

    const tile = currentBoard[row][col];
    if (tile.is_flagged || tile.is_revealed) return;

    if (gameService.isMineHit(currentBoard, row, col)) {
      stopTimer();
      clueService.clearSession();
      const revealedBoard = gameService.revealAllMines(currentBoard);
      setBoard(revealedBoard);
      setStatus('lost');
      return;
    }

    const newBoard = gameService.revealTile(currentBoard, row, col);

    if (gameService.checkWin(newBoard, mode)) {
      await handleWin(newBoard);
      return;
    }

    setBoard(newBoard);
    setStatus(currentStatus);
  }, [board, status, startTimer, stopTimer, handleWin, mode]);

  const handleRightClick = useCallback((row: number, col: number) => {
    if (status === 'won' || status === 'lost') return;

    const tile = board[row][col];
    if (tile.is_revealed) return;

    const newBoard = gameService.toggleFlag(board, row, col);
    const newFlagCount = newBoard.flat().filter(t => t.is_flagged).length;

    setBoard(newBoard);
    setFlagCount(newFlagCount);
  }, [board, status]);

  const handleChord = useCallback(async (row: number, col: number) => {
    if (status !== 'playing') return;

    const { board: newBoard, hitMine } = gameService.chordReveal(board, row, col);

    if (hitMine) {
      stopTimer();
      clueService.clearSession();
      const revealedBoard = gameService.revealAllMines(newBoard);
      setBoard(revealedBoard);
      setStatus('lost');
      return;
    }

    if (gameService.checkWin(newBoard, mode)) {
      await handleWin(newBoard);
      return;
    }

    setBoard(newBoard);
  }, [board, status, stopTimer, handleWin, mode]);

  const resetGame = useCallback(() => {
    stopTimer();
    clueService.clearSession();
    setBoard(boardRepository.create(mode));
    setStatus('ready');
    setElapsedTime(0);
    setFlagCount(0);
    setReward(null);
  }, [stopTimer, mode]);

  return {
    board,
    status,
    elapsed_time: elapsedTime,
    remaining_mines: config.mine_count - flagCount,
    reward,
    handleTileClick,
    handleRightClick,
    handleChord,
    resetGame,
  };
};
