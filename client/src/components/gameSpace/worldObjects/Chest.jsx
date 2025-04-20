import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import lootables from '../../../data/lootables';

const Chest = ({ app, container, playerPositionRef, boardSize, addToInventory, setChestLoot }) => {
    useEffect(() => {
    if (!app || !container) return;

    const chest = new PIXI.Graphics();
    chest.beginFill(0xffff00);
    chest.drawRect(0, 0, 25, 25);
    chest.endFill();
    chest.pivot.set(12.5, 12.5);
    chest.x = Math.random() * boardSize - boardSize / 2;
    chest.y = Math.random() * boardSize - boardSize / 2;
    container.addChild(chest);

    PIXI.Ticker.shared.addOnce(() => {
    if (!Array.isArray(lootables) || lootables.length === 0) {
      console.warn("Lootables not ready!");
      return;
    }

    const roll = Math.random();
    let pool = 
      roll < 0.10 ? lootables.filter(l => l.rarity === 'mythic') :
      roll < 0.25 ? lootables.filter(l => l.rarity === 'rare') : 
      roll < 0.60  ? lootables.filter(l => l.rarity === 'uncommon') :
        lootables.filter(l => l.rarity === 'common');

    if (pool.length === 0) {
      console.warn('Filtered pool empty, falling back to all lootables');
      pool = lootables;
    }

    const item = pool[Math.floor(Math.random() * pool.length)];
    console.log("Chest contains:", item);

    const onTick = () => {
        const { x, y } = playerPositionRef.current;
        const dx = chest.x - x;
        const dy = chest.y - y;
        const distance = Math.hypot(dx, dy);
        if (distance < 20) {
            container.removeChild(chest);
            setChestLoot(item);
            app.ticker.remove(onTick);
        }
        };
        app.ticker.add(onTick);
    });

    return () => {
        app.ticker.remove((ticker) => ticker);
        if (container.children.includes(chest)) container.removeChild(chest);
    };
    }, [app, container, playerPositionRef, boardSize]);

  return null;
};

export default React.memo(Chest);
