import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

const GameBoard = ({ children }) => {
  const containerRef = useRef(null);
  const [app, setApp] = useState(null);
  const [gameContainer, setGameContainer] = useState(null);

  useEffect(() => {
    (async () => {
      const size = window.innerWidth * 0.75;
      const canvas = document.createElement('canvas');

      const appInstance = new PIXI.Application();
      await appInstance.init({
        canvas,
        width: size,
        height: size,
        backgroundColor: 0xD3D3D3,
        resolution: window.devicePixelRatio || 1,
      });

      if (containerRef.current) {
        containerRef.current.appendChild(canvas);
      }

      const boardBounds = { x: 0, y: 0, width: size, height: size };

      const border = new PIXI.Graphics();
      border.setStrokeStyle({
        width: 10,
        color: 0x000000,
        alpha: 1,
        alignment: 0.5,
      });
      border.rect(boardBounds.x, boardBounds.y, boardBounds.width, boardBounds.height);
      border.stroke();
      appInstance.stage.addChild(border);

      const gameContainerInstance = new PIXI.Container();
      appInstance.stage.addChild(gameContainerInstance);

      const maskShape = new PIXI.Graphics();
      maskShape.rect(boardBounds.x, boardBounds.y, boardBounds.width, boardBounds.height);
      maskShape.fill({ color: 0xffffff });
      maskShape.alpha = 0.001;
      appInstance.stage.addChild(maskShape);
      gameContainerInstance.mask = maskShape;

      setApp(appInstance);
      setGameContainer(gameContainerInstance);

      return () => {
        appInstance.destroy(true, { children: true });
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
    >
      {app && gameContainer && React.Children.map(children, (child) =>
        React.cloneElement(child, { app, container: gameContainer })
      )}
    </div>
  );
};

export default GameBoard;
