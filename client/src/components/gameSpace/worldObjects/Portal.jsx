import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';

const Portal = ({ app, container, playerPositionRef, setInCave, setPortalVisible, boardSize, setTimer }) => {
  useEffect(() => {
    if (!app || !container) return;

    const PORTAL_WIDTH = 25;
    const PORTAL_HEIGHT = 50;
    const padding = 50;

    const portal = new PIXI.Graphics();
    portal.beginFill(0x800080); // purple color
    portal.drawEllipse(0, 0, PORTAL_WIDTH / 2, PORTAL_HEIGHT / 2);
    portal.endFill();

    portal.x = Math.random() * (boardSize - padding * 2) - boardSize / 2 + padding;
    portal.y = Math.random() * (boardSize - padding * 2) - boardSize / 2 + padding;

    container.addChild(portal);

    const PLAYER_SIZE = 25;
    const onTick = () => {
      const playerPos = playerPositionRef.current;
      if (!playerPos) return;

      const distX = portal.x - playerPos.x;
      const distY = portal.y - playerPos.y;

      const distance = Math.hypot(distX, distY);
      const interactionRadius = (PLAYER_SIZE / 2) + (PORTAL_WIDTH / 2);

      if (distance <= interactionRadius) {
        setInCave(false);
        setPortalVisible(false);
        setTimer(null);
      }
    };

    app.ticker.add(onTick);

    return () => {
      app.ticker.remove(onTick);
      container.removeChild(portal);
      portal.destroy();
    };
  }, [app, container, playerPositionRef, setInCave, setPortalVisible, boardSize, setTimer]);

  return null;
};

export default React.memo(Portal);
