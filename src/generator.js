const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { JSDOM } = require('jsdom');
const fs = require('fs-extra');
const path = require('path');

// Import components and data
const Document = require('./components/Document.js');
const { pageContents } = require('./content/pages.js');

/**
 * HTML Template für das generierte Dokument
 */
const createHTMLTemplate = (reactContent, cssContent) => {
  return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="PagedJS React Document Generator">
    <title>Unternehmensbericht Q1 2024</title>

    <!-- PagedJS Library -->
    <script src="https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js"></script>

    <!-- Print Styles -->
    <style>
        ${cssContent}
    </style>

    <!-- Additional PagedJS Configuration -->
    <script>
        window.PagedConfig = {
            before: () => {
                console.log('PagedJS: Starting pagination...');
            },
            after: () => {
                console.log('PagedJS: Pagination complete!');
                // Fix TOC page numbers after pagination
                updateTOCPageNumbers();
            }
        };

        // Function to update TOC page numbers using PagedJS counters
        function updateTOCPageNumbers() {
            const tocEntries = document.querySelectorAll('.toc-page-number');
            tocEntries.forEach(entry => {
                const targetId = entry.getAttribute('data-page-ref');
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Use PagedJS to get the actual page number
                    const pageElement = targetElement.closest('.pagedjs_page');
                    if (pageElement) {
                        const pageNumber = pageElement.getAttribute('data-page-number') ||
                                         pageElement.querySelector('.pagedjs_margin-top-right')?.textContent?.match(/\\d+/)?.[0] ||
                                         entry.textContent;
                        entry.textContent = pageNumber;
                    }
                }
            });
        }

        // Note: TOC links use standard HTML anchors, no JavaScript needed
    </script>
</head>
<body>
    ${reactContent}
</body>
</html>`;
};

/**
 * Lädt CSS Inhalt aus Datei
 */
const loadCSSContent = async () => {
  try {
    const cssPath = path.join(__dirname, 'styles', 'print.css');
    return await fs.readFile(cssPath, 'utf8');
  } catch (error) {
    console.error('Fehler beim Laden der CSS-Datei:', error);
    return '';
  }
};

/**
 * Erstellt das React Document und rendert es zu HTML
 */
const renderReactDocument = () => {
  console.log('🔄 Rendering React components...');

  // Validierung der Eingangsdaten
  if (!pageContents || !Array.isArray(pageContents) || pageContents.length === 0) {
    throw new Error('Keine gültigen Seiten-Inhalte gefunden!');
  }

  console.log(`📄 Gefunden: ${pageContents.length} Seiten zur Verarbeitung`);

  // React Document Component erstellen
  const documentElement = React.createElement(Document, {
    contents: pageContents,
    title: "Unternehmensbericht Q1 2024"
  });

  // Server-side rendering
  const htmlString = ReactDOMServer.renderToStaticMarkup(documentElement);

  console.log('✅ React rendering abgeschlossen');
  return htmlString;
};

/**
 * Verarbeitet das HTML mit JSDOM für erweiterte DOM-Manipulationen
 */
const processHTMLWithJSDOM = (html) => {
  console.log('🔄 Verarbeitung mit JSDOM...');

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Zusätzliche DOM-Manipulationen können hier durchgeführt werden
  // z.B. dynamische Inhalte, Berechnungen, etc.

  // Füge Meta-Informationen hinzu
  const metaInfo = document.createElement('div');
  metaInfo.className = 'document-meta-info';
  metaInfo.style.display = 'none';
  metaInfo.innerHTML = `
    <meta name="total-pages" content="${pageContents.length}">
    <meta name="generation-time" content="${new Date().toISOString()}">
    <meta name="generator-version" content="1.0.0">
  `;
  document.head.appendChild(metaInfo);

  console.log('✅ JSDOM Verarbeitung abgeschlossen');
  return dom.serialize();
};

/**
 * Speichert das generierte HTML in eine Datei
 */
const saveHTMLDocument = async (htmlContent) => {
  const outputDir = path.join(__dirname, '..', 'output');
  const outputPath = path.join(outputDir, 'document.html');

  // Stelle sicher, dass das Output-Verzeichnis existiert
  await fs.ensureDir(outputDir);

  // Schreibe die HTML-Datei
  await fs.writeFile(outputPath, htmlContent, 'utf8');

  console.log(`✅ Dokument gespeichert: ${outputPath}`);

  // Zeige Dateigröße
  const stats = await fs.stat(outputPath);
  const fileSizeKB = Math.round(stats.size / 1024);
  console.log(`📊 Dateigröße: ${fileSizeKB} KB`);

  return outputPath;
};

/**
 * Hauptfunktion für die Dokumentgenerierung
 */
const generateDocument = async () => {
  console.log('🚀 Starte Dokumentgenerierung...');
  console.log('=' .repeat(50));

  try {
    // 1. CSS Inhalt laden
    console.log('1️⃣  Lade CSS Styles...');
    const cssContent = await loadCSSContent();

    // 2. React Components rendern
    console.log('2️⃣  Rendere React Components...');
    const reactHTML = renderReactDocument();

    // 3. HTML Template erstellen
    console.log('3️⃣  Erstelle HTML Template...');
    const fullHTML = createHTMLTemplate(reactHTML, cssContent);

    // 4. JSDOM Verarbeitung
    console.log('4️⃣  Verarbeite mit JSDOM...');
    const processedHTML = processHTMLWithJSDOM(fullHTML);

    // 5. Datei speichern
    console.log('5️⃣  Speichere Dokument...');
    const outputPath = await saveHTMLDocument(processedHTML);

    // Erfolgreiche Generierung
    console.log('=' .repeat(50));
    console.log('🎉 Dokumentgenerierung erfolgreich abgeschlossen!');
    console.log(`📁 Output: ${outputPath}`);
    console.log('💡 Öffne die Datei in einem Browser, um das Ergebnis zu sehen.');

    // Zusätzliche Informationen
    console.log('\n📋 Zusammenfassung:');
    console.log(`   • Seiten: ${pageContents.length}`);
    console.log(`   • Generiert: ${new Date().toLocaleString('de-DE')}`);
    console.log(`   • Format: A4 (210 × 297 mm)`);

    return outputPath;

  } catch (error) {
    console.error('❌ Fehler bei der Dokumentgenerierung:', error);
    console.error('Stack Trace:', error.stack);
    process.exit(1);
  }
};

/**
 * CLI Ausführung
 */
if (require.main === module) {
  generateDocument()
    .then(outputPath => {
      console.log(`\n🌐 Um das Dokument anzuzeigen:`);
      console.log(`   open "${outputPath}"`);
      console.log(`   oder öffne die Datei manuell in einem Browser.\n`);
    })
    .catch(error => {
      console.error('Fataler Fehler:', error);
      process.exit(1);
    });
}

module.exports = { generateDocument };
module.exports.default = generateDocument;