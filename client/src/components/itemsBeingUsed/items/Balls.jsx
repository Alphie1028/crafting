import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import lootables from '../../../data/lootables';

const COLORS = {
  'fire-ball': 0xff6600,
  'ice-ball': 0x66ccff
};

const Balls = ({ app, container, playerPositionRef, equipment, slimesRef }) => {
  const ballsRef = useRef([]);
  const bulletsRef = useRef([]);

  useEffect(() => {
    if (!app || !container) return;
    console.log('[Balls] useEffect fired; equipment =', equipment);
    ballsRef.current = [];
    bulletsRef.current = [];

    const variants = equipment
      .map(eq => lootables.find(l => l.id === eq.type))
      .filter(v => v && (v.id === 'fire-ball' || v.id === 'ice-ball'));
    console.log('[Balls] mapped variants:', variants);

   if (!variants.length) {
     console.warn('[Balls] no fire/ice balls equipped, nothing to render');
     return;
   }

    variants.forEach((variant, index) => {
      const g = new PIXI.Graphics();
      g.beginFill(COLORS[variant.id]).drawCircle(0, 0, 8).endFill();
      g.variant = variant;
      container.addChild(g);
      ballsRef.current.push(g);
    });

    const shootInterval = setInterval(() => {
      ballsRef.current.forEach((ball, i) => {
        const slimes = slimesRef.current.filter(s => !s.frozenUntil);
        if (!slimes.length) return;

        const closest = slimes.reduce((a, b) => {
          const d1 = Math.hypot(a.x - ball.x, a.y - ball.y);
          const d2 = Math.hypot(b.x - ball.x, b.y - ball.y);
          return d1 < d2 ? a : b;
        });

        const dx = closest.x - ball.x;
        const dy = closest.y - ball.y;
        const dist = Math.hypot(dx, dy);
        const speed = ball.variant.extra.speed;

        const bullet = new PIXI.Graphics();
        bullet.beginFill(COLORS[ball.variant.id]).drawCircle(0, 0, 8).endFill();
        bullet.x = ball.x;
        bullet.y = ball.y;
        bullet.vx = (dx / dist) * speed;
        bullet.vy = (dy / dist) * speed;
        bullet.variant = ball.variant;

        container.addChild(bullet);
        bulletsRef.current.push(bullet);
      });
    }, 1000);

    const ticker = () => {
      const player = playerPositionRef.current;
      const spacing = Math.PI * 2 / ballsRef.current.length;

      ballsRef.current.forEach((ball, idx) => {
        const angle = spacing * idx;
        ball.x = player.x + Math.cos(angle) * 20;
        ball.y = player.y + Math.sin(angle) * 20;
      });

      bulletsRef.current.forEach((b, i) => {
        b.x += b.vx;
        b.y += b.vy;

        if (Math.abs(b.x) > app.screen.width / 2 || Math.abs(b.y) > app.screen.height / 2) {
          container.removeChild(b);
          bulletsRef.current.splice(i, 1);
          return;
        }

        const hit = slimesRef.current.find(s => Math.hypot(s.x - b.x, s.y - b.y) < 15);
        if (hit) {
          if (b.variant.id === 'fire-ball') {
            hit.hp -= b.variant.extra.damage;
          } else if (b.variant.id === 'ice-ball') {
            hit.frozenUntil = performance.now() + (b.variant.extra.freeze * 1000);
            hit.tint = COLORS['ice-ball'];
          }

          if (hit.hp <= 0) {
            container.removeChild(hit);
            const idx = slimesRef.current.indexOf(hit);
            if (idx !== -1) slimesRef.current.splice(idx, 1);
          }

          container.removeChild(b);
          bulletsRef.current.splice(i, 1);
        }
      });

      const now = performance.now();
      slimesRef.current.forEach(slime => {
        if (slime.frozenUntil && now > slime.frozenUntil) {
          slime.frozenUntil = null;
          slime.tint = 0xffffff;
        }
      });
    };

    app.ticker.add(ticker);

    return () => {
      clearInterval(shootInterval);
      app.ticker.remove(ticker);
      ballsRef.current.forEach(b => container.removeChild(b));
      bulletsRef.current.forEach(b => container.removeChild(b));
    };
  }, [app, container, equipment, playerPositionRef, slimesRef]);

  return null;
};

export default React.memo(Balls);
