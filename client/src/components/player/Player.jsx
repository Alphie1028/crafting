import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const SPEED = 5;

const Player = ({ app, container }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!app || !container) return;

    const player = new PIXI.Graphics();
    player.beginFill(0xff0000);
    player.drawRect(0, 0, 25, 25);
    player.endFill();

    player.pivot.set(12.5, 12.5);

    const spawnX = app.screen.width / 2;
    const spawnY = app.screen.height / 2;
    player.x = spawnX;
    player.y = spawnY;

    container.addChild(player);
    playerRef.current = player;

    const keys = {};
    const handleKeyDown = (e) => { keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    app.ticker.add(() => {
    if (!playerRef.current) return;

    if (keys['w']) player.y -= SPEED;
    if (keys['s']) player.y += SPEED;
    if (keys['a']) player.x -= SPEED;
    if (keys['d']) player.x += SPEED;

    const minX = 12.5;
    const maxX = app.screen.width - 12.5;
    const minY = 12.5;
    const maxY = app.screen.height - 12.5;

    player.x = Math.max(minX, Math.min(maxX, player.x));
    player.y = Math.max(minY, Math.min(maxY, player.y));
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      container.removeChild(player);
    };
  }, [app, container]);

  return null;
};

export default Player;