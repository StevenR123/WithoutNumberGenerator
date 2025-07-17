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
  monsterCard: {
    border: '2px solid #475569',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#1e293b',
    marginBottom: 20,
    breakInside: 'avoid',
  },
  monsterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 6,
  },
  monsterName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  detailSection: {
    marginBottom: 10,
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 4,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 3,
  },
  detailText: {
    fontSize: 9,
    color: '#e2e8f0',
    lineHeight: 1.3,
  },
  bodyPartsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  bodyPart: {
    backgroundColor: '#334155',
    color: '#f1f5f9',
    padding: '3 8',
    borderRadius: 10,
    margin: 2,
    fontSize: 8,
  },
  powersList: {
    marginTop: 5,
  },
  power: {
    backgroundColor: '#1e40af',
    color: '#f1f5f9',
    padding: 6,
    borderRadius: 4,
    marginBottom: 3,
  },
  powerType: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  powerDescription: {
    fontSize: 8,
    lineHeight: 1.2,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 8,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#64748b',
  },
});

// PDF Document Component
const MonstersPDFDocument = ({ monsters, filename }) => (
  <Document>
    {/* Individual Monster Pages */}
    {monsters.map((monster, index) => (
      <Page key={monster.id} size="A4" style={styles.page}>
        <View style={styles.monsterCard}>
          <View style={styles.monsterHeader}>
            <Text style={styles.monsterName}>{monster.name}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Animal Type:</Text>
            <Text style={styles.detailText}>
              {monster.animalType?.type} - {monster.animalType?.description}
            </Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Body Plan:</Text>
            <Text style={styles.detailText}>{monster.bodyPlan?.plan}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Survival Method:</Text>
            <Text style={styles.detailText}>{monster.survivalMethod?.method}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Hunting Method:</Text>
            <Text style={styles.detailText}>{monster.huntingMethod?.method}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Monstrous Drive:</Text>
            <Text style={styles.detailText}>{monster.monstrousDrive}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Power Level:</Text>
            <Text style={styles.detailText}>
              {monster.powerLevel?.points} points - {monster.powerLevel?.description}
            </Text>
          </View>

          {monster.bodyParts && monster.bodyParts.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Features:</Text>
              <View style={styles.bodyPartsList}>
                {monster.bodyParts.map((part, partIndex) => (
                  <Text key={partIndex} style={styles.bodyPart}>
                    {part.feature}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Powers Section */}
          {(monster.damagePowers?.length || monster.movementPowers?.length || 
            monster.debilitatingPowers?.length || monster.augmentingPowers?.length || 
            monster.intrinsicPowers?.length) && (
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Powers:</Text>
              <View style={styles.powersList}>
                {monster.damagePowers?.map((power, powerIndex) => (
                  <View key={`damage-${powerIndex}`} style={styles.power}>
                    <Text style={styles.powerType}>
                      Damage ({power.totalCost}pts):
                    </Text>
                    <Text style={styles.powerDescription}>{power.description}</Text>
                  </View>
                ))}
                {monster.movementPowers?.map((power, powerIndex) => (
                  <View key={`movement-${powerIndex}`} style={styles.power}>
                    <Text style={styles.powerType}>
                      Movement ({power.points}pts):
                    </Text>
                    <Text style={styles.powerDescription}>{power.description}</Text>
                  </View>
                ))}
                {monster.debilitatingPowers?.map((power, powerIndex) => (
                  <View key={`debilitating-${powerIndex}`} style={styles.power}>
                    <Text style={styles.powerType}>
                      Debilitating ({power.totalCost}pts):
                    </Text>
                    <Text style={styles.powerDescription}>{power.description}</Text>
                  </View>
                ))}
                {monster.augmentingPowers?.map((power, powerIndex) => (
                  <View key={`augmenting-${powerIndex}`} style={styles.power}>
                    <Text style={styles.powerType}>
                      Augmenting ({power.totalCost}pts):
                    </Text>
                    <Text style={styles.powerDescription}>{power.description}</Text>
                  </View>
                ))}
                {monster.intrinsicPowers?.map((power, powerIndex) => (
                  <View key={`intrinsic-${powerIndex}`} style={styles.power}>
                    <Text style={styles.powerType}>
                      Intrinsic ({power.points}pts):
                    </Text>
                    <Text style={styles.powerDescription}>{power.description}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    ))}
  </Document>
);

// Custom hook for generating Monster PDFs
export const useMonsterPDFGenerator = () => {
  const generatePDF = async (monsters, filename = 'monsters') => {
    try {
      // Create the PDF document
      const doc = <MonstersPDFDocument monsters={monsters} filename={filename} />;
      
      // Generate PDF blob
      const blob = await pdf(doc).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  };

  return { generatePDF };
};
