import React, { useState } from 'react';
import './ItemsPage.css';
import { useItemPDFGenerator } from './ItemPDFGenerator';
import {
  generateMagicalArmor,
  rollArmorEnchantment,
  rollSpecialAbilitiesCount,
  rollArmorType,
  rollShieldType,
  rollMagicalAbility,
  armorTypeTable,
  shieldTypeTable,
  magicalAbilitiesTable,
  minorArmorEnchantmentTable,
  majorArmorEnchantmentTable,
  greatArmorEnchantmentTable
} from '../../components/Tables';
import {
  generateMagicalWeapon,
  rollWeaponEnchantment,
  rollWeaponUser,
  rollWeaponType,
  rollSpecialWeaponAbilitiesCount,
  rollMagicalWeaponAbility
} from '../../components/Tables';
import {
  weaponTypeTable,
  magicalWeaponAbilitiesTable
} from '../../components/Tables/weaponsTable';

const ItemsPage = ({ onBack }) => {
  const [generatedItems, setGeneratedItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showItemTypeSelector, setShowItemTypeSelector] = useState(false);
  const [showRaritySelector, setShowRaritySelector] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(null);
  const [showAbilitySelector, setShowAbilitySelector] = useState(null);
  const [showSelectionModal, setShowSelectionModal] = useState(null);
  const { generatePDF } = useItemPDFGenerator();

  const updateItemField = (itemId, field, value) => {
    setGeneratedItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const openSelectionModal = (itemId, field, options) => {
    setShowSelectionModal({
      itemId,
      field,
      options,
      title: `Select ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
    });
  };

  const selectOption = (option) => {
    if (showSelectionModal) {
      const { itemId, field } = showSelectionModal;
      
      if (field === 'baseItem') {
        updateItemField(itemId, 'baseItem', { type: option.type });
      } else if (field === 'enchantmentBonus') {
        updateItemField(itemId, 'enchantmentBonus', { bonus: option });
      }
      
      setShowSelectionModal(null);
    }
  };

  const addSpecialAbility = (itemId, ability) => {
    setGeneratedItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, specialAbilities: [...(item.specialAbilities || []), ability] }
          : item
      )
    );
    setShowAbilitySelector(null);
  };

  const removeSpecialAbility = (itemId, abilityIndex) => {
    setGeneratedItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              specialAbilities: item.specialAbilities.filter((_, index) => index !== abilityIndex)
            }
          : item
      )
    );
  };

  const generateItem = async (itemType, rarity) => {
    setIsGenerating(true);
    setShowItemTypeSelector(false);
    setShowRaritySelector(null);
    try {
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      let newItem;
      if (itemType === 'weapon') {
        newItem = generateMagicalWeapon(rarity);
      } else {
        newItem = generateMagicalArmor(rarity, itemType);
      }
      const itemWithId = {
        ...newItem,
        id: Date.now() + Math.random(),
        name: `${newItem.enchantmentBonus ? newItem.enchantmentBonus.bonus + ' ' : ''}${newItem.baseItem.type}${newItem.specialAbilities && newItem.specialAbilities.length > 0 ? ' of ' + newItem.specialAbilities[0].ability : ''}`,
        createdAt: new Date().toISOString()
      };
      setGeneratedItems(prev => [itemWithId, ...prev]);
    } catch (error) {
      console.error('Error generating item:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteItem = (itemId) => {
    setGeneratedItems(prev => prev.filter(item => item.id !== itemId));
    setShowDeleteConfirmModal(null);
  };

  const clearAllItems = () => {
    setGeneratedItems([]);
  };

  const exportItems = () => {
    if (generatedItems.length === 0) return;
    
    const dataStr = JSON.stringify(generatedItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `magical-items-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importItems = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedItems = JSON.parse(e.target.result);
        if (Array.isArray(importedItems)) {
          setGeneratedItems(prev => [...importedItems, ...prev]);
        }
      } catch (error) {
        console.error('Error importing items:', error);
      }
    };
    reader.readAsText(file);
  };

  const exportItemsToPDF = async () => {
    if (generatedItems.length === 0) {
      alert('No items to export. Please generate items first.');
      return;
    }

    try {
      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `magical_items_${timestamp}`;
      
      const success = await generatePDF(generatedItems, filename);
      if (success) {
        // console.log('PDF generated successfully');
      } else {
        alert('Error generating PDF. Please try again.');
      }
    } catch (error) {
      // console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const ItemTypeSelector = () => (
    <div className="modal-overlay" onClick={() => setShowItemTypeSelector(false)}>
      <div className="modal-content item-type-selector" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Item Type</h3>
          <button className="modal-close" onClick={() => setShowItemTypeSelector(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="item-type-options">
            <button 
              className="item-type-option"
              onClick={() => {
                setShowItemTypeSelector(false);
                setShowRaritySelector('armor');
              }}
            >
              🛡️ Armor
            </button>
            <button 
              className="item-type-option"
              onClick={() => {
                setShowItemTypeSelector(false);
                setShowRaritySelector('shield');
              }}
            >
              🛡️ Shield
            </button>
            <button 
              className="item-type-option"
              onClick={() => {
                setShowItemTypeSelector(false);
                setShowRaritySelector('weapon');
              }}
            >
              ⚔️ Weapon
            </button>
          </div>
          <button 
            className="cancel-btn"
            onClick={() => setShowItemTypeSelector(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const RaritySelector = ({ itemType }) => (
    <div className="modal-overlay" onClick={() => setShowRaritySelector(null)}>
      <div className="modal-content rarity-selector" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select {itemType === 'armor' ? 'Armor' : itemType === 'shield' ? 'Shield' : 'Weapon'} Rarity</h3>
          <button className="modal-close" onClick={() => setShowRaritySelector(null)}>×</button>
        </div>
        <div className="modal-body">
          <div className="rarity-options">
            <button 
              className="rarity-option minor"
              onClick={() => generateItem(itemType, 'minor')}
            >
              <div className="rarity-header">
                <span className="rarity-icon">⚡</span>
                <span className="rarity-name">Minor</span>
              </div>
              <div className="rarity-description">
                Basic magical enhancement
              </div>
            </button>
            <button 
              className="rarity-option major"
              onClick={() => generateItem(itemType, 'major')}
            >
              <div className="rarity-header">
                <span className="rarity-icon">💫</span>
                <span className="rarity-name">Major</span>
              </div>
              <div className="rarity-description">
                Significant magical power
              </div>
            </button>
            <button 
              className="rarity-option great"
              onClick={() => generateItem(itemType, 'great')}
            >
              <div className="rarity-header">
                <span className="rarity-icon">✨</span>
                <span className="rarity-name">Great</span>
              </div>
              <div className="rarity-description">
                Legendary magical artifact
              </div>
            </button>
          </div>
          <button 
            className="cancel-btn"
            onClick={() => setShowRaritySelector(null)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );

  const AbilitySelector = ({ itemId, existingAbilities = [] }) => {
    const item = generatedItems.find(i => i.id === itemId);
    const isWeapon = item && item.type === 'weapon';
    const abilityTable = isWeapon ? magicalWeaponAbilitiesTable : magicalAbilitiesTable;
    return (
      <div className="modal-overlay" onClick={() => setShowAbilitySelector(null)}>
        <div className="modal-content ability-selector" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Add Special Ability</h3>
            <button className="modal-close" onClick={() => setShowAbilitySelector(null)}>×</button>
          </div>
          <div className="modal-body">
            <div className="ability-options">
              {abilityTable
                .filter(ability => !existingAbilities.some(existing => existing.ability === ability.ability))
                .map((ability, index) => (
                  <button 
                    key={index}
                    className="ability-option"
                    onClick={() => addSpecialAbility(itemId, ability)}
                  >
                    <div className="ability-name">{ability.ability}</div>
                    <div className="ability-desc">{ability.description}</div>
                  </button>
                ))}
            </div>
            <button 
              className="cancel-btn"
              onClick={() => setShowAbilitySelector(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = ({ item }) => (
    <div className="modal-overlay" onClick={() => setShowDeleteConfirmModal(null)}>
      <div className="modal-content delete-confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Delete Item</h3>
          <button className="modal-close" onClick={() => setShowDeleteConfirmModal(null)}>×</button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete "{item.name}"?</p>
          <div className="button-group">
            <button 
              className="delete-btn"
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
            <button 
              className="cancel-btn"
              onClick={() => setShowDeleteConfirmModal(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SelectionModal = () => {
    if (!showSelectionModal) return null;

    const { itemId, field, options, title } = showSelectionModal;

    return (
      <div className="modal-overlay" onClick={() => setShowSelectionModal(null)}>
        <div className="modal-content selection-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={() => setShowSelectionModal(null)}>×</button>
          </div>
          <div className="modal-body">
            <div className="options-list">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="option-item"
                  onClick={() => selectOption(option)}
                >
                  {field === 'baseItem' ? (
                    <div className="option-content">
                      <div className="option-title">{option.type}</div>
                    </div>
                  ) : field === 'enchantmentBonus' ? (
                    <div className="option-content">
                      <div className="option-title">{option}</div>
                    </div>
                  ) : (
                    <div className="option-content">
                      <div className="option-title">{option.name || option}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="items-page">
      <button className="back-button" onClick={onBack}>
        ← Back to Menu
      </button>

      <div className="items-header">
        <h1>Magical Items Generator</h1>
        <p>Generate magical armor and shields for your adventures</p>
      </div>

      <div className="input-section">
        <div className="button-group">
          <button 
            className="generate-btn"
            onClick={() => setShowItemTypeSelector(true)}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : '✨ Generate Item'}
          </button>
          <button 
            className="clear-btn"
            onClick={clearAllItems}
            disabled={generatedItems.length === 0}
          >
            🗑️ Clear All
          </button>
          <button 
            className="export-btn"
            onClick={exportItems}
            disabled={generatedItems.length === 0}
          >
            📤 Export
          </button>
          <label className="import-btn">
            📥 Import
            <input
              type="file"
              accept=".json"
              onChange={importItems}
              style={{ display: 'none' }}
            />
          </label>
          <button 
            className="print-btn"
            onClick={exportItemsToPDF}
            disabled={generatedItems.length === 0}
            title="Export items to PDF"
          >
            � Export PDF
          </button>
        </div>
      </div>

      <div className="items-results">
        {generatedItems.length === 0 ? (
          <div className="no-items">
            <p>No items generated yet. Click "Generate Item" to create magical armor and shields!</p>
          </div>
        ) : (
          <div className="items-grid">
            {generatedItems.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <div className="item-title-section">
                    <div className="item-icon">{item.icon}</div>
                    <div className="item-title">
                      {editingItem === item.id ? (
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItemField(item.id, 'name', e.target.value)}
                          className="edit-input"
                          onBlur={() => setEditingItem(null)}
                          onKeyPress={(e) => e.key === 'Enter' && setEditingItem(null)}
                          autoFocus
                        />
                      ) : (
                        <h3 onClick={() => setEditingItem(item.id)} className="editable-field">
                          {item.name} ✏️
                        </h3>
                      )}
                      <span className="item-rarity">{item.rarity} {item.type}</span>
                    </div>
                  </div>
                  <button 
                    className="delete-item-btn"
                    onClick={() => setShowDeleteConfirmModal(item)}
                  >
                    ×
                  </button>
                </div>

                <div className="item-details">
                  {item.type === 'weapon' ? (
                    <>
                      <div className="item-section">
                        <strong>User:</strong> <span className="detail-description">{item.user?.user}</span>
                      </div>
                      <div className="item-section clickable-section"
                        onClick={() => openSelectionModal(
                          item.id,
                          'baseItem',
                          weaponTypeTable
                        )}
                      >
                        <strong>Weapon Type:</strong> <span className="detail-description">{item.baseItem?.type}</span>
                      </div>
                      <div className="item-section clickable-section"
                        onClick={() => openSelectionModal(
                          item.id,
                          'enchantmentBonus',
                          ['+1', '+2', '+3']
                        )}
                      >
                        <strong>Enchantment:</strong> <span className="detail-description">{item.enchantmentBonus?.bonus || '+1'}</span>
                      </div>
                      <div className="item-section">
                        <div className="abilities-header">
                          <strong>Special Abilities</strong>
                          <button 
                            className="add-ability-btn"
                            onClick={() => setShowAbilitySelector(item.id)}
                          >
                            + Add
                          </button>
                        </div>
                        {item.specialAbilities && item.specialAbilities.length > 0 ? (
                          item.specialAbilities.map((ability, index) => (
                            <div key={index} className="ability-item">
                              <div className="ability-content">
                                <strong>{ability.ability}:</strong>
                                <span>{ability.description}</span>
                              </div>
                              <button 
                                className="remove-ability-btn"
                                onClick={() => removeSpecialAbility(item.id, index)}
                              >
                                ×
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="no-abilities">No special abilities</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div 
                        className="item-section clickable-section"
                        onClick={() => openSelectionModal(
                          item.id, 
                          'baseItem', 
                          item.type === 'shield' ? shieldTypeTable : armorTypeTable
                        )}
                      >
                        <strong>Base Item:</strong>
                        <span className="detail-description">{item.baseItem.type}</span>
                      </div>
                      {item.type !== 'shield' && (
                        <div 
                          className="item-section clickable-section"
                          onClick={() => openSelectionModal(
                            item.id,
                            'enchantmentBonus',
                            ['+1', '+2', '+3']
                          )}
                        >
                          <strong>Enchantment:</strong>
                          <span className="detail-description">{item.enchantmentBonus?.bonus || '+1'}</span>
                        </div>
                      )}
                      <div className="item-section">
                        <div className="abilities-header">
                          <strong>Special Abilities</strong>
                          <button 
                            className="add-ability-btn"
                            onClick={() => setShowAbilitySelector(item.id)}
                          >
                            + Add
                          </button>
                        </div>
                        {item.specialAbilities && item.specialAbilities.length > 0 ? (
                          item.specialAbilities.map((ability, index) => (
                            <div key={index} className="ability-item">
                              <div className="ability-content">
                                <strong>{ability.ability}:</strong>
                                <span>{ability.description}</span>
                              </div>
                              <button 
                                className="remove-ability-btn"
                                onClick={() => removeSpecialAbility(item.id, index)}
                              >
                                ×
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="no-abilities">No special abilities</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showItemTypeSelector && <ItemTypeSelector />}
      {showRaritySelector && <RaritySelector itemType={showRaritySelector} />}
      {showAbilitySelector && (
        <AbilitySelector 
          itemId={showAbilitySelector} 
          existingAbilities={generatedItems.find(item => item.id === showAbilitySelector)?.specialAbilities || []}
        />
      )}
      {showDeleteConfirmModal && <DeleteConfirmModal item={showDeleteConfirmModal} />}
      {showSelectionModal && <SelectionModal />}
    </div>
  );
};

export default ItemsPage;
