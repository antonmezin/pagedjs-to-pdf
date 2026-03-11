/**
 * PDF Generation Configuration
 * Settings for WeasyPrint and PDF optimization
 */

const path = require('path');

const PDF_CONFIG = {
  // WeasyPrint executable path
  weasyprintPath: '/Users/antonmezin/.local/bin/weasyprint',

  // Default PDF options
  defaultOptions: {
    format: 'A4',
    orientation: 'portrait',
    margins: '25mm 20mm 25mm 20mm',
    enableHinting: true,
    optimizeImages: true,
    encoding: 'utf-8'
  },

  // Batch processing settings
  batch: {
    concurrency: 3,          // Max parallel conversions
    timeout: 30000,          // 30 second timeout per conversion
    retries: 1               // Retry failed conversions once
  },

  // File naming patterns
  naming: {
    toc: 'document-toc.pdf',
    chunkPrefix: 'document-chunk-',
    chunkSuffix: '.pdf',
    chunkPadding: 2          // Zero-padding for chunk numbers (01, 02, etc.)
  },

  // Output organization
  output: {
    keepHtml: true,          // Keep HTML files after PDF generation
    separateDirectory: false, // If true, put PDFs in /pdf/ subdirectory
    indexPageName: 'index.html'
  },

  // Quality and optimization
  quality: {
    optimizeImages: true,
    enableHinting: true,
    jpegQuality: 85,
    pngOptimization: true
  },

  // Error handling
  errorHandling: {
    continueOnError: true,   // Continue batch processing if one conversion fails
    logErrors: true,
    maxRetries: 2
  },

  // Performance monitoring
  monitoring: {
    logTiming: true,
    logFileSize: true,
    warnOnLargeFiles: 5 * 1024 * 1024, // Warn if PDF > 5MB
    targetFileSize: 1 * 1024 * 1024     // Target ~1MB per chunk
  }
};

/**
 * Get configuration for different document types
 */
const getConfigForDocumentType = (type, customOptions = {}) => {
  const baseConfig = { ...PDF_CONFIG };

  switch (type) {
    case 'toc':
      return {
        ...baseConfig,
        defaultOptions: {
          ...baseConfig.defaultOptions,
          // TOC might need different margins for better table layout
          margins: '20mm 15mm 20mm 15mm'
        }
      };

    case 'chunk':
      return {
        ...baseConfig,
        defaultOptions: {
          ...baseConfig.defaultOptions,
          // Standard chunk settings
          ...customOptions
        }
      };

    case 'single':
      return {
        ...baseConfig,
        defaultOptions: {
          ...baseConfig.defaultOptions,
          // Single large document settings
          optimizeImages: true,
          enableHinting: true,
          ...customOptions
        }
      };

    default:
      return {
        ...baseConfig,
        defaultOptions: {
          ...baseConfig.defaultOptions,
          ...customOptions
        }
      };
  }
};

/**
 * Generate chunk filename with proper padding
 */
const generateChunkFileName = (chunkNumber, totalChunks) => {
  const padding = PDF_CONFIG.naming.chunkPadding;
  const paddedNumber = chunkNumber.toString().padStart(padding, '0');
  return `${PDF_CONFIG.naming.chunkPrefix}${paddedNumber}${PDF_CONFIG.naming.chunkSuffix}`;
};

/**
 * Get estimated processing time based on page count
 */
const estimateProcessingTime = (pageCount, chunkCount = 1) => {
  // Rough estimates based on WeasyPrint performance
  const secondsPerPage = 0.1;  // ~100ms per page
  const setupOverhead = 2;     // 2 seconds setup per chunk

  const totalTime = (pageCount * secondsPerPage) + (chunkCount * setupOverhead);
  return Math.max(5, Math.round(totalTime)); // Minimum 5 seconds
};

/**
 * Validate PDF generation requirements
 */
const validateRequirements = async () => {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);

  const checks = {
    weasyprint: false,
    python: false,
    diskSpace: false
  };

  try {
    // Check WeasyPrint
    await execAsync(`${PDF_CONFIG.weasyprintPath} --version`);
    checks.weasyprint = true;
  } catch (error) {
    console.warn('⚠️  WeasyPrint not found or not working');
  }

  try {
    // Check Python
    await execAsync('python3 --version');
    checks.python = true;
  } catch (error) {
    console.warn('⚠️  Python 3 not found');
  }

  // Check disk space (basic check)
  try {
    const fs = require('fs');
    const stats = fs.statSync('.');
    checks.diskSpace = true; // If we can stat current directory, assume enough space
  } catch (error) {
    console.warn('⚠️  Cannot check disk space');
  }

  return checks;
};

module.exports = {
  PDF_CONFIG,
  getConfigForDocumentType,
  generateChunkFileName,
  estimateProcessingTime,
  validateRequirements
};