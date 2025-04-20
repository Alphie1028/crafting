import React from 'react';
import Sword from './items/Sword';
import Balls from './items/Balls';

const InUse = ({ app, container, equipment, playerPositionRef, inCave, boardSize, slimesRef }) => {
  if (!inCave) return null;

  const hasStoneSword = equipment.some(item => item.type === 'stone sword');
  const hasBalls = equipment.some(item =>
    item.type === 'fire-ball' || item.type === 'ice-ball'
  );

  return (
    <>
      {hasStoneSword && (
        <Sword
          app={app}
          container={container}
          playerPositionRef={playerPositionRef}
          boardSize={boardSize}
          slimesRef={slimesRef}
        />
      )}
      {hasBalls && (
        <Balls
          app={app}
          container={container}
          playerPositionRef={playerPositionRef}
          equipment={equipment}
          slimesRef={slimesRef}
        />
      )}
    </>
  );
};

export default React.memo(InUse);
