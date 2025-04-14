import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import CaveEntranceReplica from './CaveEntranceReplica';
const ENTRANCE_SIZE = 25;
const CAVE_COLOR = 0x333333;

const Cave = ({ app, container, collisionRects, onGoToTarget, setInCave, inCave, setActiveCave}) => {
  useEffect(() => {
    if (!app || !container) return;

    const caves = [];
    const padding = 60;

    for (let i = 0; i < 3; i++) {
      const x = Math.random() * (app.screen.width - 2 * padding) + padding;
      const y = Math.random() * (app.screen.height - 2 * padding) + padding;

      const cave = new PIXI.Container();

      // Entrance
      const entrance = new PIXI.Graphics();
      entrance.beginFill(0x000000);
      entrance.drawRect(0, 0, ENTRANCE_SIZE, ENTRANCE_SIZE);
      entrance.endFill();
      entrance.x = -ENTRANCE_SIZE / 2;
      entrance.y = 0;
      cave.addChild(entrance);

      // Dome shape using squares
      const squareSize = 10;
      const layout = [
        [0,1,1,1,0],
        [1,1,1,1,1],
        [1,1,1,1,1]
      ];

      layout.forEach((row, rowIndex) => {
        row.forEach((val, colIndex) => {
          if (val === 1) {
            const block = new PIXI.Graphics();
            block.beginFill(CAVE_COLOR);
            block.drawRect(0, 0, squareSize, squareSize);
            block.endFill();
            block.x = (colIndex - 2) * squareSize;
            block.y = -squareSize * (3 - rowIndex);
            cave.addChild(block);
          }
        });
      });

      cave.x = x;
      cave.y = y;
      container.addChild(cave);
      caves.push(cave);

      // Entrance bounds for overlap detection
      const entranceRect = new PIXI.Rectangle(
        x + entrance.x,
        y + entrance.y,
        ENTRANCE_SIZE,
        ENTRANCE_SIZE
      );

      app.ticker.add(() => {
        const player = container.children.find(c => c.width === 25 && c.height === 25);
        if (!player) return;

        const px = player.x;
        const py = player.y;

        const overlapX = Math.max(0, Math.min(px + 12.5, entranceRect.x + ENTRANCE_SIZE) - Math.max(px - 12.5, entranceRect.x));
        const overlapY = Math.max(0, Math.min(py + 12.5, entranceRect.y + ENTRANCE_SIZE) - Math.max(py - 12.5, entranceRect.y));
        const overlapArea = overlapX * overlapY;
        const playerArea = 25 * 25;
if (overlapArea >= playerArea * 0.5) {
  if (!inCave) {
    setActiveCave(
      <CaveEntranceReplica
        x={x}
        y={y}
        entranceX={entrance.x}
        entranceY={entrance.y}
      />
    );
    setInCave(true);
  }
} else {
  if (inCave) {
    setInCave(false);
    setActiveCave(null);
  }
}


      });

      // Add body collision
      if (Array.isArray(collisionRects)) {
        layout.forEach((row, rowIndex) => {
          row.forEach((val, colIndex) => {
            if (val === 1) {
              const rect = new PIXI.Rectangle(
                x + (colIndex - 2) * squareSize,
                y - squareSize * (3 - rowIndex),
                squareSize,
                squareSize
              );
              collisionRects.push(rect);
            }
          });
        });
      }
    }
    if (inCave && !setInCave) return null;

    return () => {
      for (const cave of caves) container.removeChild(cave);
    };
  }, [app, container, collisionRects, onGoToTarget, setInCave, inCave]);

  return null;
};

export default React.memo(Cave);