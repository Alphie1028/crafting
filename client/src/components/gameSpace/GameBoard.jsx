import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

const GameBoard = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const size = window.innerWidth * 0.75;
      const canvas = document.createElement('canvas');

      const app = new PIXI.Application();
      await app.init({
        canvas,
        width: size,
        height: size,
        backgroundColor: 0xD3D3D3,
        resolution: window.devicePixelRatio || 1,
      });

      if (containerRef.current) {
        containerRef.current.appendChild(canvas);
      }

      const boardBounds = {
        x: 0,
        y: 0,
        width: size,
        height: size,
      };

      const border = new PIXI.Graphics();
      border.setStrokeStyle({
        width: 10,
        color: 0x000000,
        alpha: 1,
        alignment: 0.5,
      });
      border.rect(boardBounds.x, boardBounds.y, boardBounds.width, boardBounds.height);
      border.stroke();
      app.stage.addChild(border);

      const maskShape = new PIXI.Graphics();
      maskShape.rect(boardBounds.x, boardBounds.y, boardBounds.width, boardBounds.height);
      maskShape.fill({ color: 0xffffff, alpha: 1 });
      app.stage.addChild(maskShape);

      const gameContainer = new PIXI.Container();
      app.stage.addChild(gameContainer);
      gameContainer.mask = maskShape;

      return () => {
        app.destroy(true, { children: true });
      };
    })();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '75vw',
        height: '75vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default GameBoard;
