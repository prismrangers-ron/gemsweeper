import { useRef, useCallback, useEffect } from 'react';
import type { Tile as TileData } from '../types/game.types';
import styles from './Tile.module.css';

interface TileProps {
  tile: TileData;
  game_over: boolean;
  on_click: () => void;
  on_right_click: (e: React.MouseEvent) => void;
  on_chord: () => void;
}

const LONG_PRESS_DURATION = 450; // ms - slightly longer for Android

export const Tile: React.FC<TileProps> = ({
  tile,
  game_over,
  on_click,
  on_right_click,
  on_chord,
}) => {
  // Desktop mouse tracking
  const buttonsPressed = useRef<Set<number>>(new Set());
  const chordTriggered = useRef(false);
  
  // Touch/long press tracking
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);
  const isTouchDevice = useRef(false);
  const lastTouchTime = useRef(0);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  const getClassName = (): string => {
    const classes = [styles.tile];

    if (tile.is_revealed) {
      classes.push(styles.revealed);
      if (tile.adjacent_mines > 0 && !tile.is_mine) {
        classes.push(styles[`num${tile.adjacent_mines}`]);
      }
    }
    if (tile.is_flagged && !game_over) classes.push(styles.flagged);
    if (tile.is_mine && tile.is_revealed) classes.push(styles.mine);

    return classes.join(' ');
  };

  const renderContent = () => {
    if (tile.is_flagged && !game_over) {
      return <img src="/assets/redflag.png" alt="flag" className={styles.flagImg} />;
    }
    if (tile.is_mine && tile.is_revealed) {
      return <img src="/assets/butthole.png" alt="mine" className={styles.mineImg} />;
    }
    if (tile.is_revealed && tile.adjacent_mines > 0 && !tile.is_mine) {
      return tile.adjacent_mines;
    }
    return null;
  };

  // === DESKTOP MOUSE HANDLERS ===
  const handleMouseDown = (e: React.MouseEvent) => {
    // Skip if this is from a touch event
    if (isTouchDevice.current) return;
    
    buttonsPressed.current.add(e.button);

    // Middle click triggers chord
    if (e.button === 1) {
      e.preventDefault();
      chordTriggered.current = true;
      on_chord();
    }

    // Left + Right click together triggers chord
    if (buttonsPressed.current.has(0) && buttonsPressed.current.has(2)) {
      e.preventDefault();
      chordTriggered.current = true;
      on_chord();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isTouchDevice.current) return;
    
    if (chordTriggered.current && buttonsPressed.current.size <= 1) {
      chordTriggered.current = false;
    }
    buttonsPressed.current.delete(e.button);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Block click if it came from touch (Android fires click after touch)
    const now = Date.now();
    if (now - lastTouchTime.current < 500) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Block if long press was triggered
    if (longPressTriggered.current) {
      e.preventDefault();
      e.stopPropagation();
      longPressTriggered.current = false;
      return;
    }
    
    // Block if chord was used
    if (chordTriggered.current) {
      e.preventDefault();
      return;
    }
    
    on_click();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // On desktop, right-click to flag
    if (!isTouchDevice.current && !chordTriggered.current) {
      on_right_click(e);
    }
  };

  const handleMouseLeave = () => {
    buttonsPressed.current.clear();
    chordTriggered.current = false;
  };

  // === TOUCH HANDLERS (Mobile) ===
  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isTouchDevice.current = true;
    longPressTriggered.current = false;
    lastTouchTime.current = Date.now();
    
    // Start long press timer
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      
      // If tile is revealed with a number, trigger chord
      if (tile.is_revealed && tile.adjacent_mines > 0) {
        on_chord();
      } else if (!tile.is_revealed) {
        // Toggle flag on unrevealed tiles
        on_right_click(e as unknown as React.MouseEvent);
      }
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, LONG_PRESS_DURATION);
  }, [on_right_click, on_chord, tile.is_revealed, tile.adjacent_mines]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    clearLongPress();
    lastTouchTime.current = Date.now();
    
    // If long press was triggered, block everything
    if (longPressTriggered.current) {
      e.preventDefault();
      e.stopPropagation();
      // Reset after a delay
      setTimeout(() => {
        longPressTriggered.current = false;
      }, 300);
      return;
    }
    
    // Short tap on unrevealed, unflagged tile = reveal
    if (!tile.is_revealed && !tile.is_flagged) {
      e.preventDefault();
      on_click();
    }
  }, [clearLongPress, on_click, tile.is_revealed, tile.is_flagged]);

  const handleTouchMove = useCallback(() => {
    // Cancel long press if finger moves
    clearLongPress();
    longPressTriggered.current = false;
  }, [clearLongPress]);

  const handleTouchCancel = useCallback(() => {
    clearLongPress();
    longPressTriggered.current = false;
  }, [clearLongPress]);

  return (
    <button
      className={getClassName()}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onAuxClick={(e) => e.preventDefault()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={handleTouchCancel}
    >
      {renderContent()}
    </button>
  );
};
