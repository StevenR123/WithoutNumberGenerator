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

// Rooms of Interest tables
export const roomFunctionTable = [
  { roll: [1], function: 'Residential Room' },
  { roll: [2], function: 'Work Room' },
  { roll: [3], function: 'Cultural Room' },
  { roll: [4], function: 'Martial Room' },
  { roll: [5], function: 'Religious Room' },
  { roll: [6], function: 'Utility Room' }
];

export const residentialRoomExamples = [
  { roll: [1], example: 'Dormitory barracks for servants' },
  { roll: [2], example: 'The owner or ruler\'s bedchamber' },
  { roll: [3], example: 'High-ranking resident bedroom' },
  { roll: [4], example: 'Latrine or privy' },
  { roll: [5], example: 'Kennel or beast pen' },
  { roll: [6], example: 'Prison or slave cages' },
  { roll: [7], example: 'Meager room for minor servant' },
  { roll: [8], example: 'Sickroom for patients' },
  { roll: [9], example: 'Guest chambers for visitors' },
  { roll: [10], example: 'Kitchen or dining hall' },
  { roll: [11], example: 'Bathing chamber or washroom' },
  { roll: [12], example: 'Study or private library' }
];

export const workRoomExamples = [
  { roll: [1], example: 'Smithy or forge' },
  { roll: [2], example: 'Smokehouse or food preparation' },
  { roll: [3], example: 'Sewing or weaving room' },
  { roll: [4], example: 'Torture chamber' },
  { roll: [5], example: 'Healer\'s work room' },
  { roll: [6], example: 'Arcane laboratory' },
  { roll: [7], example: 'Alchemist\'s workshop' },
  { roll: [8], example: 'Artisan\'s work area' },
  { roll: [9], example: 'Artist\'s workroom' },
  { roll: [10], example: 'Washroom or scullery' },
  { roll: [11], example: 'Brewery room' },
  { roll: [12], example: 'Processing room for a raw good' }
];

export const culturalRoomExamples = [
  { roll: [1], example: 'Plaza or meeting area' },
  { roll: [2], example: 'Amphitheater or recital room' },
  { roll: [3], example: 'Art gallery' },
  { roll: [4], example: 'Cultural monument' },
  { roll: [5], example: 'Grave, cemetery, or ossuary' },
  { roll: [6], example: 'Library or archive' },
  { roll: [7], example: 'Garden or flowing water feature' },
  { roll: [8], example: 'Ornately iconographic chamber' },
  { roll: [9], example: 'Room for a particular cultural rite' },
  { roll: [10], example: 'Drinking hall' },
  { roll: [11], example: 'Performance stage or area' },
  { roll: [12], example: 'Drug den or place of debauchery' }
];

export const martialRoomExamples = [
  { roll: [1], example: 'Armory or martial storage' },
  { roll: [2], example: 'Training area' },
  { roll: [3], example: 'Barracks for soldiers' },
  { roll: [4], example: 'Guard post' },
  { roll: [5], example: 'Parade ground' },
  { roll: [6], example: 'Commemorative hall' },
  { roll: [7], example: 'Map or planning room' },
  { roll: [8], example: 'War machine fabrication or storage' },
  { roll: [9], example: 'Dueling area' },
  { roll: [10], example: 'Beast-fighting arena' },
  { roll: [11], example: 'Strong point or fortification' },
  { roll: [12], example: 'Gate or fortified entrance' }
];

export const religiousRoomExamples = [
  { roll: [1], example: 'Private shrine' },
  { roll: [2], example: 'Altar room' },
  { roll: [3], example: 'Monastic prayer cell' },
  { roll: [4], example: 'Ritual chamber' },
  { roll: [5], example: 'Monument to a deity' },
  { roll: [6], example: 'Ceremonial bath' },
  { roll: [7], example: 'Room for a labor holy to the god' },
  { roll: [8], example: 'Storage for religious equipage' },
  { roll: [9], example: 'Secured chamber for holy relics' },
  { roll: [10], example: 'Secret or unofficial chapel' },
  { roll: [11], example: 'Priest\'s private chambers' },
  { roll: [12], example: 'Public area adorned with icons' }
];

export const utilityRoomExamples = [
  { roll: [1], example: 'Work materials storage' },
  { roll: [2], example: 'Pantry or food storage' },
  { roll: [3], example: 'Storeroom for random detritus' },
  { roll: [4], example: 'Furnace or boiler room' },
  { roll: [5], example: 'Exotic ancient power or light room' },
  { roll: [6], example: 'Pool or water source room' },
  { roll: [7], example: 'Concealed servant\'s passage' },
  { roll: [8], example: 'Domestic staff head office' },
  { roll: [9], example: 'Vault for valuables' },
  { roll: [10], example: 'Secret or unobtrusive entrance' },
  { roll: [11], example: 'Grand passage or ornate corridor' },
  { roll: [12], example: 'Barn or fodder storage' }
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

export const generateRoomOfInterest = () => {
  // First roll for the basic room function (d6)
  const functionRoll = rollD6();
  const functionResult = getTableResult(functionRoll, roomFunctionTable);
  const roomFunction = functionResult.function;
  
  // Then roll for the specific example (d12)
  const exampleRoll = rollD12();
  let exampleResult;
  
  switch (roomFunction) {
    case 'Residential Room':
      exampleResult = getTableResult(exampleRoll, residentialRoomExamples);
      break;
    case 'Work Room':
      exampleResult = getTableResult(exampleRoll, workRoomExamples);
      break;
    case 'Cultural Room':
      exampleResult = getTableResult(exampleRoll, culturalRoomExamples);
      break;
    case 'Martial Room':
      exampleResult = getTableResult(exampleRoll, martialRoomExamples);
      break;
    case 'Religious Room':
      exampleResult = getTableResult(exampleRoll, religiousRoomExamples);
      break;
    case 'Utility Room':
      exampleResult = getTableResult(exampleRoll, utilityRoomExamples);
      break;
    default:
      exampleResult = { example: 'Unknown room type' };
  }
  
  return {
    function: roomFunction,
    example: exampleResult.example,
    functionRoll,
    exampleRoll
  };
};
