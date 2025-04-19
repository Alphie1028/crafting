const craftables = [
  {
    name: "Stone Sword",
    id: "stone-sword",
    requires: [
        { type: "rock", count: 1 },
        { type: "wood", count: 1 }
    ],
    gives: { type: "stone sword", count: 1 },
    extra: {
        damage: 5
    }
  }
];

export default craftables;
