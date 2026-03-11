const pageContents = [
  {
    id: 'introduction',
    title: 'Einführung',
    content: {
      type: 'text',
      data: `
        <h2>Willkommen zu unserem Dokumentationssystem</h2>
        <p>Dieses Dokument wurde automatisch generiert unter Verwendung von PagedJS und React. Es demonstriert die Möglichkeit, professionelle, druckfertige Dokumente direkt aus strukturierten Daten zu erstellen.</p>

        <p>Das System kombiniert moderne Web-Technologien mit bewährten Prinzipien des Dokumentendesigns:</p>
        <ul>
          <li>React für komponentenbasierte Strukturierung</li>
          <li>PagedJS für print-optimierte Paginierung</li>
          <li>Node.js für server-seitige HTML-Generierung</li>
        </ul>

        <p>Jede Seite dieses Dokuments wurde sorgfältig gestaltet, um sowohl digital als auch gedruckt optimal lesbar zu sein.</p>
      `
    }
  },
  {
    id: 'market-analysis',
    title: 'Marktanalyse Q1 2024',
    content: {
      type: 'table',
      data: {
        caption: 'Verkaufszahlen nach Regionen',
        headers: ['Region', 'Q1 Verkäufe', 'Veränderung (%)', 'Zielerreichung'],
        rows: [
          ['Europa', '€2.450.000', '+12.5%', '108%'],
          ['Nordamerika', '€3.200.000', '+8.3%', '95%'],
          ['Asien-Pazifik', '€1.850.000', '+25.7%', '126%'],
          ['Lateinamerika', '€680.000', '-3.2%', '87%'],
          ['Afrika/Naher Osten', '€520.000', '+15.8%', '102%']
        ]
      }
    }
  },
  {
    id: 'product-overview',
    title: 'Produktübersicht 2024',
    content: {
      type: 'mixed',
      data: `
        <h2>Unsere Produktfamilien</h2>
        <p>Im Jahr 2024 haben wir unser Produktportfolio erheblich erweitert. Die folgende Übersicht zeigt die wichtigsten Entwicklungen:</p>

        <h3>Enterprise Solutions</h3>
        <p>Unsere Enterprise-Lösungen bilden das Rückgrat unseres Geschäfts. Mit über 500 Unternehmenskunden weltweit haben wir eine starke Position im B2B-Markt etabliert.</p>

        <h3>Consumer Products</h3>
        <p>Der Verbrauchermarkt zeigt weiterhin starkes Wachstum. Besonders in der mobilen Sparte konnten wir unseren Marktanteil um 18% steigern.</p>

        <h3>Innovation Pipeline</h3>
        <p>Für 2025 planen wir die Einführung von drei neuen Produktkategorien, die auf künstlicher Intelligenz und maschinellem Lernen basieren.</p>
      `
    }
  },
  {
    id: 'financial-data',
    title: 'Finanzdaten Übersicht',
    content: {
      type: 'table',
      data: {
        caption: 'Quartalsvergleich der Hauptkennzahlen',
        headers: ['Kennzahl', 'Q4 2023', 'Q1 2024', 'Veränderung'],
        rows: [
          ['Umsatz (€)', '8.950.000', '9.240.000', '+3.2%'],
          ['Bruttogewinn (€)', '3.580.000', '3.850.000', '+7.5%'],
          ['Betriebskosten (€)', '2.100.000', '2.180.000', '+3.8%'],
          ['EBITDA (€)', '1.480.000', '1.670.000', '+12.8%'],
          ['Nettogewinn (€)', '980.000', '1.120.000', '+14.3%'],
          ['Cashflow (€)', '1.200.000', '1.380.000', '+15.0%']
        ]
      }
    }
  },
  {
    id: 'team-structure',
    title: 'Organisationsstruktur',
    content: {
      type: 'mixed',
      data: `
        <h2>Unser Team im Überblick</h2>
        <p>Mit über 250 Mitarbeitern weltweit sind wir ein mittelständisches Unternehmen mit internationaler Ausrichtung.</p>

        <h3>Führungsebene</h3>
        <p>Das Führungsteam besteht aus erfahrenen Branchenkennern mit durchschnittlich 15 Jahren Erfahrung in ihren jeweiligen Bereichen.</p>

        <h3>Entwicklungsteams</h3>
        <p>Unsere vier Entwicklungsteams arbeiten agil nach Scrum-Methodik. Jedes Team besteht aus 6-8 Entwicklern plus Product Owner und Scrum Master.</p>

        <h3>Vertrieb und Marketing</h3>
        <p>Das Vertriebs- und Marketingteam ist regional organisiert und bedient unsere Kunden in 15 Ländern.</p>

        <h3>Operations</h3>
        <p>Das Operations-Team sorgt für den reibungslosen Betrieb aller Systeme und Prozesse.</p>
      `
    }
  },
  {
    id: 'technology-stack',
    title: 'Technologie-Stack',
    content: {
      type: 'table',
      data: {
        caption: 'Verwendete Technologien und Frameworks',
        headers: ['Kategorie', 'Technologie', 'Version', 'Status'],
        rows: [
          ['Frontend', 'React', '18.2.0', 'Produktiv'],
          ['Frontend', 'TypeScript', '5.0.4', 'Produktiv'],
          ['Backend', 'Node.js', '18.16.0', 'Produktiv'],
          ['Backend', 'Express.js', '4.18.2', 'Produktiv'],
          ['Datenbank', 'PostgreSQL', '15.3', 'Produktiv'],
          ['Caching', 'Redis', '7.0.11', 'Produktiv'],
          ['Cloud', 'AWS', 'Various', 'Produktiv'],
          ['Monitoring', 'DataDog', 'Latest', 'Produktiv']
        ]
      }
    }
  },
  {
    id: 'customer-feedback',
    title: 'Kundenfeedback Analyse',
    content: {
      type: 'mixed',
      data: `
        <h2>Stimmen unserer Kunden</h2>
        <p>Das Kundenfeedback ist ein wichtiger Indikator für unseren Erfolg. Im ersten Quartal 2024 haben wir über 1.200 Kundenbewertungen gesammelt.</p>

        <h3>Zufriedenheit nach Bereichen</h3>
        <ul>
          <li><strong>Produktqualität:</strong> 4.6/5.0 Sterne (Verbesserung: +0.2)</li>
          <li><strong>Kundensupport:</strong> 4.4/5.0 Sterne (Verbesserung: +0.1)</li>
          <li><strong>Benutzerfreundlichkeit:</strong> 4.3/5.0 Sterne (Stabil)</li>
          <li><strong>Preis-Leistung:</strong> 4.1/5.0 Sterne (Verbesserung: +0.3)</li>
        </ul>

        <h3>Häufige Verbesserungsvorschläge</h3>
        <p>Die drei meistgenannten Verbesserungsvorschläge sind:</p>
        <ol>
          <li>Erweiterte Reporting-Funktionen (erwähnt in 23% der Feedbacks)</li>
          <li>Mobile App Verbesserungen (erwähnt in 18% der Feedbacks)</li>
          <li>Schnellere Ladezeiten (erwähnt in 15% der Feedbacks)</li>
        </ol>
      `
    }
  },
  {
    id: 'market-trends',
    title: 'Markttrends 2024',
    content: {
      type: 'mixed',
      data: `
        <h2>Wichtige Branchentrends</h2>
        <p>Der Markt entwickelt sich rasant weiter. Diese Trends prägen unsere Branche in 2024:</p>

        <h3>1. Künstliche Intelligenz Integration</h3>
        <p>KI wird zum Standard in Business-Anwendungen. 68% aller neuen Enterprise-Software-Projekte integrieren KI-Funktionen von Beginn an.</p>

        <h3>2. Cloud-First Strategien</h3>
        <p>Unternehmen setzen verstärkt auf Cloud-native Lösungen. Der Anteil von Cloud-First-Projekten ist von 45% auf 73% gestiegen.</p>

        <h3>3. Nachhaltigkeit in der IT</h3>
        <p>Green Computing wird immer wichtiger. Energieeffizienz ist ein Schlüsselkriterium bei Technologie-Entscheidungen geworden.</p>

        <h3>4. Remote-Work Tools</h3>
        <p>Die Nachfrage nach kollaborativen Remote-Work-Tools bleibt hoch, auch nach der Pandemie.</p>
      `
    }
  },
  {
    id: 'project-timeline',
    title: 'Projektplanung 2024',
    content: {
      type: 'table',
      data: {
        caption: 'Wichtige Meilensteine und Termine',
        headers: ['Projekt', 'Start', 'Ende', 'Status', 'Verantwortlich'],
        rows: [
          ['Mobile App v3.0', '01.01.2024', '30.04.2024', 'Abgeschlossen', 'Team Alpha'],
          ['KI-Integration Backend', '15.02.2024', '31.05.2024', 'In Bearbeitung', 'Team Beta'],
          ['Cloud Migration Phase 2', '01.03.2024', '30.06.2024', 'In Bearbeitung', 'Team Gamma'],
          ['Security Audit', '01.04.2024', '15.05.2024', 'Geplant', 'Ext. Partner'],
          ['Performance Optimization', '01.05.2024', '31.07.2024', 'Geplant', 'Team Delta'],
          ['New Dashboard UI', '15.06.2024', '30.09.2024', 'Geplant', 'Team Alpha']
        ]
      }
    }
  },
  {
    id: 'conclusions',
    title: 'Fazit und Ausblick',
    content: {
      type: 'mixed',
      data: `
        <h2>Zusammenfassung der Ergebnisse</h2>
        <p>Das erste Quartal 2024 war geprägt von solidem Wachstum und strategischen Fortschritten. Unsere wichtigsten Erfolge:</p>

        <h3>Erreichte Ziele</h3>
        <ul>
          <li>Umsatzsteigerung von 3.2% gegenüber dem Vorquartal</li>
          <li>Erfolgreiche Markterschließung in Asien-Pazifik (+25.7%)</li>
          <li>Verbesserung der Kundenzufriedenheit in allen Bereichen</li>
          <li>Planmäßiger Fortschritt bei strategischen Projekten</li>
        </ul>

        <h3>Ausblick Q2 2024</h3>
        <p>Für das zweite Quartal planen wir:</p>
        <ul>
          <li>Launch der neuen mobilen App-Version</li>
          <li>Abschluss der KI-Backend-Integration</li>
          <li>Expansion in zwei neue Märkte</li>
          <li>Start der großen Performance-Optimierung</li>
        </ul>

        <p>Mit diesen soliden Grundlagen sind wir gut positioniert für ein erfolgreiches Jahr 2024.</p>
      `
    }
  }
];

module.exports = { pageContents };