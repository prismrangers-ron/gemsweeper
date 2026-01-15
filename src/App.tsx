import { useState } from 'react'
import { useGame } from './hooks/useGame'
import { GameBoard } from './components/GameBoard'
import { HeaderBar } from './components/HeaderBar'
import { WinModal } from './components/WinModal'
import { MainMenu } from './components/MainMenu'
import type { GameMode } from './types/game.types'
import styles from './App.module.css'

function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null)
  const [modalDismissed, setModalDismissed] = useState(false)

  // Show main menu if no mode selected
  if (!gameMode) {
    return <MainMenu on_select_mode={setGameMode} />
  }

  return <GameScreen 
    mode={gameMode} 
    modalDismissed={modalDismissed}
    setModalDismissed={setModalDismissed}
    onBackToMenu={() => {
      setGameMode(null)
      setModalDismissed(false)
    }}
  />
}

interface GameScreenProps {
  mode: GameMode
  modalDismissed: boolean
  setModalDismissed: (value: boolean) => void
  onBackToMenu: () => void
}

function GameScreen({ mode, modalDismissed, setModalDismissed, onBackToMenu }: GameScreenProps) {
  const game = useGame(mode)

  const handleReset = () => {
    setModalDismissed(false)
    game.resetGame()
  }

  return (
    <main className={`${styles.container} ${mode === 'hell' ? styles.hellMode : ''}`}>
      <button className={styles.backButton} onClick={onBackToMenu}>
        ← Menu
      </button>
      <div className={styles.game}>
        <HeaderBar
          remaining_mines={game.remaining_mines}
          elapsed_time={game.elapsed_time}
          status={game.status}
          mode={mode}
          on_reset={handleReset}
        />
        <GameBoard
          board={game.board}
          status={game.status}
          mode={mode}
          on_tile_click={game.handleTileClick}
          on_tile_right_click={game.handleRightClick}
          on_chord={game.handleChord}
        />
      </div>
      <WinModal
        is_visible={game.status === 'won' && !modalDismissed}
        reward={game.reward}
        mode={mode}
        on_close={() => setModalDismissed(true)}
      />
    </main>
  )
}

export default App
