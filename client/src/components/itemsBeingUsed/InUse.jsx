import React from 'react'
import Sword from './items/Sword'

const InUse = ({ app, container, equipment, playerPositionRef, inCave, boardSize }) => {
  console.log('InUse render → inCave:', inCave, 'equipment:', equipment)
  if (!inCave) return null

  const hasStoneSword = equipment.some(item => item.type === 'stone sword')
  console.log('InUse → hasStoneSword?', hasStoneSword)

  return hasStoneSword
    ? <Sword app={app} container={container} playerPositionRef={playerPositionRef} boardSize={boardSize}/>
    : null
}

export default React.memo(InUse)
