import React, { useState } from 'react';
import './MonstersPage.css';

const MonstersPage = ({ onBack }) => {
  const [generatedMonsters, setGeneratedMonsters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingMonster, setEditingMonster] = useState(null);
  const [showSelectionModal, setShowSelectionModal] = useState(null);

  const monsterIcons = ['👹', '🦍', '🕷️', '🦅', '🪲', '🐺', '🐴', '🐅', '🐟', '🦎', '🐍', '🐻', '🐝', '🐲', '🦇', '🐙', '🦈', '🐊', '🕸️', '🦂'];

  const monstrousDrives = [
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
  const animalTypes = [
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

  const bodyPlans = [
    { roll: 1, plan: 'Limbless, amorphous, or a tentacular mass' },
    { roll: [2, 3], plan: 'Bipedal, generally upright' },
    { roll: [4, 5, 6, 7], plan: 'Quadrupedal, perhaps able to rear up' },
    { roll: 8, plan: 'Sexapedal, perhaps with wings and legs' }
  ];

  const survivalMethods = [
    { roll: 1, method: 'It requires very little food for survival' },
    { roll: 2, method: 'It\'s poisonous and repels its predators' },
    { roll: 3, method: 'It eats something other creatures can\'t' },
    { roll: 4, method: 'It\'s newly introduced in the area' },
    { roll: 5, method: 'It doesn\'t need food in a normal sense' },
    { roll: 6, method: 'It exists in symbiosis with something else' }
  ];

  const huntingMethods = [
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

  const bodyParts = {
    mammalian: ['Thick fur', 'Tail', 'Paws', 'Hooves', 'Hands', 'Fangs', 'Claws', 'Visible ears', 'Stenches', 'Leathery hide', 'Bat wings', 'Horns'],
    insectile: ['Compound eyes', 'Stings', 'Mandibles', 'Spinnerets', 'Swarms', 'Membrane wings', 'Egg sacs', 'Blood-sucking', 'Parasitizing', 'Larval forms', 'Leaping', 'Numerous legs'],
    reptilian: ['Poisons', 'Slitted eyes', 'Fangs', 'Scaled skin', 'Silence', 'Draconic wings', 'Thick hide', 'Crawling', 'Cold-blooded', 'Camouflage', 'Crushing jaws', 'Wall-climbing'],
    avian: ['Feathers', 'Beak', 'Talons', 'Light body', 'Songs', 'Bright colors', 'Sharp eyes', 'Eggs', 'Diving', 'Flocks', 'Regurgitation', 'Guano'],
    piscene: ['Scales', 'Bulging eyes', 'Fins', 'Suckers', 'Tentacles', 'Pincers', 'Rubbery hide', 'Huge maws', 'Water jets', 'Slime', 'Spines', 'Mineral deposit'],
    exotic: ['Tentacles', 'Sacs', 'Wheels', 'Balloons', 'Tendrils', 'Launchers', 'Treads', 'Jets', 'Secretions', 'Translucence', 'Alien smells', 'Unliving matter']
  };

  // Utility functions for rolling dice
  const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;
  const rollD6 = () => rollDie(6);
  const rollD8 = () => rollDie(8);
  const rollD10 = () => rollDie(10);
  const rollD12 = () => rollDie(12);

  const getTableResult = (roll, table) => {
    return table.find(entry => {
      if (Array.isArray(entry.roll)) {
        return entry.roll.includes(roll);
      }
      return entry.roll === roll;
    });
  };

  const getRandomArrayItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const getMonsterIcon = (animalType) => {
    switch (animalType) {
      case 'Apish': return '🦍';
      case 'Arachnid': return '🕷️';
      case 'Avian': return '🦅';
      case 'Beetle-like': return '🪲';
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

  const updateMonsterField = (monsterId, field, value) => {
    setGeneratedMonsters(prev => 
      prev.map(monster => 
        monster.id === monsterId 
          ? { ...monster, [field]: value }
          : monster
      )
    );
  };

  const updateMonsterName = (monsterId, newName) => {
    updateMonsterField(monsterId, 'name', newName);
  };

  const updateMonsterIcon = (monsterId, newIcon) => {
    updateMonsterField(monsterId, 'icon', newIcon);
  };

  const openSelectionModal = (monsterId, field, options) => {
    setShowSelectionModal({
      monsterId,
      field,
      options,
      currentValue: generatedMonsters.find(m => m.id === monsterId)[field]
    });
  };

  const selectOption = (option) => {
    if (showSelectionModal) {
      updateMonsterField(showSelectionModal.monsterId, showSelectionModal.field, option);
      setShowSelectionModal(null);
    }
  };

  const removeBodyPart = (monsterId, partIndex) => {
    const monster = generatedMonsters.find(m => m.id === monsterId);
    const updatedBodyParts = monster.bodyParts.filter((_, index) => index !== partIndex);
    updateMonsterField(monsterId, 'bodyParts', updatedBodyParts);
  };

  const addBodyPart = (monsterId, category, feature) => {
    const monster = generatedMonsters.find(m => m.id === monsterId);
    const newBodyPart = { category, feature };
    
    // Check if this feature already exists
    if (!monster.bodyParts.some(part => part.feature === feature)) {
      const updatedBodyParts = [...monster.bodyParts, newBodyPart];
      updateMonsterField(monsterId, 'bodyParts', updatedBodyParts);
    }
  };

  const openBodyPartCategoryModal = (monsterId) => {
    const categories = Object.keys(bodyParts);
    setShowSelectionModal({
      monsterId,
      field: 'bodyPartCategory',
      options: categories,
      currentValue: null
    });
  };

  const openBodyPartSelectionModal = (monsterId, category) => {
    setShowSelectionModal({
      monsterId,
      field: 'bodyPartSelection',
      options: bodyParts[category],
      currentValue: null,
      selectedCategory: category
    });
  };

  const handleBodyPartSelection = (option) => {
    if (showSelectionModal.field === 'bodyPartCategory') {
      // User selected a category, now show parts in that category
      openBodyPartSelectionModal(showSelectionModal.monsterId, option);
    } else if (showSelectionModal.field === 'bodyPartSelection') {
      // User selected a specific body part
      addBodyPart(showSelectionModal.monsterId, showSelectionModal.selectedCategory, option);
      setShowSelectionModal(null);
    }
  };

  const generateMonster = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Roll for basic characteristics
      const animalTypeRoll = rollD12();
      const bodyPlanRoll = rollD8();
      const survivalMethodRoll = rollD6();
      const huntingMethodRoll = rollD10();
      
      // Get results from tables
      const animalType = getTableResult(animalTypeRoll, animalTypes);
      const bodyPlan = getTableResult(bodyPlanRoll, bodyPlans);
      const survivalMethod = getTableResult(survivalMethodRoll, survivalMethods);
      const huntingMethod = getTableResult(huntingMethodRoll, huntingMethods);
      
      // Roll for 1-3 characteristic body parts
      const numBodyParts = 2;
      const selectedBodyParts = [];
      
      for (let i = 0; i < numBodyParts; i++) {
        const categoryRoll = rollD6();
        let category;
        switch (categoryRoll) {
          case 1: category = 'mammalian'; break;
          case 2: category = 'insectile'; break;
          case 3: category = 'reptilian'; break;
          case 4: category = 'avian'; break;
          case 5: category = 'piscene'; break;
          case 6: category = 'exotic'; break;
          default: category = 'mammalian';
        }
        
        const bodyPart = getRandomArrayItem(bodyParts[category]);
        if (!selectedBodyParts.some(part => part.feature === bodyPart)) {
          selectedBodyParts.push({
            category: category,
            feature: bodyPart
          });
        }
      }
      
      // Roll for monstrous drive
      const monstrousDriveRoll = rollD12();
      const monstrousDrive = monstrousDrives[monstrousDriveRoll - 1];
      
      // Create monster object
      const monster = {
        id: generatedMonsters.length + 1,
        name: `${animalType.type} Beast`,
        icon: getMonsterIcon(animalType.type),
        animalType: animalType,
        bodyPlan: bodyPlan,
        survivalMethod: survivalMethod,
        huntingMethod: huntingMethod,
        monstrousDrive: monstrousDrive,
        bodyParts: selectedBodyParts,
        generatedAt: new Date().toLocaleTimeString()
      };
      
      setGeneratedMonsters(prev => [...prev, monster]);
      setIsGenerating(false);
    }, 500);
  };

  const clearMonsters = () => {
    setGeneratedMonsters([]);
  };

  return (
    <div className="monsters-page">
      <header className="monsters-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Menu
        </button>
        <h1>👹 Monster Generator</h1>
        <p>Generate randomized monsters based on the "Without Number" monster creation rules</p>
      </header>

      <div className="input-section">
        <div className="button-group">
          <button 
            onClick={generateMonster}
            disabled={isGenerating}
            className="generate-btn"
          >
            {isGenerating ? 'Generating...' : '🎲 Generate Monster'}
          </button>
          
          <button 
            onClick={clearMonsters}
            disabled={generatedMonsters.length === 0}
            className="clear-btn"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {generatedMonsters.length > 0 && (
        <div className="monsters-container">
          <h2>Generated Monsters</h2>
          <div className="monsters-grid">
            {generatedMonsters.map((monster) => (
              <div key={monster.id} className="monster-card">
                <div className="monster-header">
                  <div className="monster-title-section">
                    <div className="monster-icon-selector">
                      <div 
                        className="icon-display"
                        onClick={() => openSelectionModal(monster.id, 'icon', monsterIcons)}
                      >
                        {monster.icon}
                      </div>
                    </div>
                    <input
                      type="text"
                      className="monster-name-input"
                      value={monster.name}
                      onChange={(e) => updateMonsterName(monster.id, e.target.value)}
                      placeholder="Monster Name"
                    />
                  </div>
                </div>
                
                <div className="monster-details">
                  <div 
                    className="animal-type-section clickable-section"
                    onClick={() => openSelectionModal(monster.id, 'animalType', animalTypes)}
                  >
                    <strong>Animal Type: 🎲</strong> {monster.animalType.type}
                    <div className="detail-description">
                      {monster.animalType.description}
                    </div>
                  </div>

                  <div 
                    className="body-plan-section clickable-section"
                    onClick={() => openSelectionModal(monster.id, 'bodyPlan', bodyPlans)}
                  >
                    <strong>Body Plan: 🎲</strong>
                    <div className="detail-description">
                      {monster.bodyPlan.plan}
                    </div>
                  </div>

                  <div 
                    className="survival-section clickable-section"
                    onClick={() => openSelectionModal(monster.id, 'survivalMethod', survivalMethods)}
                  >
                    <strong>Survival Method: 🎲</strong>
                    <div className="detail-description">
                      {monster.survivalMethod.method}
                    </div>
                  </div>

                  <div 
                    className="hunting-section clickable-section"
                    onClick={() => openSelectionModal(monster.id, 'huntingMethod', huntingMethods)}
                  >
                    <strong>Hunting Method: 🎲</strong>
                    <div className="detail-description">
                      {monster.huntingMethod.method}
                    </div>
                  </div>

                  <div 
                    className="monstrous-drive-section clickable-section"
                    onClick={() => openSelectionModal(monster.id, 'monstrousDrive', monstrousDrives)}
                  >
                    <strong>Monstrous Drive: 🎲</strong>
                    <div className="detail-description">
                      {monster.monstrousDrive}
                    </div>
                  </div>

                  <div className="body-parts-section">
                    <div className="body-parts-header">
                      <strong>Characteristic Features:</strong>
                      <button 
                        className="add-body-part-btn"
                        onClick={() => openBodyPartCategoryModal(monster.id)}
                        title="Add new body part"
                      >
                        + Add Feature
                      </button>
                    </div>
                    <div className="body-parts-list">
                      {monster.bodyParts.map((part, index) => (
                        <span key={index} className={`body-part ${part.category}`}>
                          {part.feature}
                          <button 
                            className="remove-body-part"
                            onClick={() => removeBodyPart(monster.id, index)}
                            title="Remove this feature"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Modal */}
      {showSelectionModal && (
        <div className="modal-overlay" onClick={() => setShowSelectionModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {showSelectionModal.field === 'icon' ? 'Choose Icon' : 
                 showSelectionModal.field === 'animalType' ? 'Choose Animal Type' :
                 showSelectionModal.field === 'bodyPlan' ? 'Choose Body Plan' :
                 showSelectionModal.field === 'survivalMethod' ? 'Choose Survival Method' :
                 showSelectionModal.field === 'huntingMethod' ? 'Choose Hunting Method' :
                 showSelectionModal.field === 'monstrousDrive' ? 'Choose Monstrous Drive' :
                 showSelectionModal.field === 'bodyPartCategory' ? 'Choose Body Part Category' :
                 showSelectionModal.field === 'bodyPartSelection' ? `Choose ${showSelectionModal.selectedCategory} Feature` :
                 'Choose Option'}
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowSelectionModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {showSelectionModal.field === 'icon' ? (
                <div className="icon-grid">
                  {showSelectionModal.options.map((icon, index) => (
                    <div
                      key={index}
                      className={`icon-option ${icon === showSelectionModal.currentValue ? 'selected' : ''}`}
                      onClick={() => selectOption(icon)}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              ) : showSelectionModal.field === 'bodyPartCategory' ? (
                <div className="category-grid">
                  {showSelectionModal.options.map((category, index) => (
                    <div
                      key={index}
                      className="category-option"
                      onClick={() => handleBodyPartSelection(category)}
                    >
                      <span className="category-name">{category}</span>
                      <span className="category-count">
                        {bodyParts[category].length} options
                      </span>
                    </div>
                  ))}
                </div>
              ) : showSelectionModal.field === 'bodyPartSelection' ? (
                <div className="body-part-options">
                  {showSelectionModal.options.map((part, index) => (
                    <div
                      key={index}
                      className="body-part-option"
                      onClick={() => handleBodyPartSelection(part)}
                    >
                      <span className={`category-tag ${showSelectionModal.selectedCategory}`}>
                        {showSelectionModal.selectedCategory}
                      </span>
                      <span className="part-name">{part}</span>
                    </div>
                  ))}
                </div>
              ) : showSelectionModal.field === 'monstrousDrive' ? (
                <div className="options-list">
                  {showSelectionModal.options.map((drive, index) => (
                    <div
                      key={index}
                      className={`option-item ${drive === showSelectionModal.currentValue ? 'selected' : ''}`}
                      onClick={() => selectOption(drive)}
                    >
                      <span className="option-number">#{index + 1}</span>
                      <span className="option-text">{drive}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="options-list">
                  {showSelectionModal.options.map((option, index) => {
                    const isSelected = JSON.stringify(option) === JSON.stringify(showSelectionModal.currentValue);
                    return (
                      <div
                        key={index}
                        className={`option-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => selectOption(option)}
                      >
                        <span className="option-number">
                          {Array.isArray(option.roll) ? `${option.roll[0]}-${option.roll[option.roll.length - 1]}` : `#${option.roll}`}
                        </span>
                        <div className="option-content">
                          {option.type && <span className="option-title">{option.type}</span>}
                          <span className="option-text">
                            {option.description || option.plan || option.method}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonstersPage;
