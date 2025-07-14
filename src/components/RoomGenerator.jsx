import { useState } from 'react';
import './RoomGenerator.css';

const RoomGenerator = () => {
  const [numRooms, setNumRooms] = useState(5);
  const [generatedRooms, setGeneratedRooms] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Random table data based on the instructions
  const exitTable = [
    { roll: [1, 2], exits: 'One' },
    { roll: [3, 4], exits: 'Two' },
    { roll: [5, 6, 7], exits: 'Three' },
    { roll: [8], exits: 'Four' }
  ];

  const directionTable = [
    { roll: [1, 2], direction: 'North' },
    { roll: [3], direction: 'Northeast' },
    { roll: [4, 5], direction: 'East' },
    { roll: [6], direction: 'Southeast' },
    { roll: [7, 8], direction: 'South' },
    { roll: [9], direction: 'Southwest' },
    { roll: [10, 11], direction: 'West' },
    { roll: [12], direction: 'Northwest' }
  ];

  const contentsTable = [
    { roll: [1, 2], content: 'Creature', treasureChance: [1, 2, 3] },
    { roll: [3], content: 'Hazard', treasureChance: [1, 2] },
    { roll: [4], content: 'Enigma', treasureChance: [1, 2] },
    { roll: [5, 6], content: 'Distractor', treasureChance: [1] },
    { roll: [7, 8], content: 'Empty', treasureChance: [1] }
  ];

  const hazardTypes = [
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

  const distractorTypes = [
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

  const enigmaTypes = [
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

  const treasureLocations = [
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

  // Utility functions for rolling dice
  const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;
  
  const rollD8 = () => rollDie(8);
  const rollD6 = () => rollDie(6);
  const rollD12 = () => rollDie(12);
  const rollD20 = () => rollDie(20);

  const getTableResult = (roll, table) => {
    return table.find(entry => entry.roll.includes(roll));
  };

  const getRandomArrayItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const generateExits = () => {
    const roll = rollD8();
    const result = getTableResult(roll, exitTable);
    return result.exits;
  };

  const generateDirections = (numExits) => {
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

  const generateRoomContents = () => {
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

  const generateRooms = () => {
    setIsGenerating(true);
    
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
        notes: 'Starting room - place index card on table',
        connectedRooms: new Map(), // direction -> roomId
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
          
          // Check if this direction already has a connection
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
                notes: `Connected from Room ${currentRoom.id} (${direction}) at (${newCoordinates.x}, ${newCoordinates.y})`,
                connectedRooms: new Map(),
                coordinates: newCoordinates,
                maxConnections: newRoomMaxConnections
              };
              
              // Generate directions for the new room (but we'll reserve one connection for the back-connection)
              newRoom.directions = generateDirections(newRoom.exits);
              
              // Create bidirectional connection
              currentRoom.connectedRooms.set(direction, newRoom.id);
              const oppositeDirection = getOppositeDirection(direction);
              newRoom.connectedRooms.set(oppositeDirection, currentRoom.id);
              
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
              const existingRoomConnections = existingRoom.connectedRooms.size;
              const existingRoomHasCapacity = existingRoomConnections < existingRoom.maxConnections;
              
              // Only connect if both rooms have capacity and don't already have this connection
              if (existingRoom && !existingRoom.connectedRooms.has(oppositeDirection) && existingRoomHasCapacity) {
                const originalExits = Array.from(existingRoom.connectedRooms.keys());
                
                currentRoom.connectedRooms.set(direction, existingRoom.id);
                existingRoom.connectedRooms.set(oppositeDirection, currentRoom.id);
                
                // Add the opposite direction to existing room's directions if not already present
                if (!existingRoom.directions.includes(oppositeDirection)) {
                  existingRoom.directions.push(oppositeDirection);
                }
                
                const newExits = Array.from(existingRoom.connectedRooms.keys());
                console.log(`🔗 Connection added to existing Room ${existingRoom.id}:`);
                console.log(`   Original exits: [${originalExits.join(', ')}]`);
                console.log(`   New exits: [${newExits.join(', ')}]`);
                console.log(`   Connected from Room ${currentRoom.id} via ${direction}/${oppositeDirection}`);
                
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
                    roomToExpand.notes += ` (Exits rerolled: ${newExits})`;
                    
                    // Generate additional directions if needed
                    const additionalDirectionsNeeded = newMaxConnections - roomToExpand.connectedRooms.size;
                    if (additionalDirectionsNeeded > 0) {
                      const newDirections = generateDirections(roomToExpand.exits);
                      // Filter out directions that are already connected
                      const availableDirections = newDirections.filter(dir => !roomToExpand.connectedRooms.has(dir));
                      
                      // Add unique new directions
                      const uniqueNewDirections = availableDirections.filter(dir => !roomToExpand.directions.includes(dir));
                      roomToExpand.directions = [...roomToExpand.directions, ...uniqueNewDirections];
                      
                      console.log(`🎲 Rerolled Room ${roomToExpand.id} exits:`);
                      console.log(`   Original: [${originalExits.join(', ')}] → New potential: [${[...originalExits, ...uniqueNewDirections].join(', ')}]`);
                      
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
                firstRoom.notes += ' (Exits force-expanded to continue generation)';
                
                const newDirections = generateDirections(firstRoom.exits);
                const availableDirections = newDirections.filter(dir => !firstRoom.connectedRooms.has(dir));
                const uniqueNewDirections = availableDirections.filter(dir => !firstRoom.directions.includes(dir));
                firstRoom.directions = [...firstRoom.directions, ...uniqueNewDirections];
                
                const finalExits = [...originalExits, ...uniqueNewDirections];
                console.log(`🚀 Force-expanded ingress Room ${firstRoom.id}:`);
                console.log(`   Original exits: [${originalExits.join(', ')}]`);
                console.log(`   New potential exits: [${finalExits.join(', ')}]`);
                console.log(`   Max connections increased to: ${newMaxConnections}`);
                
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
      console.log(`🌿 FALLBACK ACTIVATED: Starting expansion from rooms with least adjacent rooms`);
      // Extend from rooms with least adjacent rooms for more natural dungeon layouts
      while (rooms.length < numRooms) {
        console.log(`🌿 Need ${numRooms - rooms.length} more rooms. Finding rooms with least adjacent rooms...`);
        
        // Calculate adjacent room counts and find rooms with least adjacent rooms (excluding ingress)
        const nonIngressRooms = rooms.filter(room => !room.isIngress);
        if (nonIngressRooms.length === 0) {
          console.log(`⚠️ No non-ingress rooms to extend from.`);
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
        
        console.log(`📍 Rooms with least adjacent rooms:`, leastAdjacentRooms.map(r => 
          `Room ${r.id} (adjacent: ${getAdjacentRoomCount(r, rooms, occupiedCoordinates)})`
        ));
        
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
          room.notes += ` (Force-expanded for extension)`;
          
          // Generate all possible directions
          const allDirections = ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'];
          const availableDirections = allDirections.filter(dir => !room.connectedRooms.has(dir));
          
          // Try to create up to 2 new rooms from this room
          let connectionsFromThisRoom = 0;
          for (const direction of availableDirections) {
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
                notes: `Extended from Room ${room.id} (${direction}) at (${newCoordinates.x}, ${newCoordinates.y})`,
                connectedRooms: new Map(),
                coordinates: newCoordinates,
                maxConnections: getMaxConnectionsFromExits(generateExits())
              };
              
              // Generate directions for the new room
              newRoom.directions = generateDirections(newRoom.exits);
              
              // Create bidirectional connection
              const oppositeDirection = getOppositeDirection(direction);
              room.connectedRooms.set(direction, newRoom.id);
              newRoom.connectedRooms.set(oppositeDirection, room.id);
              
              // Update room directions
              if (!room.directions.includes(direction)) {
                room.directions.push(direction);
              }
              newRoom.directions = newRoom.directions.filter(dir => dir !== oppositeDirection);
              
              rooms.push(newRoom);
              occupiedCoordinates.set(coordKey, newRoom.id);
              roomQueue.push(newRoom);
              
              console.log(`🌿 Created Room ${newRoom.id} extending from least-adjacent Room ${room.id} via ${direction}/${oppositeDirection}`);
              console.log(`   Adjacent room count: ${getAdjacentRoomCount(room, rooms, occupiedCoordinates)}`);
              
              roomExpanded = true;
              connectionsFromThisRoom++;
            }
          }
          
          if (rooms.length >= numRooms) break;
        }
        
        // If we couldn't expand any of the rooms with least adjacent rooms, we're stuck
        if (!roomExpanded) {
          console.log(`⚠️ FALLBACK COMPLETE: Could not extend from rooms with least adjacent rooms. Final count: ${rooms.length}/${numRooms}`);
          break;
        } else {
          console.log(`✅ Fallback successfully expanded from least-adjacent room(s)`);
        }
      }
      console.log(`🌿 FALLBACK FINISHED: Generated ${rooms.length}/${numRooms} rooms using intelligent branching strategy`);
      
      
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

  const getRoomTypeIcon = (content) => {
    switch (content) {
      case 'Creature': return '👹';
      case 'Hazard': return '⚠️';
      case 'Enigma': return '🔮';
      case 'Distractor': return '📦';
      case 'Empty': return '🚪';
      default: return '❓';
    }
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

  return (
    <div className="room-generator">
      <header className="generator-header">
        <h1>🏰 Room Generator</h1>
        <p>Generate randomized rooms based on the "Without Number" exploration rules</p>
      </header>

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="numRooms">Number of Rooms:</label>
          <input
            type="number"
            id="numRooms"
            min="1"
            max="20"
            value={numRooms}
            onChange={(e) => setNumRooms(parseInt(e.target.value) || 1)}
          />
        </div>
        <button 
          onClick={generateRooms}
          disabled={isGenerating}
          className="generate-btn"
        >
          {isGenerating ? 'Generating...' : 'Generate Rooms'}
        </button>
      </div>

                <div className="connection-map">
            <h3>🗺️ Dungeon Grid Layout</h3>
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
                      gridElements.push(
                        <div key={key} className={`grid-cell room-cell ${room.isIngress ? 'ingress' : ''}`}>
                          <div className="grid-room-id">R{room.id}</div>
                          <div className="grid-coordinates">({x},{y})</div>
                          <div className="grid-room-type">{getRoomTypeIcon(room.contents.content)}</div>
                        </div>
                      );
                      
                      // Add connection lines for this room
                      if (room.connectedRooms) {
                        Array.from(room.connectedRooms.entries()).forEach(([direction, connectedRoomId]) => {
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
                              
                              let connectionClass = 'connection-line';
                              let lineStyle = {};
                              
                              // Calculate position and rotation for the line
                              const centerFromX = fromGridX * 150 + 50; // 100px cell + 50px gap = 150px spacing, +50px to center
                              const centerFromY = fromGridY * 150 + 50;
                              const centerToX = toGridX * 150 + 50;
                              const centerToY = toGridY * 150 + 50;
                              
                              const distance = Math.sqrt((centerToX - centerFromX) ** 2 + (centerToY - centerFromY) ** 2);
                              const angle = Math.atan2(centerToY - centerFromY, centerToX - centerFromX) * 180 / Math.PI;
                              
                              lineStyle = {
                                position: 'absolute',
                                left: `${centerFromX}px`,
                                top: `${centerFromY - 2}px`, // Center the line vertically
                                width: `${distance}px`,
                                height: '4px',
                                backgroundColor: '#fbbf24', // Bright yellow for visibility
                                transformOrigin: '0 50%',
                                transform: `rotate(${angle}deg)`,
                                zIndex: 15, // Even higher z-index
                                borderRadius: '2px',
                                border: '1px solid #f59e0b',
                                boxShadow: '0 0 8px rgba(251, 191, 36, 0.8)',
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
                              console.log(`Added connection line: ${connectionKey}, from (${centerFromX}, ${centerFromY}) to (${centerToX}, ${centerToY}), distance: ${distance}, angle: ${angle}`);
                            }
                          }
                        });
                      }
                    } else {
                      gridElements.push(
                        <div key={key} className="grid-cell empty-cell">
                          <div className="grid-coordinates">({x},{y})</div>
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
                        zIndex: 5
                      }}
                    >
                      {gridElements}
                    </div>
                    <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1, width: '100%', height: '100%' }}>
                      {connectionElements}
                    </div>
                  </div>
                );
              })()}
            </div>
            
            <div className="connection-list">
              <h4>Room Connections:</h4>
              {generatedRooms.map((room) => (
                <div key={room.id} className="connection-summary">
                  <strong>Room {room.id} ({room.coordinates.x}, {room.coordinates.y}):</strong>
                  {room.connectedRooms && Array.from(room.connectedRooms.entries()).map(([direction, connectedRoomId]) => {
                    const connectedRoom = generatedRooms.find(r => r.id === connectedRoomId);
                    return (
                      <span key={direction} className="connection-detail">
                        {direction} → R{connectedRoomId} ({connectedRoom?.coordinates.x}, {connectedRoom?.coordinates.y})
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

      {generatedRooms.length > 0 && (
        <div className="rooms-container">
          <h2>Generated Site Layout</h2>
          <div className="rooms-grid">
            {generatedRooms.map((room) => (
              <div key={room.id} className={`room-card ${room.isIngress ? 'ingress' : ''}`}>
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
                    {room.maxConnections && (
                      <span className="max-connections">(Max: {room.maxConnections})</span>
                    )}
                    {room.directions.length > 0 && (
                      <div className="directions">
                        <strong>Connections:</strong>
                        <ul className="connections-list">
                          {room.directions.map((direction, index) => {
                            const connectedRoomId = room.connectedRooms?.get(direction);
                            return (
                              <li key={index}>
                                <strong>{direction}:</strong> {connectedRoomId ? `→ Room ${connectedRoomId}` : 'Unconnected'}
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

          <div className="instructions">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomGenerator;
