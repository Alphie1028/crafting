import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';

const PLAYER_SIZE = 25;
const CAVE_SIZE = PLAYER_SIZE * 1.5;
const MIN_CAVES = 2;
const MAX_CAVES = 5;

const Caves = ({ app, container, inCave, setInCave }) => {
  useEffect(() => {
    if (!app || !container) return;

    const caves = [];
    const caveRects = [];
    const padding = 40;
    const count = Math.floor(Math.random() * (MAX_CAVES - MIN_CAVES + 1)) + MIN_CAVES;

    for (let i = 0; i < count; i++) {
      const g = new PIXI.Graphics();
      g.beginFill(0x000000).drawRect(0, 0, CAVE_SIZE, CAVE_SIZE).endFill();
      g.x = Math.random() * (app.screen.width  - padding*2 - CAVE_SIZE) + padding;
      g.y = Math.random() * (app.screen.height - padding*2 - CAVE_SIZE) + padding;
      container.addChild(g);
      caves.push(g);
      caveRects.push(new PIXI.Rectangle(g.x, g.y, CAVE_SIZE, CAVE_SIZE));
    }

    const onTick = () => {
      const player = container.children.find(c => c.width === PLAYER_SIZE && c.height === PLAYER_SIZE);
      if (!player) return;

      caveRects.forEach(rect => {
        const overlapX = Math.max(0,
          Math.min(player.x + PLAYER_SIZE/2, rect.x + rect.width) - Math.max(player.x - PLAYER_SIZE/2, rect.x)
        );
        
        const overlapY = Math.max(0,
          Math.min(player.y + PLAYER_SIZE/2, rect.y + rect.height) - Math.max(player.y - PLAYER_SIZE/2, rect.y)
        );

        const overlapArea = overlapX * overlapY;
        const halfPlayerArea = PLAYER_SIZE * PLAYER_SIZE * 0.5;

        if (overlapArea >= halfPlayerArea) {
          if (!inCave) setInCave(true);
        } else {
          if (inCave) setInCave(false);
        }
      });
    };

    app.ticker.add(onTick);
    return () => {
      app.ticker.remove(onTick);
      caves.forEach(c => container.removeChild(c));
    };
  }, [app, container, inCave, setInCave]);

  return null;
};

export default React.memo(Caves);