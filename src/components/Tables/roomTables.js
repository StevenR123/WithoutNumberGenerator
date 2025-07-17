// Room generation tables and data for the Generators Without Number dungeon generator

import { rollDie, rollD6, rollD8, rollD12, rollD20, getTableResult, getRandomArrayItem } from './tableUtils';

export const exitTable = [
  { roll: [1, 2], exits: 'One' },
  { roll: [3, 4], exits: 'Two' },
  { roll: [5, 6, 7], exits: 'Three' },
  { roll: [8], exits: 'Four' }
];

export const directionTable = [
  { roll: [1, 2], direction: 'North' },
  { roll: [3], direction: 'Northeast' },
  { roll: [4, 5], direction: 'East' },
  { roll: [6], direction: 'Southeast' },
  { roll: [7, 8], direction: 'South' },
  { roll: [9], direction: 'Southwest' },
  { roll: [10, 11], direction: 'West' },
  { roll: [12], direction: 'Northwest' }
];

export const contentsTable = [
  { roll: [1, 2], content: 'Creature', treasureChance: [1, 2, 3] },
  { roll: [3], content: 'Hazard', treasureChance: [1, 2] },
  { roll: [4], content: 'Enigma', treasureChance: [1, 2] },
  { roll: [5, 6], content: 'Distractor', treasureChance: [1] },
  { roll: [7, 8], content: 'Empty', treasureChance: [1] }
];

export const hazardTypes = [
  'Tripwire alarm or other alerts',
  'Unstable floor that crumbles under weight',
  'Dangerous fumes or miasma',
  'Trapped containers or portals',
  'Explosive dust or gases',
  'An object makes a loud noise if disturbed',
  'Damaged supports that give way in combat',
  'Dangerously high or deep water',
  'Trap set on a path of travel',
  'Device here is dangerously broken in use',
  'Trap that seals intruders into an area',
  'Treacherous footing over dangerous terrain',
  'Uncontrolled flames or dangerous heat',
  'Torch-extinguishing winds or vapors',
  'Ordinary-seeming object harms handlers',
  'Crushingly heavy object is going to tip over',
  'A savage foe can be attracted by accident',
  'Something here is cursed by dark powers',
  'Seeming treasure is used as bait for a trap',
  'A contagious disease is on something here'
];

export const distractorTypes = [
  'Books or records from the site\'s owners',
  'Unique furniture related to the site\'s past',
  'Trophies or prizes taken by the owners',
  'Portraits or tapestries related to the site\'s past',
  'Ornate, imposing, but harmless doors',
  'Daily life debris from the inhabitants',
  'Worthless ancient personal effects',
  'Odd-looking but normal household goods',
  'Shrines or hedge ritual remains of inhabitants',
  'Corpses of fallen intruders',
  'Bones and other food remnants',
  'Statuary or carvings related to the site',
  'Signs of recent bloodshed and battle',
  'Empty cabinets or containers',
  'A discharged or broken trap',
  'Remnants of an inhabitant social event',
  'Mouldering or ruined goods or supplies',
  'Half-completed work done by inhabitants',
  'Once-valuable but now-ruined object',
  'Broken or expended once-magical object'
];

export const enigmaTypes = [
  'Magical fountain or pool',
  'Control that opens paths elsewhere',
  'Spatial warp between locations',
  'Enchanted statue or art object',
  'Magically-animated room components',
  'Substance with physically impossible traits',
  'Altered or augmented gravity',
  'Zone that empowers foes or magic types',
  'Magical ward or seal on a summoned thing',
  'Oracular object or far-scrying device',
  'Standing magical effect in the area',
  'Temporal distortion or visions of other times',
  'Sounds being shifted over long distances',
  'Zones of darkness or blinding light',
  'Enchanted seals visibly locking up loot',
  'Magical or elemental force emitting unit',
  'Enchantment tailored to the site\'s original use',
  'Unnatural heat or chill in an area',
  'Magically-altered plant life here',
  'Restorative magical device'
];

export const treasureLocations = [
  'Stored in a visible chest or coffer',
  'Hidden in a pool of liquid',
  'Behind a stone in the wall',
  'Underneath a floor tile',
  'Hidden inside a creature\'s body',
  'Inside an ordinary furniture drawer',
  'Slid beneath a bed or other furnishing',
  'Placed openly on a shelf for display',
  'Hidden in a pile of other junk',
  'Tucked into a secret furniture space',
  'Slid behind a tapestry or painting',
  'Heavy, protective locked chest or safe',
  'Buried under heavy or dangerous debris',
  'In the pockets of clothes stored here',
  'The treasure\'s a creature\'s precious body part',
  'Scattered carelessly on the floor',
  'Tucked into a pillow or cushion',
  'Hung on a statue or display frame',
  'Hidden atop a ceiling beam',
  'Resting atop a desk or table'
];

export const getRoomTypeIcon = (content) => {
  switch (content) {
    case 'Creature': return '👹';
    case 'Hazard': return '⚠️';
    case 'Enigma': return '🔮';
    case 'Distractor': return '📦';
    case 'Empty': return '🚪';
    default: return '❓';
  }
};

// Room generation functions
export const generateExits = () => {
  const roll = rollD8();
  const result = getTableResult(roll, exitTable);
  return result.exits;
};

export const generateDirections = (numExits) => {
  const directions = [];
  const exitCount = numExits === 'One' ? 1 : 
                   numExits === 'Two' ? 2 : 
                   numExits === 'Three' ? 3 : 4;
  
  for (let i = 0; i < exitCount; i++) {
    const roll = rollD12();
    const result = getTableResult(roll, directionTable);
    directions.push(result.direction);
  }
  return directions;
};

export const generateRoomContents = () => {
  const contentRoll = rollD8();
  const treasureRoll = rollD6();
  
  const contentResult = getTableResult(contentRoll, contentsTable);
  const hasTreasure = contentResult.treasureChance.includes(treasureRoll);
  
  let details = '';
  
  switch (contentResult.content) {
    case 'Creature':
      details = 'A creature inhabits this room. Consider inhabitants from page 240.';
      break;
    case 'Hazard':
      details = getRandomArrayItem(hazardTypes);
      break;
    case 'Enigma':
      details = getRandomArrayItem(enigmaTypes);
      break;
    case 'Distractor':
      details = getRandomArrayItem(distractorTypes);
      break;
    case 'Empty':
      details = 'This room appears empty and devoid of anything worth interacting with.';
      break;
  }

  return {
    content: contentResult.content,
    details,
    hasTreasure,
    treasureLocation: hasTreasure ? getRandomArrayItem(treasureLocations) : null
  };
};
