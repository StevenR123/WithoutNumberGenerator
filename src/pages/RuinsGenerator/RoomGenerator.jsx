import React, { useState, useEffect } from 'react';
import './RoomGenerator.css';
import { useDungeonPDFGenerator } from './DungeonPDFGenerator';
import {
  exitTable,
  directionTable,
  contentsTable,
  hazardTypes,
  distractorTypes,
  enigmaTypes,
  treasureLocations,
  rollDie,
  rollD8,
  rollD6,
  rollD12,
  rollD20,
  getTableResult,
  getRandomArrayItem,
  getRoomTypeIcon,
  generateExits,
  generateDirections,
  generateRoomContents,
  generateRoomOfInterest,
  generateBasicSiteType,
  generateInhabitationFramework,
  basicSiteTypesTable,
  residentialSiteExamples,
  militarySiteExamples,
  productionSiteExamples,
  religiousSiteExamples,
  culturalSiteExamples,
  infrastructureSiteExamples,
  importantInhabitantsTable,
  hostilityReasonsTable,
  whyDidTheyComeTable,
  allianceCausesTable,
  whyStayingTable
} from '../../components/Tables';

const RoomGenerator = ({ onBack }) => {
  const [numRooms, setNumRooms] = useState(5);
  const [dungeonName, setDungeonName] = useState('');
  const [generatedRooms, setGeneratedRooms] = useState([]);
  const [ruinInfo, setRuinInfo] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileInputRef, setFileInputRef] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { generatePDF } = useDungeonPDFGenerator();
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedRoom: null,
    startPos: null,
    currentPos: null,
    dragStarted: false // Track if we've actually started dragging
  });
  const [roomEditMenu, setRoomEditMenu] = useState({
    isOpen: false,
    room: null,
    contentType: '',
    specificType: '',
    notes: '',
    hasTreasure: false,
    treasureLocation: ''
  });
  const [ruinEditMenu, setRuinEditMenu] = useState({
    isOpen: false,
    editType: '', // 'siteType', 'importantInhabitants', 'hostilityReason', 'whyTheyCame', 'allianceCause', 'whyStaying'
    currentValue: '',
    options: [],
    title: '',
    step: 1, // For multi-step selections like site type (1 = type selection, 2 = example selection)
    selectedType: null // For storing intermediate selections
  });

  const generateRooms = () => {
    setIsGenerating(true);
    
    // Generate ruin information
    const ruinInformation = generateBasicSiteType();
    const inhabitationInfo = generateInhabitationFramework();
    
    // Combine all ruin information
    const combinedRuinInfo = {
      ...ruinInformation,
      inhabitation: inhabitationInfo
    };
    
    setRuinInfo(combinedRuinInfo);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      const rooms = [];
      const occupiedCoordinates = new Map(); // Track which coordinates are occupied
      let roomIdCounter = 1;
      
      // Create the first room (ingress) at (0,0)
      const firstRoom = {
        id: roomIdCounter++,
        isIngress: true,
        exits: generateExits(),
        directions: [],
        contents: generateRoomContents(),
        notes: (() => {
          const roomOfInterest = generateRoomOfInterest();
          return `${roomOfInterest.function}: ${roomOfInterest.example}`;
        })(),
        connectedRooms: new Map(), // direction -> [roomId1, roomId2, ...]
        coordinates: { x: 0, y: 0 },
        maxConnections: 0 // Will be set based on exits roll
      };
      
      // Set max connections based on exits
      firstRoom.maxConnections = getMaxConnectionsFromExits(firstRoom.exits);
      
      // Generate directions for the first room
      firstRoom.directions = generateDirections(firstRoom.exits);
      rooms.push(firstRoom);
      occupiedCoordinates.set('0,0', firstRoom.id);
      
      // Queue of rooms that need connections processed
      const roomQueue = [firstRoom];
      let maxIterations = numRooms * 10; // Prevent infinite loops
      let iterations = 0;
      
      while (roomQueue.length > 0 && rooms.length < numRooms && iterations < maxIterations) {
        iterations++;
        const currentRoom = roomQueue.shift();
        
        // Check if current room still has capacity for more connections
        const currentConnections = currentRoom.connectedRooms.size;
        const availableConnectionSlots = currentRoom.maxConnections - currentConnections;
        
        if (availableConnectionSlots <= 0) {
          // Room is at capacity, skip to next room
          continue;
        }
        
        // Process each available direction for the current room
        let connectionsAdded = 0;
        for (let i = 0; i < currentRoom.directions.length && rooms.length < numRooms && connectionsAdded < availableConnectionSlots; i++) {
          const direction = currentRoom.directions[i];
          
          // Check if this direction already has a connection (during generation, only one per direction)
          if (!currentRoom.connectedRooms.has(direction)) {
            // Calculate new coordinates based on direction
            const coordinateChange = getCoordinateChange(direction);
            const newCoordinates = {
              x: currentRoom.coordinates.x + coordinateChange.x,
              y: currentRoom.coordinates.y + coordinateChange.y
            };
            const coordKey = `${newCoordinates.x},${newCoordinates.y}`;
            
            // Check if coordinates are already occupied
            if (!occupiedCoordinates.has(coordKey)) {
              // Generate exits for new room
              const newRoomExits = generateExits();
              const newRoomMaxConnections = getMaxConnectionsFromExits(newRoomExits);
              
            // Create a new room for this direction
            const newRoom = {
              id: roomIdCounter++,
              isIngress: false,
              exits: newRoomExits,
              directions: [],
              contents: generateRoomContents(),
              notes: (() => {
                const roomOfInterest = generateRoomOfInterest();
                return `${roomOfInterest.function}: ${roomOfInterest.example}`;
              })(),
              connectedRooms: new Map(),
              coordinates: newCoordinates,
              maxConnections: newRoomMaxConnections
            };              // Generate directions for the new room (but we'll reserve one connection for the back-connection)
              newRoom.directions = generateDirections(newRoom.exits);
              
              // Create bidirectional connection (single connection during generation)
              currentRoom.connectedRooms.set(direction, [newRoom.id]);
              const oppositeDirection = getOppositeDirection(direction);
              newRoom.connectedRooms.set(oppositeDirection, [currentRoom.id]);
              
              // Remove the opposite direction from new room's available directions
              // since it's already connected back to current room
              newRoom.directions = newRoom.directions.filter(dir => dir !== oppositeDirection);
              
              rooms.push(newRoom);
              occupiedCoordinates.set(coordKey, newRoom.id);
              roomQueue.push(newRoom);
              connectionsAdded++;
            } else {
              // Coordinates occupied, try to connect to existing room if possible
              const existingRoomId = occupiedCoordinates.get(coordKey);
              const existingRoom = rooms.find(r => r.id === existingRoomId);
              const oppositeDirection = getOppositeDirection(direction);
              
              // Check if both rooms have capacity for this connection
              const existingRoomConnections = Array.from(existingRoom.connectedRooms.values()).flat().length;
              const existingRoomHasCapacity = existingRoomConnections < existingRoom.maxConnections;
              
              // Check if this specific connection already exists
              const existingOppositeConnections = existingRoom.connectedRooms.get(oppositeDirection) || [];
              const connectionAlreadyExists = existingOppositeConnections.includes(currentRoom.id);
              
              // Only connect if both rooms have capacity and don't already have this specific connection
              if (existingRoom && !connectionAlreadyExists && existingRoomHasCapacity) {
                const originalExits = Array.from(existingRoom.connectedRooms.keys());
                
                // Create bidirectional connection (single connection during generation)
                currentRoom.connectedRooms.set(direction, [existingRoom.id]);
                existingRoom.connectedRooms.set(oppositeDirection, [currentRoom.id]);
                
                // Add the opposite direction to existing room's directions if not already present
                if (!existingRoom.directions.includes(oppositeDirection)) {
                  existingRoom.directions.push(oppositeDirection);
                }
                
                const newExits = Array.from(existingRoom.connectedRooms.keys());
                // console.log(`🔗 Connection added to existing Room ${existingRoom.id}:`);
                // console.log(`   Original exits: [${originalExits.join(', ')}]`);
                // console.log(`   New exits: [${newExits.join(', ')}]`);
                // console.log(`   Connected from Room ${currentRoom.id} via ${direction}/${oppositeDirection}`);
                
                connectionsAdded++;
              }
            }
          }
        }
        
        // If we haven't reached the desired number of rooms and all current rooms are at capacity,
        // find dead ends and reroll their exits to continue generation
        if (rooms.length < numRooms && roomQueue.length === 0) {
          const deadEnds = rooms.filter(room => {
            const currentConnections = room.connectedRooms.size;
            return currentConnections < room.maxConnections;
          });
          
          if (deadEnds.length === 0) {
            // All rooms are at capacity, need to reroll exits for some rooms
            const roomsToExpand = rooms.filter(room => !room.isIngress);
            if (roomsToExpand.length > 0) {
              // Try to reroll exits for multiple rooms, being more aggressive
              let expansionSuccessful = false;
              
              // Try rerolling multiple times for each room
              for (let attempts = 0; attempts < roomsToExpand.length && !expansionSuccessful; attempts++) {
                const roomToExpand = roomsToExpand[roomsToExpand.length - 1 - attempts];
                
                // Try rerolling up to 5 times to get more exits
                for (let rerollAttempt = 0; rerollAttempt < 5 && !expansionSuccessful; rerollAttempt++) {
                  const newExits = generateExits();
                  const newMaxConnections = getMaxConnectionsFromExits(newExits);
                  
                  if (newMaxConnections > roomToExpand.maxConnections) {
                    const originalExits = Array.from(roomToExpand.connectedRooms.keys());
                    roomToExpand.exits = newExits;
                    roomToExpand.maxConnections = newMaxConnections;
                    
                    // Generate additional directions if needed
                    const additionalDirectionsNeeded = newMaxConnections - roomToExpand.connectedRooms.size;
                    if (additionalDirectionsNeeded > 0) {
                      const newDirections = generateDirections(roomToExpand.exits);
                      // Filter out directions that are already connected
                      const availableDirections = newDirections.filter(dir => !roomToExpand.connectedRooms.has(dir));
                      
                      // Add unique new directions
                      const uniqueNewDirections = availableDirections.filter(dir => !roomToExpand.directions.includes(dir));
                      roomToExpand.directions = [...roomToExpand.directions, ...uniqueNewDirections];
                      
                      // console.log(`🎲 Rerolled Room ${roomToExpand.id} exits:`);
                      // console.log(`   Original: [${originalExits.join(', ')}] → New potential: [${[...originalExits, ...uniqueNewDirections].join(', ')}]`);
                      
                      if (uniqueNewDirections.length > 0) {
                        roomQueue.push(roomToExpand);
                        expansionSuccessful = true;
                      }
                    }
                  }
                }
              }
              
              // If we still can't expand any rooms, force expansion on the ingress room
              if (!expansionSuccessful && firstRoom.connectedRooms.size < 4) {
                const originalExits = Array.from(firstRoom.connectedRooms.keys());
                const newExits = 'Four'; // Force maximum exits
                const newMaxConnections = 4;
                firstRoom.exits = newExits;
                firstRoom.maxConnections = newMaxConnections;
                
                const newDirections = generateDirections(firstRoom.exits);
                const availableDirections = newDirections.filter(dir => !firstRoom.connectedRooms.has(dir));
                const uniqueNewDirections = availableDirections.filter(dir => !firstRoom.directions.includes(dir));
                firstRoom.directions = [...firstRoom.directions, ...uniqueNewDirections];
                
                const finalExits = [...originalExits, ...uniqueNewDirections];
                // console.log(`🚀 Force-expanded ingress Room ${firstRoom.id}:`);
                // console.log(`   Original exits: [${originalExits.join(', ')}]`);
                // console.log(`   New potential exits: [${finalExits.join(', ')}]`);
                // console.log(`   Max connections increased to: ${newMaxConnections}`);
                
                if (uniqueNewDirections.length > 0) {
                  roomQueue.push(firstRoom);
                }
              }
            }
          } else {
            // Add dead ends back to queue
            deadEnds.forEach(room => roomQueue.push(room));
          }
        }
      }
      
      // Final fallback: use intelligent branching from rooms with least adjacent rooms
      // console.log(`🌿 FALLBACK ACTIVATED: Starting expansion from rooms with least adjacent rooms`);
      // Extend from rooms with least adjacent rooms for more natural dungeon layouts
      while (rooms.length < numRooms) {
        // console.log(`🌿 Need ${numRooms - rooms.length} more rooms. Finding rooms with least adjacent rooms...`);
        
        // Calculate adjacent room counts and find rooms with least adjacent rooms (excluding ingress)
        const nonIngressRooms = rooms.filter(room => !room.isIngress);
        if (nonIngressRooms.length === 0) {
          // console.log(`⚠️ No non-ingress rooms to extend from.`);
          break;
        }
        
        const roomsWithAdjacentCounts = nonIngressRooms.map(room => ({
          room,
          adjacentCount: getAdjacentRoomCount(room, rooms, occupiedCoordinates)
        }));
        
        // Sort by adjacent count (least adjacent first)
        roomsWithAdjacentCounts.sort((a, b) => a.adjacentCount - b.adjacentCount);
        
        // Take up to 2 rooms with least adjacent rooms
        const leastAdjacentRooms = roomsWithAdjacentCounts.slice(0, 2).map(item => item.room);
        
        // console.log(`📍 Rooms with least adjacent rooms:`, leastAdjacentRooms.map(r => 
        //   `Room ${r.id} (adjacent: ${getAdjacentRoomCount(r, rooms, occupiedCoordinates)})`
        // ));
        
        let roomExpanded = false;
        
        // Try to expand each of the rooms with least adjacent rooms
        for (const room of leastAdjacentRooms) {
          // Force expand this room if needed
          if (room.connectedRooms.size >= 4) {
            continue; // Skip if already at max connections
          }
          
          const originalExits = Array.from(room.connectedRooms.keys());
          
          // Force expand to allow more connections
          room.maxConnections = 4;
          room.exits = 'Four';
          
        // Generate all possible directions
        const allDirections = ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'];
        const availableDirections = allDirections.filter(dir => !room.connectedRooms.has(dir));

        // Randomly pick up to 2 directions from availableDirections
        function getRandomDirections(arr, n) {
          const shuffled = arr.slice();
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled.slice(0, n);
        }
        const pickedDirections = getRandomDirections(availableDirections, 2);

        let connectionsFromThisRoom = 0;
        for (const direction of pickedDirections) {
          if (connectionsFromThisRoom >= 2 || rooms.length >= numRooms) break;

          const coordinateChange = getCoordinateChange(direction);
          const newCoordinates = {
            x: room.coordinates.x + coordinateChange.x,
            y: room.coordinates.y + coordinateChange.y
          };
          const coordKey = `${newCoordinates.x},${newCoordinates.y}`;

          // Check if coordinates are available
          if (!occupiedCoordinates.has(coordKey)) {
            // Create a new connected room
            const newRoom = {
              id: roomIdCounter++,
              isIngress: false,
              exits: generateExits(),
              directions: [],
              contents: generateRoomContents(),
              notes: (() => {
                const roomOfInterest = generateRoomOfInterest();
                return `${roomOfInterest.function}: ${roomOfInterest.example}`;
              })(),
              connectedRooms: new Map(),
              coordinates: newCoordinates,
              maxConnections: getMaxConnectionsFromExits(generateExits())
            };

            // Generate directions for the new room
            newRoom.directions = generateDirections(newRoom.exits);

            // Create bidirectional connection (single connection during generation)
            const oppositeDirection = getOppositeDirection(direction);
            room.connectedRooms.set(direction, [newRoom.id]);
            newRoom.connectedRooms.set(oppositeDirection, [room.id]);

            // Update room directions
            if (!room.directions.includes(direction)) {
              room.directions.push(direction);
            }
            newRoom.directions = newRoom.directions.filter(dir => dir !== oppositeDirection);

            rooms.push(newRoom);
            occupiedCoordinates.set(coordKey, newRoom.id);
            roomQueue.push(newRoom);

            // console.log(`🌿 Created Room ${newRoom.id} extending from least-adjacent Room ${room.id} via ${direction}/${oppositeDirection}`);
            // console.log(`   Adjacent room count: ${getAdjacentRoomCount(room, rooms, occupiedCoordinates)}`);

            roomExpanded = true;
            connectionsFromThisRoom++;
          }
        }
          
          if (rooms.length >= numRooms) break;
        }
        
        // If we couldn't expand any of the rooms with least adjacent rooms, we're stuck
        if (!roomExpanded) {
          // console.log(`⚠️ FALLBACK COMPLETE: Could not extend from rooms with least adjacent rooms. Final count: ${rooms.length}/${numRooms}`);
          break;
        } else {
          // console.log(`✅ Fallback successfully expanded from least-adjacent room(s)`);
        }
      }
      // console.log(`🌿 FALLBACK FINISHED: Generated ${rooms.length}/${numRooms} rooms using intelligent branching strategy`);
      
      
      // Update exit counts to reflect actual connections
      rooms.forEach(room => {
        const actualConnections = room.connectedRooms.size;
        room.exits = actualConnections === 0 ? 'None' :
                   actualConnections === 1 ? 'One' :
                   actualConnections === 2 ? 'Two' :
                   actualConnections === 3 ? 'Three' : 'Four';
        
        // Update directions to only include connected directions
        room.directions = Array.from(room.connectedRooms.keys());
      });
      
      setGeneratedRooms(rooms);
      setIsGenerating(false);
    }, 500);
  };

  const getMaxConnectionsFromExits = (exits) => {
    switch (exits) {
      case 'One': return 1;
      case 'Two': return 2;
      case 'Three': return 3;
      case 'Four': return 4;
      default: return 0;
    }
  };

  const getOppositeDirection = (direction) => {
    const opposites = {
      'North': 'South',
      'South': 'North',
      'East': 'West',
      'West': 'East',
      'Northeast': 'Southwest',
      'Southwest': 'Northeast',
      'Southeast': 'Northwest',
      'Northwest': 'Southeast'
    };
    return opposites[direction] || direction;
  };

  const getCoordinateChange = (direction) => {
    const changes = {
      'North': { x: 0, y: 1 },
      'South': { x: 0, y: -1 },
      'East': { x: 1, y: 0 },
      'West': { x: -1, y: 0 },
      'Northeast': { x: 1, y: 1 },
      'Northwest': { x: -1, y: 1 },
      'Southeast': { x: 1, y: -1 },
      'Southwest': { x: -1, y: -1 }
    };
    return changes[direction] || { x: 0, y: 0 };
  };

  const getDistanceFromIngress = (room, ingressRoom) => {
    const deltaX = Math.abs(room.coordinates.x - ingressRoom.coordinates.x);
    const deltaY = Math.abs(room.coordinates.y - ingressRoom.coordinates.y);
    return deltaX + deltaY; // Manhattan distance
  };

  const getAdjacentRoomCount = (room, allRooms, occupiedCoordinates) => {
    const adjacentDirections = [
      { x: 0, y: 1 },   // North
      { x: 0, y: -1 },  // South
      { x: 1, y: 0 },   // East
      { x: -1, y: 0 },  // West
      { x: 1, y: 1 },   // Northeast
      { x: -1, y: 1 },  // Northwest
      { x: 1, y: -1 },  // Southeast
      { x: -1, y: -1 }  // Southwest
    ];
    
    let adjacentCount = 0;
    for (const direction of adjacentDirections) {
      const adjacentX = room.coordinates.x + direction.x;
      const adjacentY = room.coordinates.y + direction.y;
      const coordKey = `${adjacentX},${adjacentY}`;
      
      if (occupiedCoordinates.has(coordKey)) {
        adjacentCount++;
      }
    }
    
    return adjacentCount;
  };

  const exportToJSON = () => {
    if (generatedRooms.length === 0) {
      alert('No rooms to export. Please generate rooms first.');
      return;
    }

    // Create export data with metadata
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        totalRooms: generatedRooms.length,
        dungeonName: dungeonName || 'Unnamed Dungeon',
        generatorSettings: {
          requestedRooms: numRooms
        }
      },
      rooms: generatedRooms.map(room => ({
        ...room,
        // Convert Map to Object for JSON serialization
        connectedRooms: Object.fromEntries(
          Array.from(room.connectedRooms.entries()).map(([direction, roomIds]) => [
            direction, 
            Array.isArray(roomIds) ? roomIds : [roomIds] // Ensure backward compatibility
          ])
        )
      }))
    };

    // Create filename with name and timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = dungeonName 
      ? `${dungeonName.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.json`
      : `dungeon_${timestamp}.json`;

    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    if (generatedRooms.length === 0) {
      alert('No rooms to export. Please generate rooms first.');
      return;
    }

    try {
      // Create filename with name and timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = dungeonName 
        ? `${dungeonName.replace(/[^a-z0-9]/gi, '_')}_${timestamp}`
        : `dungeon_${timestamp}`;
      
      const success = await generatePDF(generatedRooms, filename);
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

  const importFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        // Validate the imported data
        if (!importData.rooms || !Array.isArray(importData.rooms)) {
          throw new Error('Invalid file format: missing rooms array');
        }

        // Convert Object back to Map for connectedRooms
        const processedRooms = importData.rooms.map(room => ({
          ...room,
          connectedRooms: new Map(
            Object.entries(room.connectedRooms || {}).map(([direction, roomIds]) => [
              direction,
              Array.isArray(roomIds) ? roomIds : [roomIds] // Handle both old and new formats
            ])
          )
        }));

        // Update state
        setGeneratedRooms(processedRooms);
        if (importData.metadata?.generatorSettings?.requestedRooms) {
          setNumRooms(importData.metadata.generatorSettings.requestedRooms);
        }

        alert(`Successfully imported ${processedRooms.length} rooms from ${importData.metadata?.exportDate ? new Date(importData.metadata.exportDate).toLocaleDateString() : 'unknown date'}`);
      } catch (error) {
        alert(`Error importing file: ${error.message}`);
        // console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const triggerFileImport = () => {
    if (fileInputRef) {
      fileInputRef.click();
    }
  };

  const handleRoomClick = (room, event) => {
    if (!isEditMode) return;
    
    // Don't handle click if we actually started a drag operation
    if (dragState.dragStarted) return;

    // Check for shift+click to edit room contents
    if (event && event.shiftKey) {
      // Prevent the click from doing anything else
      event.preventDefault();
      event.stopPropagation();
      // console.log('Shift+click detected, editing room:', room.id);
      handleRoomEdit(room);
      return;
    }

    // console.log('Regular click on room:', room.id, 'Edit mode:', isEditMode);

    if (!selectedRoom) {
      // First room selected
      setSelectedRoom(room);
    } else if (selectedRoom.id === room.id) {
      // Clicking the same room deselects it
      setSelectedRoom(null);
    } else {
      // Second room selected - toggle connection
      toggleConnection(selectedRoom, room);
      setSelectedRoom(null);
    }
  };

  const deleteSelectedRoom = () => {
    if (!selectedRoom || !isEditMode) return;
    
    // Don't allow deletion of ingress room
    if (selectedRoom.isIngress) {
      // console.log('Cannot delete ingress room');
      return;
    }
    
    // Check if room has any connections
    const totalConnections = Array.from(selectedRoom.connectedRooms.values()).reduce((sum, connections) => {
      return sum + (Array.isArray(connections) ? connections.length : 1);
    }, 0);
    
    if (totalConnections > 0) {
      // console.log('Cannot delete room with connections');
      return;
    }
    
    // Remove the room from the rooms array
    const updatedRooms = generatedRooms.filter(room => room.id !== selectedRoom.id);
    setGeneratedRooms(updatedRooms);
    setSelectedRoom(null);
    
    // console.log(`Deleted Room ${selectedRoom.id}`);
  };

  const isRoomDeletable = (room) => {
    if (!room || room.isIngress) return false;
    
    const totalConnections = Array.from(room.connectedRooms.values()).reduce((sum, connections) => {
      return sum + (Array.isArray(connections) ? connections.length : 1);
    }, 0);
    
    return totalConnections === 0;
  };

  const toggleConnection = (room1, room2) => {
    // Calculate direction from room1 to room2
    const direction = getDirectionBetweenRooms(room1, room2);
    const oppositeDirection = getOppositeDirection(direction);

    // Check if connection already exists
    const room1Connections = room1.connectedRooms.get(direction) || [];
    const room2Connections = room2.connectedRooms.get(oppositeDirection) || [];
    const room1HasConnection = room1Connections.includes(room2.id);
    const room2HasConnection = room2Connections.includes(room1.id);

    const updatedRooms = generatedRooms.map(room => {
      if (room.id === room1.id) {
        const newConnectedRooms = new Map(room.connectedRooms);
        const currentConnections = newConnectedRooms.get(direction) || [];
        let newDirections = [...room.directions];
        
        if (room1HasConnection) {
          // Remove connection
          const updatedConnections = currentConnections.filter(id => id !== room2.id);
          if (updatedConnections.length === 0) {
            newConnectedRooms.delete(direction);
            const dirIndex = newDirections.indexOf(direction);
            if (dirIndex > -1) {
              newDirections.splice(dirIndex, 1);
            }
          } else {
            newConnectedRooms.set(direction, updatedConnections);
          }
        } else {
          // Add connection
          const updatedConnections = [...currentConnections, room2.id];
          newConnectedRooms.set(direction, updatedConnections);
          if (!newDirections.includes(direction)) {
            newDirections.push(direction);
          }
        }
        
        // Calculate total connections across all directions
        const totalConnections = Array.from(newConnectedRooms.values()).reduce((sum, connections) => sum + connections.length, 0);
        const newExits = totalConnections === 0 ? 'None' :
                        totalConnections === 1 ? 'One' :
                        totalConnections === 2 ? 'Two' :
                        totalConnections === 3 ? 'Three' : 'Four';

        return {
          ...room,
          connectedRooms: newConnectedRooms,
          directions: newDirections,
          exits: newExits,
          maxConnections: Math.max(totalConnections, room.maxConnections)
        };
      } else if (room.id === room2.id) {
        const newConnectedRooms = new Map(room.connectedRooms);
        const currentConnections = newConnectedRooms.get(oppositeDirection) || [];
        let newDirections = [...room.directions];
        
        if (room2HasConnection) {
          // Remove connection
          const updatedConnections = currentConnections.filter(id => id !== room1.id);
          if (updatedConnections.length === 0) {
            newConnectedRooms.delete(oppositeDirection);
            const dirIndex = newDirections.indexOf(oppositeDirection);
            if (dirIndex > -1) {
              newDirections.splice(dirIndex, 1);
            }
          } else {
            newConnectedRooms.set(oppositeDirection, updatedConnections);
          }
        } else {
          // Add connection
          const updatedConnections = [...currentConnections, room1.id];
          newConnectedRooms.set(oppositeDirection, updatedConnections);
          if (!newDirections.includes(oppositeDirection)) {
            newDirections.push(oppositeDirection);
          }
        }
        
        // Calculate total connections across all directions
        const totalConnections = Array.from(newConnectedRooms.values()).reduce((sum, connections) => sum + connections.length, 0);
        const newExits = totalConnections === 0 ? 'None' :
                        totalConnections === 1 ? 'One' :
                        totalConnections === 2 ? 'Two' :
                        totalConnections === 3 ? 'Three' : 'Four';

        return {
          ...room,
          connectedRooms: newConnectedRooms,
          directions: newDirections,
          exits: newExits,
          maxConnections: Math.max(totalConnections, room.maxConnections)
        };
      }
      return room;
    });

    setGeneratedRooms(updatedRooms);
  };

  const getDirectionBetweenRooms = (fromRoom, toRoom) => {
    const deltaX = toRoom.coordinates.x - fromRoom.coordinates.x;
    const deltaY = toRoom.coordinates.y - fromRoom.coordinates.y;

    // For adjacent rooms, use exact directions
    if (Math.abs(deltaX) <= 1 && Math.abs(deltaY) <= 1) {
      if (deltaX === 0 && deltaY === 1) return 'North';
      if (deltaX === 0 && deltaY === -1) return 'South';
      if (deltaX === 1 && deltaY === 0) return 'East';
      if (deltaX === -1 && deltaY === 0) return 'West';
      if (deltaX === 1 && deltaY === 1) return 'Northeast';
      if (deltaX === -1 && deltaY === 1) return 'Northwest';
      if (deltaX === 1 && deltaY === -1) return 'Southeast';
      if (deltaX === -1 && deltaY === -1) return 'Southwest';
    }

    // For non-adjacent rooms, determine general direction based on predominant axis
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    if (absDeltaX > absDeltaY) {
      // Primarily horizontal movement
      if (deltaY === 0) {
        return deltaX > 0 ? 'East' : 'West';
      } else {
        // Diagonal with horizontal predominance
        if (deltaX > 0) {
          return deltaY > 0 ? 'Northeast' : 'Southeast';
        } else {
          return deltaY > 0 ? 'Northwest' : 'Southwest';
        }
      }
    } else if (absDeltaY > absDeltaX) {
      // Primarily vertical movement
      if (deltaX === 0) {
        return deltaY > 0 ? 'North' : 'South';
      } else {
        // Diagonal with vertical predominance
        if (deltaY > 0) {
          return deltaX > 0 ? 'Northeast' : 'Northwest';
        } else {
          return deltaX > 0 ? 'Southeast' : 'Southwest';
        }
      }
    } else {
      // Equal horizontal and vertical movement (perfect diagonal)
      if (deltaX > 0) {
        return deltaY > 0 ? 'Northeast' : 'Southeast';
      } else {
        return deltaY > 0 ? 'Northwest' : 'Southwest';
      }
    }
  };

  const areRoomsAdjacent = (room1, room2) => {
    const deltaX = Math.abs(room1.coordinates.x - room2.coordinates.x);
    const deltaY = Math.abs(room1.coordinates.y - room2.coordinates.y);
    return deltaX <= 1 && deltaY <= 1 && !(deltaX === 0 && deltaY === 0);
  };

  const areRoomsConnected = (room1, room2) => {
    if (!room1 || !room2) return false;
    const direction = getDirectionBetweenRooms(room1, room2);
    const connectionsInDirection = room1.connectedRooms.get(direction) || [];
    return connectionsInDirection.includes(room2.id);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedRoom(null); // Clear selection when toggling mode
    setDragState({ isDragging: false, draggedRoom: null, startPos: null, currentPos: null, dragStarted: false }); // Clear drag state
    setRoomEditMenu({ isOpen: false, room: null, contentType: '', specificType: '', notes: '', hasTreasure: false, treasureLocation: '' }); // Close edit menu
  };

  const handleRoomEdit = (room) => {
    // console.log('handleRoomEdit called for room:', room.id, 'Edit mode:', isEditMode);
    if (!isEditMode) return;
    
    // Clear any room selection when editing
    setSelectedRoom(null);
    
    // Get the specific type details based on content type
    let specificType = '';
    if (room.contents.content === 'Hazard' && hazardTypes.includes(room.contents.details)) {
      specificType = room.contents.details;
    } else if (room.contents.content === 'Enigma' && enigmaTypes.includes(room.contents.details)) {
      specificType = room.contents.details;
    } else if (room.contents.content === 'Distractor' && distractorTypes.includes(room.contents.details)) {
      specificType = room.contents.details;
    }
    
    // console.log('Opening room edit menu for room:', room.id);
    setRoomEditMenu({
      isOpen: true,
      room: room,
      contentType: room.contents.content,
      specificType: specificType,
      notes: room.notes || '',
      hasTreasure: room.contents.hasTreasure || false,
      treasureLocation: room.contents.treasureLocation || ''
    });
  };

  // Separate handler for room card clicks in the Generated Site Layout
  const handleRoomCardClick = (room) => {
    // Get the specific type details based on content type
    let specificType = '';
    if (room.contents.content === 'Hazard' && hazardTypes.includes(room.contents.details)) {
      specificType = room.contents.details;
    } else if (room.contents.content === 'Enigma' && enigmaTypes.includes(room.contents.details)) {
      specificType = room.contents.details;
    } else if (room.contents.content === 'Distractor' && distractorTypes.includes(room.contents.details)) {
      specificType = room.contents.details;
    }
    
    setRoomEditMenu({
      isOpen: true,
      room: room,
      contentType: room.contents.content,
      specificType: specificType,
      notes: room.notes || '',
      hasTreasure: room.contents.hasTreasure || false,
      treasureLocation: room.contents.treasureLocation || ''
    });
  };

  const closeRoomEditMenu = () => {
    setRoomEditMenu({ isOpen: false, room: null, contentType: '', specificType: '', notes: '', hasTreasure: false, treasureLocation: '' });
  };

  const saveRoomChanges = () => {
    if (!roomEditMenu.room) return;
    
    const updatedRooms = generatedRooms.map(room => {
      if (room.id === roomEditMenu.room.id) {
        let details = '';
        
        // Set details based on content type and specific type
        switch (roomEditMenu.contentType) {
          case 'Creature':
            details = 'A creature inhabits this room. Consider inhabitants from page 240.';
            break;
          case 'Hazard':
            details = roomEditMenu.specificType || getRandomArrayItem(hazardTypes);
            break;
          case 'Enigma':
            details = roomEditMenu.specificType || getRandomArrayItem(enigmaTypes);
            break;
          case 'Distractor':
            details = roomEditMenu.specificType || getRandomArrayItem(distractorTypes);
            break;
          case 'Empty':
            details = 'This room appears empty and devoid of anything worth interacting with.';
            break;
          default:
            details = room.contents.details;
        }
        
        return {
          ...room,
          contents: {
            ...room.contents,
            content: roomEditMenu.contentType,
            details: details,
            hasTreasure: roomEditMenu.hasTreasure,
            treasureLocation: roomEditMenu.hasTreasure ? 
              (roomEditMenu.treasureLocation || getRandomArrayItem(treasureLocations)) : null
          },
          notes: roomEditMenu.notes
        };
      }
      return room;
    });
    
    setGeneratedRooms(updatedRooms);
    closeRoomEditMenu();
  };

  const getSpecificTypesForContent = (contentType) => {
    switch (contentType) {
      case 'Hazard':
        return hazardTypes;
      case 'Enigma':
        return enigmaTypes;
      case 'Distractor':
        return distractorTypes;
      default:
        return [];
    }
  };

  // Ruin Edit Functions
  const handleRuinItemClick = (editType, currentValue) => {
    let options = [];
    let title = '';

    switch (editType) {
      case 'siteType':
        options = basicSiteTypesTable.map(entry => ({
          type: entry.type,
          display: entry.type
        }));
        title = 'Choose Site Type';
        break;
      case 'importantInhabitants':
        options = importantInhabitantsTable.map(entry => ({
          description: entry.result,
          display: entry.result
        }));
        title = 'Choose Important Inhabitants';
        break;
      case 'hostilityReason':
        options = hostilityReasonsTable.map(entry => ({
          reason: entry.reason,
          display: entry.reason
        }));
        title = 'Choose Hostility Reason';
        break;
      case 'whyTheyCame':
        options = whyDidTheyComeTable.map(entry => ({
          reason: entry.reason,
          display: entry.reason
        }));
        title = 'Choose Why They Came';
        break;
      case 'allianceCause':
        options = allianceCausesTable.map(entry => ({
          cause: entry.cause,
          display: entry.cause
        }));
        title = 'Choose Alliance Cause';
        break;
      case 'whyStaying':
        options = whyStayingTable.map(entry => ({
          reason: entry.reason,
          display: entry.reason
        }));
        title = 'Choose Why They\'re Staying';
        break;
      default:
        break;
    }

    setRuinEditMenu({
      isOpen: true,
      editType: editType,
      currentValue: currentValue,
      options: options,
      title: title,
      step: 1,
      selectedType: null
    });
  };

  const closeRuinEditMenu = () => {
    setRuinEditMenu({
      isOpen: false,
      editType: '',
      currentValue: '',
      options: [],
      title: '',
      step: 1,
      selectedType: null
    });
  };

  const selectRuinOption = (option) => {
    if (!ruinEditMenu.editType || !ruinInfo) return;

    // Handle site type two-step selection
    if (ruinEditMenu.editType === 'siteType') {
      if (ruinEditMenu.step === 1) {
        // First step: type selected, show examples
        let exampleTable = [];
        let exampleTitle = '';
        
        switch (option.type) {
          case 'Residential Site':
            exampleTable = residentialSiteExamples;
            exampleTitle = 'Choose Residential Site Example';
            break;
          case 'Military Site':
            exampleTable = militarySiteExamples;
            exampleTitle = 'Choose Military Site Example';
            break;
          case 'Production Site':
            exampleTable = productionSiteExamples;
            exampleTitle = 'Choose Production Site Example';
            break;
          case 'Religious Site':
            exampleTable = religiousSiteExamples;
            exampleTitle = 'Choose Religious Site Example';
            break;
          case 'Cultural Site':
            exampleTable = culturalSiteExamples;
            exampleTitle = 'Choose Cultural Site Example';
            break;
          case 'Infrastructure Site':
            exampleTable = infrastructureSiteExamples;
            exampleTitle = 'Choose Infrastructure Site Example';
            break;
          default:
            break;
        }

        const exampleOptions = exampleTable.map(entry => ({
          type: option.type,
          site: entry.site,
          display: entry.site
        }));

        setRuinEditMenu({
          ...ruinEditMenu,
          options: exampleOptions,
          title: exampleTitle,
          step: 2,
          selectedType: option.type
        });
        return;
      } else {
        // Second step: example selected, update ruin info
        let updatedRuinInfo = { ...ruinInfo };
        updatedRuinInfo.type = option.type;
        updatedRuinInfo.site = option.site;
        setRuinInfo(updatedRuinInfo);
        closeRuinEditMenu();
        return;
      }
    }

    // Handle other single-step selections
    let updatedRuinInfo = { ...ruinInfo };

    switch (ruinEditMenu.editType) {
      case 'importantInhabitants':
        updatedRuinInfo.inhabitation.importantInhabitants = option;
        break;
      case 'hostilityReason':
        updatedRuinInfo.inhabitation.hostilityReason = option;
        break;
      case 'whyTheyCame':
        updatedRuinInfo.inhabitation.whyTheyCame = option;
        break;
      case 'allianceCause':
        updatedRuinInfo.inhabitation.allianceCause = option;
        break;
      case 'whyStaying':
        updatedRuinInfo.inhabitation.whyStaying = option;
        break;
      default:
        break;
    }

    setRuinInfo(updatedRuinInfo);
    closeRuinEditMenu();
  };

  const goBackToSiteTypeSelection = () => {
    if (ruinEditMenu.editType === 'siteType' && ruinEditMenu.step === 2) {
      const typeOptions = basicSiteTypesTable.map(entry => ({
        type: entry.type,
        display: entry.type
      }));

      setRuinEditMenu({
        ...ruinEditMenu,
        options: typeOptions,
        title: 'Choose Site Type',
        step: 1,
        selectedType: null
      });
    }
  };

  const handleMouseDown = (room, event) => {
    if (!isEditMode) return;
    
    // Don't start drag on shift+click (used for editing) - let the click handler deal with it
    if (event.shiftKey) {
      return; // Don't prevent default, let the click event handle it normally
    }
    
    // Prevent text selection during drag preparation
    event.preventDefault();
    
    const rect = event.currentTarget.getBoundingClientRect();
    const startPos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    
    // Prepare for potential drag, but don't mark as dragging yet
    setDragState({
      isDragging: false, // Don't mark as dragging until mouse moves
      draggedRoom: room,
      startPos: startPos,
      currentPos: { x: event.clientX, y: event.clientY },
      dragStarted: false
    });
  };

  const handleMouseMove = (event) => {
    if (!dragState.draggedRoom) return;
    
    event.preventDefault();
    
    // Calculate distance moved from start position
    const deltaX = Math.abs(event.clientX - dragState.currentPos.x);
    const deltaY = Math.abs(event.clientY - dragState.currentPos.y);
    const dragThreshold = 5; // Minimum pixels to move before considering it a drag
    
    // If we've moved enough distance, start actual dragging
    if (!dragState.isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
      setDragState(prev => ({
        ...prev,
        isDragging: true,
        dragStarted: true,
        currentPos: {
          x: event.clientX,
          y: event.clientY
        }
      }));
    } else if (dragState.isDragging) {
      // Update position if already dragging
      setDragState(prev => ({
        ...prev,
        currentPos: {
          x: event.clientX,
          y: event.clientY
        }
      }));
    }
  };

  const handleMouseUp = (event) => {
    if (!dragState.draggedRoom) return;
    
    // Only process room movement if we actually started dragging
    if (dragState.isDragging && dragState.dragStarted) {
      // Find the grid cell we're dropping onto
      const gridContainer = document.querySelector('.grid-layout');
      if (gridContainer) {
        const rect = gridContainer.getBoundingClientRect();
        const dropX = event.clientX - rect.left;
        const dropY = event.clientY - rect.top;
        
        // Calculate which grid cell this corresponds to
        const cellWidth = 100 + 50; // cell width + gap
        const cellHeight = 100 + 50; // cell height + gap
        
        // Calculate grid bounds
        const minX = Math.min(...generatedRooms.map(r => r.coordinates.x)) - 1;
        const maxX = Math.max(...generatedRooms.map(r => r.coordinates.x)) + 1;
        const minY = Math.max(...generatedRooms.map(r => r.coordinates.y)) + 1;
        const maxY = Math.min(...generatedRooms.map(r => r.coordinates.y)) - 1;
        
        const gridCol = Math.floor(dropX / cellWidth);
        const gridRow = Math.floor(dropY / cellHeight);
        
        // Convert grid position to coordinates
        const newX = minX + gridCol;
        const newY = minY - gridRow; // Y is inverted in the display
        
        // Check if the target position is valid and not occupied by another room
        const targetOccupied = generatedRooms.some(room => 
          room.id !== dragState.draggedRoom.id && 
          room.coordinates.x === newX && 
          room.coordinates.y === newY
        );
        
        if (!targetOccupied && newX >= minX && newX <= maxX && newY >= maxY && newY <= minY) {
          // Move the room to the new position
          moveRoomToPosition(dragState.draggedRoom, { x: newX, y: newY });
        }
      }
    }
    
    // Reset drag state
    setDragState({ 
      isDragging: false, 
      draggedRoom: null, 
      startPos: null, 
      currentPos: null, 
      dragStarted: false 
    });
  };

  const moveRoomToPosition = (room, newCoordinates) => {
    // First, update the room's coordinates
    let updatedRooms = generatedRooms.map(r => {
      if (r.id === room.id) {
        return {
          ...r,
          coordinates: newCoordinates
        };
      }
      return r;
    });

    // Now recalculate all connections and directions for affected rooms
    updatedRooms = updatedRooms.map(currentRoom => {
      // Get all rooms that this room is connected to (flatten all direction arrays)
      const allConnectedRoomIds = Array.from(currentRoom.connectedRooms.values()).flat();
      
      // If this room has connections, we need to update the directions
      if (allConnectedRoomIds.length > 0) {
        const newConnectedRooms = new Map();
        const newDirections = [];
        
        // Group connected rooms by their new directions
        allConnectedRoomIds.forEach(connectedRoomId => {
          const connectedRoom = updatedRooms.find(r => r.id === connectedRoomId);
          if (connectedRoom) {
            // Calculate new direction from current room to connected room
            const newDirection = getDirectionBetweenRooms(currentRoom, connectedRoom);
            
            // Add to the array of rooms in this direction
            const existingConnections = newConnectedRooms.get(newDirection) || [];
            newConnectedRooms.set(newDirection, [...existingConnections, connectedRoomId]);
            
            // Add direction to directions array if not already present
            if (!newDirections.includes(newDirection)) {
              newDirections.push(newDirection);
            }
          }
        });
        
        return {
          ...currentRoom,
          connectedRooms: newConnectedRooms,
          directions: newDirections
        };
      }
      
      return currentRoom;
    });
    
    setGeneratedRooms(updatedRooms);
  };

  // Add global mouse event listeners for drag and drop
  React.useEffect(() => {
    if (dragState.draggedRoom) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      if (dragState.isDragging) {
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
      }
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [dragState.draggedRoom, dragState.isDragging, generatedRooms]);

  // Add keyboard event listener for delete functionality
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isEditMode || !selectedRoom) return;
      
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        deleteSelectedRoom();
      }
    };

    if (isEditMode) {
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isEditMode, selectedRoom, generatedRooms]);
  
  const createNewRoom = (coordinates) => {
    if (!isEditMode) return;
    
    // Check if coordinates are already occupied
    const existingRoom = generatedRooms.find(room => 
      room.coordinates.x === coordinates.x && room.coordinates.y === coordinates.y
    );
    
    if (existingRoom) {
      // console.log('Cannot create room - position already occupied');
      return;
    }
    
    // Find the highest room ID to assign the next sequential ID
    const maxId = Math.max(...generatedRooms.map(room => room.id), 0);
    const newRoomId = maxId + 1;
    
    // Create the new room with no exits initially (to be connected manually)
    const newRoom = {
      id: newRoomId,
      isIngress: false,
      exits: 'None',
      directions: [],
      contents: generateRoomContents(),
      notes: (() => {
        const roomOfInterest = generateRoomOfInterest();
        return `${roomOfInterest.function}: ${roomOfInterest.example}`;
      })(),
      connectedRooms: new Map(),
      coordinates: coordinates,
      maxConnections: null
    };
    
    // Add the new room to the rooms array
    const updatedRooms = [...generatedRooms, newRoom];
    setGeneratedRooms(updatedRooms);
    
    // console.log(`Created new Room ${newRoomId} at coordinates (${coordinates.x}, ${coordinates.y})`);
  };

  const handleEmptyCellClick = (coordinates, event) => {
    if (!isEditMode) return;
    
    // Check for shift+click to create new room
    if (event && event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      // console.log('Shift+click detected on empty cell, creating new room at:', coordinates);
      createNewRoom(coordinates);
      return;
    }
  };

  return (
    <div className="room-generator">
      <header className="generator-header">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            ← Back to Menu
          </button>
        )}
        <h1>🏰 Room Generator</h1>
        <p>Generate randomized rooms based on the "Without Number" exploration rules</p>
      </header>

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="dungeonName">Name:</label>
          <input
            type="text"
            id="dungeonName"
            placeholder="Dungeon Name"
            value={dungeonName}
            onChange={(e) => setDungeonName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="numRooms">Number of Rooms:</label>
          <input
            type="number"
            id="numRooms"
            min="1"
            max="50"
            value={numRooms}
            onChange={(e) => setNumRooms(parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="button-group">
          <button 
            onClick={generateRooms}
            disabled={isGenerating}
            className="generate-btn"
          >
            {isGenerating ? 'Generating...' : 'Generate Rooms'}
          </button>
          
          <button 
            onClick={exportToJSON}
            disabled={generatedRooms.length === 0}
            className="export-btn"
            title="Export current dungeon layout to JSON file"
          >
            💾 Export JSON
          </button>
          
          <button 
            onClick={exportToPDF}
            disabled={generatedRooms.length === 0}
            className="print-btn"
            title="Export current dungeon layout to PDF file"
          >
            💾 Export PDF
          </button>
          
          <button 
            onClick={triggerFileImport}
            className="import-btn"
            title="Import dungeon layout from JSON file"
          >
            📁 Import JSON
          </button>
          
          <button 
            onClick={toggleEditMode}
            disabled={generatedRooms.length === 0}
            className={`edit-btn ${isEditMode ? 'active' : ''}`}
            title="Toggle edit mode to add/remove connections between rooms"
          >
            ✏️ {isEditMode ? 'Exit Edit' : 'Edit Mode'}
          </button>
          
          <input
            type="file"
            accept=".json"
            onChange={importFromJSON}
            ref={(ref) => setFileInputRef(ref)}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {ruinInfo && (
            <div className="ruin-information">
              <h3>🏛️ Ruin Information</h3>
              <div className="ruin-details">
                {/* Column 1: Site Information */}
                <div className="ruin-column">
                  <h4>📍 Site Details</h4>
                  <div 
                    className="ruin-detail-item clickable"
                    onClick={() => handleRuinItemClick('siteType', `${ruinInfo.type} - ${ruinInfo.site}`)}
                    title="Click to choose site type"
                  >
                    <strong>Site Type:</strong> {ruinInfo.type}
                    <br />
                    <strong>Example:</strong> {ruinInfo.site}
                  </div>
                  {ruinInfo.inhabitation && (
                    <div 
                      className="ruin-detail-item clickable"
                      onClick={() => handleRuinItemClick('importantInhabitants', ruinInfo.inhabitation.importantInhabitants.description)}
                      title="Click to choose important inhabitants"
                    >
                      <strong>Important Inhabitants:</strong> {ruinInfo.inhabitation.importantInhabitants.description}
                    </div>
                  )}
                </div>

                {/* Column 2: Social Dynamics */}
                {ruinInfo.inhabitation && (
                  <div className="ruin-column">
                    <h4>⚔️ Social Dynamics</h4>
                    <div 
                      className="ruin-detail-item clickable"
                      onClick={() => handleRuinItemClick('hostilityReason', ruinInfo.inhabitation.hostilityReason.reason)}
                      title="Click to choose hostility reason"
                    >
                      <strong>Hostility Reason:</strong> {ruinInfo.inhabitation.hostilityReason.reason}
                    </div>
                    <div 
                      className="ruin-detail-item clickable"
                      onClick={() => handleRuinItemClick('allianceCause', ruinInfo.inhabitation.allianceCause.cause)}
                      title="Click to choose alliance cause"
                    >
                      <strong>Alliance Cause:</strong> {ruinInfo.inhabitation.allianceCause.cause}
                    </div>
                  </div>
                )}

                {/* Column 3: Origins & Motivations */}
                {ruinInfo.inhabitation && (
                  <div className="ruin-column">
                    <h4>🎯 Origins & Motivations</h4>
                    <div 
                      className="ruin-detail-item clickable"
                      onClick={() => handleRuinItemClick('whyTheyCame', ruinInfo.inhabitation.whyTheyCame.reason)}
                      title="Click to choose why they came"
                    >
                      <strong>Why They Came:</strong> {ruinInfo.inhabitation.whyTheyCame.reason}
                    </div>
                    <div 
                      className="ruin-detail-item clickable"
                      onClick={() => handleRuinItemClick('whyStaying', ruinInfo.inhabitation.whyStaying.reason)}
                      title="Click to choose why they're staying"
                    >
                      <strong>Why They're Staying:</strong> {ruinInfo.inhabitation.whyStaying.reason}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {generatedRooms.length > 0 && (
        <div className="connection-map">          
          <h3>🗺️ Dungeon Grid Layout</h3>
            {isEditMode && (
              <div className="edit-instructions">
                <h4>✏️ Edit Mode Active</h4>
                <p>
                  Click on any two rooms to toggle their connection. Adjacent rooms show yellow lines, distant rooms show red lines.
                  Shift+click a room to edit its contents. Shift+click an empty grid square to create a new room. Drag and drop rooms to move them to different positions.
                  Press Delete or Backspace to remove a selected room that has no connections.
                  {selectedRoom && <span> <strong>Room {selectedRoom.id} selected</strong> - click another room to connect/disconnect{isRoomDeletable(selectedRoom) ? ', or press Delete/Backspace to remove this room' : ''}.</span>}
                  {!selectedRoom && <span> Click a room to select it first.</span>}
                </p>
              </div>
            )}
            <div className="grid-container">
              {(() => {
                // Calculate grid bounds
                const minX = Math.min(...generatedRooms.map(r => r.coordinates.x)) - 1;
                const maxX = Math.max(...generatedRooms.map(r => r.coordinates.x)) + 1;
                const minY = Math.max(...generatedRooms.map(r => r.coordinates.y)) + 1;
                const maxY = Math.min(...generatedRooms.map(r => r.coordinates.y)) - 1;
                
                const gridElements = [];
                const connectionElements = [];
                
                // Create grid cells (Y from top to bottom, so we iterate from maxY to minY)
                for (let y = minY; y >= maxY; y--) {
                  for (let x = minX; x <= maxX; x++) {
                    const room = generatedRooms.find(r => r.coordinates.x === x && r.coordinates.y === y);
                    const key = `${x},${y}`;
                    
                    if (room) {
                      const isSelected = selectedRoom && selectedRoom.id === room.id;
                      const isConnectable = selectedRoom && selectedRoom.id !== room.id;
                      const isConnected = selectedRoom && areRoomsConnected(selectedRoom, room);
                      const isAdjacent = selectedRoom && areRoomsAdjacent(selectedRoom, room);
                      const isDragging = dragState.isDragging && dragState.draggedRoom?.id === room.id;
                      const isDeletable = isSelected && isRoomDeletable(room);
                      
                      const roomClasses = [
                        'grid-cell',
                        'room-cell',
                        room.isIngress ? 'ingress' : '',
                        room.contents.hasTreasure ? 'treasure' : '',
                        isEditMode ? 'editable' : '',
                        isSelected ? 'selected' : '',
                        isDragging ? 'dragging' : '',
                        isDeletable ? 'deletable' : '',
                        isConnectable ? (isConnected ? 'connectable-connected' : (isAdjacent ? 'connectable' : 'connectable-distant')) : ''
                      ].filter(Boolean).join(' ');

                      const cellStyle = {
                        cursor: isEditMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
                        opacity: isDragging ? 0.3 : 1, // Make original semi-transparent when dragging
                        pointerEvents: isDragging ? 'none' : 'auto'
                      };

                      gridElements.push(
                        <div 
                          key={key} 
                          className={roomClasses}
                          onClick={(e) => handleRoomClick(room, e)}
                          style={cellStyle}
                          onMouseDown={(e) => handleMouseDown(room, e)}
                        >
                          <div className="grid-room-id">R{room.id}</div>
                          <div className="grid-coordinates">({x},{y})</div>
                          <div className="grid-room-type">{getRoomTypeIcon(room.contents.content)}</div>
                          {isEditMode && isConnectable && (
                            <div className="connection-indicator">
                              {isConnected ? '🔗' : (isAdjacent ? '➕' : '🔗➕')}
                            </div>
                          )}
                        </div>
                      );
                      
                      // Add connection lines for this room
                      if (room.connectedRooms) {
                        Array.from(room.connectedRooms.entries()).forEach(([direction, connectedRoomIds]) => {
                          // Handle both old format (single ID) and new format (array of IDs)
                          const roomIds = Array.isArray(connectedRoomIds) ? connectedRoomIds : [connectedRoomIds];
                          
                          roomIds.forEach(connectedRoomId => {
                            const connectedRoom = generatedRooms.find(r => r.id === connectedRoomId);
                            if (connectedRoom) {
                              // Calculate grid positions (convert from coordinate system to grid indices)
                              const fromGridX = x - minX;
                              const fromGridY = minY - y;
                              const toGridX = connectedRoom.coordinates.x - minX;
                              const toGridY = minY - connectedRoom.coordinates.y;
                              
                              // Only draw line if we haven't drawn it from the other direction
                            // (to avoid duplicate lines)
                            const connectionKey = `${Math.min(room.id, connectedRoomId)}-${Math.max(room.id, connectedRoomId)}`;
                            
                            // Check if this connection has already been added
                            if (!connectionElements.some(el => el.key === connectionKey)) {
                              // Determine connection type and create line element
                              const deltaX = toGridX - fromGridX;
                              const deltaY = toGridY - fromGridY;
                              
                              // Check if rooms are adjacent (distance of 1 in both X and Y)
                              const isAdjacent = Math.abs(deltaX) <= 1 && Math.abs(deltaY) <= 1;
                              
                              let connectionClass = isAdjacent ? 'connection-line' : 'connection-line distant';
                              let lineStyle = {};
                              
                              // Calculate position and rotation for the line
                              const centerFromX = fromGridX * 150 + 50; // 100px cell + 50px gap = 150px spacing, +50px to center
                              const centerFromY = fromGridY * 150 + 50;
                              const centerToX = toGridX * 150 + 50;
                              const centerToY = toGridY * 150 + 50;
                              
                              const distance = Math.sqrt((centerToX - centerFromX) ** 2 + (centerToY - centerFromY) ** 2);
                              const angle = Math.atan2(centerToY - centerFromY, centerToX - centerFromX) * 180 / Math.PI;
                              
                              // Use different colors for adjacent vs distant connections
                              const lineColor = isAdjacent ? '#fbbf24' : '#dc2626'; // Yellow for adjacent, darker red core for distant
                              const borderColor = isAdjacent ? '#f59e0b' : '#991b1b'; // Darker border for distant
                              const shadowColor = isAdjacent ? 'rgba(251, 191, 36, 0.8)' : 'rgba(220, 38, 38, 1.0)'; // More intense red shadow
                              
                              lineStyle = {
                                position: 'absolute',
                                left: `${centerFromX}px`,
                                top: `${centerFromY - 2}px`, // Center the line vertically
                                width: `${distance}px`,
                                height: isAdjacent ? '4px' : '6px', // Make distant connections slightly thicker
                                backgroundColor: lineColor,
                                transformOrigin: '0 50%',
                                transform: `rotate(${angle}deg)`,
                                zIndex: 15, // Even higher z-index
                                borderRadius: '2px',
                                border: `2px solid ${borderColor}`, // Thicker border for distant connections
                                boxShadow: `0 0 ${isAdjacent ? '8px' : '12px'} ${shadowColor}`, // More prominent glow for distant
                                pointerEvents: 'none' // Prevent interference with room interactions
                              };
                              
                              connectionElements.push(
                                <div
                                  key={connectionKey}
                                  className={connectionClass}
                                  style={lineStyle}
                                  title={`Connection: Room ${room.id} ↔ Room ${connectedRoomId}`}
                                />
                              );
                              
                              // Debug log
                              // console.log(`Added ${isAdjacent ? 'adjacent' : 'distant'} connection line: ${connectionKey}, from (${centerFromX}, ${centerFromY}) to (${centerToX}, ${centerToY}), distance: ${distance}, angle: ${angle}`);
                            }
                          }
                        });
                      });
                      }
                    } else {
                      gridElements.push(
                        <div 
                          key={key} 
                          className="grid-cell empty-cell"
                          onClick={(e) => handleEmptyCellClick({ x, y }, e)}
                          style={{
                            cursor: isEditMode ? 'pointer' : 'default'
                          }}
                        >
                          <div className="grid-coordinates">({x},{y})</div>
                          {isEditMode && (
                            <div className="empty-cell-hint">Shift+click to add room</div>
                          )}
                        </div>
                      );
                    }
                  }
                }
                
                return (
                  <div className="grid-layout-wrapper" style={{ 
                    position: 'relative',
                    overflow: 'visible',
                    padding: '20px'
                  }}>
                    <div 
                      className="grid-layout" 
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${maxX - minX + 1}, 100px)`,
                        gridTemplateRows: `repeat(${minY - maxY + 1}, 100px)`,
                        gap: '50px', // Half the width of a square
                        position: 'relative',
                        zIndex: 5,
                        width: 'max-content'
                      }}
                    >
                      {gridElements}
                    </div>
                    <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1, width: '100%', height: '100%' }}>
                      {connectionElements}
                    </div>
                    {/* Drag preview element */}
                    {dragState.isDragging && dragState.draggedRoom && dragState.currentPos && (
                      <div
                        style={{
                          position: 'fixed',
                          left: dragState.currentPos.x,
                          top: dragState.currentPos.y,
                          zIndex: 1000,
                          transform: 'translate(-50%, -50%)',
                          opacity: 0.8,
                          pointerEvents: 'none'
                        }}
                        className={`grid-cell room-cell dragging ${dragState.draggedRoom.isIngress ? 'ingress' : ''} ${dragState.draggedRoom.contents.hasTreasure ? 'treasure' : ''}`}
                      >
                        <div className="grid-room-id">R{dragState.draggedRoom.id}</div>
                        <div className="grid-coordinates">({dragState.draggedRoom.coordinates.x},{dragState.draggedRoom.coordinates.y})</div>
                        <div className="grid-room-type">{getRoomTypeIcon(dragState.draggedRoom.contents.content)}</div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            
            {/* <div className="connection-list">
              <h4>Room Connections:</h4>
              <div className="connection-legend">
                <div className="legend-item">
                  <div className="legend-line adjacent"></div>
                  <span>Adjacent Room Connections</span>
                </div>
                <div className="legend-item">
                  <div className="legend-line distant"></div>
                  <span>Distant Room Connections</span>
                </div>
              </div>
              {generatedRooms.map((room) => (
                <div key={room.id} className="connection-summary">
                  <strong>Room {room.id} ({room.coordinates.x}, {room.coordinates.y}):</strong>
                  {room.connectedRooms && Array.from(room.connectedRooms.entries()).map(([direction, connectedRoomIds]) => {
                    // Handle both old format (single ID) and new format (array of IDs)
                    const roomIds = Array.isArray(connectedRoomIds) ? connectedRoomIds : [connectedRoomIds];
                    return roomIds.map(connectedRoomId => {
                      const connectedRoom = generatedRooms.find(r => r.id === connectedRoomId);
                      return (
                        <span key={`${direction}-${connectedRoomId}`} className="connection-detail">
                          {direction} → R{connectedRoomId} ({connectedRoom?.coordinates.x}, {connectedRoom?.coordinates.y})
                        </span>
                      );
                    });
                  }).flat()}
                </div>
              ))}
            </div> */}
          </div>
        )}

      {generatedRooms.length > 0 && (
        <div className="rooms-container">
          <h2>Generated Site Layout</h2>
          <div className="rooms-grid">
            {generatedRooms.map((room) => (
              <div 
                key={room.id} 
                className={`room-card ${room.isIngress ? 'ingress' : ''}`}
                onClick={() => handleRoomCardClick(room)}
                style={{ cursor: 'pointer' }}
                title="Click to edit room"
              >
                <div className="room-header">
                  <h3>
                    {getRoomTypeIcon(room.contents.content)} Room {room.id}
                    {room.isIngress && <span className="ingress-badge">INGRESS</span>}
                  </h3>
                  <div className="room-coordinates">
                    Grid: ({room.coordinates.x}, {room.coordinates.y})
                  </div>
                </div>
                
                <div className="room-details">
                  <div className="exits-section">
                    <strong>Exits:</strong> {room.exits}
                    {room.directions.length > 0 && (
                      <div className="directions">
                        <strong>Connections:</strong>
                        <ul className="connections-list">
                          {room.directions.map((direction, index) => {
                            const connectedRoomIds = room.connectedRooms?.get(direction) || [];
                            const roomIds = Array.isArray(connectedRoomIds) ? connectedRoomIds : [connectedRoomIds];
                            return (
                              <li key={index}>
                                <strong>{direction}:</strong> {roomIds.length > 0 ? roomIds.map(id => `Room ${id}`).join(', ') : 'Unconnected'}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="contents-section">
                    <strong>Contents:</strong> {room.contents.content}
                    <div className="content-details">
                      {room.contents.details}
                    </div>
                  </div>

                  {room.contents.hasTreasure && (
                    <div className="treasure-section">
                      <strong>💰 Treasure:</strong> {room.contents.treasureLocation}
                    </div>
                  )}

                  {room.notes && (
                    <div className="notes-section">
                      <strong>Notes:</strong> {room.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* <div className="instructions">
            <h3>📋 GM Instructions</h3>
            <ol>
              <li>Place Room 1 (Ingress) at the center of your play area - this represents grid position (0,0)</li>
              <li>Use the grid coordinates to place other rooms relative to Room 1</li>
              <li>Each room's "Exits" count represents the total number of connections (including the entrance from another room)</li>
              <li>Follow the connections shown for each room - place connected rooms in the indicated directions</li>
              <li>Mark exits with coins or tokens on each room card</li>
              <li>Rooms are automatically linked bidirectionally (if Room 1 connects North to Room 2, Room 2 connects South back to Room 1)</li>
              <li>Dead-end rooms may have had their exits rerolled to continue dungeon generation</li>
              <li>Sketch room dimensions on each card for combat</li>
              <li>Distribute treasure according to the treasure placement rules</li>
              <li>The layout forms a connected dungeon where players can move between rooms via the established connections</li>
            </ol>
            
            <div className="layout-tip">
              <strong>💡 Layout Tip:</strong> This generator creates a realistic dungeon layout on a coordinate grid. 
              Each room has specific (x,y) coordinates relative to the starting room. The exit count includes all 
              connections to and from the room. If generation gets stuck on dead ends, exits are automatically 
              rerolled to continue building the dungeon.
            </div>
          </div> */}
        </div>
      )}

      {/* Room Edit Menu Modal */}
      {roomEditMenu.isOpen && (
        <div className="room-edit-overlay">
          <div className="room-edit-modal">
            <h3>Edit Room {roomEditMenu.room?.id}</h3>
            
            <div className="room-edit-form">
              <div className="form-group">
                <label htmlFor="contentType">Content Type:</label>
                <select 
                  id="contentType"
                  value={roomEditMenu.contentType}
                  onChange={(e) => setRoomEditMenu({
                    ...roomEditMenu, 
                    contentType: e.target.value,
                    specificType: '' // Reset specific type when content type changes
                  })}
                >
                  <option value="Creature">Creature</option>
                  <option value="Hazard">Hazard</option>
                  <option value="Enigma">Enigma</option>
                  <option value="Distractor">Distractor</option>
                  <option value="Empty">Empty</option>
                </select>
              </div>

              {(roomEditMenu.contentType === 'Hazard' || roomEditMenu.contentType === 'Enigma' || roomEditMenu.contentType === 'Distractor') && (
                <div className="form-group">
                  <label htmlFor="specificType">Specific Type:</label>
                  <select 
                    id="specificType"
                    value={roomEditMenu.specificType}
                    onChange={(e) => setRoomEditMenu({...roomEditMenu, specificType: e.target.value})}
                  >
                    <option value="">Random (will be auto-selected)</option>
                    {getSpecificTypesForContent(roomEditMenu.contentType).map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="hasTreasure">
                  <input 
                    type="checkbox"
                    id="hasTreasure"
                    checked={roomEditMenu.hasTreasure}
                    onChange={(e) => setRoomEditMenu({
                      ...roomEditMenu, 
                      hasTreasure: e.target.checked,
                      treasureLocation: e.target.checked ? roomEditMenu.treasureLocation || getRandomArrayItem(treasureLocations) : ''
                    })}
                  />
                  Has Treasure
                </label>
              </div>

              {roomEditMenu.hasTreasure && (
                <div className="form-group">
                  <label htmlFor="treasureLocation">Treasure Location:</label>
                  <select 
                    id="treasureLocation"
                    value={roomEditMenu.treasureLocation}
                    onChange={(e) => setRoomEditMenu({...roomEditMenu, treasureLocation: e.target.value})}
                  >
                    <option value="">Random (will be auto-selected)</option>
                    {treasureLocations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="roomNotes">Notes:</label>
                <textarea 
                  id="roomNotes"
                  value={roomEditMenu.notes}
                  onChange={(e) => setRoomEditMenu({...roomEditMenu, notes: e.target.value})}
                  placeholder="Additional notes about this room..."
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-buttons">
              <button className="modal-button secondary" onClick={closeRoomEditMenu}>Cancel</button>
              <button className="modal-button primary" onClick={saveRoomChanges}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Ruin Edit Menu Modal */}
      {ruinEditMenu.isOpen && (
        <div className="room-edit-overlay">
          <div className="room-edit-modal">
            <h3>{ruinEditMenu.title}</h3>
            
            <div className="room-edit-form">
              <div className="form-group">
                <label>Current Value:</label>
                <div className="current-value-display">
                  {ruinEditMenu.currentValue}
                </div>
              </div>
              
              <div className="options-list">
                {ruinEditMenu.options.map((option, index) => (
                  <div
                    key={index}
                    className={`option-item ${option.display === ruinEditMenu.currentValue ? 'selected' : ''}`}
                    onClick={() => selectRuinOption(option)}
                  >
                    <span className="option-text">{option.display}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-buttons">
              <button className="modal-button secondary" onClick={closeRuinEditMenu}>Cancel</button>
              {ruinEditMenu.editType === 'siteType' && ruinEditMenu.step === 2 && (
                <button className="modal-button secondary" onClick={goBackToSiteTypeSelection}>← Back to Types</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomGenerator;
