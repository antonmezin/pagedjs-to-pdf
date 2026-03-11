// Test content with 300 pages for multi-page TOC testing
const generateTestPages = (count = 300) => {
  const pages = [];

  const contentTypes = ['text', 'table', 'mixed'];
  const sampleTexts = [
    `<h2>Kapitel über Geschäftsentwicklung</h2>
     <p>Die Geschäftsentwicklung zeigt positive Trends in allen wichtigen Kennzahlen. Unsere strategischen Initiativen haben zu nachhaltigen Verbesserungen geführt.</p>
     <p>Die Marktposition wurde durch gezielte Investitionen in Innovation und Kundenservice weiter gestärkt. Besonders hervorzuheben sind die Erfolge im digitalen Bereich.</p>
     <h3>Wichtige Erkenntnisse</h3>
     <ul>
       <li>Umsatzsteigerung um 15% gegenüber Vorjahr</li>
       <li>Verbesserung der Kundenzufriedenheit um 12 Punkte</li>
       <li>Expansion in zwei neue Märkte erfolgreich abgeschlossen</li>
       <li>Digitalisierungsgrad um 25% erhöht</li>
     </ul>`,

    `<h2>Operative Effizienz und Prozessoptimierung</h2>
     <p>Durch systematische Prozessoptimierung konnten wir die operative Effizienz deutlich steigern. Automatisierung spielt dabei eine Schlüsselrolle.</p>
     <p>Die Implementierung moderner Technologien hat zu messbaren Verbesserungen in der Produktivität geführt. Mitarbeiterschulungen unterstützen den Wandel.</p>
     <h3>Maßnahmen und Ergebnisse</h3>
     <ol>
       <li>Einführung digitaler Workflows - 30% Zeitersparnis</li>
       <li>Automatisierung von Routineprozessen - 40% weniger manuelle Arbeit</li>
       <li>Optimierung der Lieferkette - 20% Kostensenkung</li>
       <li>Verbesserung der Datenqualität - 95% Genauigkeit erreicht</li>
     </ol>`,

    `<h2>Technische Innovation und Forschung</h2>
     <p>Innovation ist der Motor unseres Wachstums. Wir investieren kontinuierlich in Forschung und Entwicklung neuer Technologien.</p>
     <p>Unsere F&E-Abteilung arbeitet an zukunftsweisenden Lösungen, die neue Marktchancen eröffnen. Partnerschaften mit Universitäten verstärken unsere Forschungskapazität.</p>
     <h3>Aktuelle Projekte</h3>
     <ul>
       <li>KI-basierte Predictive Analytics</li>
       <li>Blockchain-Integration für Supply Chain</li>
       <li>IoT-Sensoren für Smart Manufacturing</li>
       <li>Nachhaltige Produktionstechnologien</li>
     </ul>
     <p>Die ersten Prototypen zeigen vielversprechende Ergebnisse und werden in den nächsten Monaten in Pilotprojekten getestet.</p>`,

    `<h2>Nachhaltigkeit und Umweltverantwortung</h2>
     <p>Nachhaltigkeit ist ein zentraler Bestandteil unserer Unternehmensstrategie. Wir setzen konkrete Maßnahmen zur Reduzierung unseres ökologischen Fußabdrucks um.</p>
     <p>Erneuerbare Energien, Abfallreduzierung und ressourcenschonende Produktionsverfahren stehen im Fokus unserer Nachhaltigkeitsbemühungen.</p>
     <h3>Nachhaltigkeitsziele</h3>
     <ul>
       <li>CO2-Neutralität bis 2030</li>
       <li>50% Reduzierung des Wasserverbrauchs</li>
       <li>100% wiederverwertbare Verpackungen</li>
       <li>Zertifizierung nach ISO 14001</li>
     </ul>`
  ];

  const sampleTables = [
    {
      caption: 'Monatliche Leistungskennzahlen',
      headers: ['Monat', 'Umsatz (€)', 'Kosten (€)', 'Gewinn (€)', 'Marge (%)'],
      rows: [
        ['Januar', '850.000', '680.000', '170.000', '20.0'],
        ['Februar', '920.000', '720.000', '200.000', '21.7'],
        ['März', '1.050.000', '780.000', '270.000', '25.7'],
        ['April', '980.000', '750.000', '230.000', '23.5'],
        ['Mai', '1.120.000', '820.000', '300.000', '26.8'],
        ['Juni', '1.200.000', '860.000', '340.000', '28.3']
      ]
    },
    {
      caption: 'Regionale Verkaufsstatistik',
      headers: ['Region', 'Verkäufe Q1', 'Verkäufe Q2', 'Wachstum (%)', 'Marktanteil'],
      rows: [
        ['Nord', '2.450.000', '2.680.000', '+9.4', '15.2%'],
        ['Süd', '3.200.000', '3.520.000', '+10.0', '18.7%'],
        ['Ost', '1.850.000', '2.100.000', '+13.5', '12.8%'],
        ['West', '2.980.000', '3.150.000', '+5.7', '16.9%'],
        ['Zentral', '1.680.000', '1.890.000', '+12.5', '11.4%']
      ]
    },
    {
      caption: 'Mitarbeiterstatistiken',
      headers: ['Abteilung', 'Mitarbeiter', 'Vollzeit', 'Teilzeit', 'Fluktuation (%)'],
      rows: [
        ['Entwicklung', '45', '42', '3', '5.2'],
        ['Vertrieb', '32', '28', '4', '8.1'],
        ['Marketing', '18', '16', '2', '6.7'],
        ['Administration', '22', '20', '2', '4.1'],
        ['Produktion', '67', '65', '2', '3.8'],
        ['Support', '28', '24', '4', '7.5']
      ]
    }
  ];

  for (let i = 1; i <= count; i++) {
    const contentType = contentTypes[i % contentTypes.length];
    let content;

    if (contentType === 'text') {
      content = {
        type: 'text',
        data: sampleTexts[i % sampleTexts.length]
      };
    } else if (contentType === 'table') {
      const table = sampleTables[i % sampleTables.length];
      content = {
        type: 'table',
        data: {
          caption: `${table.caption} - Seite ${i}`,
          headers: table.headers,
          rows: table.rows
        }
      };
    } else { // mixed
      const textIndex = i % sampleTexts.length;
      const tableIndex = i % sampleTables.length;
      content = {
        type: 'mixed',
        data: `
          ${sampleTexts[textIndex]}
          <h3>Ergänzende Datenanalyse</h3>
          <p>Die folgenden Zahlen unterstützen die oben genannten Aussagen und zeigen detaillierte Entwicklungen auf.</p>
        `
      };
    }

    pages.push({
      id: `page-${i.toString().padStart(3, '0')}`,
      title: `Abschnitt ${i} - ${getRandomTitle(i)}`,
      content: content
    });
  }

  return pages;
};

const getRandomTitle = (index) => {
  const titles = [
    'Strategische Ausrichtung',
    'Marktanalyse und Trends',
    'Operative Leistung',
    'Finanzielle Entwicklung',
    'Technologische Innovation',
    'Kundenbeziehungen',
    'Personalentwicklung',
    'Nachhaltigkeitsmaßnahmen',
    'Qualitätsmanagement',
    'Risikobewertung',
    'Wettbewerbsposition',
    'Produktentwicklung',
    'Prozessoptimierung',
    'Digitalisierung',
    'Compliance und Governance'
  ];

  return titles[index % titles.length];
};

const testPages300 = generateTestPages(300);

module.exports = { testPages300, generateTestPages };