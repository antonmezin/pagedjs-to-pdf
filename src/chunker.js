const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs-extra');
const path = require('path');

// Import components
const Document = require('./components/Document.js');
const TableOfContents = require('./components/TableOfContents.js');

/**
 * Document Chunker - Splits large documents into smaller files
 */
class DocumentChunker {
  constructor(pages, title, chunkSize = 50) {
    this.pages = pages;
    this.title = title;
    this.chunkSize = chunkSize;
    this.totalPages = pages.length;
    this.tocPages = this.calculateTOCPages();
    this.chunks = this.createChunks();
  }

  /**
   * Calculates how many pages the TOC will need
   */
  calculateTOCPages() {
    const entriesPerPage = 25; // Rough estimate: 25 TOC entries per page
    const titlePages = 1; // Title page
    const tocContentPages = Math.ceil(this.totalPages / entriesPerPage);
    return titlePages + tocContentPages;
  }

  /**
   * Splits pages into chunks of specified size with correct page numbering
   */
  createChunks() {
    const chunks = [];

    for (let i = 0; i < this.pages.length; i += this.chunkSize) {
      const chunkPages = this.pages.slice(i, i + this.chunkSize);
      const chunkNumber = Math.floor(i / this.chunkSize) + 1;

      // Calculate correct start page: TOC pages + content pages so far
      const startPage = this.tocPages + i + 1;
      const endPage = this.tocPages + Math.min(i + this.chunkSize, this.totalPages);

      // pageOffset for CSS counter-reset (0-based)
      const pageOffset = startPage - 1;

      chunks.push({
        number: chunkNumber,
        pages: chunkPages,
        startPage: startPage,
        endPage: endPage,
        pageOffset: pageOffset // For CSS counter-reset
      });
    }
    return chunks;
  }

  /**
   * Creates CSS with proper page counter offset for chunk
   */
  createChunkCSS(baseCSS, pageOffset, totalDocumentPages, chunkNumber) {
    // Calculate the correct starting page number for this chunk
    const startingPageNumber = pageOffset + 1; // Convert from 0-based to 1-based

    // Replace counter(pages) with actual total document pages
    let chunkCSS = baseCSS.replace(
      /counter\(pages\)/g,
      totalDocumentPages.toString()
    );

    // Create proper counter-reset CSS that works with PagedJS
    const counterResetCSS = `
/* Chunk-specific page counter - starts from page ${startingPageNumber} */
/* Total document pages: ${totalDocumentPages} */

html {
  counter-reset: page ${pageOffset};
}

body {
  counter-reset: page ${pageOffset};
}

/* Override @page counter increment to continue from previous chunks */
@page {
  counter-increment: page;
}

/* Screen-visible page numbers using tested CSS from working debug page */
@media screen {
  .page {
    position: relative;
    min-height: calc(100vh - 40px);
    margin: 20px 0;
    border: 2px solid #ecf0f1;
    padding: 40px 20px 20px 20px;
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    border-radius: 5px;
  }

  /* WORKING METHOD from debug-page-numbers.html - Maximum strength CSS */
  .screen-page-number {
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    background: #3498db !important;
    color: white !important;
    padding: 12px 20px !important;
    font-size: 16px !important;
    border-radius: 25px !important;
    font-weight: bold !important;
    z-index: 2147483647 !important;
    border: 3px solid #2980b9 !important;
    box-shadow: 0 5px 15px rgba(0,0,0,0.5) !important;
    font-family: Arial, sans-serif !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: auto !important;
    height: auto !important;
    margin: 0 !important;
    padding: 12px 20px !important;
    transform: none !important;
    transition: none !important;
  }

  .screen-chunk-info {
    position: fixed !important;
    top: 20px !important;
    left: 20px !important;
    background: #e74c3c !important;
    color: white !important;
    padding: 12px 20px !important;
    font-size: 16px !important;
    border-radius: 25px !important;
    font-weight: bold !important;
    z-index: 2147483647 !important;
    border: 3px solid #c0392b !important;
    box-shadow: 0 5px 15px rgba(0,0,0,0.5) !important;
    font-family: Arial, sans-serif !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: auto !important;
    height: auto !important;
    margin: 0 !important;
    padding: 12px 20px !important;
    transform: none !important;
    transition: none !important;
  }

  /* Maximum strength PagedJS overrides */
  .pagedjs_pages .screen-page-number,
  .pagedjs_pages .screen-chunk-info,
  .pagedjs_page .screen-page-number,
  .pagedjs_page .screen-chunk-info {
    position: fixed !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    z-index: 2147483647 !important;
  }

  /* Additional failsafe overrides */
  * .screen-page-number,
  * .screen-chunk-info {
    position: fixed !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    z-index: 2147483647 !important;
  }

  /* Page break visual separator */
  .page-break {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #95a5a6;
    font-size: 14px;
    font-weight: bold;
  }

  .page-break::after {
    content: "• • • Seitenumbruch • • •";
  }
}

/* Print mode - hide screen elements */
@media print {
  .page {
    border: none !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .screen-page-number,
  .screen-chunk-info,
  .screen-page-number-override,
  .screen-chunk-info-override {
    display: none !important;
  }

  .page-break::after {
    display: none !important;
  }
}
`;

    // Insert counter-reset at the very beginning
    chunkCSS = counterResetCSS + '\n' + chunkCSS;

    return chunkCSS;
  }

  /**
   * Creates the global TOC for the entire document
   */
  createGlobalTOC() {
    // Calculate actual page numbers using the same logic as chunks
    const sections = this.pages.map((page, index) => {
      const pageNumber = this.tocPages + index + 1; // Start after TOC pages
      const chunkNumber = Math.floor(index / this.chunkSize) + 1;

      return {
        id: page.id,
        title: page.title,
        pageNumber: pageNumber,
        chunkNumber: chunkNumber
      };
    });

    return React.createElement('div', { className: 'document' }, [
      // Title page
      React.createElement('div', {
        key: 'title',
        className: 'title-page',
        style: { page: 'title' }
      }, React.createElement('div', { className: 'title-content' }, [
        React.createElement('h1', { key: 'title', className: 'document-title' }, this.title),
        React.createElement('div', { key: 'meta', className: 'document-meta' }, [
          React.createElement('p', { key: 'date', className: 'generation-date' },
            `Erstellt am: ${new Date().toLocaleDateString('de-DE')}`),
          React.createElement('p', { key: 'info', className: 'document-info' },
            `Aufgeteilt in ${this.chunks.length} Druckteile à ${this.chunkSize} Seiten`)
        ])
      ])),

      // Page break before TOC
      React.createElement('div', { key: 'break1', className: 'page-break' }),

      // Global TOC
      React.createElement('div', {
        key: 'toc',
        className: 'toc-page',
        style: { page: 'toc' }
      }, [
        React.createElement('div', { key: 'header', className: 'toc-header' }, [
          React.createElement('h1', { key: 'title', className: 'toc-title' },
            'Inhaltsverzeichnis'
          ),
          React.createElement('p', { key: 'info', className: 'toc-info' },
            `${this.totalPages} Abschnitte • ${this.chunks.length} Druckteile`
          )
        ]),
        React.createElement('div', { key: 'content', className: 'toc-content' }, [
          React.createElement('nav', { key: 'nav', className: 'toc-nav' },
            sections.map((section, index) =>
              React.createElement('div', {
                key: section.id,
                className: 'toc-entry'
              }, [
                React.createElement('div', {
                  key: 'content',
                  className: 'toc-entry-content'
                }, [
                  React.createElement('span', {
                    key: 'number',
                    className: 'toc-number'
                  }, `${index + 1}.`),
                  React.createElement('span', {
                    key: 'title',
                    className: 'toc-link-text'  // Not clickable since content is in different files
                  }, section.title),
                  React.createElement('span', {
                    key: 'dots',
                    className: 'toc-dots'
                  }),
                  React.createElement('span', {
                    key: 'page',
                    className: 'toc-page-number'
                  }, section.pageNumber),
                  React.createElement('span', {
                    key: 'chunk',
                    className: 'toc-chunk-info'
                  }, `(Teil ${section.chunkNumber})`)
                ])
              ])
            )
          )
        ])
      ])
    ]);
  }

  /**
   * Creates HTML template for a chunk
   */
  createChunkHTMLTemplate(reactContent, cssContent, chunkNumber, startPage, endPage) {
    return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="PagedJS React Document Generator - Chunk ${chunkNumber}">
    <title>${this.title} - Teil ${chunkNumber} (Seiten ${startPage}-${endPage})</title>

    <!-- PagedJS Library -->
    <script src="https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js"></script>

    <!-- Chunk-specific styles -->
    <style>
        ${cssContent}
    </style>

    <!-- GUARANTEED VISIBLE PAGE NUMBERS - Tested working CSS -->
    <style>
        /* This CSS is proven to work in debug-page-numbers.html */
        .screen-page-number-override {
            position: absolute !important;
            top: 10px !important;
            right: 15px !important;
            background: #3498db !important;
            color: white !important;
            padding: 12px 20px !important;
            font-size: 16px !important;
            border-radius: 25px !important;
            font-weight: bold !important;
            z-index: 2147483647 !important;
            border: 3px solid #2980b9 !important;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5) !important;
            font-family: Arial, sans-serif !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: auto !important;
            height: auto !important;
            margin: 0 !important;
            transform: none !important;
            transition: none !important;
        }

        .screen-chunk-info-override {
            position: absolute !important;
            top: 10px !important;
            left: 15px !important;
            background: #e74c3c !important;
            color: white !important;
            padding: 12px 20px !important;
            font-size: 16px !important;
            border-radius: 25px !important;
            font-weight: bold !important;
            z-index: 2147483647 !important;
            border: 3px solid #c0392b !important;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5) !important;
            font-family: Arial, sans-serif !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: auto !important;
            height: auto !important;
            margin: 0 !important;
            transform: none !important;
            transition: none !important;
        }

        /* Hide in print mode */
        @media print {
            .screen-page-number-override,
            .screen-chunk-info-override {
                display: none !important;
            }
        }

        /* Maximum strength PagedJS overrides */
        .pagedjs_pages .screen-page-number-override,
        .pagedjs_pages .screen-chunk-info-override,
        .pagedjs_page .screen-page-number-override,
        .pagedjs_page .screen-chunk-info-override,
        * .screen-page-number-override,
        * .screen-chunk-info-override {
            position: absolute !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 2147483647 !important;
        }
    </style>

    <!-- Chunk navigation info -->
    <script>
        window.ChunkInfo = {
            number: ${chunkNumber},
            startPage: ${startPage},
            endPage: ${endPage},
            totalChunks: ${this.chunks.length},
            title: "${this.title}"
        };

        // Add chunk navigation after PagedJS loads
        document.addEventListener('DOMContentLoaded', () => {
            // Add navigation helper
            console.log(\`📖 Chunk \${window.ChunkInfo.number}/\${window.ChunkInfo.totalChunks} loaded\`);
            console.log(\`📄 Seiten \${window.ChunkInfo.startPage}-\${window.ChunkInfo.endPage}\`);
        });
    </script>
</head>
<body>
    <!-- Chunk navigation header -->
    <div class="chunk-nav-header" style="position: fixed; top: 5px; right: 5px; background: rgba(255,255,255,0.9); padding: 5px; font-size: 10px; border-radius: 3px; z-index: 1000;">
        Teil ${chunkNumber}/${this.chunks.length} • Seiten ${startPage}-${endPage}
    </div>

    ${reactContent}
</body>
</html>`;
  }

  /**
   * Generates a single chunk HTML file (content only, no TOC)
   */
  async generateChunk(chunk, cssContent, outputDir) {
    console.log(`📄 Generiere Chunk ${chunk.number}/${this.chunks.length} (Seiten ${chunk.startPage}-${chunk.endPage})...`);

    // Calculate total document pages
    const totalDocumentPages = this.tocPages + this.totalPages;

    // Create chunk document - ONLY CONTENT PAGES with hardcoded page numbers
    const chunkDocument = React.createElement('div', { className: 'document' }, [
      // Content pages only - no TOC, no title page
      React.createElement('div', { key: 'content', className: 'content-pages' },
        chunk.pages.map((pageContent, index) => {
          const currentPageNumber = chunk.startPage + index; // Calculate exact page number

          return React.createElement(React.Fragment, { key: pageContent.id }, [
            React.createElement('div', {
              key: 'page',
              id: pageContent.id,
              className: 'page',
              style: { page: 'content' },
              'data-page-number': currentPageNumber,
              'data-total-pages': totalDocumentPages,
              'data-chunk-info': `${chunk.number}/${this.chunks.length}`
            }, [
              // Screen-only page number display with GUARANTEED working CSS
              React.createElement('div', {
                key: 'screen-page-number-override',
                className: 'screen-page-number-override'
              }, `Seite ${currentPageNumber} von ${totalDocumentPages}`),

              // Screen-only chunk info display with GUARANTEED working CSS
              React.createElement('div', {
                key: 'screen-chunk-info-override',
                className: 'screen-chunk-info-override'
              }, `Teil ${chunk.number}/${this.chunks.length}`),

              React.createElement('div', { key: 'header', className: 'page-header' },
                React.createElement('h1', { className: 'page-title' }, pageContent.title)
              ),
              React.createElement('div', { key: 'content', className: 'page-content' },
                this.renderPageContent(pageContent.content)
              )
            ]),
            ...(index < chunk.pages.length - 1 ? [
              React.createElement('div', {
                key: `break-${index}`,
                className: 'page-break'
              })
            ] : [])
          ]);
        })
      )
    ]);

    // Render to HTML
    const reactHTML = ReactDOMServer.renderToStaticMarkup(chunkDocument);

    // Create chunk-specific CSS with page offset and total pages
    const chunkCSS = this.createChunkCSS(cssContent, chunk.pageOffset, totalDocumentPages, chunk.number);

    // Create final HTML
    const finalHTML = this.createChunkHTMLTemplate(
      reactHTML,
      chunkCSS,
      chunk.number,
      chunk.startPage,
      chunk.endPage
    );

    // Save chunk file
    const fileName = `document-chunk-${chunk.number.toString().padStart(2, '0')}.html`;
    const filePath = path.join(outputDir, fileName);
    await fs.writeFile(filePath, finalHTML, 'utf8');

    const stats = await fs.stat(filePath);
    const fileSizeKB = Math.round(stats.size / 1024);

    console.log(`   ✅ ${fileName} gespeichert (${fileSizeKB} KB) - Seiten ${chunk.startPage}-${chunk.endPage}`);

    return {
      fileName,
      filePath,
      size: fileSizeKB,
      chunk
    };
  }

  /**
   * Renders page content based on type
   */
  renderPageContent(content) {
    switch (content.type) {
      case 'text':
        return React.createElement('div', {
          className: 'text-content',
          dangerouslySetInnerHTML: { __html: content.data }
        });
      case 'table':
        return this.renderTable(content.data);
      case 'mixed':
        return React.createElement('div', {
          className: 'mixed-content',
          dangerouslySetInnerHTML: { __html: content.data }
        });
      default:
        return React.createElement('div', { className: 'error-content' },
          `Unbekannter Content-Typ: ${content.type}`);
    }
  }

  /**
   * Renders table content
   */
  renderTable(tableData) {
    return React.createElement('div', { className: 'table-container' }, [
      React.createElement('table', { key: 'table', className: 'content-table' }, [
        tableData.caption && React.createElement('caption', {
          key: 'caption',
          className: 'table-caption'
        }, tableData.caption),
        React.createElement('thead', { key: 'head', className: 'table-header' },
          React.createElement('tr', {},
            tableData.headers.map((header, index) =>
              React.createElement('th', {
                key: index,
                className: 'table-header-cell'
              }, header)
            )
          )
        ),
        React.createElement('tbody', { key: 'body', className: 'table-body' },
          tableData.rows.map((row, rowIndex) =>
            React.createElement('tr', { key: rowIndex, className: 'table-row' },
              row.map((cell, cellIndex) =>
                React.createElement('td', {
                  key: cellIndex,
                  className: 'table-cell'
                }, cell)
              )
            )
          )
        )
      ]),
      React.createElement('div', { key: 'footer', className: 'table-footer' },
        React.createElement('small', { className: 'table-meta' },
          `${tableData.rows.length} ${tableData.rows.length === 1 ? 'Eintrag' : 'Einträge'}`
        )
      )
    ]);
  }

  /**
   * Generates the global TOC file
   */
  async generateGlobalTOC(cssContent, outputDir) {
    console.log('📖 Generiere globales Inhaltsverzeichnis...');

    // Create TOC document
    const tocDocument = this.createGlobalTOC();
    const reactHTML = ReactDOMServer.renderToStaticMarkup(tocDocument);

    // Calculate total document pages and fix CSS
    const totalDocumentPages = this.tocPages + this.totalPages;
    let tocCSS = cssContent.replace(
      /counter\(pages\)/g,
      totalDocumentPages.toString()
    );

    // Create TOC HTML template
    const tocHTML = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="PagedJS React Document Generator - Global TOC">
    <title>${this.title} - Inhaltsverzeichnis</title>

    <!-- PagedJS Library -->
    <script src="https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js"></script>

    <!-- TOC-specific styles -->
    <style>
        ${tocCSS}

        /* TOC specific enhancements */
        .toc-link-text {
            color: #2c3e50;
            font-weight: 500;
            flex-shrink: 0;
        }

        .toc-chunk-info {
            color: #95a5a6;
            font-size: 9pt;
            margin-left: 8pt;
            font-style: italic;
        }

        .toc-page-number {
            color: #7f8c8d;
            font-weight: bold;
            flex-shrink: 0;
        }
    </style>
</head>
<body>
    <!-- TOC header info -->
    <div class="toc-nav-header" style="position: fixed; top: 5px; right: 5px; background: rgba(255,255,255,0.9); padding: 5px; font-size: 10px; border-radius: 3px; z-index: 1000;">
        Inhaltsverzeichnis • Total ${totalDocumentPages} Seiten • ${this.chunks.length} Druckteile
    </div>

    ${reactHTML}
</body>
</html>`;

    // Save TOC file
    const tocFileName = 'document-toc.html';
    const tocFilePath = path.join(outputDir, tocFileName);
    await fs.writeFile(tocFilePath, tocHTML, 'utf8');

    const stats = await fs.stat(tocFilePath);
    const fileSizeKB = Math.round(stats.size / 1024);

    console.log(`   ✅ ${tocFileName} gespeichert (${fileSizeKB} KB) - Globales TOC`);

    return {
      fileName: tocFileName,
      filePath: tocFilePath,
      size: fileSizeKB
    };
  }

  /**
   * Generates all chunks (content only)
   */
  async generateAllChunks(cssContent, outputDir) {
    console.log(`🔨 Erstelle ${this.chunks.length} Content-Chunks (je ${this.chunkSize} Seiten)...`);

    const chunkFiles = [];

    for (const chunk of this.chunks) {
      const chunkResult = await this.generateChunk(chunk, cssContent, outputDir);
      chunkFiles.push(chunkResult);
    }

    return chunkFiles;
  }

  /**
   * Generates index/overview page with print instructions
   */
  async generateIndexPage(chunkFiles, tocFile, outputDir) {
    console.log('🔗 Erstelle Index-Seite...');

    const totalSize = Math.round(chunkFiles.reduce((sum, f) => sum + f.size, 0) + tocFile.size);

    const indexHTML = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.title} - Übersicht & Druckanleitung</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #3498db;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .document-title {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .document-info {
            color: #7f8c8d;
            font-style: italic;
        }
        .print-instructions {
            background: #e8f6f3;
            border: 1px solid #16a085;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        .print-instructions h2 {
            color: #16a085;
            margin-top: 0;
        }
        .print-steps {
            counter-reset: step;
            list-style: none;
            padding: 0;
        }
        .print-steps li {
            counter-increment: step;
            padding: 10px 0;
            padding-left: 40px;
            position: relative;
        }
        .print-steps li::before {
            content: counter(step);
            position: absolute;
            left: 0;
            top: 10px;
            background: #16a085;
            color: white;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        .toc-section {
            background: #fdf2e9;
            border: 1px solid #e67e22;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .toc-link {
            display: inline-block;
            background: #e67e22;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
            font-weight: bold;
            transition: background 0.2s;
        }
        .toc-link:hover {
            background: #d35400;
        }
        .chunks-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .chunk-card {
            border: 1px solid #ecf0f1;
            border-radius: 8px;
            padding: 20px;
            background: #f9f9f9;
            transition: all 0.2s ease;
        }
        .chunk-card:hover {
            background: #e8f4f8;
            border-color: #3498db;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .chunk-title {
            color: #2c3e50;
            margin: 0 0 10px 0;
            font-size: 18px;
        }
        .chunk-info {
            color: #7f8c8d;
            margin: 5px 0;
            font-size: 14px;
        }
        .chunk-link {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
            transition: background 0.2s;
        }
        .chunk-link:hover {
            background: #2980b9;
        }
        .stats {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            text-align: center;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 20px;
            margin-top: 15px;
        }
        .stat-item {
            background: white;
            padding: 15px;
            border-radius: 5px;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            display: block;
        }
        .stat-label {
            color: #7f8c8d;
            font-size: 12px;
            text-transform: uppercase;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            color: #7f8c8d;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="document-title">${this.title}</h1>
        <p class="document-info">
            Automatisch generiert am ${new Date().toLocaleString('de-DE')}
        </p>
    </div>

    <div class="print-instructions">
        <h2>🖨️ Druckanleitung für vollständiges Dokument</h2>
        <p>Dieses Dokument wurde in <strong>${this.chunks.length + 1}</strong> separate HTML-Dateien aufgeteilt für optimales Drucken:</p>

        <ol class="print-steps">
            <li><strong>Inhaltsverzeichnis drucken:</strong> Beginne mit dem TOC (siehe unten)</li>
            <li><strong>Chunks nacheinander drucken:</strong> Jeder Chunk enthält ${this.chunkSize} Seiten mit korrekter Nummerierung</li>
            <li><strong>Zusammenheften:</strong> TOC + Teil 1 + Teil 2 + ... = Vollständiges Dokument</li>
            <li><strong>Ergebnis:</strong> Professionelles Dokument mit durchgängiger Seitennummerierung</li>
        </ol>
    </div>

    <div class="toc-section">
        <h2>📖 Inhaltsverzeichnis</h2>
        <p>Das <strong>globale Inhaltsverzeichnis</strong> zeigt alle ${this.totalPages} Abschnitte mit korrekten Seitenzahlen und zeigt an, in welchem Druckteil sich jeder Abschnitt befindet.</p>
        <a href="${tocFile.fileName}" class="toc-link" target="_blank">
            📋 Inhaltsverzeichnis öffnen (${tocFile.size} KB)
        </a>
        <p style="margin-top: 15px; color: #d35400;"><strong>⚠️ Wichtig:</strong> Das TOC zuerst drucken und an den Anfang des Dokuments heften!</p>
    </div>

    <div class="stats">
        <h2>Dokument-Statistiken</h2>
        <div class="stats-grid">
            <div class="stat-item">
                <span class="stat-number">${this.totalPages}</span>
                <span class="stat-label">Seiten</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${this.chunks.length}</span>
                <span class="stat-label">Content-Teile</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${this.chunkSize}</span>
                <span class="stat-label">Seiten/Teil</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${totalSize}KB</span>
                <span class="stat-label">Gesamt</span>
            </div>
        </div>
    </div>

    <h2>📄 Content-Teile (Druckreihenfolge)</h2>
    <div class="chunks-grid">
        ${chunkFiles.map(chunkFile => `
            <div class="chunk-card">
                <h3 class="chunk-title">Teil ${chunkFile.chunk.number}</h3>
                <div class="chunk-info">📄 Seiten ${chunkFile.chunk.startPage} - ${chunkFile.chunk.endPage}</div>
                <div class="chunk-info">💾 ${chunkFile.size} KB</div>
                <div class="chunk-info">📝 ${chunkFile.chunk.pages.length} Abschnitte</div>
                <div class="chunk-info">🖨️ <strong>Drucken als ${chunkFile.chunk.number}. Teil</strong></div>
                <a href="${chunkFile.fileName}" class="chunk-link" target="_blank">
                    📖 Teil ${chunkFile.chunk.number} öffnen & drucken
                </a>
            </div>
        `).join('')}
    </div>

    <div class="footer">
        <p><strong>💡 Drucktipp:</strong> Jede HTML-Datei hat korrekte Seitennummerierung. Einfach nacheinander drucken und zusammenheften!</p>
        <p><strong>🔗 Browser-Tipp:</strong> Bei großen Dokumenten lädt jeder Teil schnell, da nur 50 Seiten pro Datei.</p>
    </div>
</body>
</html>`;

    const indexPath = path.join(outputDir, 'index.html');
    await fs.writeFile(indexPath, indexHTML, 'utf8');

    console.log(`   ✅ index.html erstellt`);
    return indexPath;
  }
}

module.exports = DocumentChunker;