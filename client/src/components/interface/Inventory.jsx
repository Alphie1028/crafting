import React from 'react';

const Inventory = () => {
  const slotCount = 20;
  const rows = 2;
  const columns = 10;

  const slots = Array.from({ length: slotCount }, (_, index) => (
    <div key={index} className="inventory-slot" />
  ));

  return (
    <div className="inventory-container">
      {slots}
    </div>
  );
};

export default Inventory;
