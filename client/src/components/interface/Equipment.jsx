import React from 'react';
import './css/equipment.css';

const Equipment = ({equipment, draggedItem, setDraggedItem, draggedFrom, setDraggedFrom, onDrop, }) => {
  const handleMouseDown = (slot, index) => {
    setDraggedItem({ ...slot });
    setDraggedFrom({ container: 'equipment', index });
  };

  const handleContainerMouseUp = () => {
    onDrop('equipment');
  };

  const handleSlotMouseUp = (index) => {
    onDrop('equipment-slot', index);
  };

  return (
    <div
      className="equipment-container"
      onMouseUp={handleContainerMouseUp}
    >
      <h2>Equipment</h2>
      <div className="equipment-slots">
        {equipment.map((slot, idx) => (
          <div
            key={idx}
            className="equipment-slot"
            onMouseDown={() => handleMouseDown(slot, idx)}
            onMouseUp={() => handleSlotMouseUp(idx)}
          >
            <div className="slot-item">{slot.type}</div>
            {slot.count > 1 && (
              <div className="slot-count">{slot.count}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipment;
