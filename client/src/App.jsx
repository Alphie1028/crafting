import './App.css'
import GameBoard from './components/gameSpace/GameBoard'
import Player from './components/player/Player'
import Tree from './components/gameSpace/worldObjects/Tree'
import Stone from './components/gameSpace/worldObjects/Stone'
import Inventory from './components/interface/Inventory'

function App() {

  return (
    <div className="App">
      <GameBoard>
        <Player></Player>
        <Tree></Tree>
        <Stone></Stone>
      </GameBoard>
      <Inventory></Inventory>
    </div>
  )
}

export default App
