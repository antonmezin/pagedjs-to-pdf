const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

/**
 * WeasyPrint Node.js Wrapper
 * Provides interface to convert HTML files to PDF using WeasyPrint
 */
class WeasyPrintWrapper {
  constructor(options = {}) {
    this.weasyprintPath = options.weasyprintPath || '/Users/antonmezin/.local/bin/weasyprint';
    this.defaultOptions = {
      format: 'A4',
      orientation: 'portrait',
      margins: '25mm 20mm 25mm 20mm',
      enableHinting: true,
      optimizeImages: true,
      ...options
    };
  }

  /**
   * Check if WeasyPrint is available
   */
  async checkWeasyPrintAvailable() {
    return new Promise((resolve, reject) => {
      exec(`${this.weasyprintPath} --version`, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`WeasyPrint not available: ${error.message}`));
        } else {
          const version = stdout.trim();
          console.log(`✅ WeasyPrint available: ${version}`);
          resolve(version);
        }
      });
    });
  }

  /**
   * Convert HTML file to PDF
   * @param {string} htmlFilePath - Path to input HTML file
   * @param {string} pdfFilePath - Path to output PDF file
   * @param {object} options - WeasyPrint options
   * @returns {Promise<object>} - Result object with file info
   */
  async convertToPDF(htmlFilePath, pdfFilePath, options = {}) {
    const startTime = Date.now();

    // Validate input file exists
    if (!await fs.pathExists(htmlFilePath)) {
      throw new Error(`Input HTML file not found: ${htmlFilePath}`);
    }

    // Ensure output directory exists
    await fs.ensureDir(path.dirname(pdfFilePath));

    // Build WeasyPrint command arguments
    const args = [
      htmlFilePath,
      pdfFilePath
    ];

    // Add optional arguments
    const mergedOptions = { ...this.defaultOptions, ...options };

    if (mergedOptions.baseUrl) {
      args.push('--base-url', mergedOptions.baseUrl);
    }

    if (mergedOptions.encoding) {
      args.push('--encoding', mergedOptions.encoding);
    }

    if (mergedOptions.optimizeImages) {
      args.push('--optimize-images');
    }

    if (mergedOptions.enableHinting) {
      args.push('--hinting');
    }

    if (mergedOptions.jpegQuality) {
      args.push('-j', mergedOptions.jpegQuality.toString());
    }

    console.log(`🔄 Converting: ${path.basename(htmlFilePath)} → ${path.basename(pdfFilePath)}`);

    return new Promise((resolve, reject) => {
      const process = spawn(this.weasyprintPath, args);

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', async (code) => {
        const duration = Date.now() - startTime;

        if (code === 0) {
          // Success - check if PDF was created
          try {
            const stats = await fs.stat(pdfFilePath);
            const fileSizeKB = Math.round(stats.size / 1024);
            const fileSizeMB = Math.round(stats.size / 1024 / 1024 * 10) / 10;

            const result = {
              success: true,
              htmlFile: htmlFilePath,
              pdfFile: pdfFilePath,
              fileSize: stats.size,
              fileSizeKB,
              fileSizeMB,
              duration,
              stdout: stdout.trim(),
              stderr: stderr.trim()
            };

            console.log(`   ✅ ${path.basename(pdfFilePath)} (${fileSizeKB} KB, ${duration}ms)`);
            resolve(result);

          } catch (statError) {
            reject(new Error(`PDF generated but couldn't stat file: ${statError.message}`));
          }

        } else {
          // Error
          const error = new Error(`WeasyPrint failed with code ${code}`);
          error.code = code;
          error.stdout = stdout;
          error.stderr = stderr;
          error.duration = duration;

          console.error(`   ❌ Failed: ${path.basename(htmlFilePath)} (code ${code})`);
          if (stderr) console.error(`   Error: ${stderr}`);

          reject(error);
        }
      });

      process.on('error', (error) => {
        console.error(`   ❌ Process error: ${error.message}`);
        reject(error);
      });
    });
  }

  /**
   * Convert multiple HTML files to PDF in parallel
   * @param {Array} conversions - Array of {html, pdf} objects
   * @param {object} options - Global options for all conversions
   * @param {number} concurrency - Maximum concurrent conversions
   * @returns {Promise<Array>} - Array of results
   */
  async convertMultipleToPDF(conversions, options = {}, concurrency = 3) {
    console.log(`🔨 Starting batch PDF conversion: ${conversions.length} files (concurrency: ${concurrency})`);

    const results = [];
    const errors = [];

    // Process conversions in batches
    for (let i = 0; i < conversions.length; i += concurrency) {
      const batch = conversions.slice(i, i + concurrency);

      console.log(`📄 Processing batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(conversions.length / concurrency)}`);

      const batchPromises = batch.map(async (conversion) => {
        try {
          const result = await this.convertToPDF(conversion.html, conversion.pdf, options);
          results.push(result);
          return result;
        } catch (error) {
          console.error(`❌ Batch error for ${conversion.html}:`, error.message);
          errors.push({ conversion, error });
          return null;
        }
      });

      await Promise.all(batchPromises);
    }

    console.log(`📊 Batch conversion complete: ${results.length} success, ${errors.length} errors`);

    return {
      successful: results,
      failed: errors,
      totalProcessed: conversions.length,
      successCount: results.length,
      errorCount: errors.length
    };
  }

  /**
   * Clean up temporary files
   * @param {Array<string>} filePaths - Files to clean up
   */
  async cleanup(filePaths) {
    for (const filePath of filePaths) {
      try {
        if (await fs.pathExists(filePath)) {
          await fs.remove(filePath);
          console.log(`🧹 Cleaned up: ${path.basename(filePath)}`);
        }
      } catch (error) {
        console.warn(`⚠️  Could not clean up ${filePath}: ${error.message}`);
      }
    }
  }

  /**
   * Get PDF file info
   * @param {string} pdfFilePath - Path to PDF file
   * @returns {Promise<object>} - File information
   */
  async getPDFInfo(pdfFilePath) {
    if (!await fs.pathExists(pdfFilePath)) {
      throw new Error(`PDF file not found: ${pdfFilePath}`);
    }

    const stats = await fs.stat(pdfFilePath);
    const fileSizeKB = Math.round(stats.size / 1024);
    const fileSizeMB = Math.round(stats.size / 1024 / 1024 * 10) / 10;

    return {
      filePath: pdfFilePath,
      fileName: path.basename(pdfFilePath),
      fileSize: stats.size,
      fileSizeKB,
      fileSizeMB,
      created: stats.birthtime,
      modified: stats.mtime
    };
  }
}

module.exports = WeasyPrintWrapper;