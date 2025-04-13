import React from 'react';
import './css/craftingBox.css';

const CraftingSlots = ({ craftingGrid, setCraftingGrid, draggedItem, setDraggedItem, draggedFrom, setDraggedFrom, onDrop }) => {
    const handleMouseDown = (index, e) => {
        const slot = craftingGrid[index];
        if (!slot.type) return;

        if (e.shiftKey && slot.count > 1) {
            const half = Math.floor(slot.count / 2);
            const remaining = slot.count - half;
            const held = { type: slot.type, count: half };

            setCraftingGrid(prev => {
                const copy = [...prev];
                copy[index].count = remaining;
                return copy;
            });

            setDraggedItem(held);
            setDraggedFrom(null);
        } else {
            setDraggedItem({ ...slot });
            setDraggedFrom({ container: 'crafting', index });
        }
    };

    const handleMouseUp = (index) => {
        onDrop('crafting', index);
    };


    return (
        <div className="crafting-container">
        {craftingGrid.map((slot, index) => (
            <div
            key={index}
            className="crafting-slot"
            onMouseDown={(e) => handleMouseDown(index, e)}
            onMouseUp={() => handleMouseUp(index)}
            >
            {slot.type && (
                <>
                <div className="slot-item">{slot.type}</div>
                <div className="slot-count">{slot.count}</div>
                </>
            )}
            </div>
        ))}
        </div>
    );
};

export default CraftingSlots;