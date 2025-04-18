import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';

const MIN_SLIMES = 3;
const MAX_SLIMES = 6;
const SLIME_COLOR = 0x0000ff;
const SLIME_RADIUS = 15;
const PADDING = 40;
const SLIME_SPEED = 1.2;
const MIN_DISTANCE = SLIME_RADIUS * 2.2;
const PLAYER_RADIUS = 12.5;

const Slimes = ({ app, container, playerPositionRef }) => {
    useEffect(() => {
        if (!app || !container) return;

        const slimes = [];
        const count = Math.floor(Math.random() * (MAX_SLIMES - MIN_SLIMES + 1)) + MIN_SLIMES;

        for (let i = 0; i < count; i++) {
            const slime = new PIXI.Graphics();
            slime.beginFill(SLIME_COLOR);
            slime.drawCircle(0, 0, SLIME_RADIUS);
            slime.endFill();

            slime.x = Math.random() * (app.screen.width  - PADDING * 2 - SLIME_RADIUS * 2) + PADDING + SLIME_RADIUS;
            slime.y = Math.random() * (app.screen.height - PADDING * 2 - SLIME_RADIUS * 2) + PADDING + SLIME_RADIUS;

            container.addChild(slime);
            slimes.push(slime);
        }

        const tickerCb = () => {
            const playerPos = playerPositionRef?.current;
            if (!playerPos) return;

            for (const slime of slimes) {
                const dx = playerPos.x - slime.x;
                const dy = playerPos.y - slime.y;
                const distToPlayer = Math.hypot(dx, dy);

                if (distToPlayer > SLIME_RADIUS + PLAYER_RADIUS + 2) {
                    const angle = Math.atan2(dy, dx);
                    slime.x += Math.cos(angle) * SLIME_SPEED;
                    slime.y += Math.sin(angle) * SLIME_SPEED;
                } else {
                    const repelAngle = Math.atan2(dy, dx);
                    slime.x -= Math.cos(repelAngle) * (SLIME_SPEED * 0.5);
                    slime.y -= Math.sin(repelAngle) * (SLIME_SPEED * 0.5);
                }
            }

            for (let i = 0; i < slimes.length; i++) {
                for (let j = i + 1; j < slimes.length; j++) {
                const a = slimes[i];
                const b = slimes[j];

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.hypot(dx, dy);

                if (dist < MIN_DISTANCE && dist > 0.01) {
                    const overlap = (MIN_DISTANCE - dist) / 2;
                    const angle = Math.atan2(dy, dx);
                    const offsetX = Math.cos(angle) * overlap;
                    const offsetY = Math.sin(angle) * overlap;

                    a.x -= offsetX;
                    a.y -= offsetY;
                    b.x += offsetX;
                    b.y += offsetY;
                }
                }
            }
        };

        app.ticker.add(tickerCb);

        return () => {
            slimes.forEach(s => container.removeChild(s));
            app.ticker.remove(tickerCb);
        };
    }, [app, container, playerPositionRef]);

    return null;
};

export default React.memo(Slimes);