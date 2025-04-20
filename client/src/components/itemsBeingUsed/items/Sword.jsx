import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const VARIANTS = {
  stone: {
    color: 0x808080,
    damage: 5,
    width: 5,
    height: 30,
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

      const tipX = x + Math.cos(angle) * variantProps.height;
      const tipY = y + Math.sin(angle) * variantProps.height;

      if (slimesRef?.current) {
        for (let i = slimesRef.current.length - 1; i >= 0; i--) {
          const slime = slimesRef.current[i];
          const dx = tipX - slime.x;
          const dy = tipY - slime.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 15 + variantProps.width / 2) {
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
