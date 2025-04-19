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

const Sword = ({ app, container, playerPositionRef, variant = 'stone' }) => {
  const bladeRef = useRef(null);

  useEffect(() => {
    if (!app || !container) return;

    const variantProps = VARIANTS[variant] || VARIANTS.stone;
    console.log('🔪 Sword mounted with props:', variantProps);

    const blade = new PIXI.Graphics();
    blade.beginFill(variantProps.color);
    blade.drawRect(-variantProps.width / 2, 0, variantProps.width, variantProps.height);
    blade.endFill();

    blade.pivot.set(0, 0);

    container.addChild(blade);
    bladeRef.current = blade;

    const ticker = () => {
      const { x, y } = playerPositionRef.current;
      blade.x = x;
      blade.y = y;
    };

    app.ticker.add(ticker);

    return () => {
      app.ticker.remove(ticker);
      if (bladeRef.current) {
        container.removeChild(blade);
        blade.destroy();
      }
    };
  }, [app, container, playerPositionRef, variant]);

  return null;
};

export default React.memo(Sword);
