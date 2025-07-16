import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontSize: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
    color: '#334155',
  },
  gridSection: {
    marginBottom: 30,
  },
  gridContainer: {
    border: '2px solid #475569',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f8fafc',
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  gridCell: {
    width: 40,
    height: 40,
    border: '1px solid #cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    fontSize: 8,
    marginRight: 5,
  },
  roomCell: {
    backgroundColor: '#ddd6fe',
    borderColor: '#8b5cf6',
  },
  ingressCell: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  emptyCell: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  gridWrapper: {
    position: 'relative',
  },
  connectionLine: {
    position: 'absolute',
    backgroundColor: '#f59e0b',
    height: 1,
  },
  roomsSection: {
    marginTop: 20,
  },
  roomCard: {
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9fafb',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  roomCoordinates: {
    fontSize: 8,
    color: '#6b7280',
  },
  roomDetails: {
    marginBottom: 6,
  },
  roomLabel: {
    fontWeight: 'bold',
    color: '#374151',
  },
  roomContent: {
    color: '#4b5563',
    marginTop: 2,
  },
  connectionsList: {
    marginTop: 4,
  },
  connectionItem: {
    fontSize: 8,
    color: '#6b7280',
    marginLeft: 10,
  },
  treasureSection: {
    backgroundColor: '#fef7cd',
    padding: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  notesSection: {
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  metadata: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
});

// Helper function to get room type emoji as text
const getRoomTypeText = (content) => {
  switch (content) {
    case 'Creature': return 'CREATURE';
    case 'Hazard': return 'HAZARD';
    case 'Enigma': return 'ENIGMA';
    case 'Distractor': return 'DISTRACTOR';
    case 'Empty': return 'EMPTY';
    default: return 'UNKNOWN';
  }
};

// Component to render connection lines between rooms
const ConnectionLines = ({ rooms, minX, minY }) => {
  if (!rooms || rooms.length === 0) return null;

  const lines = [];
  const processedConnections = new Set();
  const cellSize = 40;
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
                      left: fromCenterX + (stepX * i) - 1,
                      top: fromCenterY + (stepY * i) - 1,
                      width: 2,
                      height: 2,
                      backgroundColor: '#f59e0b',
                      borderRadius: 1,
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
        gridCells.push(
          <View 
            key={`${x},${y}`} 
            style={[
              styles.gridCell, 
              styles.roomCell,
              room.isIngress ? styles.ingressCell : {}
            ]}
          >
            <Text style={{ fontSize: 6 }}>R{room.id}</Text>
            <Text style={{ fontSize: 5 }}>{getRoomTypeText(room.contents.content)}</Text>
          </View>
        );
      } else {
        gridCells.push(
          <View key={`${x},${y}`} style={[styles.gridCell, styles.emptyCell]}>
            <Text style={{ fontSize: 5 }}>({x},{y})</Text>
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
        <View key={room.id} style={styles.roomCard}>
          <View style={styles.roomHeader}>
            <Text style={styles.roomTitle}>
              {getRoomTypeText(room.contents.content)} Room {room.id}
              {room.isIngress && ' (INGRESS)'}
            </Text>
            <Text style={styles.roomCoordinates}>
              Grid: ({room.coordinates.x}, {room.coordinates.y})
            </Text>
          </View>

          <View style={styles.roomDetails}>
            <Text style={styles.roomLabel}>
              Exits: <Text style={styles.roomContent}>{room.exits}</Text>
            </Text>
            
            {room.directions && room.directions.length > 0 && (
              <View style={styles.connectionsList}>
                <Text style={styles.roomLabel}>Connections:</Text>
                {room.directions.map((direction, index) => {
                  const connectedRooms = room.connectedRooms.get(direction) || [];
                  return (
                    <Text key={index} style={styles.connectionItem}>
                      • {direction}: Room(s) {connectedRooms.join(', ')}
                    </Text>
                  );
                })}
              </View>
            )}

            <Text style={styles.roomLabel}>
              Contents: <Text style={styles.roomContent}>{room.contents.content}</Text>
            </Text>
            
            <Text style={styles.roomContent}>
              {room.contents.details}
            </Text>
          </View>

          {room.contents.hasTreasure && (
            <View style={styles.treasureSection}>
              <Text style={styles.roomLabel}>
                Treasure: <Text style={styles.roomContent}>{room.contents.treasureLocation}</Text>
              </Text>
            </View>
          )}

          {room.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.roomLabel}>
                Notes: <Text style={styles.roomContent}>{room.notes}</Text>
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
      <Text style={styles.title}>Dungeon Layout Report</Text>
      
      <View style={styles.gridSection}>
        <Text style={styles.subtitle}>Dungeon Grid Layout</Text>
        <GridLayout rooms={rooms} />
      </View>

      <Text style={styles.subtitle}>Generated Site Layout</Text>
      <View style={styles.roomsSection}>
        <RoomDetails rooms={rooms} />
      </View>

      <View style={styles.metadata}>
        <Text>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</Text>
        <Text>Total Rooms: {rooms?.length || 0}</Text>
        {metadata.requestedRooms && (
          <Text>Requested Rooms: {metadata.requestedRooms}</Text>
        )}
        <Text>Created with Without Number Generator</Text>
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
