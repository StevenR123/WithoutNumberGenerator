// Armor generation tables and data for the Generators Without Number armor generator

import { rollDie, rollD20, rollD100, getTableResult, getRandomArrayItem } from './tableUtils';

export const armorIcons = ['🛡️', '⚔️', '🧙‍♂️', '✨', '🔮', '👑', '💎', '🏺', '📿', '🗡️'];

// Armor Enchantment Bonus Tables
export const minorArmorEnchantmentTable = [
  { roll: [1, 16], bonus: '+1', description: 'Minor enchantment +1' },
  { roll: [17, 19], bonus: '+2', description: 'Minor enchantment +2' },
  { roll: [20, 20], bonus: '+3', description: 'Minor enchantment +3' }
];

export const majorArmorEnchantmentTable = [
  { roll: [1, 5], bonus: '+1', description: 'Major enchantment +1' },
  { roll: [6, 17], bonus: '+2', description: 'Major enchantment +2' },
  { roll: [18, 20], bonus: '+3', description: 'Major enchantment +3' }
];

export const greatArmorEnchantmentTable = [
  { roll: [1, 1], bonus: '+1', description: 'Great enchantment +1' },
  { roll: [2, 4], bonus: '+2', description: 'Great enchantment +2' },
  { roll: [5, 20], bonus: '+3', description: 'Great enchantment +3' }
];

// Special Abilities Count Tables
export const minorSpecialAbilitiesTable = [
  { roll: [1, 16], count: 0, description: 'No special abilities' },
  { roll: [17, 19], count: 0, description: 'No special abilities' },
  { roll: [20, 20], count: 1, description: 'One special ability' }
];

export const majorSpecialAbilitiesTable = [
  { roll: [1, 16], count: 0, description: 'No special abilities' },
  { roll: [17, 19], count: 1, description: 'One special ability' },
  { roll: [20, 20], count: 2, description: 'Two special abilities' }
];

export const greatSpecialAbilitiesTable = [
  { roll: [1, 16], count: 1, description: 'One special ability' },
  { roll: [17, 19], count: 2, description: 'Two special abilities' },
  { roll: [20, 20], count: 3, description: 'Three special abilities' }
];

// Armor Type Table
export const armorTypeTable = [
  { roll: [1, 1], type: 'War Shirt', ac: 7, encumbrance: 1 },
  { roll: [2, 4], type: 'Buff Coat', ac: 8, encumbrance: 1 },
  { roll: [5, 6], type: 'Linothorax', ac: 9, encumbrance: 1 },
  { roll: [7, 8], type: 'War Robe', ac: 9, encumbrance: 0 },
  { roll: [9, 9], type: 'Pieced Armor', ac: 10, encumbrance: 1 },
  { roll: [10, 11], type: 'Mail Shirt', ac: 11, encumbrance: 1 },
  { roll: [12, 13], type: 'Cuirass and Greaves', ac: 12, encumbrance: 1 },
  { roll: [14, 15], type: 'Scaled Armor', ac: 13, encumbrance: 2 },
  { roll: [16, 17], type: 'Mail Hauberk', ac: 13, encumbrance: 2 },
  { roll: [18, 18], type: 'Plate Armor', ac: 15, encumbrance: 2 },
  { roll: [19, 19], type: 'Great Armor', ac: 16, encumbrance: 3 },
  { roll: [20, 20], type: 'Grand Plate', ac: 17, encumbrance: 3 }
];

// Shield Type Table
export const shieldTypeTable = [
  { roll: [1, 5], type: 'Small Shield', acBonus: 1, encumbrance: 1 },
  { roll: [6, 20], type: 'Large Shield', acBonus: 2, encumbrance: 2 }
];

// Magical Armor and Shield Abilities Table
export const magicalAbilitiesTable = [
  { roll: [1, 4], ability: 'Augmented', description: 'The bearer can carry four more points of Readied encumbrance. Once per scene, they can lift or briefly manipulate with brute strength anything a human possibly could.' },
  { roll: [5, 8], ability: 'Bracing', description: 'As a Move Action, the bearer can brace against one specific foe. Until they voluntarily move from their location, they\'re immune to Shock from that foe and cannot be forcibly moved.' },
  { roll: [9, 12], ability: 'Clotting', description: 'Once per day, it automatically stabilizes a Mortally Wounded bearer.' },
  { roll: [13, 16], ability: 'Feathery', description: 'The user is immune to falling damage and can choose a landing site within 30 feet of their target.' },
  { roll: [17, 20], ability: 'Feral', description: 'At the cost of one System Strain, the bearer can talk to animals for a scene, who will reply with human intellect but bestial interests and focus.' },
  { roll: [21, 24], ability: 'Fireproof', description: 'The bearer ignores the first 10 points of fire or heat damage they suffer each round.' },
  { roll: [25, 28], ability: 'Fortified', description: 'The bearer ignores the first point of System Strain they\'d otherwise incur in a day.' },
  { roll: [29, 32], ability: 'Graceful', description: 'The bearer walks so lightly as to leave no footprints and cannot slip, trip, or be subject to forced movement by a man-sized foe.' },
  { roll: [33, 36], ability: 'Harmonic', description: 'An allied mage can cast a spell on it; the bearer is then immune to that spell until it is changed.' },
  { roll: [37, 40], ability: 'Impervious', description: 'Once per round, the bearer ignores an instance of Shock they would otherwise have suffered.' },
  { roll: [41, 44], ability: 'Inspiring', description: 'Allies who can see the wearer gain a +1 Morale bonus and may reroll failed Mental saves against emotion or thought-controlling effects.' },
  { roll: [45, 48], ability: 'Lucky', description: 'Once per day, as an Instant action, turn a failed save into a success.' },
  { roll: [49, 52], ability: 'Majestic', description: 'Its magnificent appearance makes it socially acceptable wear in any situation or context.' },
  { roll: [53, 56], ability: 'Sealed', description: 'The bearer ignores toxic atmospheres, terrestrial temperature extremes, and has no need to breathe.' },
  { roll: [57, 60], ability: 'Shifting', description: 'The bearer can teleport up to 30\' to a visible location as a Move action.' },
  { roll: [61, 64], ability: 'Shining', description: 'It can emit light in a 30\' radius at will. Once per day as an On Turn action, force a melee foe to make a Physical save or lose their next Main Action from being dazzled.' },
  { roll: [65, 68], ability: 'Silent', description: 'It applies no penalty to Sneak skill checks. If light armor or a shield, it grants a +1 bonus to the checks.' },
  { roll: [69, 72], ability: 'Soaring', description: 'As a Main Action, the bearer can move twice their movement rate through the air. They\'ll fall if they end the turn on an unsupported surface.' },
  { roll: [73, 76], ability: 'Sustaining', description: 'Once per day, cause the bearer to gain a point of System Strain and lose all need for sleep, food, air, or drink for the next 24 hours.' },
  { roll: [77, 80], ability: 'Thorned', description: 'Successful grapple, unarmed or natural weapon attacks against them also inflict 1d6 damage on the attacker, plus any armor enhancement bonus.' },
  { roll: [81, 84], ability: 'Transient', description: 'It can vanish from its wearer or return to their person as an On Turn action once per round. It appears if they fall unconscious or die.' },
  { roll: [85, 88], ability: 'Unsleeping', description: 'The bearer need not sleep, but will not get the benefits of a night\'s rest unless they do so.' },
  { roll: [89, 92], ability: 'Vigilant', description: 'The bearer can see normally even in deep mists or total darkness. They cannot be surprised.' },
  { roll: [93, 96], ability: 'Warded', description: 'The GM chooses one weapon entry from the table on page 37. Non-magic weapons of that kind can\'t hurt the bearer, and magic ones do only half damage, rounded down. Neither inflicts Shock.' },
  { roll: [97, 100], ability: 'Weightless', description: 'It has no Encumbrance, but this benefit does not apply to the Armored Magic Focus\' limits or the armor\'s usual skill check penalties.' }
];

// Helper functions for armor generation
export function rollArmorEnchantment(rarity = 'minor') {
  const roll = rollD20();
  let table;
  
  switch (rarity.toLowerCase()) {
    case 'major':
      table = majorArmorEnchantmentTable;
      break;
    case 'great':
      table = greatArmorEnchantmentTable;
      break;
    default:
      table = minorArmorEnchantmentTable;
      break;
  }
  
  return getTableResult(table, roll);
}

export function rollSpecialAbilitiesCount(rarity = 'minor') {
  const roll = rollD20();
  let table;
  
  switch (rarity.toLowerCase()) {
    case 'major':
      table = majorSpecialAbilitiesTable;
      break;
    case 'great':
      table = greatSpecialAbilitiesTable;
      break;
    default:
      table = minorSpecialAbilitiesTable;
      break;
  }
  
  return getTableResult(table, roll);
}

export function rollArmorType() {
  const roll = rollD20();
  return getTableResult(armorTypeTable, roll);
}

export function rollShieldType() {
  const roll = rollD20();
  return getTableResult(shieldTypeTable, roll);
}

export function rollMagicalAbility() {
  const roll = rollD100();
  return getTableResult(magicalAbilitiesTable, roll);
}

export function generateMagicalArmor(rarity = 'minor', itemType = 'armor') {
  let result = {
    type: itemType,
    rarity: rarity,
    icon: getRandomArrayItem(armorIcons)
  };
  
  if (itemType === 'shield') {
    // Shields never have enchantment bonus but always have special abilities
    result.baseItem = rollShieldType();
    result.enchantmentBonus = null;
    result.specialAbilities = [rollMagicalAbility()];
  } else {
    // Regular armor
    result.baseItem = rollArmorType();
    result.enchantmentBonus = rollArmorEnchantment(rarity);
    
    const abilitiesCount = rollSpecialAbilitiesCount(rarity);
    result.specialAbilities = [];
    
    for (let i = 0; i < abilitiesCount.count; i++) {
      let ability;
      do {
        ability = rollMagicalAbility();
      } while (result.specialAbilities.some(existing => existing.ability === ability.ability));
      
      result.specialAbilities.push(ability);
    }
  }
  
  return result;
}
