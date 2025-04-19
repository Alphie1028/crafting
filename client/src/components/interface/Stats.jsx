import React from 'react';
import './css/Stats.css';

const Stats = ({ stats }) => {
  return (
    <div className="stats-container">
      <h2>Stats</h2>
      <ul className="stats-list">
        <li>HP: {stats.hp}</li>
        <li>Attack: {stats.attack}</li>
        <li>Armor: {stats.armor}</li>
      </ul>
    </div>
  );
};

export default Stats;
