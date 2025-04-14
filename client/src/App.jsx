import './App.css'
import React, { useState, useCallback, useMemo } from 'react';
import GameBoard from './components/gameSpace/GameBoard'
import Player from './components/player/Player'
import Tree from './components/gameSpace/worldObjects/Tree'
import Stone from './components/gameSpace/worldObjects/Stone'
import Inventory from './components/interface/Inventory'
import CraftingSlots from './components/interface/CraftingSlots';
import CraftingListModal from './components/interface/modals/CraftingListModal';

const initialInventory = Array.from({ length: 20 }, () => ({ type: null, count: 0 }));
const initialCraftingGrid = Array.from({ length: 4 }, () => ({ type: null, count: 0 }));

function App() {
  const [inventory, setInventory] = useState(initialInventory);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [gameReady, setGameReady] = useState(false);
  const [craftingGrid, setCraftingGrid] = useState(initialCraftingGrid);

  const handleItemDrop = (targetContainer, targetIndex) => {
    if (!draggedItem || !draggedFrom) return;

    if (targetContainer === 'inventory') {
      setInventory(prev => {
        const copy = [...prev];
        if (targetIndex === draggedFrom.index) return copy;
        const targetSlot = copy[targetIndex];

        if (!targetSlot.type) {
          copy[targetIndex] = { ...draggedItem };
        } else if (
          targetSlot.type === draggedItem.type &&
          targetSlot.count < 50
        ) {
          const space = 50 - targetSlot.count;
          const transfer = Math.min(space, draggedItem.count);
          targetSlot.count += transfer;
        }
        return copy;
      });

      if (draggedFrom.container === 'inventory' && targetIndex !== draggedFrom.index) {
        setInventory(prev => {
          const copy = [...prev];
          copy[draggedFrom.index] = { type: null, count: 0 };
          return copy;
        });
      } else if (draggedFrom.container === 'crafting') {
        setCraftingGrid(prev => {
          const copy = [...prev];
          copy[draggedFrom.index] = { type: null, count: 0 };
          return copy;
        });
      }
    } else if (targetContainer === 'crafting') {
      setCraftingGrid(prev => {
        const copy = [...prev];
        const targetSlot = copy[targetIndex];

        if (!targetSlot.type) {
          copy[targetIndex] = { ...draggedItem };
        } else if (
          targetSlot.type === draggedItem.type &&
          targetSlot.count < 50
        ) {
          const space = 50 - targetSlot.count;
          const transfer = Math.min(space, draggedItem.count);
          targetSlot.count += transfer;
        }
        return copy;
      });

      if (draggedFrom.container === 'inventory') {
        setInventory(prev => {
          const copy = [...prev];
          copy[draggedFrom.index] = { type: null, count: 0 };
          return copy;
        });
      } else if (draggedFrom.container === 'crafting' && targetIndex !== draggedFrom.index) {
        setCraftingGrid(prev => {
          const copy = [...prev];
          copy[draggedFrom.index] = { type: null, count: 0 };
          return copy;
        });
      }
    }

    setDraggedItem(null);
    setDraggedFrom(null);
  };

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
  <div className="app-layout">
    <div className="board-wrapper">
      <GameBoard>{gameElements}</GameBoard>
    </div>

  <div className="interface-stack">
    <CraftingSlots
      craftingGrid={craftingGrid}
      setCraftingGrid={setCraftingGrid}
      draggedItem={draggedItem}
      setDraggedItem={setDraggedItem}
      draggedFrom={draggedFrom}
      setDraggedFrom={setDraggedFrom}
      onDrop={handleItemDrop}
    />
    <CraftingListModal
      craftingGrid={craftingGrid}
      setCraftingGrid={setCraftingGrid}
      inventory={inventory}
      setInventory={setInventory}
    />
    <Inventory
      inventory={inventory}
      setInventory={setInventory}
      draggedItem={draggedItem}
      setDraggedItem={setDraggedItem}
      draggedFrom={draggedFrom}
      setDraggedFrom={setDraggedFrom}
      onDrop={handleItemDrop}
    />

  </div>

  </div>
);
}

export default App;