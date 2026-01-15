import { useState, useCallback, useRef } from 'react';
import { gameService } from '../services/gameService';
import { boardRepository } from '../repositories/boardRepository';
import { timerService } from '../services/timerService';
import { clueService } from '../services/clueService';
import type { Board, GameStatus } from '../types/game.types';
import { GRID_CONFIG } from '../types/game.types';

interface UseGameReturn {
  board: Board;
  status: GameStatus;
  elapsed_time: number;
  remaining_mines: number;
  clue: string | null;
  handleTileClick: (row: number, col: number) => void;
  handleRightClick: (row: number, col: number) => void;
  handleChord: (row: number, col: number) => void;
  resetGame: () => void;
}

export const useGame = (): UseGameReturn => {
  const [board, setBoard] = useState<Board>(() => boardRepository.create());
  const [status, setStatus] = useState<GameStatus>('ready');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [clue, setClue] = useState<string | null>(null);

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

  // Claim the clue from server when winning
  const handleWin = useCallback(async (newBoard: Board) => {
    stopTimer();
    setBoard(newBoard);
    setStatus('won');
    
    // Fetch the clue from the server
    const serverClue = await clueService.claimClue();
    if (serverClue) {
      setClue(serverClue);
    }
  }, [stopTimer]);

  const handleTileClick = useCallback(async (row: number, col: number) => {
    if (status === 'won' || status === 'lost') return;

    let currentBoard = board;
    let currentStatus = status;

    // First click: place mines and start session
    if (currentStatus === 'ready') {
      // Start a secure session for clue retrieval
      await clueService.startSession();
      
      currentBoard = gameService.placeMines(currentBoard, row, col);
      currentStatus = 'playing';
      startTimer();
    }

    // Check if tile is flagged or already revealed
    const tile = currentBoard[row][col];
    if (tile.is_flagged || tile.is_revealed) return;

    // Check mine hit
    if (gameService.isMineHit(currentBoard, row, col)) {
      stopTimer();
      clueService.clearSession();
      const revealedBoard = gameService.revealAllMines(currentBoard);
      setBoard(revealedBoard);
      setStatus('lost');
      return;
    }

    // Reveal tile
    const newBoard = gameService.revealTile(currentBoard, row, col);

    // Check win
    if (gameService.checkWin(newBoard)) {
      await handleWin(newBoard);
      return;
    }

    setBoard(newBoard);
    setStatus(currentStatus);
  }, [board, status, startTimer, stopTimer, handleWin]);

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

    if (gameService.checkWin(newBoard)) {
      await handleWin(newBoard);
      return;
    }

    setBoard(newBoard);
  }, [board, status, stopTimer, handleWin]);

  const resetGame = useCallback(() => {
    stopTimer();
    clueService.clearSession();
    setBoard(boardRepository.create());
    setStatus('ready');
    setElapsedTime(0);
    setFlagCount(0);
    setClue(null);
  }, [stopTimer]);

  return {
    board,
    status,
    elapsed_time: elapsedTime,
    remaining_mines: GRID_CONFIG.mine_count - flagCount,
    clue,
    handleTileClick,
    handleRightClick,
    handleChord,
    resetGame,
  };
};
