import './App.css'
import GameBoard from './components/gameSpace/GameBoard'
import Player from './components/player/Player'
import Tree from './components/gameSpace/worldObjects/Tree'
import Stone from './components/gameSpace/worldObjects/Stone'

function App() {

  return (
    <div className="App">
      <GameBoard>
        <Player></Player>
        <Tree></Tree>
        <Stone></Stone>
      </GameBoard>
    </div>
  )
}

export default App
