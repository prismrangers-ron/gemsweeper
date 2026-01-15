import { useState } from 'react'
import { useGame } from './hooks/useGame'
import { GameBoard } from './components/GameBoard'
import { HeaderBar } from './components/HeaderBar'
import { WinModal } from './components/WinModal'
import styles from './App.module.css'

function App() {
  const game = useGame()
  const [modalDismissed, setModalDismissed] = useState(false)

  const handleReset = () => {
    setModalDismissed(false)
    game.resetGame()
  }

  return (
    <main className={styles.container}>
      <div className={styles.game}>
        <HeaderBar
          remaining_mines={game.remaining_mines}
          elapsed_time={game.elapsed_time}
          status={game.status}
          on_reset={handleReset}
        />
        <GameBoard
          board={game.board}
          status={game.status}
          on_tile_click={game.handleTileClick}
          on_tile_right_click={game.handleRightClick}
          on_chord={game.handleChord}
        />
      </div>
      <WinModal
        is_visible={game.status === 'won' && !modalDismissed}
        clue={game.clue}
        on_close={() => setModalDismissed(true)}
      />
    </main>
  )
}

export default App

