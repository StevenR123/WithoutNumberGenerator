// Shared utility functions for table rolling and random selection

// Utility functions for rolling dice
export const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

export const rollD6 = () => rollDie(6);
export const rollD8 = () => rollDie(8);
export const rollD10 = () => rollDie(10);
export const rollD12 = () => rollDie(12);
export const rollD20 = () => rollDie(20);

export const getTableResult = (roll, table) => {
  return table.find(entry => {
    if (Array.isArray(entry.roll)) {
      return entry.roll.includes(roll);
    }
    return entry.roll === roll;
  });
};

export const getRandomArrayItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
