// --- Weapon Generator Functions ---
import { rollDie, rollD8, rollD12, rollD20, rollD100, getTableResult, getRandomArrayItem } from './tableUtils';

export function rollWeaponEnchantment(rarity = 'minor') {
  const roll = rollD20();
  let table;
  switch (rarity.toLowerCase()) {
    case 'major':
      table = weaponEnchantmentBonusTable.map(e => ({ ...e, range: e.major }));
      break;
    case 'great':
      table = weaponEnchantmentBonusTable.map(e => ({ ...e, range: e.great }));
      break;
    default:
      table = weaponEnchantmentBonusTable.map(e => ({ ...e, range: e.minor }));
      break;
  }
  const result = table.find(e => {
    if (Array.isArray(e.range)) {
      if (e.range.length === 1) return roll === e.range[0];
      return roll >= e.range[0] && roll <= e.range[1];
    }
    return false;
  });
  return result ? { bonus: result.bonus } : null;
}

export function rollWeaponUser() {
  const roll = rollD8();
  return getTableResult(roll, weaponUserTable);
}

export function rollWeaponType() {
  const roll = rollD100();
  return getTableResult(roll, weaponTypeTable);
}

export function rollSpecialWeaponAbilitiesCount(rarity = 'minor') {
  const roll = rollD12();
  const result = getTableResult(roll, specialWeaponAbilitiesTable);
  if (!result) return { minor: 'None', major: 'None', great: 'None' };
  return result;
}

export function rollMagicalWeaponAbility() {
  const roll = rollD100();
  return getTableResult(roll, magicalWeaponAbilitiesTable);
}

export function generateMagicalWeapon(rarity = 'minor') {
  // Ensure user and baseItem are always objects with the expected fields
  const userResult = rollWeaponUser();
  const baseItemResult = rollWeaponType();
  const result = {
    type: 'weapon',
    rarity,
    icon: '⚔️',
    user: userResult && userResult.user ? { user: userResult.user } : { user: String(userResult) },
    baseItem: baseItemResult && baseItemResult.type ? { type: baseItemResult.type } : { type: String(baseItemResult) },
    enchantmentBonus: rollWeaponEnchantment(rarity),
    specialAbilities: []
  };
  // Determine number of special abilities
  const abilitiesCount = rollSpecialWeaponAbilitiesCount(rarity);
  let count = 0;
  switch (rarity.toLowerCase()) {
    case 'major':
      count = abilitiesCount.major === 'None' ? 0 : parseInt(abilitiesCount.major) || 1;
      break;
    case 'great':
      count = abilitiesCount.great === 'None' ? 0 : parseInt(abilitiesCount.great) || 1;
      break;
    default:
      count = abilitiesCount.minor === 'None' ? 0 : parseInt(abilitiesCount.minor) || 1;
      break;
  }
  // Add unique magical abilities
  for (let i = 0; i < count; i++) {
    let ability;
    let attempts = 0;
    do {
      ability = rollMagicalWeaponAbility();
      attempts++;
      if (attempts > 10) break;
    } while (result.specialAbilities.some(a => a.ability === ability.ability));
    if (ability) result.specialAbilities.push(ability);
  }
  return result;
}
// weaponsTable.js
// Magical Weapons Table and Utilities

export const weaponEnchantmentBonusTable = [
  { bonus: '+1', minor: [1,16], major: [1,5], great: [1] },
  { bonus: '+2', minor: [17,19], major: [6,17], great: [2,4] },
  { bonus: '+3', minor: [20], major: [18,20], great: [5,20] }
];

export const weaponUserTable = [
  {
    roll: 1,
    user: 'Common infantry',
    favored: 'Spears, pole arms, short swords, or daggers.'
  },
  {
    roll: 2,
    user: 'Civilian gentleman or duelist',
    favored: 'Swords, daggers, hand hurlants, staffs, cane-clubs, or concealable weapons.'
  },
  {
    roll: 3,
    user: 'Champion or heroic warrior',
    favored: 'Complex, exotic, or specialist weapons, two-handed weapons, and hurlants.'
  },
  {
    roll: 4,
    user: 'Assassin or denied obvious weaponry',
    favored: 'Daggers, claw blades, and other small concealed weapons; sometimes long hurlants or crossbows.'
  },
  {
    roll: 5,
    user: 'Knightly duelists or heavy-armor combatants',
    favored: 'Maces, hammers, two-handed weapons, stilettos, and other weapons with penetrating Shock.'
  },
  {
    roll: 6,
    user: 'Archers or ranged combatants',
    favored: 'Bows, crossbows, hurlants, light spears, short swords, or daggers.'
  },
  {
    roll: 7,
    user: 'Individualistic warbands',
    favored: 'Spears and short swords somewhat, but an individual warrior could use anything.'
  },
  {
    roll: 8,
    user: 'High-tech culture',
    favored: 'Roll again, but replace bows and crossbows with hurlants, and melee weapons will have advanced-tech stylings.'
  }
];

export const weaponTypeTable = [
  { range: '1–30', type: 'Favored primary' },
  { range: '31–40', type: 'Favored secondary' },
  { range: '41–50', type: 'Favored ranged' },
  { range: '51–53', type: 'Axe, Hand' },
  { range: '54', type: 'Axe, War' },
  { range: '55', type: 'Blackjack' },
  { range: '56–58', type: 'Bow, Large' },
  { range: '59–61', type: 'Bow, Small' },
  { range: '62', type: 'Claw Blades' },
  { range: '63', type: 'Club' },
  { range: '64', type: 'Club, Great' },
  { range: '65', type: 'Crossbow' },
  { range: '66–68', type: 'Dagger' },
  { range: '69–70', type: 'Halberd' },
  { range: '71', type: 'Hammer, Great' },
  { range: '72–73', type: 'Hammer, War' },
  { range: '74', type: 'Hurlant, Great' },
  { range: '75', type: 'Hurlant, Hand' },
  { range: '76', type: 'Hurlant, Long' },
  { range: '77–78', type: 'Mace' },
  { range: '79–80', type: 'Pike' },
  { range: '81–85', type: 'Spear, Heavy' },
  { range: '86–89', type: 'Spear, Light' },
  { range: '90', type: 'Throwing Blade' },
  { range: '91', type: 'Staff' },
  { range: '92', type: 'Stiletto' },
  { range: '93–94', type: 'Sword, Great' },
  { range: '95–97', type: 'Sword, Long' },
  { range: '98–00', type: 'Sword, Short' }
];

export const specialWeaponAbilitiesTable = [
  { range: '1–2', minor: 'None', major: 'None', great: 'None' },
  { range: '3–4', minor: 'None', major: 'None', great: 'One' },
  { range: '5–6', minor: 'None', major: 'One', great: 'Two' },
  { range: '7', minor: 'None', major: 'One', great: 'Two' },
  { range: '8', minor: 'None', major: 'One', great: 'Two' },
  { range: '9', minor: 'One', major: 'Two', great: 'Three' },
  { range: '10', minor: 'One', major: 'Two', great: 'Three' },
  { range: '11', minor: 'One', major: 'Two', great: 'Three' },
  { range: '12', minor: 'Two', major: 'Three', great: 'Three' }
];

export const magicalWeaponAbilitiesTable = [
  { range: '1–2', ability: 'Adamantine' },
  { range: '3–4', ability: 'Augmented' },
  { range: '5–6', ability: 'Baffling' },
  { range: '7–8', ability: 'Barring' },
  { range: '9–10', ability: 'Blighted' },
  { range: '11–12', ability: 'Bloodbound' },
  { range: '13–14', ability: 'Bloodthirsty' },
  { range: '15–16', ability: 'Despairing' },
  { range: '17–18', ability: 'Devoted' },
  { range: '19–20', ability: 'Devouring' },
  { range: '21–22', ability: 'Effortless' },
  { range: '23–24', ability: 'Energetic' },
  { range: '25–26', ability: 'Enervating' },
  { range: '27–28', ability: 'Enraging' },
  { range: '29–30', ability: 'Forfending' },
  { range: '31–32', ability: 'Fortifying' },
  { range: '33–34', ability: 'Harmonious' },
  { range: '35–36', ability: 'Hunting' },
  { range: '37–38', ability: 'Illuminating' },
  { range: '39–40', ability: 'Innervating' },
  { range: '41–42', ability: 'Longarm' },
  { range: '43–44', ability: 'Lucky' },
  { range: '45–46', ability: 'Marking' },
  { range: '47–48', ability: 'Merciful' },
  { range: '49–50', ability: 'Negating' },
  { range: '51–52', ability: 'Nightwalking' },
  { range: '53–54', ability: 'Omened' },
  { range: '55–56', ability: 'Penetrating' },
  { range: '57–58', ability: 'Phantom' },
  { range: '59–60', ability: 'Phasing' },
  { range: '61–62', ability: 'Piercing' },
  { range: '63–64', ability: 'Radioactive' },
  { range: '65–66', ability: 'Rampaging' },
  { range: '67–68', ability: 'Rectifying' },
  { range: '69–70', ability: 'Returning' },
  { range: '71–72', ability: 'Sacrificial' },
  { range: '73–74', ability: 'Shattering' },
  { range: '75–76', ability: 'Shieldbreaking' },
  { range: '77–78', ability: 'Shocking' },
  { range: '79–80', ability: 'Shrieking' },
  { range: '81–82', ability: 'Skittering' },
  { range: '83–84', ability: 'Skytreading' },
  { range: '85–86', ability: 'Slaughtering' },
  { range: '87–88', ability: 'Souleating' },
  { range: '89–90', ability: 'Spellcleaving' },
  { range: '91–92', ability: 'Terrifying' },
  { range: '93–94', ability: 'Toxic' },
  { range: '95–96', ability: 'Vengeful' },
  { range: '97–98', ability: 'Versatile' },
  { range: '99–00', ability: 'Vigilant' }
];

// Utility functions for random rolls and lookups can be added here.
