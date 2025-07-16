import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#0f1419',
    padding: 20,
    fontSize: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#f1f5f9',
    padding: 15,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    border: '1px solid #475569',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
    color: '#f1f5f9',
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 6,
  },
  gridSection: {
    marginBottom: 30,
  },
  gridContainer: {
    border: '2px solid #475569',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#1e293b',
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  gridCell: {
    width: 45,
    height: 45,
    border: '1px solid #64748b',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    fontSize: 8,
    marginRight: 5,
  },
  roomCell: {
    backgroundColor: '#3b82f6',
    borderColor: '#1d4ed8',
    color: '#ffffff',
  },
  creatureCell: {
    backgroundColor: '#dc2626',
    borderColor: '#991b1b',
    color: '#ffffff',
  },
  hazardCell: {
    backgroundColor: '#ea580c',
    borderColor: '#c2410c',
    color: '#ffffff',
  },
  enigmaCell: {
    backgroundColor: '#7c3aed',
    borderColor: '#5b21b6',
    color: '#ffffff',
  },
  distractorCell: {
    backgroundColor: '#059669',
    borderColor: '#047857',
    color: '#ffffff',
  },
  emptyCell: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
    color: '#9ca3af',
  },
  ingressCell: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
    color: '#ffffff',
  },
  gridWrapper: {
    position: 'relative',
  },
  connectionLine: {
    position: 'absolute',
    backgroundColor: '#fbbf24',
    height: 2,
  },
  roomsSection: {
    marginTop: 20,
  },
  roomCard: {
    border: '2px solid #475569',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#1e293b',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: '2px solid #475569',
  },
  roomTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  roomCoordinates: {
    fontSize: 9,
    color: '#94a3b8',
  },
  roomDetails: {
    marginBottom: 8,
  },
  roomLabel: {
    fontWeight: 'bold',
    color: '#cbd5e1',
  },
  roomContent: {
    color: '#e6e6e6',
    marginTop: 2,
  },
  connectionsList: {
    marginTop: 4,
  },
  connectionItem: {
    fontSize: 8,
    color: '#94a3b8',
    marginLeft: 10,
  },
  treasureSection: {
    backgroundColor: '#92400e',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
    borderLeft: '4px solid #f59e0b',
  },
  notesSection: {
    backgroundColor: '#374151',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
    borderLeft: '4px solid #9ca3af',
  },
  exitsSection: {
    backgroundColor: '#1e3a8a',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
    borderLeft: '4px solid #3b82f6',
  },
  contentsSection: {
    backgroundColor: '#14532d',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
    borderLeft: '4px solid #22c55e',
  },
  metadata: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
    borderTop: '1px solid #475569',
    paddingTop: 10,
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 6,
  },
});

// Helper function to get room type with visual indicator
const getRoomTypeText = (content) => {
  switch (content) {
    case 'Creature': return '[C]';
    case 'Hazard': return '[H]';
    case 'Enigma': return '[E]';
    case 'Distractor': return '[D]';
    case 'Empty': return '[X]';
    default: return '[UNKNOWN]';
  }
};

// Helper function to get simplified room type for grid
const getRoomTypeIcon = (content) => {
  switch (content) {
    case 'Creature': return 'C';
    case 'Hazard': return 'H';
    case 'Enigma': return 'E';
    case 'Distractor': return 'D';
    case 'Empty': return 'X';
    default: return '?';
  }
};

// Component to render connection lines between rooms
const ConnectionLines = ({ rooms, minX, minY }) => {
  if (!rooms || rooms.length === 0) return null;

  const lines = [];
  const processedConnections = new Set();              const cellSize = 45;
              const cellMargin = 5;
  const rowMargin = 5;

  rooms.forEach(room => {
    if (room.connectedRooms) {
      room.connectedRooms.forEach((connectedRoomIds, direction) => {
        connectedRoomIds.forEach(connectedRoomId => {
          const connectionKey = [room.id, connectedRoomId].sort().join('-');
          
          if (!processedConnections.has(connectionKey)) {
            processedConnections.add(connectionKey);
            
            const connectedRoom = rooms.find(r => r.id === connectedRoomId);
            if (connectedRoom) {
              // Calculate grid positions
              const fromGridX = room.coordinates.x - minX;
              const fromGridY = minY - room.coordinates.y;
              const toGridX = connectedRoom.coordinates.x - minX;
              const toGridY = minY - connectedRoom.coordinates.y;

              // Calculate actual positions with margins
              const fromX = fromGridX * (cellSize + cellMargin);
              const fromY = fromGridY * (cellSize + rowMargin);
              const toX = toGridX * (cellSize + cellMargin);
              const toY = toGridY * (cellSize + rowMargin);

              // Calculate center points
              const fromCenterX = fromX + cellSize / 2;
              const fromCenterY = fromY + cellSize / 2;
              const toCenterX = toX + cellSize / 2;
              const toCenterY = toY + cellSize / 2;

              const deltaX = toCenterX - fromCenterX;
              const deltaY = toCenterY - fromCenterY;

              // Use dotted lines for all connections (horizontal, vertical, and diagonal)
              const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
              const steps = Math.floor(length / 3);
              const stepX = deltaX / steps;
              const stepY = deltaY / steps;

              for (let i = 0; i <= steps; i++) {
                lines.push(
                  <View
                    key={`${connectionKey}-${i}`}
                    style={{
                      position: 'absolute',
                      left: fromCenterX + (stepX * i) - 1.5,
                      top: fromCenterY + (stepY * i) - 1.5,
                      width: 3,
                      height: 3,
                      backgroundColor: '#fbbf24',
                      borderRadius: 2,
                      border: '0.5px solid #f59e0b',
                    }}
                  />
                );
              }
            }
          }
        });
      });
    }
  });

  return <>{lines}</>;
};

// Component to render the grid layout
const GridLayout = ({ rooms }) => {
  if (!rooms || rooms.length === 0) return null;

  // Calculate grid bounds
  const minX = Math.min(...rooms.map(r => r.coordinates.x)) - 1;
  const maxX = Math.max(...rooms.map(r => r.coordinates.x)) + 1;
  const minY = Math.max(...rooms.map(r => r.coordinates.y)) + 1;
  const maxY = Math.min(...rooms.map(r => r.coordinates.y)) - 1;

  const gridRows = [];
  
  // Create grid rows (Y coordinates from top to bottom)
  for (let y = minY; y >= maxY; y--) {
    const gridCells = [];
    
    // Create cells for this row
    for (let x = minX; x <= maxX; x++) {
      const room = rooms.find(r => r.coordinates.x === x && r.coordinates.y === y);
      
      if (room) {
        // Determine cell style based on room type
        let cellStyle = styles.roomCell;
        if (room.isIngress) {
          cellStyle = styles.ingressCell;
        } else {
          switch (room.contents.content) {
            case 'Creature':
              cellStyle = styles.creatureCell;
              break;
            case 'Hazard':
              cellStyle = styles.hazardCell;
              break;
            case 'Enigma':
              cellStyle = styles.enigmaCell;
              break;
            case 'Distractor':
              cellStyle = styles.distractorCell;
              break;
            case 'Empty':
            default:
              cellStyle = styles.roomCell;
              break;
          }
        }
        
        gridCells.push(
          <View 
            key={`${x},${y}`} 
            style={[
              styles.gridCell, 
              cellStyle
            ]}
          >
            <Text style={{ fontSize: 7, fontWeight: 'bold' }}>R{room.id}</Text>
            <Text style={{ fontSize: 7, fontWeight: 'bold' }}>{getRoomTypeIcon(room.contents.content)}</Text>
          </View>
        );
      } else {
        gridCells.push(
          <View key={`${x},${y}`} style={[styles.gridCell, styles.emptyCell]}>
            <Text style={{ fontSize: 5, color: '#9ca3af' }}>({x},{y})</Text>
          </View>
        );
      }
    }
    
    gridRows.push(
      <View key={y} style={styles.gridRow}>
        {gridCells}
      </View>
    );
  }

  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridWrapper}>
        <View>
          {gridRows}
        </View>
        <ConnectionLines rooms={rooms} minX={minX} minY={minY} />
      </View>
    </View>
  );
};

// Component to render room details
const RoomDetails = ({ rooms }) => {
  if (!rooms || rooms.length === 0) return null;

  return (
    <View>
      {rooms.map((room) => (
        <View key={room.id} style={[
          styles.roomCard,
          room.isIngress ? { borderColor: '#ef4444', backgroundColor: '#1e293b' } : {}
        ]}>
          <View style={styles.roomHeader}>
            <Text style={styles.roomTitle}>
              {getRoomTypeText(room.contents.content)} Room {room.id}
              {room.isIngress && (
                <Text style={{ 
                  backgroundColor: '#ef4444', 
                  color: '#ffffff', 
                  fontSize: 8,
                  padding: 2,
                  borderRadius: 3,
                  marginLeft: 5
                }}> [INGRESS]</Text>
              )}
            </Text>
            <Text style={styles.roomCoordinates}>
              Grid: ({room.coordinates.x}, {room.coordinates.y})
            </Text>
          </View>

          <View style={styles.roomDetails}>
            <View style={styles.exitsSection}>
              <Text style={[styles.roomLabel, { color: '#60a5fa' }]}>
                Exits: <Text style={[styles.roomContent, { color: '#dbeafe' }]}>{room.exits}</Text>
              </Text>
            </View>
            
            {room.directions && room.directions.length > 0 && (
              <View style={[styles.connectionsList, { backgroundColor: '#334155', padding: 6, borderRadius: 4, marginTop: 4 }]}>
                <Text style={[styles.roomLabel, { color: '#cbd5e1' }]}>Connections:</Text>
                {room.directions.map((direction, index) => {
                  const connectedRooms = room.connectedRooms.get(direction) || [];
                  return (
                    <Text key={index} style={[styles.connectionItem, { color: '#e2e8f0' }]}>
                      • {direction}: Room(s) {connectedRooms.join(', ')}
                    </Text>
                  );
                })}
              </View>
            )}

            <View style={styles.contentsSection}>
              <Text style={[styles.roomLabel, { color: '#4ade80' }]}>
                Contents: <Text style={[styles.roomContent, { color: '#dcfce7' }]}>{room.contents.content}</Text>
              </Text>
              
              <Text style={[styles.roomContent, { fontStyle: 'italic', marginTop: 4, color: '#bbf7d0' }]}>
                {room.contents.details}
              </Text>
            </View>
          </View>

          {room.contents.hasTreasure && (
            <View style={styles.treasureSection}>
              <Text style={[styles.roomLabel, { color: '#fbbf24' }]}>
                [TREASURE]: <Text style={[styles.roomContent, { color: '#fef3c7' }]}>{room.contents.treasureLocation}</Text>
              </Text>
            </View>
          )}

          {room.notes && (
            <View style={styles.notesSection}>
              <Text style={[styles.roomLabel, { color: '#d1d5db' }]}>
                [NOTES]: <Text style={[styles.roomContent, { color: '#f3f4f6' }]}>{room.notes}</Text>
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

// Main PDF Document component
const DungeonPDFDocument = ({ rooms, metadata = {} }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>DUNGEON LAYOUT REPORT</Text>
      
      <View style={styles.gridSection}>
        <Text style={styles.subtitle}>DUNGEON GRID LAYOUT</Text>
        <GridLayout rooms={rooms} />
      </View>

      <Text style={styles.subtitle}>GENERATED SITE LAYOUT</Text>
      <View style={styles.roomsSection}>
        <RoomDetails rooms={rooms} />
      </View>

      <View style={styles.metadata}>
        <Text style={{ color: '#f1f5f9', fontWeight: 'bold', marginBottom: 5 }}>Generated with Without Number Generator</Text>
        <Text>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</Text>
        <Text>Total Rooms: {rooms?.length || 0}</Text>
        {metadata.requestedRooms && (
          <Text>Requested Rooms: {metadata.requestedRooms}</Text>
        )}
      </View>
    </Page>
  </Document>
);

// Hook to generate and download PDF
export const useDungeonPDFGenerator = () => {
  const generatePDF = async (rooms, filename = 'dungeon-layout') => {
    try {
      const doc = <DungeonPDFDocument rooms={rooms} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  };

  return { generatePDF };
};

export default DungeonPDFDocument;
