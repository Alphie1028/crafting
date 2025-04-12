import React, { useState, useEffect } from 'react';

const Inventory = ({ inventory, setInventory }) => {
    const [draggedItem, setDraggedItem] = useState(null);
    const [draggedFrom, setDraggedFrom] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleMouseDown = (index, e) => {
        const slot = inventory[index];
        if (!slot.type) return;

        if (e.shiftKey && slot.count > 1) {
        const half = Math.floor(slot.count / 2);
        const remaining = slot.count - half;
        const held = { type: slot.type, count: half };

        setInventory(prev => {
            const copy = [...prev];
            copy[index].count = remaining;
            return copy;
        });

        setDraggedItem(held);
        setDraggedFrom(null);
        } else {
        setDraggedItem({ ...slot });
        setDraggedFrom(index);
        }
    };

    const handleMouseUp = (index) => {
        if (draggedItem && draggedFrom !== null) {
        setInventory(prev => {
            const copy = [...prev];
            const targetSlot = copy[index];

            if (!targetSlot.type) {
            copy[index] = draggedItem;
            copy[draggedFrom] = { type: null, count: 0 };
            } else if (targetSlot.type === draggedItem.type && targetSlot.count < 50) {
            const space = 50 - targetSlot.count;
            const transfer = Math.min(space, draggedItem.count);
            targetSlot.count += transfer;
            draggedItem.count -= transfer;

            if (draggedItem.count <= 0) {
                copy[draggedFrom] = { type: null, count: 0 };
            } else {
                copy[draggedFrom] = draggedItem;
            }
            }

            return copy;
        });

        setDraggedItem(null);
        setDraggedFrom(null);
        } else if (draggedItem && draggedFrom === null) {
        setInventory(prev => {
            const copy = [...prev];
            const targetSlot = copy[index];

            if (!targetSlot.type) {
            copy[index] = draggedItem;
            } else if (targetSlot.type === draggedItem.type && targetSlot.count < 50) {
            const space = 50 - targetSlot.count;
            const transfer = Math.min(space, draggedItem.count);
            targetSlot.count += transfer;
            draggedItem.count -= transfer;

            if (draggedItem.count > 0) {
                setDraggedItem({ ...draggedItem });
                return copy;
            }
            }

            return copy;
        });

        setDraggedItem(null);
        setDraggedFrom(null);
        }
    };

    const handleWheel = (e, index) => {
        if (!e.shiftKey || !draggedItem) return;
        const direction = Math.sign(e.deltaY);

        setInventory(prev => {
        const copy = [...prev];
        const slot = copy[index];

        if (direction > 0) {
            // Scroll down: held item -> hovered slot
            if ((slot.type === draggedItem.type || !slot.type) && draggedItem.count > 0) {
            if (!slot.type) slot.type = draggedItem.type;
            if (slot.count < 50) {
                slot.count += 1;
                draggedItem.count -= 1;
                setDraggedItem(draggedItem.count > 0 ? { ...draggedItem } : null);
            }
            }
        } else if (direction < 0) {
            // Scroll up: hovered slot -> held item
            if (slot.type === draggedItem.type && slot.count > 0 && draggedItem.count < 50) {
            slot.count -= 1;
            draggedItem.count += 1;
            if (slot.count === 0) slot.type = null;
            setDraggedItem({ ...draggedItem });
            }
        }

        return copy;
        });
    };

    return (
        <div className="inventory-container">
        {inventory.map((slot, index) => (
            <div
            key={index}
            className="inventory-slot"
            onMouseDown={(e) => handleMouseDown(index, e)}
            onMouseUp={() => handleMouseUp(index)}
            onWheel={(e) => handleWheel(e, index)}
            >
            {slot.type && (
                <>
                <div className="slot-item">{slot.type}</div>
                <div className="slot-count">{slot.count}</div>
                </>
            )}
            </div>
        ))}

        {draggedItem && (
            <div
            className="floating-item"
            style={{
                position: 'fixed',
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
                pointerEvents: 'none',
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '4px 8px',
                border: '1px solid #333',
                borderRadius: '4px',
                zIndex: 1000,
                width: '60px',
                textAlign: 'center',
                transform: 'translate(-575px, -1610px)'
            }}
            >
            <div>{draggedItem.type}</div>
            <div>{draggedItem.count}</div>
            </div>
        )}
        </div>
    );
};

export default Inventory;