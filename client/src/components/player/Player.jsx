import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const SPEED = 5;

function willCollide(nextX, nextY, rects) {
    const playerBounds = new PIXI.Rectangle(nextX - 12.5, nextY - 12.5, 25, 25);
    return rects.some(rect => rect.intersects(playerBounds));
}

const Player = ({ app, container, collisionRects, registerGoToHandler, addToInventory, playerPositionRef, boardSize }) => {
    const playerRef = useRef(null);
    const goTo = useRef(null);
    const isBouncingBack = useRef(false);
    const bounceVector = useRef({ dx: 0, dy: 0 });
    const bounceSpeed = useRef(SPEED * 2);
    const bounceDistanceRemaining = useRef(0);

    useEffect(() => {
        if (registerGoToHandler) {
            registerGoToHandler(({ x, y, target }) => {
                goTo.current = { x, y, target };
                isBouncingBack.current = false;
            });
        }
    }, [registerGoToHandler]);

    useEffect(() => {
        if (!app || !container) return;

        const player = new PIXI.Graphics();
        player.beginFill(0xff0000);
        player.drawRect(0, 0, 25, 25);
        player.endFill();
        player.pivot.set(12.5, 12.5);

        player.x = 0
        player.y = 0
        container.addChild(player);
        playerRef.current = player;

        const keys = {};
        const handleKeyDown = (e) => { keys[e.key.toLowerCase()] = true; };
        const handleKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        app.ticker.add((delta) => {
            if (!playerRef.current) return;
            const player = playerRef.current;
            
            playerPositionRef.current = {
                x: player.x,
                y: player.y,
            };
            
            let dx = 0;
            let dy = 0;

            if (keys['w']) dy -= SPEED;
            if (keys['s']) dy += SPEED;
            if (keys['a']) dx -= SPEED;
            if (keys['d']) dx += SPEED;
            if ((dx !== 0 || dy !== 0) && goTo.current && !isBouncingBack.current) {
                goTo.current = null;
            }

            if (isBouncingBack.current) {
                dx = bounceVector.current.dx * bounceSpeed.current;
                dy = bounceVector.current.dy * bounceSpeed.current;
                bounceDistanceRemaining.current -= bounceSpeed.current;

                if (bounceDistanceRemaining.current <= 0) {
                    isBouncingBack.current = false;
                }
            }

            if (goTo.current && !isBouncingBack.current) {
                const { x, y, target } = goTo.current;
                const distX = x - player.x;
                const distY = y - player.y;
                const dist = Math.hypot(distX, distY);

                const angle = Math.atan2(distY, distX);
                dx = Math.cos(angle) * SPEED * 2;
                dy = Math.sin(angle) * SPEED * 2;

                const globalPlayer = player.parent.toGlobal(player.position);
                const playerBounds = new PIXI.Rectangle(globalPlayer.x - 12.5, globalPlayer.y - 12.5, 25, 25);

                const globalX = target.parent.toGlobal(target.position).x;
                const globalY = target.parent.toGlobal(target.position).y;

                const size = target.size ?? 10;

                const targetBounds = new PIXI.Rectangle(
                globalX - 6,
                globalY - 6,
                size + 12,
                size + 12
                );


                if (playerBounds.intersects(targetBounds)) {
                    bounceVector.current = {
                        dx: -Math.cos(angle),
                        dy: -Math.sin(angle),
                    };
                    bounceDistanceRemaining.current = 100;
                    bounceSpeed.current = SPEED * 2;
                    isBouncingBack.current = true;

                if (!target.isFlashing && typeof target.clear === 'function') {
                target.isFlashing = true;

                const flashColor = 0xffff00;
                const originalColor = target.baseColor ?? 0x808080;
                const size = target.size ?? 10;

                try {
                    target.clear();
                    target.beginFill(flashColor);
                    const height = target.flashHeight ?? size;
                    target.drawRect(0, 0, size, height);

                    target.endFill();
                } catch (e) {
                    console.warn('Failed to flash target initially:', e);
                }

                setTimeout(() => {
                    if (!target.destroyed && typeof target.clear === 'function') {
                    try {
                        target.clear();
                        target.beginFill(originalColor);
                        const height = target.flashHeight ?? size;
                        target.drawRect(0, 0, size, height);

                        target.endFill();
                    } catch (e) {
                        console.warn('Failed to restore target after flash:', e);
                    }
                    }
                    target.isFlashing = false;
                }, 200);
                }

                const parent = target.parent;

                if (target.targetType === 'rock') {
                    const cluster = target.parent;

                    target.quantity -= 1;
                    cluster.totalRock -= 1;
                    addToInventory?.('rock', 1);
                    console.log(`Rock hit: quantity = ${target.quantity}, total = ${cluster.totalRock}`);

                    if (target.quantity <= 0) {
                        cluster.removeChild(target);
                        target.destroy();
                        cluster.rocks = cluster.rocks.filter(r => r !== target);
                        console.log('Rock depleted and removed');
                    }

                    if (cluster.totalRock <= 0) {
                        container.removeChild(cluster);
                        cluster.destroy({ children: true });
                        console.log('Entire cluster depleted and removed');
                    }
                }
                if (target.targetType === 'tree') {
                    const tree = target.parent;
                    tree.custom.wood -= 1;
                    addToInventory?.('wood', 1);
                    console.log(`Tree hit: remaining wood = ${tree.custom.wood}`);

                    if (tree.custom.wood <= 0) {
                        container.removeChild(tree);
                        tree.destroy({ children: true });
                        console.log('Tree depleted and removed');
                    }
                }
                goTo.current = null;
            }
        }

            const half = boardSize / 2;
            const minX = -half + 12.5;
            const maxX =  half - 12.5;
            const minY = -half + 12.5;
            const maxY =  half - 12.5;

            const nextX = Math.max(minX, Math.min(maxX, player.x + dx));
            const nextY = Math.max(minY, Math.min(maxY, player.y + dy));

        if (!collisionRects || !willCollide(nextX, nextY, collisionRects)) {
            player.x = nextX;
            player.y = nextY;
        }
    });

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        container.removeChild(player);
    }; }, [app, container, collisionRects]);

    return null;
};

export default React.memo(Player);