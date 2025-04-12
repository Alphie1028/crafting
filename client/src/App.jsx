import './App.css'
import React, { useState, useCallback, useMemo } from 'react';
import GameBoard from './components/gameSpace/GameBoard'
import Player from './components/player/Player'
import Tree from './components/gameSpace/worldObjects/Tree'
import Stone from './components/gameSpace/worldObjects/Stone'
import Inventory from './components/interface/Inventory'

const initialInventory = Array.from({ length: 20 }, () => ({ type: null, count: 0 }));

function App() {
  const [inventory, setInventory] = useState(initialInventory);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [gameReady, setGameReady] = useState(false);

  const addToInventory = useCallback((type, amount) => {
    setInventory(prev => {
      const copy = [...prev];
      let leftover = amount;

      for (const slot of copy) {
        if (slot.type === type && slot.count < 50) {
          const space = 50 - slot.count;
          const toAdd = Math.min(space, leftover);
          slot.count += toAdd;
          leftover -= toAdd;
          if (leftover <= 0) break;
        }
      }

      for (const slot of copy) {
        if (!slot.type && leftover > 0) {
          const toAdd = Math.min(50, leftover);
          slot.type = type;
          slot.count = toAdd;
          leftover -= toAdd;
          if (leftover <= 0) break;
        }
      }

      return copy;
    });
  }, []);

  const gameElements = useMemo(() => [
    <Tree key="tree" />,
    <Stone key="stone" />,
    <Player key="player" addToInventory={addToInventory} />,
  ], [addToInventory]);

  return (
    <>
      <GameBoard>
        {gameElements}
      </GameBoard>

      <Inventory
        inventory={inventory}
        setInventory={setInventory}
        draggedItem={draggedItem}
        setDraggedItem={setDraggedItem}
        draggedIndex={draggedIndex}
        setDraggedIndex={setDraggedIndex}
      />
    </>
  );
}

export default App;