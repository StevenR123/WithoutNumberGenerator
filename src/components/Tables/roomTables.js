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

// Basic Site Types tables
export const basicSiteTypesTable = [
  { roll: [1], type: 'Residential Site' },
  { roll: [2], type: 'Military Site' },
  { roll: [3], type: 'Production Site' },
  { roll: [4], type: 'Religious Site' },
  { roll: [5], type: 'Cultural Site' },
  { roll: [6], type: 'Infrastructure Site' }
];

export const residentialSiteExamples = [
  { roll: [1], site: 'Isolated rural estate of nobility' },
  { roll: [2], site: 'Massive tenement or slum tower' },
  { roll: [3], site: 'Compact fortified village' },
  { roll: [4], site: 'Mazey urban residential block' },
  { roll: [5], site: 'Ancient arcology or fragment of it' },
  { roll: [6], site: 'Sprawling slum of shanties and huts' },
  { roll: [7], site: 'Townhouse of minor gentry' },
  { roll: [8], site: 'Rural grange with outbuildings' },
  { roll: [9], site: 'Hidden shelter against calamity' },
  { roll: [10], site: 'Rubble-wrought makeshift village' },
  { roll: [11], site: 'Outpost of refugees or recluses' },
  { roll: [12], site: 'Inhabited natural feature or cave' }
];

export const militarySiteExamples = [
  { roll: [1], site: 'Grand fortress of major significance' },
  { roll: [2], site: 'Remote frontier keep' },
  { roll: [3], site: 'Isolated watchtower' },
  { roll: [4], site: 'Military training camp' },
  { roll: [5], site: 'Half-subterranean entrenchments' },
  { roll: [6], site: 'Battlefield littered with fortifications' },
  { roll: [7], site: 'Hidden bunker or strongpoint' },
  { roll: [8], site: 'Secret operations base' },
  { roll: [9], site: 'Battered front-line fortress' },
  { roll: [10], site: 'Gatehouse controlling a vital pass' },
  { roll: [11], site: 'Military cache or storehouse' },
  { roll: [12], site: 'Fortified waystation' }
];

export const productionSiteExamples = [
  { roll: [1], site: 'Illicit manufactory for illegal goods' },
  { roll: [2], site: 'Sacred shrine for holy product' },
  { roll: [3], site: 'Destroyed camp or extraction site' },
  { roll: [4], site: 'Inexplicable ancient manufactory' },
  { roll: [5], site: 'Outsider goods production site' },
  { roll: [6], site: 'Magical production facility' },
  { roll: [7], site: 'Mine or open pit for excavation' },
  { roll: [8], site: 'Overgrown ancient plantation' },
  { roll: [9], site: 'Managed woodland gone feral' },
  { roll: [10], site: 'Farm for now-feral valuable beasts' },
  { roll: [11], site: 'Repurposed ancient manufactory' },
  { roll: [12], site: 'Fishery or salt extraction site' }
];

export const religiousSiteExamples = [
  { roll: [1], site: 'Lost pilgrimage destination' },
  { roll: [2], site: 'Tomb of some mighty ancient' },
  { roll: [3], site: 'Shrine repurposed for a newer god' },
  { roll: [4], site: 'Inexplicable sacred structure' },
  { roll: [5], site: 'Outsider fane to an alien god' },
  { roll: [6], site: 'Pilgrim hospital or waystation' },
  { roll: [7], site: 'Fortified frontier monastery' },
  { roll: [8], site: 'Prison-monastery for heretics' },
  { roll: [9], site: 'Fragment of megastructure temple' },
  { roll: [10], site: 'Place of some holy trial or test' },
  { roll: [11], site: 'Prison for a sealed demonic force' },
  { roll: [12], site: 'Holy archive or relic-fortress' }
];

export const culturalSiteExamples = [
  { roll: [1], site: 'Inscrutable Outsider art structure' },
  { roll: [2], site: 'Ancient culture\'s gathering site' },
  { roll: [3], site: 'Monument complex to lost glories' },
  { roll: [4], site: 'Abandoned school or study center' },
  { roll: [5], site: 'Indoctrination camp or prison' },
  { roll: [6], site: 'Museum of a lost nation' },
  { roll: [7], site: 'Library or ancient archive' },
  { roll: [8], site: 'Resort for nobles at ease' },
  { roll: [9], site: 'Enormous musical structure' },
  { roll: [10], site: 'Massive ceremonial structure' },
  { roll: [11], site: 'Preserved "heritage" village-resort' },
  { roll: [12], site: 'Taboo site of dark magic' }
];

export const infrastructureSiteExamples = [
  { roll: [1], site: 'Psychic or tech communications site' },
  { roll: [2], site: 'Canal or aqueduct control center' },
  { roll: [3], site: 'Reality-stabilizing Working ruin' },
  { roll: [4], site: 'Massive bridge or tunnel' },
  { roll: [5], site: 'Ancient power production center' },
  { roll: [6], site: 'Semi-ruined teleportation node' },
  { roll: [7], site: 'Subterranean transit tunnels' },
  { roll: [8], site: 'Weather-control Working ruin' },
  { roll: [9], site: 'Ancient road through an obstacle' },
  { roll: [10], site: 'Huge ancient dam' },
  { roll: [11], site: 'Outsider xenoforming engine' },
  { roll: [12], site: 'Now-incomprehensible wreckage' }
];

// The Framework of Inhabitation tables
export const importantInhabitantsTable = [
  { roll: [1], result: 'One major monstrous beast, with the other inhabitants avoiding it or supplicating it' },
  { roll: [2], result: 'One major intelligent leader with their followers, slaves, or associates' },
  { roll: [3], result: '1d3+1 major inhabitants, at least two of which are hostile to each other' },
  { roll: [4], result: 'A major inhabitant and the remnants of another group or pack they deposed' },
  { roll: [5], result: 'A relatively harmonious group of 1d3+1 significant figures' },
  { roll: [6], result: 'No discernible major figures, only a disorganized congery of beasts and beings' }
];

export const hostilityReasonsTable = [
  { roll: [1], reason: 'They raided us and stole our resources' },
  { roll: [2], reason: 'They\'re from a rival religion' },
  { roll: [3], reason: 'Our kinds naturally hate each other' },
  { roll: [4], reason: 'They took advantage of us in the past' },
  { roll: [5], reason: 'They\'re weak and ripe for plunder' },
  { roll: [6], reason: 'They broke an alliance in a treacherous way' },
  { roll: [7], reason: 'They caused a local disaster or problem' },
  { roll: [8], reason: 'Our leader has a personal hatred for them' },
  { roll: [9], reason: 'Local resources are insufficient for us both' },
  { roll: [10], reason: 'They\'re crowding into our territory' },
  { roll: [11], reason: 'They tricked us and led us into a disaster' },
  { roll: [12], reason: 'They stole a treasure or an important slave' }
];

export const whyDidTheyComeTable = [
  { roll: [1], reason: 'Driven here by a terrible monster' },
  { roll: [2], reason: 'No one remembers when they first came' },
  { roll: [3], reason: 'Forced out of their old home by enemies' },
  { roll: [4], reason: 'Sent out as a colony from their parent group' },
  { roll: [5], reason: 'Gathered from scattered exiles and outcasts' },
  { roll: [6], reason: 'Enlisted to come by a powerful leader' },
  { roll: [7], reason: 'Drawn by the prospect of resources or loot' },
  { roll: [8], reason: 'Making a cultural or religious pilgrimage' },
  { roll: [9], reason: 'Came to fight an enemy that lairs here' },
  { roll: [10], reason: 'Sent by visions, prophecy, or oracles' },
  { roll: [11], reason: 'It\'s a refuge from some pursuing foe' },
  { roll: [12], reason: 'To guard something precious here' }
];

export const allianceCausesTable = [
  { roll: [1], cause: 'We have a shared enemy' },
  { roll: [2], cause: 'Our leaders are personal friends' },
  { roll: [3], cause: 'We intermarry or have a blood relation' },
  { roll: [4], cause: 'We each have goods the other needs' },
  { roll: [5], cause: 'Each has skills the other lacks' },
  { roll: [6], cause: 'We give protection for a tolerable price' },
  { roll: [7], cause: 'We share the defense of the territory' },
  { roll: [8], cause: 'We share the same religion' },
  { roll: [9], cause: 'We overcame a great peril together' },
  { roll: [10], cause: 'We used to be under the same leader' },
  { roll: [11], cause: 'We recognize them as our rightful masters' },
  { roll: [12], cause: 'We gain a great profit by mutual cooperation' }
];

export const whyStayingTable = [
  { roll: [1], reason: 'It\'s rich in resources useful to them' },
  { roll: [2], reason: 'A foe outside threatens them if they leave' },
  { roll: [3], reason: 'They\'re trying to find something specific here' },
  { roll: [4], reason: 'It\'s simply always been their home' },
  { roll: [5], reason: 'An important member is immobile somehow' },
  { roll: [6], reason: 'Some drug or pleasure here has caught them' },
  { roll: [7], reason: 'They\'ve been enslaved by a power here' },
  { roll: [8], reason: 'They\'re being paid to do so by someone' },
  { roll: [9], reason: 'They haven\'t anywhere better to go' },
  { roll: [10], reason: 'They\'re waiting for someone else to arrive' },
  { roll: [11], reason: 'They\'re trapped here by something' },
  { roll: [12], reason: 'Their leader has a personal reason to stay' }
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

export const generateBasicSiteType = () => {
  // First roll for the basic site type (d6)
  const typeRoll = rollD6();
  const typeResult = getTableResult(typeRoll, basicSiteTypesTable);
  const siteType = typeResult.type;
  
  // Then roll for the specific example (d12)
  const exampleRoll = rollD12();
  let exampleResult;
  
  switch (siteType) {
    case 'Residential Site':
      exampleResult = getTableResult(exampleRoll, residentialSiteExamples);
      break;
    case 'Military Site':
      exampleResult = getTableResult(exampleRoll, militarySiteExamples);
      break;
    case 'Production Site':
      exampleResult = getTableResult(exampleRoll, productionSiteExamples);
      break;
    case 'Religious Site':
      exampleResult = getTableResult(exampleRoll, religiousSiteExamples);
      break;
    case 'Cultural Site':
      exampleResult = getTableResult(exampleRoll, culturalSiteExamples);
      break;
    case 'Infrastructure Site':
      exampleResult = getTableResult(exampleRoll, infrastructureSiteExamples);
      break;
    default:
      exampleResult = { site: 'Unknown site type' };
  }
  
  return {
    type: siteType,
    site: exampleResult.site,
    typeRoll,
    exampleRoll
  };
};

export const generateInhabitationFramework = () => {
  // Roll for important inhabitants (d6)
  const inhabitantsRoll = rollD6();
  const inhabitantsResult = getTableResult(inhabitantsRoll, importantInhabitantsTable);
  
  // Roll for hostility reasons (d12)
  const hostilityRoll = rollD12();
  const hostilityResult = getTableResult(hostilityRoll, hostilityReasonsTable);
  
  // Roll for why they came here (d12)
  const whyCameRoll = rollD12();
  const whyCameResult = getTableResult(whyCameRoll, whyDidTheyComeTable);
  
  // Roll for alliance causes (d12)
  const allianceRoll = rollD12();
  const allianceResult = getTableResult(allianceRoll, allianceCausesTable);
  
  // Roll for why they're staying (d12)
  const whyStayingRoll = rollD12();
  const whyStayingResult = getTableResult(whyStayingRoll, whyStayingTable);
  
  return {
    importantInhabitants: {
      description: inhabitantsResult.result,
      roll: inhabitantsRoll
    },
    hostilityReason: {
      reason: hostilityResult.reason,
      roll: hostilityRoll
    },
    whyTheyCame: {
      reason: whyCameResult.reason,
      roll: whyCameRoll
    },
    allianceCause: {
      cause: allianceResult.cause,
      roll: allianceRoll
    },
    whyStaying: {
      reason: whyStayingResult.reason,
      roll: whyStayingRoll
    }
  };
};
