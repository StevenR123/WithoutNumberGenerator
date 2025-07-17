// Monster generation tables and data for the Without Number monster generator

import { rollDie, rollD6, rollD8, rollD10, rollD12, getTableResult, getRandomArrayItem } from './tableUtils';

export const monsterIcons = ['👹', '🦍', '🕷️', '🦅', '🐞', '🐺', '🐴', '🐅', '🐟', '🦎', '🐍', '🐻', '🐝', '🐲', '🦇', '🐙', '🦈', '🐊', '🕸️', '🦂'];

export const monstrousDrives = [
  'Hunger for a specific type of food',
  'Territory expansion and dominance',
  'Reproduction and nest protection',
  'Curiosity about strange phenomena',
  'Revenge against those who wronged it',
  'Collection of shiny or valuable objects',
  'Protection of young or mate',
  'Elimination of competing predators',
  'Seeking shelter from environmental threats',
  'Following ancient instincts or commands',
  'Magical compulsion or curse',
  'Simple malevolence toward all life'
];

export const creaturePowerLevels = [
  { points: 0, description: 'Perfectly ordinary beast or person' },
  { points: 2, description: 'Minor hero or significant mage' },
  { points: 3, description: 'Minor magical beast or construct' },
  { points: 4, description: 'Species of magically-potent sentient' },
  { points: 5, description: 'Significant magical beast or being' },
  { points: 6, description: 'Major hero or famous mage' },
  { points: 8, description: 'Hero of a magically-potent species / Regionally-significant magical beast' },
  { points: 10, description: 'Legendary magical beast / Legate or famous major hero' },
  { points: 15, description: 'Imperator or other demi-divine being' }
];

export const damageInflictionPowers = {
  basePowers: [
    { points: 1, description: 'A power does damage equal to a normal weapon blow' },
    { points: 2, description: 'A power does damage of about 3d6' },
    { points: 3, description: 'A power does damage of about 6d6' },
    { points: 5, description: 'A power does damage of 10d6 or more' }
  ],
  modifiers: [
    { id: 'meleeOnly', points: -1, description: 'The power only works in melee range' },
    { id: 'saveHalf', points: -1, description: 'The power\'s damage allows a save for half' },
    { id: 'saveNone', multiplier: 0.5, description: 'The power\'s damage allows a save for none' },
    { id: 'multipleTargets', multiplier: 2, description: 'The power\'s damage is done to multiple targets' },
    { id: 'ongoing', multiplier: 2, description: 'The power\'s damage is ongoing, repeating in full or part for several rounds' },
    { id: 'hitRoll', points: -1, description: 'The power\'s damage requires a hit roll' },
    { id: 'onTurn', points: 2, description: 'The power can be used once per round as an On Turn action' }
  ]
};

export const movementPowers = [
  { points: 2, description: 'Flight ability at its movement rate, including the ability to fight on the wing' },
  { points: 2, description: 'Passes through any solid object' },
  { points: 1, description: 'Ignores a type of solid barrier substance' },
  { points: 2, description: 'Extra Move action each round' },
  { points: 1, description: 'Movement increased by 50%' },
  { points: 1, description: 'It makes Fighting Withdrawals as On Turn actions' },
  { points: 1, description: 'Can leap its full movement rate' },
  { points: 1, description: 'Can swim, climb, or navigate some other usually-troublesome medium at full speed' },
  { points: 2, description: 'It can teleport at its movement rate' },
  { points: 2, description: 'Can teleport long distances through shadows, flame, or other characteristic substances' },
  { points: 1, description: 'Gets a free Instant Move action when some characteristic event or circumstance obtains' },
  { points: 1, description: 'It can split its Move action\'s movement around its Main Action' }
];

export const debilitatingPowers = {
  basePowers: [
    { points: 1, description: 'Melee or ranged attacks must be rolled twice and the worst hit and damage used' },
    { points: 1, description: 'Lose a Move action for the round' },
    { points: 3, description: 'Suffer paralysis, unconsciousness, or other fight-ending status after being hit twice with this ability. 5 points if only one hit is needed.' },
    { points: 2, description: 'Suffer 1d6 damage/2 HD of the creature when you do a common type of activity' },
    { points: 2, description: 'Lose a Main action for the round' },
    { points: 2, description: 'Become unable to cast spells or use arts for 1d4 rounds' },
    { points: 1, description: 'Suffer double damage from the creature' }
  ],
  modifiers: [
    { id: 'savePenalty', points: 1, description: 'The power applies a -2 penalty to any saves against it' },
    { id: 'areaEffect', multiplier: 3, description: 'The power automatically affects all foes around it, with a save to resist' },
    { id: 'persistent', multiplier: 2, description: 'The penalty lasts longer than just the scene' },
    { id: 'limitedUse', multiplier: 0.5, description: 'The power is only usable 1-3 times a fight' },
    { id: 'onTurnAction', multiplier: 2, description: 'Use the power as an On Turn action once per round' }
  ]
};

export const augmentingPowers = {
  basePowers: [
    { points: 1, description: 'Gain an extra normal attack' },
    { points: 1, description: 'Double an attack\'s normal damage or Shock' },
    { points: 2, description: 'Gain a bonus Main Action' },
    { points: 1, description: 'Regenerate its HD in lost hit points each round until you\'re slain' },
    { points: 1, description: 'Gain a +4 bonus to AC or become immune to Shock' },
    { points: 2, description: 'One attack per round becomes unavoidable' },
    { points: 1, description: 'Become immune to certain general types of spells and magical effects' },
    { points: 3, description: 'Gain an entire bonus round of action' },
    { points: 2, description: 'Automatically succeed at one save per round' }
  ],
  modifiers: [
    { id: 'shortDuration', points: 0, description: 'The buff trigger lasts only a short while or is difficult to arrange' },
    { id: 'longDuration', points: 1, description: 'The buff trigger either lasts a long while once achieved or is not hard to make happen' },
    { id: 'maintainRequired', points: -1, description: 'The creature has to work continuously to maintain or obtain the trigger situation' },
    { id: 'alwaysActive', multiplier: 2, description: 'The buff is normally in effect, either because it\'s intrinsic or very easy to trigger' }
  ]
};

export const intrinsicPowers = [
  { points: 2, description: 'Use a first or second-level spell equivalent' },
  { points: 4, description: 'Use a third or fourth-level spell equivalent' },
  { points: 6, description: 'Use a fifth level spell equivalent' },
  { points: 1, description: 'Use a Mage art equivalent once a scene' },
  { points: 2, description: 'Use a Mage art equivalent at will' },
  { points: 1, description: 'Gain the benefits of one level of a Focus' },
  { points: 2, description: 'Be immune to a general class of weapon: piercing, slashing, crushing, or the like' },
  { points: 3, description: 'Be immune to non-magical weapons' },
  { points: 6, description: 'Require a specific type of weapon or form of injury to harm it' },
  { points: 1, description: 'Be immune to an uncommon harm like poison, frost, or electricity' },
  { points: 2, description: 'Be immune to a fairly common harm like fire or mind-affecting magic' },
  { points: 3, description: 'Be immune to an entire large class of material, such as metal, plant matter, or directly damaging spells' },
  { points: 'special', description: 'Inflict a particular debuff or damage on someone who hits you with a save to avoid it; add the harmful power\'s cost to this', requiresSecondaryPower: true }
];

export const animalTypes = [
  { roll: 1, type: 'Apish', description: 'Distorted humanoid outlines' },
  { roll: 2, type: 'Arachnid', description: 'Webs, many limbs, many eyes' },
  { roll: 3, type: 'Avian', description: 'Feathers, beak, talons, light weight' },
  { roll: 4, type: 'Beetle-like', description: 'Rounded body and armor' },
  { roll: 5, type: 'Canine', description: 'Muzzle, tail, paws' },
  { roll: 6, type: 'Equine', description: 'Hooves, speed, manes' },
  { roll: 7, type: 'Feline', description: 'Fangs, claws, litheness' },
  { roll: 8, type: 'Piscene', description: 'Googly eyes, scales, fins' },
  { roll: 9, type: 'Reptilian', description: 'Frills, side-slung limbs, scales' },
  { roll: 10, type: 'Serpentine', description: 'Limbless, venomous, slim' },
  { roll: 11, type: 'Ursine', description: 'Broad body, thick hide, claws' },
  { roll: 12, type: 'Wasp-like', description: 'Wings, narrow thorax, sting' }
];

export const bodyPlans = [
  { roll: 1, plan: 'Limbless, amorphous, or a tentacular mass' },
  { roll: [2, 3], plan: 'Bipedal, generally upright' },
  { roll: [4, 5, 6, 7], plan: 'Quadrupedal, perhaps able to rear up' },
  { roll: 8, plan: 'Sexapedal, perhaps with wings and legs' }
];

export const survivalMethods = [
  { roll: 1, method: 'It requires very little food for survival' },
  { roll: 2, method: 'It\'s poisonous and repels its predators' },
  { roll: 3, method: 'It eats something other creatures can\'t' },
  { roll: 4, method: 'It\'s newly introduced in the area' },
  { roll: 5, method: 'It doesn\'t need food in a normal sense' },
  { roll: 6, method: 'It exists in symbiosis with something else' }
];

export const huntingMethods = [
  { roll: 1, method: 'Stealthy stalking and ambush of its prey' },
  { roll: 2, method: 'It steals the kills of other creatures' },
  { roll: 3, method: 'It hunts in packs or family groups' },
  { roll: 4, method: 'It uses some unnatural power to catch prey' },
  { roll: 5, method: 'A partnership with another kind of beast' },
  { roll: 6, method: 'It feeds on carrion and the very weak' },
  { roll: 7, method: 'It chases down its prey in open pursuit' },
  { roll: 8, method: 'It disguises itself as something harmless' },
  { roll: 9, method: 'It blindly eats whatever it encounters' },
  { roll: 10, method: 'It lures in its prey with some kind of bait' }
];

export const bodyParts = {
  mammalian: ['Thick fur', 'Tail', 'Paws', 'Hooves', 'Hands', 'Fangs', 'Claws', 'Visible ears', 'Stenches', 'Leathery hide', 'Bat wings', 'Horns'],
  insectile: ['Compound eyes', 'Stings', 'Mandibles', 'Spinnerets', 'Swarms', 'Membrane wings', 'Egg sacs', 'Blood-sucking', 'Parasitizing', 'Larval forms', 'Leaping', 'Numerous legs'],
  reptilian: ['Poisons', 'Slitted eyes', 'Fangs', 'Scaled skin', 'Silence', 'Draconic wings', 'Thick hide', 'Crawling', 'Cold-blooded', 'Camouflage', 'Crushing jaws', 'Wall-climbing'],
  avian: ['Feathers', 'Beak', 'Talons', 'Light body', 'Songs', 'Bright colors', 'Sharp eyes', 'Eggs', 'Diving', 'Flocks', 'Regurgitation', 'Guano'],
  piscene: ['Scales', 'Bulging eyes', 'Fins', 'Suckers', 'Tentacles', 'Pincers', 'Rubbery hide', 'Huge maws', 'Water jets', 'Slime', 'Spines', 'Mineral deposit'],
  exotic: ['Tentacles', 'Sacs', 'Wheels', 'Balloons', 'Tendrils', 'Launchers', 'Treads', 'Jets', 'Secretions', 'Translucence', 'Alien smells', 'Unliving matter']
};

export const getMonsterIcon = (animalType) => {
  switch (animalType) {
    case 'Apish': return '🦍';
    case 'Arachnid': return '🕷️';
    case 'Avian': return '🦅';
    case 'Beetle-like': return '🐞';
    case 'Canine': return '🐺';
    case 'Equine': return '🐴';
    case 'Feline': return '🐅';
    case 'Piscene': return '🐟';
    case 'Reptilian': return '🦎';
    case 'Serpentine': return '🐍';
    case 'Ursine': return '🐻';
    case 'Wasp-like': return '🐝';
    default: return '👹';
  }
};
