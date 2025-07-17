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
//   console.log(`Special Weapon Abilities Count Roll: ${roll} -> ${result[rarity.toLowerCase()] || 'No result'}`);
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
    user: userResult && userResult.user ? { user: userResult.user, favored: userResult.favored } : { user: String(userResult) },
    baseItem: baseItemResult && baseItemResult.type ? { type: baseItemResult.type } : { type: String(baseItemResult) },
    enchantmentBonus: rollWeaponEnchantment(rarity),
    specialAbilities: []
  };
  // Determine number of special abilities
  const abilitiesCount = rollSpecialWeaponAbilitiesCount(rarity);
  let count = 0;
  
  // Convert text numbers to actual numbers
  const convertTextToNumber = (text) => {
    switch (text) {
      case 'None': return 0;
      case 'One': return 1;
      case 'Two': return 2;
      case 'Three': return 3;
      default: return 0;
    }
  };
  
  switch (rarity.toLowerCase()) {
    case 'major':
      count = convertTextToNumber(abilitiesCount.major);
      break;
    case 'great':
      count = convertTextToNumber(abilitiesCount.great);
      break;
    default:
      count = convertTextToNumber(abilitiesCount.minor);
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
  { roll: [1, 30], type: 'Favored primary' },
  { roll: [31, 40], type: 'Favored secondary' },
  { roll: [41, 50], type: 'Favored ranged' },
  { roll: [51, 53], type: 'Axe, Hand' },
  { roll: 54, type: 'Axe, War' },
  { roll: 55, type: 'Blackjack' },
  { roll: [56, 58], type: 'Bow, Large' },
  { roll: [59, 61], type: 'Bow, Small' },
  { roll: 62, type: 'Claw Blades' },
  { roll: 63, type: 'Club' },
  { roll: 64, type: 'Club, Great' },
  { roll: 65, type: 'Crossbow' },
  { roll: [66, 68], type: 'Dagger' },
  { roll: [69, 70], type: 'Halberd' },
  { roll: 71, type: 'Hammer, Great' },
  { roll: [72, 73], type: 'Hammer, War' },
  { roll: 74, type: 'Hurlant, Great' },
  { roll: 75, type: 'Hurlant, Hand' },
  { roll: 76, type: 'Hurlant, Long' },
  { roll: [77, 78], type: 'Mace' },
  { roll: [79, 80], type: 'Pike' },
  { roll: [81, 85], type: 'Spear, Heavy' },
  { roll: [86, 89], type: 'Spear, Light' },
  { roll: 90, type: 'Throwing Blade' },
  { roll: 91, type: 'Staff' },
  { roll: 92, type: 'Stiletto' },
  { roll: [93, 94], type: 'Sword, Great' },
  { roll: [95, 97], type: 'Sword, Long' },
  { roll: [98, 100], type: 'Sword, Short' }
];

export const specialWeaponAbilitiesTable = [
  { roll: [1, 2], minor: 'None', major: 'None', great: 'None' },
  { roll: [3, 4], minor: 'None', major: 'None', great: 'One' },
  { roll: [5, 6], minor: 'None', major: 'One', great: 'Two' },
  { roll: 7, minor: 'None', major: 'One', great: 'Two' },
  { roll: 8, minor: 'None', major: 'One', great: 'Two' },
  { roll: 9, minor: 'One', major: 'Two', great: 'Three' },
  { roll: 10, minor: 'One', major: 'Two', great: 'Three' },
  { roll: 11, minor: 'One', major: 'Two', great: 'Three' },
  { roll: 12, minor: 'Two', major: 'Three', great: 'Three' }
];

export const magicalWeaponAbilitiesTable = [
  { roll: [1, 2], ability: 'Adamantine', description: 'The weapon is imperishable and unbreakable by all conventional and most magical means. Edged weapons never lose their keenness, bowstrings never snap, and the weapon can bear a seemingly limitless amount of weight without bending or breaking. The weapon’s damage and hit bonus are both increased by +1, to a maximum of +3.' },
  { roll: [3, 4], ability: 'Augmented', description: 'The weapon’s enchantment hit and damage bonus increase by +1, up to a maximum of +4.' },
  { roll: [5, 6], ability: 'Baffling', description: 'The weapon looks very strange in some way, and its operation is not obvious to onlookers. The first attack the wielder makes during a fight is an automatic hit; after that, the onlookers have seen enough to defend against it normally. The shifting configuration of the weapon allows the same bonus during the next fight, however, even if the foes have seen it in an earlier engagement.' },
  { roll: [7, 8], ability: 'Barring', description: 'As a Move action, the bearer can use the weapon to draw a straight, glowing line up to twenty feet long, provided one part of the line is within five feet of the bearer. Enemies must make a Mental saving throw to voluntarily cross the line from either direction with their bodies, weapons, or powers; on a failed save, their attempted action is wasted. The effect ends when a new line is drawn, the scene ends, or the bearer or their allies cross the line with their own bodies, weapons, or powers.' },
  { roll: [9, 10], ability: 'Blighted', description: 'The weapon was created to slaughter normal human beings. Against baseline humans, it rolls damage twice and takes the better result. It functions without issues even in the hands of a baseline wielder; its creators were as glad to see internecine strife as any other kind.' },
  { roll: [11, 12], ability: 'Bloodbound', description: 'The weapon forms a symbiotic bond with the wielder. So long as they are wielding the weapon, they automatically stabilize from any survivable mortal wound and automatically regenerate one hit point every hour as magical healing. Once per day, a failed Physical or Mental saving throw may be re-rolled as the weapon shares the strain on the wielder.' },
  { roll: [13, 14], ability: 'Bloodthirsty', description: 'When the weapon’s wielder reduces a creature with at least one hit die to zero hit points, they regain 1d8 plus the creature’s hit dice in lost hit points. This healing cannot take them above their usual maximum hit points.' },
  { roll: [15, 16], ability: 'Despairing', description: 'The weapon drains a victim’s courage and hope. By accepting a point of System Strain as an Instant action when they hit a target, they can force the victim to make an immediate Morale check at a -1 penalty. This effect can be applied to a given target only once per scene.' },
  { roll: [17, 18], ability: 'Devoted', description: 'The weapon bonds with the first possessor to pick it up after the death of their last wielder. Until the wielder dies or intentionally discards it, it remains bound to them. Under no circumstances will it or its projectiles harm its wielder, and it can be teleported back to their hand as an On Turn action. The first time the wielder would be reduced to zero hit points during a day, they may accept a point of System Strain to let the weapon leap up and block the damage, assuming the damage is the sort the weapon could block.' },
  { roll: [19, 20], ability: 'Devouring', description: 'The weapon bites pieces out of a victim’s body or spirit. Damage inflicted by a devouring weapon cannot be healed until the end of the scene, whether by regeneration or other healing abilities. Creatures brought to zero hit points by the weapon are killed immediately and largely dismembered. Every time the weapon kills a living creature, the bearer gains twice their hit dice in points of healing.' },
  { roll: [21, 22], ability: 'Effortless', description: 'The weapon is supernaturally handy and easy to use. It has an effective Encumbrance of zero, cannot be unintentionally dropped or disarmed, and will hang suspended in space by the bearer for up to a minute if they should need their weapon hand free for some other purpose during a round. Large Effortless weapons will automatically compact or contort themselves to remain convenient to carry or use in even the most awkward circumstances.' },
  { roll: [23, 24], ability: 'Energetic', description: 'When in use, the weapon or its projectiles are wreathed in flame, lightning, killing frost, or some other form of energy. Minor energetic weapons do +2 damage on a hit, while major or great energetic weapons do 1d6+2 additional damage. This bonus doesn’t add to the weapon’s Shock.' },
  { roll: [25, 26], ability: 'Enervating', description: 'The weapon drains the vital energy from those it harms. A creature hit by the weapon must make a Physical saving throw or lose their next Move action. This draining effect can’t apply more than once to a creature until their next turn.' },
  { roll: [27, 28], ability: 'Enraging', description: 'The weapon ignites a bloodthirsty fury in the bearer. As an On Turn action, the wielder can become enraged. While enraged, they gain a +2 bonus to hit and damage rolls, can reroll any failed Mental saving throws that would stop them from fighting, and can continue fighting for one round after being reduced to zero hit points. Enraged wielders never fail a Morale check. Every round, however, they must either attack someone, seek to get close enough to attack someone, or spend their Main Action to come out of the rage.' },
  { roll: [29, 30], ability: 'Forfending', description: 'The first Screen Ally skill check the bearer attempts each round is an automatic success. While they are using the Screen Ally action, they are immune to Shock damage and gain a +2 bonus to their Armor Class.' },
  { roll: [31, 32], ability: 'Fortifying', description: 'The weapon has a supplementary pool of System Strain; up to three points of it can be accumulated by the weapon in place of its bearer when System Strain is incurred. This System Strain decreases by one point per night. A bearer can benefit from only one of these weapons at a time, and its pool is shared among all its potential users.' },
  { roll: [33, 34], ability: 'Harmonious', description: 'As an On Turn action, provided the bearer has not attacked yet this turn, the bearer may target a weapon being held by an enemy; the Harmonious weapon will instantly move to perfectly parry, deflect, or block all attacks that weapon makes against the bearer until the start of their next turn. Conversely, the Harmonious weapon cannot be used to hurt the bearer of the targeted weapon, as it is too perfectly in harmony with their movements.' },
  { roll: [35, 36], ability: 'Hunting', description: 'The weapon was fashioned to slay monstrous beasts. Against non-sentient foes, the weapon rolls any damage it inflicts twice and takes the higher.' },
  { roll: [37, 38], ability: 'Illuminating', description: 'The weapon casts light up to 60’ in radius at the wielder’s mental command. By accepting one point of System Strain, the bearer may make the light visible only to them and their allies; such selective light lasts for an hour.' },
  { roll: [39, 40], ability: 'Innervating', description: 'A wielder who uses Effort, such as a High Mage or a Vowed, may accept a point of System Strain to gain an additional bonus point of Effort for as long as they carry the weapon. This System Strain cannot be recovered until the weapon is put aside. Only one Innervating weapon can help a bearer at once. If the weapon is dropped or lost for more than an hour, the Effort and any effect it may be supporting are lost.' },
  { roll: [41, 42], ability: 'Longarm', description: 'A ranged weapon’s effective range is doubled. If it’s a melee weapon without the Long quality, it gains it, and if it already has the Long quality, it now extends out to 20 feet.' },
  { roll: [43, 44], ability: 'Lucky', description: 'The weapon confers an unpredictable and unreliable luck on its bearer. As an Instant action, they can call on this luck to reroll an attack roll, damage roll, or skill check made during combat, taking the better of the two rolls. They can use this ability only once per scene, and every time they use it, they must roll 1d6 as well; on a 1, the attempted roll fails or rolls minimum damage instead.' },
  { roll: [45, 46], ability: 'Marking', description: 'When the weapon harms or even touches a target, the wielder can choose to gain a point of System Strain and activate its marking power. For the rest of the scene, the weapon can strike the target as if they were adjacent, regardless of their distance or any intervening cover. They are also perfectly aware of the marked target’s location, speech, and physical actions. The mark ends at the end of the scene, when a new target is marked, or when the marked target gets more than five hundred feet away.' },
  { roll: [47, 48], ability: 'Merciful', description: 'The weapon never kills any target it reduces to zero hit points; instead, they are immediately stabilized and will awaken an hour later with one hit point. The damage that this weapon inflicts is completely painless and leaves no visible physical marks.' },
  { roll: [49, 50], ability: 'Negating', description: 'The weapon feeds on the arcane power of spells and magical weapons used against its bearer. When the bearer is targeted by a magical spell, arcane power, or the special powers of a magical weapon, they may accept a point of System Strain as an Instant action and make a Physical saving throw; on a success, they are unaffected. This save may only be attempted once per instance of effect.' },
  { roll: [51, 52], ability: 'Nightwalking', description: 'The weapon allows the bearer to step through shadows, entering one and appearing in another no more than a hundred feet away as a Move action. Even very small shadows will suffice, and one is generally available in any area not devoid of light or objects to cast them.' },
  { roll: [53, 54], ability: 'Omened', description: 'Once per day the weapon can provide a yes, no, or unclear answer to a single question asked by a wielder regarding events that could happen to the wielder within the next hour. The weapon’s answer is the GM’s best estimate of likelihood, and may not be correct if events play out in an unexpected way. Thus, asking “Will I win this hand of cards?” might result in the GM dicing out the result and telling the PC yes or no based on what will happen should they play, but if the PC knifes their gambling partner partway through the draw the weapon’s answer would no longer apply.' },
  { roll: [55, 56], ability: 'Penetrating', description: 'This weapon ignores non-magical armor, shields, or beast hides for purposes of determining Shock susceptibility.' },
  { roll: [57, 58], ability: 'Phantom', description: 'As an On Turn action, the bearer can turn the weapon invisible and intangible to anyone but themselves, or revert the weapon to visibility. While invisible the weapon can harm only intangible or immaterial foes, but it cannot be detected or touched by others.' },
  { roll: [59, 60], ability: 'Phasing', description: 'The weapon can be tuned to pass through solid obstacles, striking only those objects or targets the bearer wills. Causing the weapon to phase is an On Turn action that adds one point of System Strain to the bearer; until the end of the round, the weapon ignores any armor, cover, or barrier that interposes.' },
  { roll: [61, 62], ability: 'Piercing', description: 'This weapon inflicts its Shock damage on everything the wielder attacks with it, even if the target is normally immune to Shock. However, the weapon never inflicts more than its Shock damage, whether or not the attack roll hits. If the weapon doesn’t normally do Shock, it gains a base Shock rating of 2/-. ' },
  { roll: [63, 64], ability: 'Radioactive', description: 'The weapon emits a constant invisible radiance of toxic power. As an On Turn action the bearer can drop or restore the safeguards on the weapon. While unleashed the weapon glows deep blue and everyone within melee range of the bearer, including the bearer, will take 1d10 damage at the end of the bearer’s turn each round unless somehow shielded against radioactivity. Creatures with one hit die automatically die if so poisoned, regardless of the damage roll.' },
  { roll: [65, 66], ability: 'Rampaging', description: 'Whenever this weapon kills a creature with at least one hit die, its bearer may immediately make another attack on any target within range. If no additional targets are available, the wielder instead gets an instant free Move action.' },
  { roll: [67, 68], ability: 'Rectifying', description: 'The weapon is exceptionally potent against undead, robots, and other synthetic life forms. All damage done to such creatures is rolled twice, with the better number taken. The weapon can affect even insubstantial or otherwise immune entities of that type, and an undead creature killed by this weapon is permanently put to rest barring tremendous powers of revivification or immortality.' },
  { roll: [69, 70], ability: 'Returning', description: 'If thrown, dropped, or disarmed, the weapon can be called back to the owner’s hand as an On Turn action. A new possessor becomes the owner after carrying it for at least an hour.' },
  { roll: [71, 72], ability: 'Sacrificial', description: 'The weapon’s violence is fueled by the wielder’s own life force. As an Instant action on a hit, the wielder may accept 1d8 hit points of damage; double this damage is inflicted on the target. This damage may be enough to mortally wound the weapon’s own wielder.' },
  { roll: [73, 74], ability: 'Shattering', description: 'The weapon can be used to smash inanimate objects and barriers. Once per scene, with one minute of careful preparation, the wielder can break a man-sized hole in a normal exterior wall or up to a foot of stone. If they accept a point of System Strain, they can do so as a Main Action instead, and may do so as often as they have System Strain available. Shattering blows inflict no special damage on animate targets.' },
  { roll: [75, 76], ability: 'Shieldbreaking', description: 'The weapon ignores all shields, both their Armor Class bonus and their Shock protection. Non-magical shields are destroyed by the weapon’s attack, whether or not the attack hits.' },
  { roll: [77, 78], ability: 'Shocking', description: 'The weapon’s Shock damage is increased by 2 points. If it has no natural Shock score, it gains a Shock rating of 2/AC 15.' },
  { roll: [79, 80], ability: 'Shrieking', description: 'At the wielder’s will, the weapon emits an ear-splitting shriek while in use. The wielder and up to a dozen allies are immune to this effect, but others who are within 60 feet of the wielder are unable to hear themselves speak, and spellcasters must make Wis/Magic skill checks at a difficulty of 7 plus the spell level to successfully cast spells without fumbling the incantations. All Instinct checks made within the area suffer a -2 penalty. The shrieking is completely inaudible outside the sixty-foot radius of effect.' },
  { roll: [81, 82], ability: 'Skittering', description: 'When the weapon is shot or thrown at a location within sixty feet, the wielder may instantly appear where the weapon was thrown or struck as an On Turn action, provided they do so in the same round. If thrown, they appear with the weapon in their hand. This ability may be used only once per round.' },
  { roll: [83, 84], ability: 'Skytreading', description: 'The weapon’s bearer falls gently from any height, becoming immune to falling damage. By accepting one point of System Strain as an On Turn action, they may fly at their full normal movement rate until the end of the round.' },
  { roll: [85, 86], ability: 'Slaughtering', description: 'The weapon hideously disjects its victims. Any target reduced to zero hit points by the weapon is immediately killed and violently dismembered. Any enemies with a Morale score of less than 12 who are within melee range of the slaughtered victim take the weapon’s Shock damage as emotional trauma and horror, even if they’re normally immune to Shock. Weapons that don’t do Shock damage inflict 2 points of damage to these bystanders instead. This weapon cannot be used for less than lethal attacks.' },
  { roll: [87, 88], ability: 'Souleating', description: 'While this weapon may or may not devour the actual soul of the target, such as it may be, it channels great vital force to the wielder. Every time they kill a sentient creature with the weapon, they lose one accumulated System Strain point. This effect can trigger only once per scene.' },
  { roll: [89, 90], ability: 'Spellcleaving', description: 'At a cost of a Move action and one System Strain gained by the wielder, the weapon can apply an Extirpate Arcana spell effect to any target point within range of the weapon. The spell is cast as if by a tenth level High Mage with a total Int/Magic skill bonus of +3. This power can be used only once per scene.' },
  { roll: [91, 92], ability: 'Terrifying', description: 'The weapon is wrought with psychic distress, creating an intense burden of fear in those who oppose its wielder. Whenever the wielder does something that provokes a Morale or Instinct check, any targets who can see them must make the check at a -1 penalty. This effect does not stack with multiple weapons, nor does it affect those with Morale 12.' },
  { roll: [93, 94], ability: 'Toxic', description: 'The weapon sweats a potent toxin. When it hits a living target, the wielder may accept a point of System Strain to trigger the toxin’s effect; the victim is racked with spasms of torment and cannot speak or cry out while they remain poisoned. Each round they take 1d8 damage at the end of their turn; they can try to throw off the poison’s effects by making a successful Physical saving throw at the end of their round. A creature can only be poisoned once by this weapon at any one time.' },
  { roll: [95, 96], ability: 'Vengeful', description: 'The weapon will always succeed at any attack roll made against a foe who has harmed the wielder within the past round, assuming success is physically possible. Such vengeful strikes roll damage twice and take the higher roll.' },
  { roll: [97, 98], ability: 'Versatile', description: 'The weapon shifts forms to better suit the bearer’s need. As an On Turn action, the wielder can give it one of the following qualities it doesn’t already have: Subtle, Long, or Throwable. If thrown, it returns to the bearer’s hand at the end of the round.' },
  { roll: [99, 100], ability: 'Vigilant', description: 'The weapon’s bearer cannot be surprised by anyone who is carrying a manufactured weapon. The bearer does not need to sleep, though they do not recover lost hit points or accumulated System Strain without doing so.' }
];

// Utility functions for random rolls and lookups can be added here.
