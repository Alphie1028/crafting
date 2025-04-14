import React, { useMemo } from 'react';
import craftables from '../../../data/craftables';
import '../css/craftingBox.css';

const CraftingListModal = ({ craftingGrid, setCraftingGrid, inventory, setInventory }) => {
    const craftingCounts = useMemo(() => {
        const counts = {};
        for (const slot of craftingGrid) {
        if (slot.type) {
            counts[slot.type] = (counts[slot.type] || 0) + slot.count;
        }
        }
        return counts;
    }, [craftingGrid]);

    const getAvailableSlotIndex = () => {
        return inventory.findIndex(slot => slot.type === null);
    };

    const canCraft = (recipe) => {
        return recipe.requires.every(req => (craftingCounts[req.type] || 0) >= req.count);
    };

    const craftItem = (recipe) => {
        if (!canCraft(recipe)) return;
        const slotIndex = getAvailableSlotIndex();
        if (slotIndex === -1) return;

        const newCraftingGrid = craftingGrid.map(slot => ({ ...slot }));
        for (const req of recipe.requires) {
        let remaining = req.count;
        for (const slot of newCraftingGrid) {
            if (slot.type === req.type && remaining > 0) {
            const used = Math.min(slot.count, remaining);
            slot.count -= used;
            if (slot.count === 0) slot.type = null;
            remaining -= used;
            }
        }
        }

        setCraftingGrid(newCraftingGrid);
        const newInventory = [...inventory];
        newInventory[slotIndex] = {
        type: recipe.gives.type,
        count: recipe.gives.count
        };
        setInventory(newInventory);
    };

    const craftableOptions = useMemo(() => {
        return craftables
        .filter(recipe => canCraft(recipe))
        .map(recipe => ({
            ...recipe,
            disabled: getAvailableSlotIndex() === -1
        }));
    }, [craftingCounts, inventory]);

    if (!Object.values(craftingCounts).some(count => count > 0)) return null;

    return (
        <div style={{
        position: 'absolute',
        right: '2vw',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: '#eee',
        padding: '1vh',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1vh',
        zIndex: 3
        }}>
        {craftableOptions.map(option => (
            <button
            key={option.id}
            onClick={() => craftItem(option)}
            disabled={option.disabled}
            style={{
                padding: '1vh 2vw',
                backgroundColor: option.disabled ? '#aaa' : '#aaa',
                color: option.disabled ? '#666' : '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: option.disabled ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease'
            }}
            >
            {option.name} x{option.gives.count}
            </button>
        ))}
        </div>
    );
};

export default CraftingListModal;
