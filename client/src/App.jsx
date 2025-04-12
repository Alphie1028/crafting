import './App.css'
import GameBoard from './components/gameSpace/GameBoard'
import Player from './components/player/Player'

function App() {

  return (
    <div className="App">
      <GameBoard>
        <Player></Player>
      </GameBoard>
    </div>
  )
}

export default App
