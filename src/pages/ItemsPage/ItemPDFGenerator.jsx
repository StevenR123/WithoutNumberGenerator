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
  itemCard: {
    border: '2px solid #475569',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#1e293b',
    marginBottom: 20,
    breakInside: 'avoid',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  itemRarity: {
    fontSize: 10,
    color: '#94a3b8',
    marginLeft: 10,
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
  abilitiesList: {
    marginTop: 5,
  },
  ability: {
    backgroundColor: '#1e40af',
    color: '#f1f5f9',
    padding: 6,
    borderRadius: 4,
    marginBottom: 3,
  },
  abilityName: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  abilityDescription: {
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
const ItemsPDFDocument = ({ items, filename }) => (
  <Document>
    {/* Individual Item Pages */}
    {items.map((item, index) => (
      <Page key={item.id} size="A4" style={styles.page}>
        <View style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemRarity}>{item.rarity} {item.type}</Text>
          </View>

          {item.type === 'weapon' ? (
            <>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>User:</Text>
                <Text style={styles.detailText}>{item.user?.user}</Text>
                {item.user?.favored && (
                  <View style={{ marginTop: 3 }}>
                    <Text style={styles.detailLabel}>Favored:</Text>
                    <Text style={styles.detailText}>{item.user.favored}</Text>
                  </View>
                )}
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Weapon Type:</Text>
                <Text style={styles.detailText}>{item.baseItem?.type}</Text>
              </View>
            </>
          ) : (
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Base Item:</Text>
              <Text style={styles.detailText}>{item.baseItem?.type}</Text>
            </View>
          )}

          {item.type !== 'shield' && item.enchantmentBonus && (
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Enchantment:</Text>
              <Text style={styles.detailText}>{item.enchantmentBonus.bonus}</Text>
            </View>
          )}

          {item.specialAbilities && item.specialAbilities.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Special Abilities:</Text>
              <View style={styles.abilitiesList}>
                {item.specialAbilities.map((ability, abilityIndex) => (
                  <View key={abilityIndex} style={styles.ability}>
                    <Text style={styles.abilityName}>{ability.ability}:</Text>
                    <Text style={styles.abilityDescription}>{ability.description}</Text>
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

// Custom hook for generating Item PDFs
export const useItemPDFGenerator = () => {
  const generatePDF = async (items, filename = 'magical_items') => {
    try {
      // Create the PDF document
      const doc = <ItemsPDFDocument items={items} filename={filename} />;
      
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
