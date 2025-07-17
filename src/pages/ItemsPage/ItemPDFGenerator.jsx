import { useCallback } from 'react';

export const useItemPDFGenerator = () => {
  const generatePDF = useCallback((items) => {
    if (!items || items.length === 0) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      console.error('Could not open print window');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Magical Items - Generators Without Number</title>
        <style>
          @page {
            margin: 0.5in;
            size: letter;
          }
          
          body {
            font-family: 'Georgia', serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            font-size: 2.5em;
            margin: 0;
            color: #2c3e50;
          }
          
          .header h2 {
            font-size: 1.2em;
            margin: 10px 0 0 0;
            color: #7f8c8d;
            font-weight: normal;
          }
          
          .items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .item-card {
            border: 2px solid #34495e;
            border-radius: 8px;
            padding: 15px;
            break-inside: avoid;
            page-break-inside: avoid;
            background: #f8f9fa;
          }
          
          .item-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #bdc3c7;
          }
          
          .item-icon {
            font-size: 1.5em;
            background: #ecf0f1;
            padding: 8px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .item-title {
            flex: 1;
          }
          
          .item-title h3 {
            margin: 0 0 5px 0;
            font-size: 1.2em;
            color: #2c3e50;
          }
          
          .item-rarity {
            font-size: 0.9em;
            color: #7f8c8d;
            text-transform: capitalize;
            font-style: italic;
          }
          
          .item-details {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .item-section {
            background: white;
            padding: 10px;
            border-radius: 4px;
            border-left: 4px solid #3498db;
          }
          
          .item-section h4 {
            margin: 0 0 8px 0;
            font-size: 0.95em;
            color: #2980b9;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: bold;
          }
          
          .item-section p {
            margin: 0;
            color: #2c3e50;
            font-size: 0.9em;
          }
          
          .ability-item {
            margin-bottom: 8px;
          }
          
          .ability-item:last-child {
            margin-bottom: 0;
          }
          
          .ability-item strong {
            color: #e74c3c;
            font-weight: bold;
            display: block;
            margin-bottom: 3px;
          }
          
          .ability-item span {
            color: #2c3e50;
            font-size: 0.85em;
            line-height: 1.3;
            display: block;
            margin-left: 10px;
          }
          
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #bdc3c7;
            color: #7f8c8d;
            font-size: 0.9em;
          }
          
          @media print {
            body { print-color-adjust: exact; }
            .item-card { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Magical Items</h1>
          <h2>Generated with Generators Without Number</h2>
        </div>
        
        <div class="items-grid">
          ${items.map(item => `
            <div class="item-card">
              <div class="item-header">
                <div class="item-icon">${item.icon}</div>
                <div class="item-title">
                  <h3>${item.name}</h3>
                  <div class="item-rarity">${item.rarity} ${item.type}</div>
                </div>
              </div>
              
              <div class="item-details">
                <div class="item-section">
                  <h4>Base Item</h4>
                  <p>${item.baseItem.type}</p>
                </div>
                
                ${item.enchantmentBonus ? `
                  <div class="item-section">
                    <h4>Enchantment</h4>
                    <p>${item.enchantmentBonus.bonus}</p>
                  </div>
                ` : ''}
                
                ${item.specialAbilities && item.specialAbilities.length > 0 ? `
                  <div class="item-section">
                    <h4>Special Abilities</h4>
                    ${item.specialAbilities.map(ability => `
                      <div class="ability-item">
                        <strong>${ability.ability}:</strong>
                        <span>${ability.description}</span>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="footer">
          Generated on ${new Date().toLocaleDateString()} | ${items.length} item${items.length !== 1 ? 's' : ''}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  }, []);

  return { generatePDF };
};
