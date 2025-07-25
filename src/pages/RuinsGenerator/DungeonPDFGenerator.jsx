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
    textAlign: 'center',
  },
  gridSection: {
    marginBottom: 30,
  },
  gridContainer: {
    border: '2px solid #475569',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
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
  treasureCell: {
    borderColor: '#ffd700',
    borderWidth: 3,
  },
  gridWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  connectionLine: {
    position: 'absolute',
    backgroundColor: '#fbbf24',
    height: 2,
  },
  roomsSection: {
    marginTop: 20,
  },
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  roomCard: {
    border: '2px solid #475569',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#1e293b',
    width: '31%', // Slightly less than 33% to account for margins
    minWidth: 150,
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
    fontSize: 11,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  roomCoordinates: {
    fontSize: 8,
    color: '#94a3b8',
  },
  roomDetails: {
    marginBottom: 6,
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
    padding: 6,
    borderRadius: 4,
    marginTop: 4,
    borderLeft: '4px solid #3b82f6',
  },
  contentsSection: {
    backgroundColor: '#14532d',
    padding: 6,
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
const ConnectionLines = ({ rooms, minX, minY, maxX, maxY, scaleFactor = 1 }) => {
  if (!rooms || rooms.length === 0) return null;

  const lines = [];
  const processedConnections = new Set();
  
  // These values must match exactly with the grid cell styling, scaled
  const cellSize = 45 * scaleFactor;
  const cellMargin = 5 * scaleFactor; // marginRight from gridCell style
  const rowMargin = 5 * scaleFactor; // marginBottom from gridRow style

  rooms.forEach(room => {
    if (room.connectedRooms) {
      room.connectedRooms.forEach((connectedRoomIds, direction) => {
        connectedRoomIds.forEach(connectedRoomId => {
          const connectionKey = [room.id, connectedRoomId].sort().join('-');
          
          if (!processedConnections.has(connectionKey)) {
            processedConnections.add(connectionKey);
            
            const connectedRoom = rooms.find(r => r.id === connectedRoomId);
            if (connectedRoom) {
              // Calculate grid positions (0-based from top-left corner)
              const fromGridX = room.coordinates.x - minX;
              const fromGridY = minY - room.coordinates.y; // Flip Y coordinate for top-to-bottom rendering
              const toGridX = connectedRoom.coordinates.x - minX;
              const toGridY = minY - connectedRoom.coordinates.y; // Flip Y coordinate for top-to-bottom rendering

              // Calculate actual pixel positions matching the grid layout
              // Each cell takes up (cellSize + cellMargin) pixels horizontally
              // Each row takes up (cellSize + rowMargin) pixels vertically
              const fromX = fromGridX * (cellSize + cellMargin);
              const fromY = fromGridY * (cellSize + rowMargin);
              const toX = toGridX * (cellSize + cellMargin);
              const toY = toGridY * (cellSize + rowMargin);

              // Calculate center points of each cell
              const fromCenterX = fromX + (cellSize / 2);
              const fromCenterY = fromY + (cellSize / 2);
              const toCenterX = toX + (cellSize / 2);
              const toCenterY = toY + (cellSize / 2);

              const deltaX = toCenterX - fromCenterX;
              const deltaY = toCenterY - fromCenterY;

              // Create dotted line with smaller, more frequent dots
              const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
              const dotSpacing = 4 * scaleFactor; // Pixels between dots, scaled
              const steps = Math.max(1, Math.floor(length / dotSpacing));
              const stepX = deltaX / steps;
              const stepY = deltaY / steps;

              // Generate dots along the connection line
              for (let i = 0; i <= steps; i++) {
                lines.push(
                  <View
                    key={`${connectionKey}-${i}`}
                    style={{
                      position: 'absolute',
                      left: fromCenterX + (stepX * i) - (1 * scaleFactor),
                      top: fromCenterY + (stepY * i) - (1 * scaleFactor),
                      width: 2 * scaleFactor,
                      height: 2 * scaleFactor,
                      backgroundColor: '#fbbf24',
                      borderRadius: 1 * scaleFactor,
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

  // Calculate grid dimensions
  const gridWidth = maxX - minX + 1;
  const gridHeight = minY - maxY + 1;

  // Calculate required space for the grid (without scaling)
  const baseCellSize = 45;
  const baseCellMargin = 5;
  const baseRowMargin = 5;
  const baseRequiredWidth = gridWidth * (baseCellSize + baseCellMargin) - baseCellMargin;
  const baseRequiredHeight = gridHeight * (baseCellSize + baseRowMargin) - baseRowMargin;

  // Available space (accounting for container padding and margins)
  // PDF page width is approximately 555 points for A4, accounting for page padding (20px) and container padding
  const availableWidth = 555 - 40 - 30; // page padding + container padding + extra margin
  const availableHeight = 250; // Reserve space for title and room details below

  // Calculate scale factor to fit within available space
  const scaleX = availableWidth / baseRequiredWidth;
  const scaleY = availableHeight / baseRequiredHeight;
  const scaleFactor = Math.min(1, scaleX, scaleY); // Don't scale up, only down

  // Apply scaled dimensions
  const cellSize = baseCellSize * scaleFactor;
  const cellMargin = baseCellMargin * scaleFactor;
  const rowMargin = baseRowMargin * scaleFactor;

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
              {
                width: cellSize,
                height: cellSize,
                border: `1px solid ${room.contents.hasTreasure ? '#ffd700' : '#64748b'}`,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4 * scaleFactor,
                fontSize: 8 * scaleFactor,
                marginRight: cellMargin,
              },
              cellStyle,
              room.contents.hasTreasure ? {
                borderColor: '#ffd700',
                borderWidth: 3 * scaleFactor,
              } : null
            ]}
          >
            <Text style={{ fontSize: 7 * scaleFactor, fontWeight: 'bold' }}>R{room.id}</Text>
            <Text style={{ fontSize: 7 * scaleFactor, fontWeight: 'bold' }}>{getRoomTypeIcon(room.contents.content)}</Text>
          </View>
        );
      } else {
        gridCells.push(
          <View key={`${x},${y}`} style={[
            {
              width: cellSize,
              height: cellSize,
              border: '1px solid #4b5563',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4 * scaleFactor,
              fontSize: 5 * scaleFactor,
              marginRight: cellMargin,
              backgroundColor: '#374151',
              color: '#9ca3af',
            }
          ]}>
            <Text style={{ fontSize: 5 * scaleFactor, color: '#9ca3af' }}>({x},{y})</Text>
          </View>
        );
      }
    }
    
    gridRows.push(
      <View key={y} style={{
        flexDirection: 'row',
        marginBottom: rowMargin,
      }}>
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
        <ConnectionLines rooms={rooms} minX={minX} minY={minY} maxX={maxX} maxY={maxY} scaleFactor={scaleFactor} />
      </View>
    </View>
  );
};

// Component to render room details with row-based page breaks
const RoomDetails = ({ rooms }) => {
  if (!rooms || rooms.length === 0) return null;

  // Group rooms into rows of 3 (matching the 3-column layout)
  const roomRows = [];
  for (let i = 0; i < rooms.length; i += 3) {
    roomRows.push(rooms.slice(i, i + 3));
  }

  return (
    <View style={styles.roomsGrid}>
      {roomRows.map((rowRooms, rowIndex) => (
        <View 
          key={`room-row-${rowIndex}`} 
          style={styles.roomRow}
          wrap={false} // Prevent breaking within a row
        >
          {rowRooms.map((room) => (
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
                      fontSize: 7,
                      padding: 1,
                      borderRadius: 2,
                      marginLeft: 3
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
                  <View style={[styles.connectionsList, { backgroundColor: '#334155', padding: 4, borderRadius: 3, marginTop: 3 }]}>
                    <Text style={[styles.roomLabel, { color: '#cbd5e1', fontSize: 8 }]}>Connections:</Text>
                    {room.directions.map((direction, index) => {
                      const connectedRooms = room.connectedRooms.get(direction) || [];
                      return (
                        <Text key={index} style={[styles.connectionItem, { color: '#e2e8f0', fontSize: 7 }]}>
                          • {direction}: Room(s) {connectedRooms.join(', ')}
                        </Text>
                      );
                    })}
                  </View>
                )}

                <View style={styles.contentsSection}>
                  <Text style={[styles.roomLabel, { color: '#4ade80', fontSize: 8 }]}>
                    Contents: <Text style={[styles.roomContent, { color: '#dcfce7', fontSize: 8 }]}>{room.contents.content}</Text>
                  </Text>
                  
                  <Text style={[styles.roomContent, { fontStyle: 'italic', marginTop: 3, color: '#bbf7d0', fontSize: 7 }]}>
                    {room.contents.details}
                  </Text>
                </View>
              </View>

              {room.contents.hasTreasure && (
                <View style={styles.treasureSection}>
                  <Text style={[styles.roomLabel, { color: '#fbbf24', fontSize: 8 }]}>
                    [TREASURE]: <Text style={[styles.roomContent, { color: '#fef3c7', fontSize: 7 }]}>{room.contents.treasureLocation}</Text>
                  </Text>
                </View>
              )}

              {room.notes && (
                <View style={styles.notesSection}>
                  <Text style={[styles.roomLabel, { color: '#d1d5db', fontSize: 8 }]}>
                    [NOTES]: <Text style={[styles.roomContent, { color: '#f3f4f6', fontSize: 7 }]}>{room.notes}</Text>
                  </Text>
                </View>
              )}
            </View>
          ))}
          {/* Fill empty slots in the last row to maintain layout */}
          {rowRooms.length < 3 && Array.from({ length: 3 - rowRooms.length }).map((_, index) => (
            <View key={`empty-${index}`} style={{ width: '31%' }} />
          ))}
        </View>
      ))}
    </View>
  );
};

// Main PDF Document component
const DungeonPDFDocument = ({ rooms, ruinInfo = null, metadata = {} }) => {
  // Calculate how many rooms can fit per page (considering space for headers and grid)
  const roomsPerPage = 9; // 3 rows of 3 rooms each
  const totalPages = Math.ceil((rooms?.length || 0) / roomsPerPage);

  const pages = [];

  // First page: ruin info (if present) and grid only
  pages.push(
    <Page key="page-1" size="A4" style={styles.page}>
      <Text style={styles.title}>DUNGEON LAYOUT REPORT</Text>
      {ruinInfo && (
        <View style={{ marginBottom: 16, padding: 10, backgroundColor: '#1e293b', borderRadius: 8, border: '1px solid #475569' }}>
          {/* Site Details Section */}
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#fbbf24', marginBottom: 4 }}>Ruin Information</Text>
          <Text style={{ color: '#f1f5f9', fontSize: 10, marginBottom: 2 }}>
            <Text style={{ fontWeight: 'bold' }}>Site Type:</Text> {ruinInfo.type || ''}
          </Text>
          {ruinInfo.site && (
            <Text style={{ color: '#f1f5f9', fontSize: 10, marginBottom: 6 }}>
              <Text style={{ fontWeight: 'bold' }}>Example:</Text> {ruinInfo.site}
            </Text>
          )}

          {/* Social Dynamics Section */}
          {ruinInfo.inhabitation && (
            <>
              <Text style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: 11, marginTop: 6, marginBottom: 2 }}>Social Dynamics</Text>
              <Text style={{ color: '#f1f5f9', fontSize: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Important Inhabitants:</Text> {ruinInfo.inhabitation.importantInhabitants?.description || ''}
              </Text>
              <Text style={{ color: '#f1f5f9', fontSize: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Hostility Reason:</Text> {ruinInfo.inhabitation.hostilityReason?.reason || ''}
              </Text>
              <Text style={{ color: '#f1f5f9', fontSize: 10, marginBottom: 6 }}>
                <Text style={{ fontWeight: 'bold' }}>Alliance Cause:</Text> {ruinInfo.inhabitation.allianceCause?.cause || ''}
              </Text>

              {/* Origins & Motivations Section */}
              <Text style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: 11, marginTop: 6, marginBottom: 2 }}>Origins & Motivations</Text>
              <Text style={{ color: '#f1f5f9', fontSize: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Why They Came:</Text> {ruinInfo.inhabitation.whyTheyCame?.reason || ''}
              </Text>
              <Text style={{ color: '#f1f5f9', fontSize: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Why They're Staying:</Text> {ruinInfo.inhabitation.whyStaying?.reason || ''}
              </Text>
            </>
          )}
        </View>
      )}
      <View style={styles.gridSection}>
        <Text style={styles.subtitle}>DUNGEON GRID LAYOUT</Text>
        <GridLayout rooms={rooms} />
      </View>
    </Page>
  );

  // Second and subsequent pages: room details (GENERATED SITE LAYOUT)
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const startIndex = pageIndex * roomsPerPage;
    const endIndex = Math.min(startIndex + roomsPerPage, rooms.length);
    const pageRooms = rooms.slice(startIndex, endIndex);
    pages.push(
      <Page key={`site-layout-page-${pageIndex + 1}`} size="A4" style={styles.page}>
        {pageIndex === 0 && <Text style={styles.subtitle}>GENERATED SITE LAYOUT</Text>}
        <View style={styles.roomsSection}>
          <RoomDetails rooms={pageRooms} />
        </View>
      </Page>
    );
  }

  return (
    <Document>
      {pages}
    </Document>
  );
};

// Hook to generate and download PDF
export const useDungeonPDFGenerator = () => {
  const generatePDF = async (rooms, filename = 'dungeon-layout', ruinInfo = null) => {
    try {
      const doc = <DungeonPDFDocument rooms={rooms} ruinInfo={ruinInfo} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.pdf`;
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
