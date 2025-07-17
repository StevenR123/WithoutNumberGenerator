// Re-export all shared table utilities
export * from './tableUtils';

// Re-export all monster tables and utilities
export * from './monsterTables';

// Re-export all room/dungeon tables and utilities  
export * from './roomTables';

// Re-export all armor tables and utilities
export * from './armorTables';

// Re-export all weapons tables and utilities
export * from './weaponsTable';
// Re-export all weapon generator functions (now in weaponsTable.js)
export {
  rollWeaponEnchantment,
  rollWeaponUser,
  rollWeaponType,
  rollSpecialWeaponAbilitiesCount,
  rollMagicalWeaponAbility,
  generateMagicalWeapon
} from './weaponsTable';
