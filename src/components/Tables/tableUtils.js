// Shared utility functions for table rolling and random selection

// Utility functions for rolling dice
export const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

export const rollD6 = () => rollDie(6);
export const rollD8 = () => rollDie(8);
export const rollD10 = () => rollDie(10);
export const rollD12 = () => rollDie(12);
export const rollD20 = () => rollDie(20);
export const rollD100 = () => rollDie(100);

export const getTableResult = (roll, table) => {
  return table.find(entry => {
    if (Array.isArray(entry.roll)) {
      // Handle single-element arrays
      if (entry.roll.length === 1) {
        return roll === entry.roll[0];
      }
      // Handle range arrays (two or more elements)
      return roll >= entry.roll[0] && roll <= entry.roll[entry.roll.length - 1];
    }
    // Handle single number entries
    return roll === entry.roll;
  });
};

export const getRandomArrayItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
