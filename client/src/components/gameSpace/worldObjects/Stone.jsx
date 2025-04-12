import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';

const Stone = ({ app, container, collisionRects, onGoToTarget }) => {
  useEffect(() => {
    if (!app || !container) return;

    const stoneClusters = [];
    const clusterCount = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < clusterCount; i++) {
      const cluster = new PIXI.Container();
      cluster.rocks = [];
      cluster.totalRock = 0;

      const rockSize = 10;
      const numRocks = Math.floor(Math.random() * 6) + 15;

      for (let j = 0; j < numRocks; j++) {
        const rock = new PIXI.Graphics();
        rock.beginFill(0x808080);
        rock.drawRect(0, 0, rockSize, rockSize);
        rock.endFill();

        const offsetX = Math.floor(Math.random() * 4 - 2) * rockSize;
        const offsetY = Math.floor(Math.random() * 4 - 2) * rockSize;

        rock.x = offsetX;
        rock.y = offsetY;

        rock.quantity = Math.floor(Math.random() * 6) + 1;
        cluster.totalRock += rock.quantity;

        cluster.addChild(rock);
        cluster.rocks.push(rock);

        rock.interactive = true;
        rock.buttonMode = true;
        rock.hitArea = new PIXI.Rectangle(0, 0, rockSize, rockSize);
        rock.targetType = 'rock';
        rock.size = rockSize;
        rock.baseColor = 0x808080;

        rock.on('pointerdown', () => {
          onGoToTarget?.({
            x: cluster.x + rock.x,
            y: cluster.y + rock.y,
            target: rock,
          });
        });
      }

      const padding = 40;
      const x = Math.random() * (app.screen.width - padding * 2) + padding;
      const y = Math.random() * (app.screen.height - padding * 2) + padding;

      cluster.x = x;
      cluster.y = y;

      if (Array.isArray(collisionRects)) {
        for (const rock of cluster.rocks) {
          const rect = new PIXI.Rectangle(
            x + rock.x,
            y + rock.y,
            rockSize,
            rockSize
          );
          collisionRects.push(rect);
        }
      }

      container.addChild(cluster);
      stoneClusters.push(cluster);
    }

    return () => {
      for (const cluster of stoneClusters) container.removeChild(cluster);
    };
  }, [app, container, collisionRects, onGoToTarget]);

  return null;
};

export default React.memo(Stone);
