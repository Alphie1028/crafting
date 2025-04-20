import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const VARIANTS = {
  stone: {
    color: 0x808080,
    damage: 5,
    width: 10,
    height: 100,
  },
};

const Sword = ({ app, container, playerPositionRef, variant = 'stone', slimesRef }) => {
  const bladeRef = useRef(null);

  useEffect(() => {
    if (!app || !container) return;

    const variantProps = VARIANTS[variant] || VARIANTS.stone;
    console.log('Sword mounted with props:', variantProps);

    const blade = new PIXI.Graphics();
    blade.beginFill(variantProps.color);
    blade.drawRect(-variantProps.width / 2, -variantProps.height, variantProps.width, variantProps.height);
    blade.endFill();

    blade.pivot.set(0, 0);
    container.addChild(blade);
    bladeRef.current = blade;

    let angle = 0;

    const ticker = () => {
      const { x, y } = playerPositionRef.current;
      blade.x = x;
      blade.y = y;
      blade.rotation = angle;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      if (slimesRef?.current) {
        for (let i = slimesRef.current.length - 1; i >= 0; i--) {
          const slime = slimesRef.current[i];

          const dx = slime.x - x;
          const dy = slime.y - y;

          const localX = cos * dx + sin * dy;
          const localY = -sin * dx + cos * dy;

          const withinX = localX >= -variantProps.width / 2 && localX <= variantProps.width / 2;
          const withinY = localY >= -variantProps.height && localY <= 0;

          if (withinX && withinY) {
            console.log(`Hit slime ${i}!`);
            container.removeChild(slime);
            slimesRef.current.splice(i, 1);
          }
        }
      }

      angle += 0.1;
    };


    app.ticker.add(ticker);

    return () => {
      app.ticker.remove(ticker);
      if (bladeRef.current) {
        container.removeChild(blade);
        blade.destroy();
      }
    };
  }, [app, container, playerPositionRef, variant, slimesRef]);

  return null;
};

export default React.memo(Sword);
