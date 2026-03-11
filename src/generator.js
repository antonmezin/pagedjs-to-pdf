const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs-extra');
const path = require('path');
// JSDOM no longer needed - CSS target-counter() handles everything

// Import components and data
const Document = require('./components/Document.js');
const { pageContents } = require('./content/pages.js');
const { testPages300 } = require('./content/test-content-300.js');
const DocumentChunker = require('./chunker.js');

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
    <!-- PagedJS handles pagination automatically - no custom JavaScript needed -->
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
const renderReactDocument = (testMode = false) => {
  console.log('🔄 Rendering React components...');

  // Wähle Content basierend auf Modus
  const contents = testMode ? testPages300 : pageContents;
  const title = testMode ? "Test Dokument - 300 Seiten" : "Unternehmensbericht Q1 2024";

  // Validierung der Eingangsdaten
  if (!contents || !Array.isArray(contents) || contents.length === 0) {
    throw new Error('Keine gültigen Seiten-Inhalte gefunden!');
  }

  console.log(`📄 Gefunden: ${contents.length} Seiten zur Verarbeitung`);

  // React Document Component erstellen
  const documentElement = React.createElement(Document, {
    contents: contents,
    title: title
  });

  // Server-side rendering
  const htmlString = ReactDOMServer.renderToStaticMarkup(documentElement);

  console.log('✅ React rendering abgeschlossen');
  return htmlString;
};

/**
 * JSDOM processing no longer needed - CSS target-counter() handles TOC automatically
 * Keeping for potential future extensions
 */
// const processHTMLWithJSDOM = (html) => { /* removed */ };

/**
 * Speichert das generierte HTML in eine Datei
 */
const saveHTMLDocument = async (htmlContent, fileName = 'document.html') => {
  const outputDir = path.join(__dirname, '..', 'output');
  const outputPath = path.join(outputDir, fileName);

  // Stelle sicher, dass das Output-Verzeichnis existiert
  await fs.ensureDir(outputDir);

  // Schreibe die HTML-Datei
  await fs.writeFile(outputPath, htmlContent, 'utf8');

  console.log(`✅ Dokument gespeichert: ${outputPath}`);

  // Zeige Dateigröße
  const stats = await fs.stat(outputPath);
  const fileSizeKB = Math.round(stats.size / 1024);
  const fileSizeMB = Math.round(stats.size / 1024 / 1024 * 10) / 10;
  if (fileSizeMB >= 1) {
    console.log(`📊 Dateigröße: ${fileSizeMB} MB`);
  } else {
    console.log(`📊 Dateigröße: ${fileSizeKB} KB`);
  }

  return outputPath;
};

/**
 * Hauptfunktion für die Dokumentgenerierung
 */
const generateDocument = async (testMode = false) => {
  console.log('🚀 Starte Dokumentgenerierung...');
  if (testMode) {
    console.log('🧪 TEST MODE: Generiere 300-Seiten Dokument');
  }
  console.log('=' .repeat(50));

  try {
    // 1. CSS Inhalt laden
    console.log('1️⃣  Lade CSS Styles...');
    const cssContent = await loadCSSContent();

    // 2. React Components rendern
    console.log('2️⃣  Rendere React Components...');
    const reactHTML = renderReactDocument(testMode);

    // 3. HTML Template erstellen
    console.log('3️⃣  Erstelle HTML Template...');
    const fullHTML = createHTMLTemplate(reactHTML, cssContent);

    // 4. Datei speichern (keine JSDOM-Verarbeitung mehr nötig)
    console.log('4️⃣  Speichere Dokument...');
    const outputFileName = testMode ? 'document-300pages.html' : 'document.html';
    const outputPath = await saveHTMLDocument(fullHTML, outputFileName);

    // Erfolgreiche Generierung
    console.log('=' .repeat(50));
    console.log('🎉 Dokumentgenerierung erfolgreich abgeschlossen!');
    console.log(`📁 Output: ${outputPath}`);
    console.log('💡 Öffne die Datei in einem Browser, um das Ergebnis zu sehen.');

    // Zusätzliche Informationen
    const contents = testMode ? testPages300 : pageContents;
    console.log('\n📋 Zusammenfassung:');
    console.log(`   • Seiten: ${contents.length}`);
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
 * Generiert ein in Chunks aufgeteiltes Dokument
 */
const generateChunkedDocument = async (testMode = false, chunkSize = 50) => {
  console.log('🚀 Starte CHUNKED Dokumentgenerierung...');
  console.log(`📑 Chunk-Größe: ${chunkSize} Seiten pro Datei`);
  if (testMode) {
    console.log('🧪 TEST MODE: Generiere 300-Seiten Dokument in Chunks');
  }
  console.log('=' .repeat(60));

  try {
    // 1. Content und Titel bestimmen
    const contents = testMode ? testPages300 : pageContents;
    const title = testMode ? "Test Dokument - 300 Seiten" : "Unternehmensbericht Q1 2024";

    console.log(`📄 Content-Seiten: ${contents.length}`);
    const totalChunks = Math.ceil(contents.length / chunkSize);
    console.log(`📑 Content-Chunks: ${totalChunks} (je ${chunkSize} Seiten)`);

    // 2. CSS Inhalt laden
    console.log('1️⃣  Lade CSS Styles...');
    const cssContent = await loadCSSContent();

    // 3. Output-Verzeichnis vorbereiten
    const outputDir = path.join(__dirname, '..', 'output', 'chunks');
    await fs.ensureDir(outputDir);
    console.log(`📁 Output: ${outputDir}`);

    // 4. Chunker erstellen
    console.log('2️⃣  Erstelle Chunker...');
    const chunker = new DocumentChunker(contents, title, chunkSize);
    console.log(`📖 TOC wird ${chunker.tocPages} Seiten haben`);
    console.log(`📄 Content startet ab Seite ${chunker.tocPages + 1}`);

    // 5. Globales TOC generieren
    console.log('3️⃣  Erstelle globales TOC...');
    const tocFile = await chunker.generateGlobalTOC(cssContent, outputDir);

    // 6. Content-Chunks generieren
    console.log('4️⃣  Erstelle Content-Chunks...');
    const chunkFiles = await chunker.generateAllChunks(cssContent, outputDir);

    // 7. Index-Seite generieren
    console.log('5️⃣  Erstelle Index-Seite...');
    const indexPath = await chunker.generateIndexPage(chunkFiles, tocFile, outputDir);

    // Erfolgreiche Generierung
    console.log('=' .repeat(60));
    console.log('🎉 CHUNKED Dokumentgenerierung erfolgreich abgeschlossen!');
    console.log(`📁 Output-Verzeichnis: ${outputDir}`);
    console.log(`🔗 Index-Seite: ${indexPath}`);

    // Statistiken
    const totalDocumentPages = chunker.tocPages + contents.length;
    console.log('\n📋 Zusammenfassung:');
    console.log(`   • Gesamt-Seitenzahl: ${totalDocumentPages} (${chunker.tocPages} TOC + ${contents.length} Content)`);
    console.log(`   • TOC-Datei: ${tocFile.fileName} (${tocFile.size} KB)`);
    console.log(`   • Content-Chunks: ${chunkFiles.length} (je ${chunkSize} Seiten)`);
    console.log(`   • Seitennummerierung: TOC 1-${chunker.tocPages}, Content ${chunker.tocPages + 1}-${totalDocumentPages}`);
    console.log(`   • Gesamtgröße: ${Math.round(chunkFiles.reduce((sum, f) => sum + f.size, 0) + tocFile.size)} KB`);
    console.log(`   • Generiert: ${new Date().toLocaleString('de-DE')}`);
    console.log(`   • Druckreihenfolge: TOC → Teil 1 → Teil 2 → ... → Teil ${chunkFiles.length}`);

    return {
      indexPath,
      chunkFiles,
      tocFile,
      outputDir
    };

  } catch (error) {
    console.error('❌ Fehler bei der CHUNKED Dokumentgenerierung:', error);
    console.error('Stack Trace:', error.stack);
    process.exit(1);
  }
};

/**
 * CLI Ausführung
 */
if (require.main === module) {
  // Parse command line arguments
  const testMode = process.argv.includes('--300pages') || process.argv.includes('--large');
  const chunkMode = process.argv.includes('--chunks') || process.argv.includes('--split');

  // Parse chunk size
  const chunkSizeArg = process.argv.find(arg => arg.startsWith('--chunk-size='));
  const chunkSize = chunkSizeArg ? parseInt(chunkSizeArg.split('=')[1]) : 50;

  if (chunkMode) {
    // Chunked document generation
    generateChunkedDocument(testMode, chunkSize)
      .then(result => {
        console.log(`\n🌐 Um das Dokument anzuzeigen:`);
        console.log(`   open "${result.indexPath}"`);
        console.log(`   oder öffne die Index-Seite manuell im Browser.\n`);

        console.log(`📂 Einzelne Chunks:`);
        result.chunkFiles.forEach(chunk => {
          console.log(`   • ${chunk.fileName} (Seiten ${chunk.chunk.startPage}-${chunk.chunk.endPage})`);
        });
      })
      .catch(error => {
        console.error('Fataler Fehler:', error);
        process.exit(1);
      });
  } else {
    // Standard single-file generation
    generateDocument(testMode)
      .then(outputPath => {
        console.log(`\n🌐 Um das Dokument anzuzeigen:`);
        console.log(`   open "${outputPath}"`);
        console.log(`   oder öffne die Datei manuell in einem Browser.\n`);

        if (testMode) {
          console.log(`⚡ Test-Modus: Öffnen könnte bei 300 Seiten etwas dauern...`);
        }
      })
      .catch(error => {
        console.error('Fataler Fehler:', error);
        process.exit(1);
      });
  }
}

module.exports = { generateDocument };
module.exports.default = generateDocument;