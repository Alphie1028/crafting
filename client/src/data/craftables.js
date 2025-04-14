const craftables = [
  {
    name: "Stone Sword",
    id: "stone-sword",
    requires: [
        { type: "rock", count: 10 },
        { type: "wood", count: 5 }
    ],
    gives: { type: "stone sword", count: 1 },
    extra: {
        damage: 5
    }
  }
];

export default craftables;
