import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';

const ENTRANCE_SIZE = 25;

const CaveEntranceReplica = ({ app, container, x, y, entranceX, entranceY, setInCave, setActiveCave }) => {
  useEffect(() => {
    if (!app || !container) return;

    const entrance = new PIXI.Graphics();
    entrance.beginFill(0x000000);
    entrance.drawRect(0, 0, ENTRANCE_SIZE, ENTRANCE_SIZE);
    entrance.endFill();
    entrance.x = entranceX;
    entrance.y = entranceY;

    const wrapper = new PIXI.Container();
    wrapper.x = x;
    wrapper.y = y;
    wrapper.addChild(entrance);
    container.addChild(wrapper);

    const entranceRect = new PIXI.Rectangle(
      x + entranceX,
      y + entranceY,
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
        setInCave(false);
        setActiveCave(null);
      }
    });

    return () => {
      container.removeChild(wrapper);
    };
  }, [app, container, x, y, entranceX, entranceY, setInCave, setActiveCave]);

  return null;
};

export default React.memo(CaveEntranceReplica);
