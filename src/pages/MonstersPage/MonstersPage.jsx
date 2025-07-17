import React, { useState } from 'react';
import './MonstersPage.css';
import { useMonsterPDFGenerator } from './MonsterPDFGenerator';
import {
  monsterIcons,
  monstrousDrives,
  creaturePowerLevels,
  damageInflictionPowers,
  movementPowers,
  debilitatingPowers,
  augmentingPowers,
  intrinsicPowers,
  animalTypes,
  bodyPlans,
  survivalMethods,
  huntingMethods,
  bodyParts,
  rollDie,
  rollD6,
  rollD8,
  rollD10,
  rollD12,
  getTableResult,
  getRandomArrayItem,
  getMonsterIcon
} from '../../components/Tables';

const MonstersPage = ({ onBack }) => {
  const [generatedMonsters, setGeneratedMonsters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingMonster, setEditingMonster] = useState(null);
  const [showSelectionModal, setShowSelectionModal] = useState(null);
  const [showPowerTypeSelector, setShowPowerTypeSelector] = useState(null);
  const [showDamagePowerModal, setShowDamagePowerModal] = useState(null);
  const [showMovementPowerModal, setShowMovementPowerModal] = useState(null);
  const [showDebilitatingPowerModal, setShowDebilitatingPowerModal] = useState(null);
  const [showAugmentingPowerModal, setShowAugmentingPowerModal] = useState(null);
  const [showIntrinsicPowerModal, setShowIntrinsicPowerModal] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(null);
  const [showSpecialIntrinsicModal, setShowSpecialIntrinsicModal] = useState(null);
  const { generatePDF } = useMonsterPDFGenerator();

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

  const openDamagePowerModal = (monsterId) => {
    setShowDamagePowerModal({
      monsterId,
      selectedBasePower: null,
      selectedModifiers: {},
      totalCost: 0
    });
  };

  const calculateDamagePowerCost = (basePower, modifiers) => {
    if (!basePower) return 0;
    
    let cost = basePower.points;
    let multiplier = 1;
    
    // Apply point modifiers first
    damageInflictionPowers.modifiers.forEach(modifier => {
      if (modifiers[modifier.id] && modifier.points !== undefined) {
        cost += modifier.points;
      }
    });
    
    // Apply multipliers
    damageInflictionPowers.modifiers.forEach(modifier => {
      if (modifiers[modifier.id] && modifier.multiplier !== undefined) {
        multiplier *= modifier.multiplier;
      }
    });
    
    const finalCost = cost * multiplier;
    return Math.ceil(finalCost); // Round up any fractions
  };

  const updateDamagePowerSelection = (field, value) => {
    setShowDamagePowerModal(prev => {
      const updated = { ...prev, [field]: value };
      updated.totalCost = calculateDamagePowerCost(updated.selectedBasePower, updated.selectedModifiers);
      return updated;
    });
  };

  const addDamagePower = () => {
    if (!showDamagePowerModal.selectedBasePower) return;
    
    const monster = generatedMonsters.find(m => m.id === showDamagePowerModal.monsterId);
    const damagePower = {
      id: Date.now(), // Simple ID for removal
      basePower: showDamagePowerModal.selectedBasePower,
      modifiers: showDamagePowerModal.selectedModifiers,
      totalCost: showDamagePowerModal.totalCost,
      description: generateDamagePowerDescription(showDamagePowerModal.selectedBasePower, showDamagePowerModal.selectedModifiers)
    };
    
    const updatedDamagePowers = [...(monster.damagePowers || []), damagePower];
    updateMonsterField(showDamagePowerModal.monsterId, 'damagePowers', updatedDamagePowers);
    setShowDamagePowerModal(null);
  };

  const generateDamagePowerDescription = (basePower, modifiers) => {
    let description = basePower.description;
    const activeModifiers = damageInflictionPowers.modifiers.filter(mod => modifiers[mod.id]);
    
    if (activeModifiers.length > 0) {
      const modifierTexts = activeModifiers.map(mod => mod.description.toLowerCase());
      description += ` (${modifierTexts.join(', ')})`;
    }
    
    return description;
  };

  const removeDamagePower = (monsterId, powerId) => {
    const monster = generatedMonsters.find(m => m.id === monsterId);
    const updatedDamagePowers = monster.damagePowers.filter(power => power.id !== powerId);
    updateMonsterField(monsterId, 'damagePowers', updatedDamagePowers);
  };

  const calculateRemainingPowerPoints = (monster) => {
    const totalPoints = monster.powerLevel.points;
    const damagePoints = monster.damagePowers?.reduce((sum, power) => sum + power.totalCost, 0) || 0;
    const movementPoints = monster.movementPowers?.reduce((sum, power) => sum + power.points, 0) || 0;
    const debilitatingPoints = monster.debilitatingPowers?.reduce((sum, power) => sum + power.totalCost, 0) || 0;
    const augmentingPoints = monster.augmentingPowers?.reduce((sum, power) => sum + power.totalCost, 0) || 0;
    const intrinsicPoints = monster.intrinsicPowers?.reduce((sum, power) => sum + power.points, 0) || 0;
    
    const usedPoints = damagePoints + movementPoints + debilitatingPoints + augmentingPoints + intrinsicPoints;
    return totalPoints - usedPoints;
  };

  // Movement Power Functions
  const openMovementPowerModal = (monsterId) => {
    setShowMovementPowerModal({ monsterId });
  };

  const addMovementPower = (power) => {
    const monster = generatedMonsters.find(m => m.id === showMovementPowerModal.monsterId);
    const movementPower = {
      id: Date.now(),
      points: power.points,
      description: power.description
    };
    
    const updatedMovementPowers = [...(monster.movementPowers || []), movementPower];
    updateMonsterField(showMovementPowerModal.monsterId, 'movementPowers', updatedMovementPowers);
    setShowMovementPowerModal(null);
  };

  const removeMovementPower = (monsterId, powerId) => {
    const monster = generatedMonsters.find(m => m.id === monsterId);
    const updatedMovementPowers = monster.movementPowers.filter(power => power.id !== powerId);
    updateMonsterField(monsterId, 'movementPowers', updatedMovementPowers);
  };

  // Debilitating Power Functions
  const openDebilitatingPowerModal = (monsterId) => {
    setShowDebilitatingPowerModal({
      monsterId,
      selectedBasePower: null,
      selectedModifiers: {},
      totalCost: 0
    });
  };

  const calculateDebilitatingPowerCost = (basePower, modifiers) => {
    if (!basePower) return 0;
    
    let cost = basePower.points;
    let multiplier = 1;
    
    // Apply point modifiers first
    debilitatingPowers.modifiers.forEach(modifier => {
      if (modifiers[modifier.id] && modifier.points !== undefined) {
        cost += modifier.points;
      }
    });
    
    // Apply multipliers
    debilitatingPowers.modifiers.forEach(modifier => {
      if (modifiers[modifier.id] && modifier.multiplier !== undefined) {
        multiplier *= modifier.multiplier;
      }
    });
    
    const finalCost = cost * multiplier;
    return Math.ceil(finalCost);
  };

  const updateDebilitatingPowerSelection = (field, value) => {
    setShowDebilitatingPowerModal(prev => {
      const updated = { ...prev, [field]: value };
      updated.totalCost = calculateDebilitatingPowerCost(updated.selectedBasePower, updated.selectedModifiers);
      return updated;
    });
  };

  const addDebilitatingPower = () => {
    if (!showDebilitatingPowerModal.selectedBasePower) return;
    
    const monster = generatedMonsters.find(m => m.id === showDebilitatingPowerModal.monsterId);
    const debilitatingPower = {
      id: Date.now(),
      basePower: showDebilitatingPowerModal.selectedBasePower,
      modifiers: showDebilitatingPowerModal.selectedModifiers,
      totalCost: showDebilitatingPowerModal.totalCost,
      description: generateDebilitatingPowerDescription(showDebilitatingPowerModal.selectedBasePower, showDebilitatingPowerModal.selectedModifiers)
    };
    
    const updatedDebilitatingPowers = [...(monster.debilitatingPowers || []), debilitatingPower];
    updateMonsterField(showDebilitatingPowerModal.monsterId, 'debilitatingPowers', updatedDebilitatingPowers);
    setShowDebilitatingPowerModal(null);
  };

  const generateDebilitatingPowerDescription = (basePower, modifiers) => {
    let description = basePower.description;
    const activeModifiers = debilitatingPowers.modifiers.filter(mod => modifiers[mod.id]);
    
    if (activeModifiers.length > 0) {
      const modifierTexts = activeModifiers.map(mod => mod.description.toLowerCase());
      description += ` (${modifierTexts.join(', ')})`;
    }
    
    return description;
  };

  const removeDebilitatingPower = (monsterId, powerId) => {
    const monster = generatedMonsters.find(m => m.id === monsterId);
    const updatedDebilitatingPowers = monster.debilitatingPowers.filter(power => power.id !== powerId);
    updateMonsterField(monsterId, 'debilitatingPowers', updatedDebilitatingPowers);
  };

  // Augmenting Power Functions
  const openAugmentingPowerModal = (monsterId) => {
    setShowAugmentingPowerModal({
      monsterId,
      selectedBasePower: null,
      selectedModifiers: {},
      totalCost: 0
    });
  };

  const calculateAugmentingPowerCost = (basePower, modifiers) => {
    if (!basePower) return 0;
    
    let cost = basePower.points;
    let multiplier = 1;
    
    // Apply point modifiers first
    augmentingPowers.modifiers.forEach(modifier => {
      if (modifiers[modifier.id] && modifier.points !== undefined) {
        cost += modifier.points;
      }
    });
    
    // Apply multipliers
    augmentingPowers.modifiers.forEach(modifier => {
      if (modifiers[modifier.id] && modifier.multiplier !== undefined) {
        multiplier *= modifier.multiplier;
      }
    });
    
    const finalCost = cost * multiplier;
    return Math.ceil(finalCost);
  };

  const updateAugmentingPowerSelection = (field, value) => {
    setShowAugmentingPowerModal(prev => {
      const updated = { ...prev, [field]: value };
      updated.totalCost = calculateAugmentingPowerCost(updated.selectedBasePower, updated.selectedModifiers);
      return updated;
    });
  };

  const addAugmentingPower = () => {
    if (!showAugmentingPowerModal.selectedBasePower) return;
    
    const monster = generatedMonsters.find(m => m.id === showAugmentingPowerModal.monsterId);
    const augmentingPower = {
      id: Date.now(),
      basePower: showAugmentingPowerModal.selectedBasePower,
      modifiers: showAugmentingPowerModal.selectedModifiers,
      totalCost: showAugmentingPowerModal.totalCost,
      description: generateAugmentingPowerDescription(showAugmentingPowerModal.selectedBasePower, showAugmentingPowerModal.selectedModifiers)
    };
    
    const updatedAugmentingPowers = [...(monster.augmentingPowers || []), augmentingPower];
    updateMonsterField(showAugmentingPowerModal.monsterId, 'augmentingPowers', updatedAugmentingPowers);
    setShowAugmentingPowerModal(null);
  };

  const generateAugmentingPowerDescription = (basePower, modifiers) => {
    let description = basePower.description;
    const activeModifiers = augmentingPowers.modifiers.filter(mod => modifiers[mod.id]);
    
    if (activeModifiers.length > 0) {
      const modifierTexts = activeModifiers.map(mod => mod.description.toLowerCase());
      description += ` (${modifierTexts.join(', ')})`;
    }
    
    return description;
  };

  const removeAugmentingPower = (monsterId, powerId) => {
    const monster = generatedMonsters.find(m => m.id === monsterId);
    const updatedAugmentingPowers = monster.augmentingPowers.filter(power => power.id !== powerId);
    updateMonsterField(monsterId, 'augmentingPowers', updatedAugmentingPowers);
  };

  // Intrinsic Power Functions
  const openIntrinsicPowerModal = (monsterId) => {
    setShowIntrinsicPowerModal({ monsterId });
  };

  const addIntrinsicPower = (power) => {
    // Check if this is the special retribution power
    if (power.requiresSecondaryPower) {
      setShowSpecialIntrinsicModal({
        monsterId: showIntrinsicPowerModal.monsterId,
        basePower: power,
        selectedSecondaryPower: null,
        selectedPowerType: null,
        totalCost: 1 // Base cost is 1
      });
      setShowIntrinsicPowerModal(null);
      return;
    }

    const monster = generatedMonsters.find(m => m.id === showIntrinsicPowerModal.monsterId);
    const intrinsicPower = {
      id: Date.now(),
      points: power.points,
      description: power.description
    };
    
    const updatedIntrinsicPowers = [...(monster.intrinsicPowers || []), intrinsicPower];
    updateMonsterField(showIntrinsicPowerModal.monsterId, 'intrinsicPowers', updatedIntrinsicPowers);
    setShowIntrinsicPowerModal(null);
  };

  const removeIntrinsicPower = (monsterId, powerId) => {
    const monster = generatedMonsters.find(m => m.id === monsterId);
    const updatedIntrinsicPowers = monster.intrinsicPowers.filter(power => power.id !== powerId);
    updateMonsterField(monsterId, 'intrinsicPowers', updatedIntrinsicPowers);
  };

  // Special Intrinsic Power Functions
  const updateSpecialIntrinsicSelection = (field, value) => {
    setShowSpecialIntrinsicModal(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calculate total cost when secondary power is selected
      if (updated.selectedSecondaryPower) {
        let secondaryCost = 0;
        
        if (updated.selectedPowerType === 'damage') {
          secondaryCost = calculateDamagePowerCost(updated.selectedSecondaryPower, updated.selectedModifiers || {});
        } else if (updated.selectedPowerType === 'debilitating') {
          secondaryCost = calculateDebilitatingPowerCost(updated.selectedSecondaryPower, updated.selectedModifiers || {});
        } else {
          secondaryCost = updated.selectedSecondaryPower.points || 0;
        }
        
        updated.totalCost = 1 + secondaryCost; // 1 base + modified secondary cost
      } else {
        updated.totalCost = 1;
      }
      
      return updated;
    });
  };

  const selectSecondaryPowerType = (powerType) => {
    setShowSpecialIntrinsicModal(prev => ({
      ...prev,
      selectedPowerType: powerType,
      selectedSecondaryPower: null,
      selectedModifiers: {},
      totalCost: 1
    }));
  };

  const selectSecondaryPower = (power) => {
    setShowSpecialIntrinsicModal(prev => {
      const updated = {
        ...prev,
        selectedSecondaryPower: power,
        selectedModifiers: {} // Reset modifiers when new power is selected
      };
      
      // Recalculate cost
      let secondaryCost = 0;
      if (updated.selectedPowerType === 'damage') {
        secondaryCost = calculateDamagePowerCost(power, {});
      } else if (updated.selectedPowerType === 'debilitating') {
        secondaryCost = calculateDebilitatingPowerCost(power, {});
      } else {
        secondaryCost = power.points || 0;
      }
      
      updated.totalCost = 1 + secondaryCost;
      return updated;
    });
  };

  const addSpecialIntrinsicPower = () => {
    if (!showSpecialIntrinsicModal.selectedSecondaryPower) return;

    const monster = generatedMonsters.find(m => m.id === showSpecialIntrinsicModal.monsterId);
    const secondaryPower = showSpecialIntrinsicModal.selectedSecondaryPower;
    const modifiers = showSpecialIntrinsicModal.selectedModifiers || {};
    
    // Generate description based on power type and modifiers
    let secondaryDescription = secondaryPower.description;
    if (showSpecialIntrinsicModal.selectedPowerType === 'damage') {
      secondaryDescription = generateDamagePowerDescription(secondaryPower, modifiers);
    } else if (showSpecialIntrinsicModal.selectedPowerType === 'debilitating') {
      secondaryDescription = generateDebilitatingPowerDescription(secondaryPower, modifiers);
    }
    
    const specialIntrinsicPower = {
      id: Date.now(),
      points: showSpecialIntrinsicModal.totalCost,
      description: `Inflict a particular debuff or damage on someone who hits you with a save to avoid it: ${secondaryDescription}`,
      secondaryPower: secondaryPower,
      selectedModifiers: modifiers,
      powerType: showSpecialIntrinsicModal.selectedPowerType
    };
    
    const updatedIntrinsicPowers = [...(monster.intrinsicPowers || []), specialIntrinsicPower];
    updateMonsterField(showSpecialIntrinsicModal.monsterId, 'intrinsicPowers', updatedIntrinsicPowers);
    setShowSpecialIntrinsicModal(null);
  };

  const removeMonster = (monsterId) => {
    const monster = generatedMonsters.find(m => m.id === monsterId);
    setShowDeleteConfirmModal({ 
      monsterId: monsterId, 
      monsterName: monster.name 
    });
  };

  const confirmRemoveMonster = () => {
    setGeneratedMonsters(prev => prev.filter(monster => monster.id !== showDeleteConfirmModal.monsterId));
    setShowDeleteConfirmModal(null);
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
      
      // Roll for creature power level (weighted towards lower levels)
      const powerLevelRoll = rollDie(100);
      let powerLevel;
      if (powerLevelRoll <= 30) powerLevel = creaturePowerLevels[0]; // 0 points - 30%
      else if (powerLevelRoll <= 50) powerLevel = creaturePowerLevels[1]; // 2 points - 20%
      else if (powerLevelRoll <= 65) powerLevel = creaturePowerLevels[2]; // 3 points - 15%
      else if (powerLevelRoll <= 78) powerLevel = creaturePowerLevels[3]; // 4 points - 13%
      else if (powerLevelRoll <= 88) powerLevel = creaturePowerLevels[4]; // 5 points - 10%
      else if (powerLevelRoll <= 94) powerLevel = creaturePowerLevels[5]; // 6 points - 6%
      else if (powerLevelRoll <= 97) powerLevel = creaturePowerLevels[6]; // 8 points - 3%
      else if (powerLevelRoll <= 99) powerLevel = creaturePowerLevels[7]; // 10 points - 2%
      else powerLevel = creaturePowerLevels[8]; // 15 points - 1%
      
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
        powerLevel: powerLevel,
        damagePowers: [],
        movementPowers: [],
        debilitatingPowers: [],
        augmentingPowers: [],
        intrinsicPowers: [],
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

  const exportMonstersToJSON = () => {
    const dataStr = JSON.stringify(generatedMonsters, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `monsters_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importMonstersFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedMonsters = JSON.parse(e.target.result);
        
        // Validate that it's an array of monster objects
        if (Array.isArray(importedMonsters)) {
          // Assign new IDs to avoid conflicts
          const monstersWithNewIds = importedMonsters.map((monster, index) => ({
            ...monster,
            id: generatedMonsters.length + index + 1,
            generatedAt: new Date().toLocaleTimeString()
          }));
          
          setGeneratedMonsters(prev => [...prev, ...monstersWithNewIds]);
        } else {
          alert('Invalid file format. Please select a valid monsters JSON file.');
        }
      } catch (error) {
        alert('Error reading file. Please make sure it\'s a valid JSON file.');
      }
    };
    
    reader.readAsText(file);
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  const exportMonstersToPDF = async () => {
    if (generatedMonsters.length === 0) {
      alert('No monsters to export. Please generate monsters first.');
      return;
    }

    try {
      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `monsters_${timestamp}`;
      
      const success = await generatePDF(generatedMonsters, filename);
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
          
          <button 
            onClick={exportMonstersToJSON}
            disabled={generatedMonsters.length === 0}
            className="export-btn"
            title="Export monsters to JSON file"
          >
            💾 Export JSON
          </button>
          
          <label className="import-btn" title="Import monsters from JSON file">
            📁 Import JSON
            <input
              type="file"
              accept=".json"
              onChange={importMonstersFromJSON}
              style={{ display: 'none' }}
            />
          </label>
          
          <button 
            onClick={exportMonstersToPDF}
            disabled={generatedMonsters.length === 0}
            className="print-btn"
            title="Export monsters to PDF"
          >
            💾 Export PDF
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
                  <button 
                    className="remove-monster-btn"
                    onClick={() => removeMonster(monster.id)}
                    title="Remove this monster"
                  >
                    🗑️
                  </button>
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
                  </div>                  <div
                    className="power-level-section clickable-section"
                    onClick={() => openSelectionModal(monster.id, 'powerLevel', creaturePowerLevels)}
                  >
                    <strong>Creature Power Level: 🎲</strong>
                    <div className="detail-description">
                      {calculateRemainingPowerPoints(monster)}/{monster.powerLevel.points} Points
                    </div>
                    <div className="detail-description">
                      {monster.powerLevel.description}
                    </div>
                  </div>

                  <div className="body-parts-section">
                    <div className="body-parts-header">
                      <strong>Powers:</strong>
                      <button 
                        className="add-body-part-btn"
                        onClick={() => setShowPowerTypeSelector({ monsterId: monster.id })}
                        title="Add power"
                      >
                        + Add Power
                      </button>
                    </div>
                    <div className="body-parts-list">
                      {/* Damage Powers */}
                      {monster.damagePowers && monster.damagePowers.length > 0 && (
                        monster.damagePowers.map((power) => (
                          <span key={`damage-${power.id}`} className="body-part damage-power">
                            <span className="power-type-badge">Damage</span> {power.totalCost}pts - {power.description}
                            <button 
                              className="remove-body-part"
                              onClick={() => removeDamagePower(monster.id, power.id)}
                              title="Remove this power"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}

                      {/* Movement Powers */}
                      {monster.movementPowers && monster.movementPowers.length > 0 && (
                        monster.movementPowers.map((power) => (
                          <span key={`movement-${power.id}`} className="body-part movement-power">
                            <span className="power-type-badge">Movement</span> {power.points}pts - {power.description}
                            <button 
                              className="remove-body-part"
                              onClick={() => removeMovementPower(monster.id, power.id)}
                              title="Remove this power"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}

                      {/* Debilitating Powers */}
                      {monster.debilitatingPowers && monster.debilitatingPowers.length > 0 && (
                        monster.debilitatingPowers.map((power) => (
                          <span key={`debilitating-${power.id}`} className="body-part debilitating-power">
                            <span className="power-type-badge">Debilitating</span> {power.totalCost}pts - {power.description}
                            <button 
                              className="remove-body-part"
                              onClick={() => removeDebilitatingPower(monster.id, power.id)}
                              title="Remove this power"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}

                      {/* Augmenting Powers */}
                      {monster.augmentingPowers && monster.augmentingPowers.length > 0 && (
                        monster.augmentingPowers.map((power) => (
                          <span key={`augmenting-${power.id}`} className="body-part augmenting-power">
                            <span className="power-type-badge">Augmenting</span> {power.totalCost}pts - {power.description}
                            <button 
                              className="remove-body-part"
                              onClick={() => removeAugmentingPower(monster.id, power.id)}
                              title="Remove this power"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}

                      {/* Intrinsic Powers */}
                      {monster.intrinsicPowers && monster.intrinsicPowers.length > 0 && (
                        monster.intrinsicPowers.map((power) => (
                          <span 
                            key={`intrinsic-${power.id}`} 
                            className={`body-part intrinsic-power ${power.powerType ? `intrinsic-${power.powerType}-gradient` : ''}`}
                            style={power.powerType ? {
                              background: power.powerType === 'damage' 
                                ? 'linear-gradient(90deg, rgba(241, 196, 15, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)' 
                                : 'linear-gradient(90deg, rgba(241, 196, 15, 0.2) 0%, rgba(230, 126, 34, 0.2) 100%)',
                              display: 'flex',
                              alignItems: 'center'
                            } : { display: 'flex', alignItems: 'center' }}
                          >
                            <div className="power-badges-stack">
                              <span className="power-type-badge primary-badge">Intrinsic</span>
                              {power.powerType && (
                                <span className={`power-type-badge secondary-badge ${power.powerType}-badge`}>
                                  {power.powerType === 'damage' ? 'Damage' : 'Debilitating'}
                                </span>
                              )}
                            </div>
                            <span className="power-info">
                              {power.points}pts - {power.description}
                            </span>
                            <button 
                              className="remove-body-part"
                              onClick={() => removeIntrinsicPower(monster.id, power.id)}
                              title="Remove this power"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
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
                 showSelectionModal.field === 'powerLevel' ? 'Choose Creature Power Level' :
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
                      className={`category-option ${category}`}
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
                      className={`body-part-option ${showSelectionModal.selectedCategory}`}
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
              ) : showSelectionModal.field === 'powerLevel' ? (
                <div className="options-list">
                  {showSelectionModal.options.map((level, index) => {
                    const isSelected = JSON.stringify(level) === JSON.stringify(showSelectionModal.currentValue);
                    return (
                      <div
                        key={index}
                        className={`option-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => selectOption(level)}
                      >
                        <span className="option-number">{level.points} pts</span>
                        <span className="option-text">{level.description}</span>
                      </div>
                    );
                  })}
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

      {/* Power Type Selector Modal */}
      {showPowerTypeSelector && (
        <div className="modal-overlay" onClick={() => setShowPowerTypeSelector(null)}>
          <div className="modal-content power-type-selector" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose Power Type</h3>
              <button 
                className="modal-close"
                onClick={() => setShowPowerTypeSelector(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="power-type-options">
                <div 
                  className="power-type-option damage-type"
                  onClick={() => {
                    openDamagePowerModal(showPowerTypeSelector.monsterId);
                    setShowPowerTypeSelector(null);
                  }}
                >
                  <div className="power-type-icon">⚔️</div>
                  <div className="power-type-info">
                    <h4>Damage Infliction</h4>
                    <p>Abilities that directly harm enemies</p>
                  </div>
                </div>
                
                <div 
                  className="power-type-option movement-type"
                  onClick={() => {
                    openMovementPowerModal(showPowerTypeSelector.monsterId);
                    setShowPowerTypeSelector(null);
                  }}
                >
                  <div className="power-type-icon">🏃</div>
                  <div className="power-type-info">
                    <h4>Movement</h4>
                    <p>Special locomotion and positioning abilities</p>
                  </div>
                </div>
                
                <div 
                  className="power-type-option debilitating-type"
                  onClick={() => {
                    openDebilitatingPowerModal(showPowerTypeSelector.monsterId);
                    setShowPowerTypeSelector(null);
                  }}
                >
                  <div className="power-type-icon">🛡️</div>
                  <div className="power-type-info">
                    <h4>Debilitating</h4>
                    <p>Abilities that weaken or impair enemies</p>
                  </div>
                </div>
                
                <div 
                  className="power-type-option augmenting-type"
                  onClick={() => {
                    openAugmentingPowerModal(showPowerTypeSelector.monsterId);
                    setShowPowerTypeSelector(null);
                  }}
                >
                  <div className="power-type-icon">💪</div>
                  <div className="power-type-info">
                    <h4>Augmenting</h4>
                    <p>Self-enhancing and buffing abilities</p>
                  </div>
                </div>
                
                <div 
                  className="power-type-option intrinsic-type"
                  onClick={() => {
                    openIntrinsicPowerModal(showPowerTypeSelector.monsterId);
                    setShowPowerTypeSelector(null);
                  }}
                >
                  <div className="power-type-icon">✨</div>
                  <div className="power-type-info">
                    <h4>Intrinsic</h4>
                    <p>Inherent magical and special abilities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Damage Power Modal */}
      {showDamagePowerModal && (
        <div className="modal-overlay" onClick={() => setShowDamagePowerModal(null)}>
          <div className="modal-content damage-power-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Damage Infliction Power</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDamagePowerModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="damage-power-builder">
                {/* Base Power Selection */}
                <div className="power-section">
                  <h4>Base Power</h4>
                  <div className="base-powers-list">
                    {damageInflictionPowers.basePowers.map((power, index) => (
                      <div
                        key={index}
                        className={`power-option ${showDamagePowerModal.selectedBasePower && 
                          showDamagePowerModal.selectedBasePower.points === power.points && 
                          showDamagePowerModal.selectedBasePower.description === power.description ? 'selected' : ''}`}
                        onClick={() => updateDamagePowerSelection('selectedBasePower', power)}
                      >
                        <span className="power-cost">{power.points} pts</span>
                        <span className="power-description">{power.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modifiers Selection */}
                <div className="power-section">
                  <h4>Modifiers</h4>
                  <div className="modifiers-list">
                    {damageInflictionPowers.modifiers.map((modifier) => (
                      <label key={modifier.id} className="modifier-option">
                        <input
                          type="checkbox"
                          checked={showDamagePowerModal.selectedModifiers[modifier.id] || false}
                          onChange={(e) => {
                            const newModifiers = {
                              ...showDamagePowerModal.selectedModifiers,
                              [modifier.id]: e.target.checked
                            };
                            updateDamagePowerSelection('selectedModifiers', newModifiers);
                          }}
                        />
                        <span className="modifier-cost">
                          {modifier.points !== undefined ? 
                            (modifier.points >= 0 ? `+${modifier.points}` : modifier.points) + ' pts' :
                            `×${modifier.multiplier}`
                          }
                        </span>
                        <span className="modifier-description">{modifier.description}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Total Cost Display */}
                <div className="power-section">
                  <div className="total-cost-display">
                    <strong>Total Cost: {showDamagePowerModal.totalCost} points</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setShowDamagePowerModal(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="add-power-btn"
                    onClick={addDamagePower}
                    disabled={!showDamagePowerModal.selectedBasePower}
                  >
                    Add Power
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movement Power Modal */}
      {showMovementPowerModal && (
        <div className="modal-overlay" onClick={() => setShowMovementPowerModal(null)}>
          <div className="modal-content simple-power-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Movement Power</h3>
              <button 
                className="modal-close"
                onClick={() => setShowMovementPowerModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="power-list">
                {movementPowers.map((power, index) => (
                  <div
                    key={index}
                    className="power-option"
                    onClick={() => addMovementPower(power)}
                  >
                    <span className="power-cost">{power.points} pts</span>
                    <span className="power-description">{power.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debilitating Power Modal */}
      {showDebilitatingPowerModal && (
        <div className="modal-overlay" onClick={() => setShowDebilitatingPowerModal(null)}>
          <div className="modal-content damage-power-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Debilitating Power</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDebilitatingPowerModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="damage-power-builder">
                {/* Base Power Selection */}
                <div className="power-section">
                  <h4>Base Power</h4>
                  <div className="base-powers-list">
                    {debilitatingPowers.basePowers.map((power, index) => (
                      <div
                        key={index}
                        className={`power-option ${showDebilitatingPowerModal.selectedBasePower && 
                          showDebilitatingPowerModal.selectedBasePower.points === power.points && 
                          showDebilitatingPowerModal.selectedBasePower.description === power.description ? 'selected' : ''}`}
                        onClick={() => updateDebilitatingPowerSelection('selectedBasePower', power)}
                      >
                        <span className="power-cost">{power.points} pts</span>
                        <span className="power-description">{power.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modifiers Selection */}
                <div className="power-section">
                  <h4>Modifiers</h4>
                  <div className="modifiers-list">
                    {debilitatingPowers.modifiers.map((modifier) => (
                      <label key={modifier.id} className="modifier-option">
                        <input
                          type="checkbox"
                          checked={showDebilitatingPowerModal.selectedModifiers[modifier.id] || false}
                          onChange={(e) => {
                            const newModifiers = {
                              ...showDebilitatingPowerModal.selectedModifiers,
                              [modifier.id]: e.target.checked
                            };
                            updateDebilitatingPowerSelection('selectedModifiers', newModifiers);
                          }}
                        />
                        <span className="modifier-cost">
                          {modifier.points !== undefined ? 
                            (modifier.points >= 0 ? `+${modifier.points}` : modifier.points) + ' pts' :
                            `×${modifier.multiplier}`
                          }
                        </span>
                        <span className="modifier-description">{modifier.description}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Total Cost Display */}
                <div className="power-section">
                  <div className="total-cost-display">
                    <strong>Total Cost: {showDebilitatingPowerModal.totalCost} points</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setShowDebilitatingPowerModal(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="add-btn"
                    onClick={addDebilitatingPower}
                    disabled={!showDebilitatingPowerModal.selectedBasePower}
                  >
                    Add Power
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Augmenting Power Modal */}
      {showAugmentingPowerModal && (
        <div className="modal-overlay" onClick={() => setShowAugmentingPowerModal(null)}>
          <div className="modal-content damage-power-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Augmenting Power</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAugmentingPowerModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="damage-power-builder">
                {/* Base Power Selection */}
                <div className="power-section">
                  <h4>Base Power</h4>
                  <div className="base-powers-list">
                    {augmentingPowers.basePowers.map((power, index) => (
                      <div
                        key={index}
                        className={`power-option ${showAugmentingPowerModal.selectedBasePower && 
                          showAugmentingPowerModal.selectedBasePower.points === power.points && 
                          showAugmentingPowerModal.selectedBasePower.description === power.description ? 'selected' : ''}`}
                        onClick={() => updateAugmentingPowerSelection('selectedBasePower', power)}
                      >
                        <span className="power-cost">{power.points} pts</span>
                        <span className="power-description">{power.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modifiers Selection */}
                <div className="power-section">
                  <h4>Modifiers</h4>
                  <div className="modifiers-list">
                    {augmentingPowers.modifiers.map((modifier) => (
                      <label key={modifier.id} className="modifier-option">
                        <input
                          type="checkbox"
                          checked={showAugmentingPowerModal.selectedModifiers[modifier.id] || false}
                          onChange={(e) => {
                            const newModifiers = {
                              ...showAugmentingPowerModal.selectedModifiers,
                              [modifier.id]: e.target.checked
                            };
                            updateAugmentingPowerSelection('selectedModifiers', newModifiers);
                          }}
                        />
                        <span className="modifier-cost">
                          {modifier.points !== undefined ? 
                            (modifier.points >= 0 ? `+${modifier.points}` : modifier.points) + ' pts' :
                            `×${modifier.multiplier}`
                          }
                        </span>
                        <span className="modifier-description">{modifier.description}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Total Cost Display */}
                <div className="power-section">
                  <div className="total-cost-display">
                    <strong>Total Cost: {showAugmentingPowerModal.totalCost} points</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setShowAugmentingPowerModal(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="add-btn"
                    onClick={addAugmentingPower}
                    disabled={!showAugmentingPowerModal.selectedBasePower}
                  >
                    Add Power
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Intrinsic Power Modal */}
      {showIntrinsicPowerModal && (
        <div className="modal-overlay" onClick={() => setShowIntrinsicPowerModal(null)}>
          <div className="modal-content simple-power-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Intrinsic Power</h3>
              <button 
                className="modal-close"
                onClick={() => setShowIntrinsicPowerModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="power-list">
                {intrinsicPowers.map((power, index) => (
                  <div
                    key={index}
                    className="power-option"
                    onClick={() => addIntrinsicPower(power)}
                  >
                    <span className="power-cost">{power.points} pts</span>
                    <span className="power-description">{power.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Special Intrinsic Power Modal */}
      {showSpecialIntrinsicModal && (
        <div className="modal-overlay" onClick={() => setShowSpecialIntrinsicModal(null)}>
          <div className="modal-content damage-power-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Retribution Power</h3>
              <button 
                className="modal-close"
                onClick={() => setShowSpecialIntrinsicModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="damage-power-builder">
                <div className="power-section">
                  <h4>Base Power</h4>
                  <div className="base-power-display">
                    <span className="power-cost">1 pt + secondary power cost</span>
                    <span className="power-description">{showSpecialIntrinsicModal.basePower.description}</span>
                  </div>
                </div>

                {!showSpecialIntrinsicModal.selectedPowerType && (
                  <div className="power-section">
                    <h4>Select Power Type</h4>
                    <div className="power-type-options">
                      <div 
                        className="power-type-option damage-type"
                        onClick={() => selectSecondaryPowerType('damage')}
                      >
                        <div className="power-type-icon">⚔️</div>
                        <div className="power-type-info">
                          <h5>Damage Power</h5>
                          <p>Direct harm effects</p>
                        </div>
                      </div>
                      
                      <div 
                        className="power-type-option debilitating-type"
                        onClick={() => selectSecondaryPowerType('debilitating')}
                      >
                        <div className="power-type-icon">🛡️</div>
                        <div className="power-type-info">
                          <h5>Debilitating Power</h5>
                          <p>Weakening and impairing effects</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showSpecialIntrinsicModal.selectedPowerType === 'damage' && (
                  <>
                    <div className="power-section">
                      <h4>Select Damage Power</h4>
                      <div className="base-powers-list">
                        {damageInflictionPowers.basePowers.map((power, index) => (
                          <div
                            key={index}
                            className={`power-option ${showSpecialIntrinsicModal.selectedSecondaryPower && 
                              showSpecialIntrinsicModal.selectedSecondaryPower.points === power.points && 
                              showSpecialIntrinsicModal.selectedSecondaryPower.description === power.description ? 'selected' : ''}`}
                            onClick={() => selectSecondaryPower(power)}
                          >
                            <span className="power-cost">{power.points} pts</span>
                            <span className="power-description">{power.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="power-section">
                      <h4>Modifiers</h4>
                      <div className="modifiers-list">
                        {damageInflictionPowers.modifiers.map((modifier) => (
                          <label key={modifier.id} className="modifier-option">
                            <input
                              type="checkbox"
                              checked={showSpecialIntrinsicModal.selectedModifiers?.[modifier.id] || false}
                              disabled={!showSpecialIntrinsicModal.selectedSecondaryPower}
                              onChange={(e) => {
                                const newModifiers = {
                                  ...showSpecialIntrinsicModal.selectedModifiers,
                                  [modifier.id]: e.target.checked
                                };
                                updateSpecialIntrinsicSelection('selectedModifiers', newModifiers);
                              }}
                            />
                            <span className="modifier-cost">
                              {modifier.points !== undefined ? 
                                (modifier.points >= 0 ? `+${modifier.points}` : modifier.points) + ' pts' :
                                `×${modifier.multiplier}`
                              }
                            </span>
                            <span className="modifier-description">{modifier.description}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {showSpecialIntrinsicModal.selectedPowerType === 'debilitating' && (
                  <>
                    <div className="power-section">
                      <h4>Select Debilitating Power</h4>
                      <div className="base-powers-list">
                        {debilitatingPowers.basePowers.map((power, index) => (
                          <div
                            key={index}
                            className={`power-option ${showSpecialIntrinsicModal.selectedSecondaryPower && 
                              showSpecialIntrinsicModal.selectedSecondaryPower.points === power.points && 
                              showSpecialIntrinsicModal.selectedSecondaryPower.description === power.description ? 'selected' : ''}`}
                            onClick={() => selectSecondaryPower(power)}
                          >
                            <span className="power-cost">{power.points} pts</span>
                            <span className="power-description">{power.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="power-section">
                      <h4>Modifiers</h4>
                      <div className="modifiers-list">
                        {debilitatingPowers.modifiers.map((modifier) => (
                          <label key={modifier.id} className="modifier-option">
                            <input
                              type="checkbox"
                              checked={showSpecialIntrinsicModal.selectedModifiers?.[modifier.id] || false}
                              disabled={!showSpecialIntrinsicModal.selectedSecondaryPower}
                              onChange={(e) => {
                                const newModifiers = {
                                  ...showSpecialIntrinsicModal.selectedModifiers,
                                  [modifier.id]: e.target.checked
                                };
                                updateSpecialIntrinsicSelection('selectedModifiers', newModifiers);
                              }}
                            />
                            <span className="modifier-cost">
                              {modifier.points !== undefined ? 
                                (modifier.points >= 0 ? `+${modifier.points}` : modifier.points) + ' pts' :
                                `×${modifier.multiplier}`
                              }
                            </span>
                            <span className="modifier-description">{modifier.description}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {showSpecialIntrinsicModal.selectedSecondaryPower && (
                  <div className="power-section">
                    <div className="total-cost-display">
                      <strong>Total Cost: {showSpecialIntrinsicModal.totalCost} points</strong>
                      <div className="cost-breakdown">
                        1 base intrinsic + {showSpecialIntrinsicModal.totalCost - 1} secondary power 
                        {showSpecialIntrinsicModal.selectedModifiers && Object.keys(showSpecialIntrinsicModal.selectedModifiers).some(key => showSpecialIntrinsicModal.selectedModifiers[key]) && 
                          " (including modifiers)"
                        }
                      </div>
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setShowSpecialIntrinsicModal(null)}
                  >
                    Cancel
                  </button>
                  {showSpecialIntrinsicModal.selectedPowerType && (
                    <button 
                      className="back-btn"
                      onClick={() => selectSecondaryPowerType(null)}
                    >
                      ← Back to Power Types
                    </button>
                  )}
                  <button 
                    className="add-power-btn"
                    onClick={addSpecialIntrinsicPower}
                    disabled={!showSpecialIntrinsicModal.selectedSecondaryPower}
                  >
                    Add Retribution Power
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirmModal(null)}>
          <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🗑️ Delete Monster</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteConfirmModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-confirmation">
                <div className="confirmation-message">
                  <p>Are you sure you want to delete this monster?</p>
                  <div className="monster-preview">
                    <span className="monster-name">"{showDeleteConfirmModal.monsterName}"</span>
                  </div>
                  <p className="warning-text">⚠️ This action cannot be undone</p>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteConfirmModal(null)}
              >
                Cancel
              </button>
              <button 
                className="delete-btn danger-btn"
                onClick={confirmRemoveMonster}
              >
                🗑️ Delete Monster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonstersPage;
