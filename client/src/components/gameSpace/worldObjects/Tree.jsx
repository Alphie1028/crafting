import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';

const Tree = ({ app, container, collisionRects, onGoToTarget }) => {
    useEffect(() => {
    if (!app || !container) return;

        const trees = [];
        const treeCount = Math.floor(Math.random() * 10) + 5;

        for (let i = 0; i < treeCount; i++) {
            const tree = new PIXI.Container();

            tree.custom = { wood: Math.floor(Math.random() * 6) + 5 };


            const leafSize = 16;
            const leafPositions = [
                [-8, -24], [0, -24], [8, -24],
                [-12, -12], [-4, -12], [4, -12], [12, -12],
                [-8, 0], [0, 0], [8, 0]
            ];

            for (const [dx, dy] of leafPositions) {
                const leaf = new PIXI.Graphics();
                leaf.beginFill(0x228B22); // green
                leaf.drawRect(0, 0, leafSize, leafSize);
                leaf.endFill();
                leaf.x = dx;
                leaf.y = dy - 12;
                tree.addChild(leaf);
            }

            const trunk = new PIXI.Graphics();
            trunk.beginFill(0x8B4513);
            trunk.drawRect(0, 0, 13, 40);
            trunk.endFill();
            trunk.x = -4.5;
            trunk.y = 0;
            tree.addChild(trunk);

            const padding = 40;
            const x = Math.random() * (app.screen.width - padding * 2) + padding;
            const y = Math.random() * (app.screen.height - padding * 2) + padding;

            tree.x = x;
            tree.y = y;

            const hitbox = new PIXI.Rectangle(x - 4.5, y, 13, 40);
            if (Array.isArray(collisionRects)) {
                collisionRects.push(hitbox);
            }

            container.addChild(tree);
            trees.push(tree);
            trunk.interactive = true;
            trunk.buttonMode = true;
            const bounds = tree.getLocalBounds();
            tree.hitArea = new PIXI.Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);

            trunk.targetType = 'tree';
            trunk.baseColor = 0x8B4513;
            trunk.flashHeight = 40;

            trunk.size = 13;
            trunk.on('pointerdown', () => {
                onGoToTarget?.({
                x: tree.x + trunk.x,
                y: tree.y + trunk.y,
                target: trunk,
                });
            });
        }

        return () => {
            for (const tree of trees) {
                container.removeChild(tree);
            }
        };
    }, [app, container, collisionRects, onGoToTarget]);

    return null;
};

export default React.memo(Tree);
