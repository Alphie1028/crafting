import './App.css'
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import GameBoard from './components/gameSpace/GameBoard'
import Player from './components/player/Player'
import Tree from './components/gameSpace/worldObjects/Tree'
import Stone from './components/gameSpace/worldObjects/Stone'
import Inventory from './components/interface/Inventory'
import CraftingSlots from './components/interface/CraftingSlots';
import CraftingListModal from './components/interface/modals/CraftingListModal';
import Caves from './components/gameSpace/worldObjects/Caves';
import Slimes from './components/gameSpace/enemies/Slimes';
import craftables from './data/craftables';
import Stats from './components/interface/Stats';
import Equipment from './components/interface/Equipment';
import InUse from './components/itemsBeingUsed/InUse';
import Portal from './components/gameSpace/worldObjects/Portal';

const initialInventory = Array.from({ length: 20 }, () => ({ type: null, count: 0 }));
const initialCraftingGrid = Array.from({ length: 4 }, () => ({ type: null, count: 0 }));
const initialBaseStats = { hp: 100, attack: 1, armor: 0 };

function App() {
  const [inventory, setInventory] = useState(initialInventory);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [gameReady, setGameReady] = useState(false);
  const [craftingGrid, setCraftingGrid] = useState(initialCraftingGrid);
  const [inCave, setInCave] = useState(false);
  const playerPositionRef = useRef({ x: 0, y: 0 });
  const [equipment, setEquipment] = useState([]);
  const slimesRef = useRef([]);
  const [timer, setTimer] = useState(null);
  const [portalVisible, setPortalVisible] = useState(false);
  const originalPlayerPositionRef = useRef({ x: 0, y: 0 });
  const [boardSize, setBoardSize] = useState(null);
  const playerHpRef = useRef(initialBaseStats.hp);
  const [liveHp, setLiveHp] = useState(initialBaseStats.hp);
  const [isDead, setIsDead] = useState(false);


  const handleTakeDamage = useCallback((amount) => {
    playerHpRef.current = Math.max(0, playerHpRef.current - amount);
    setLiveHp(prev => {
      const nextHp = Math.max(0, prev - amount);
      if (nextHp === 0) setIsDead(true);
      return nextHp;
    });
  }, []);


  useEffect(() => {
    if (inCave) {
      originalPlayerPositionRef.current = { ...playerPositionRef.current };
    } else {
      playerPositionRef.current = { ...originalPlayerPositionRef.current };
    }
  }, [inCave]);

  const handleItemDrop = (targetContainer, targetIndex) => {
    if (!draggedItem || !draggedFrom) return;

    if (targetContainer === 'inventory') {
      if (draggedFrom.container === 'equipment') {
        setEquipment(prev => {
          const copy = [...prev];
          copy.splice(draggedFrom.index, 1);
          return copy;
        });
      }

      setInventory(prev => {
        const copy = [...prev];
        if (!(draggedFrom.container === 'inventory' && targetIndex === draggedFrom.index)) {
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
        const slot = copy[targetIndex];
        if (!slot.type) {
          copy[targetIndex] = { ...draggedItem };
        } else if (
          slot.type === draggedItem.type &&
          slot.count < 50
        ) {
          const space = 50 - slot.count;
          const move  = Math.min(space, draggedItem.count);
          slot.count += move;
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
      } else if (draggedFrom.container === 'equipment') {
        setEquipment(prev => {
          const copy = [...prev];
          copy.splice(draggedFrom.index, 1);
          return copy;
        });
      }

    } else if (targetContainer === 'equipment-slot') {
      setEquipment(prev => {
        const copy = [...prev];
        copy[targetIndex] = { ...draggedItem };
        return copy;
      });
      if (draggedFrom.container === 'inventory') {
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

    } else if (targetContainer === 'equipment') {
      if (['inventory', 'crafting'].includes(draggedFrom.container)) {
        setEquipment(prev => [...prev, { ...draggedItem }]);
        if (draggedFrom.container === 'inventory') {
          setInventory(prev => {
            const copy = [...prev];
            copy[draggedFrom.index] = { type: null, count: 0 };
            return copy;
          });
        } else {
          setCraftingGrid(prev => {
            const copy = [...prev];
            copy[draggedFrom.index] = { type: null, count: 0 };
            return copy;
          });
        }
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

  const stats = useMemo(() => {
   const s = { ...initialBaseStats };
    equipment.forEach((item) => {
      const recipe = craftables.find(c => c.gives.type === item.type);
      if (recipe?.extra) {
        if (recipe.extra.damage)   s.attack += recipe.extra.damage;
        if (recipe.extra.armor)    s.armor  += recipe.extra.armor;
        if (recipe.extra.hp)       s.hp     += recipe.extra.hp;
      }
    });
    return s;
  }, [equipment]);

  const gameElements = useMemo(() => [
    <Tree key="tree" />,
    <Stone key="stone" />,
    !isDead && <Player key="player" addToInventory={addToInventory} playerPositionRef={playerPositionRef} />,
    <Caves key="caves" inCave={inCave} setInCave={setInCave} />
  ], [addToInventory]);

  const caveElements = useMemo(() => [
    !isDead && <Player key="player-cave" addToInventory={addToInventory} playerPositionRef={playerPositionRef} />,
    <Slimes key="slimes-cave" playerPositionRef={playerPositionRef} slimesRef={slimesRef} inCave={inCave} setTimer={setTimer} setPortalVisible={setPortalVisible} takeDamage={handleTakeDamage}/>,
    <InUse key="in-use" equipment={equipment} playerPositionRef={playerPositionRef} inCave={inCave} slimesRef={slimesRef}/>,
      portalVisible && <Portal
    key="portal"
    playerPositionRef={playerPositionRef}
    setInCave={setInCave}
    setPortalVisible={setPortalVisible}
    boardSize={boardSize}
  />,
  ],[addToInventory, equipment, playerPositionRef, inCave, boardSize, portalVisible]);

return (
  <div className="app-layout">
    <div
      className="board-and-sidebars"
       style={{ display:'flex', alignItems:'flex-start', justifyContent:'center', width:'100%' }}
     >
       <Stats stats={{ ...stats, hp: liveHp }} />
    <div className="board-wrapper">
      <div style={{ display: inCave ? 'none' : 'block'}}>
      <GameBoard timer={timer} onBoardSize={setBoardSize}>{gameElements}</GameBoard>
      </div>

      <div style={{ display: inCave ? 'block' : 'none' }}>
        <GameBoard key="cave" timer={timer} onBoardSize={setBoardSize}>{caveElements}</GameBoard>
      </div>
    </div>
      <Equipment
        equipment={equipment}
        draggedItem={draggedItem}
         setDraggedItem={setDraggedItem}
        draggedFrom={draggedFrom}
         setDraggedFrom={setDraggedFrom}
         onDrop={handleItemDrop}
       />
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
  {isDead && (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      textAlign: 'center',
      padding: '40px',
      borderRadius: '12px',
      zIndex: 9999,
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Wasted</h1>
      <button
        style={{
          padding: '12px 24px',
          fontSize: '20px',
          backgroundColor: '#ff5555',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        onClick={() => window.location.reload()}
      >
        Restart
      </button>
    </div>
  )}
  </div>
);
}

export default App;