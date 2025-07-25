import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Prepares HTML content for PDF generation by ensuring proper styling
 */
export function preparePdfContent(htmlContent: string): string {
  // Enhanced CSS for better PDF rendering
  const pdfStyles = `
    <style>
      body {
        font-family: 'Arial', 'Helvetica', sans-serif;
        font-size: 12px;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 20px;
        background: white;
      }
      h1, h2, h3, h4, h5, h6 {
        color: #2c3e50;
        margin-top: 20px;
        margin-bottom: 10px;
        page-break-after: avoid;
      }
      h1 { font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
      h2 { font-size: 18px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
      h3 { font-size: 16px; }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
        page-break-inside: avoid;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px 12px;
        text-align: left;
        vertical-align: top;
      }
      th {
        background-color: #f8f9fa;
        font-weight: bold;
        color: #2c3e50;
      }
      tr:nth-child(even) {
        background-color: #f8f9fa;
      }
      p {
        margin: 10px 0;
        text-align: justify;
      }
      ul, ol {
        padding-left: 20px;
        margin: 10px 0;
      }
      li {
        margin: 5px 0;
      }
      .recommendation {
        background-color: #e8f5e8;
        border-left: 4px solid #27ae60;
        padding: 15px;
        margin: 15px 0;
        border-radius: 4px;
      }
      .summary-box {
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        padding: 15px;
        margin: 15px 0;
        border-radius: 4px;
      }
      .highlight {
        background-color: #fff3cd;
        padding: 2px 4px;
        border-radius: 2px;
      }
      @page {
        margin: 0.5in;
        size: letter;
      }
      .page-break {
        page-break-before: always;
      }
      .no-break {
        page-break-inside: avoid;
      }
    </style>
  `;

  // Check if HTML already has a head section
  if (htmlContent.includes('<head>')) {
    // Insert enhanced styles into existing head section
    return htmlContent.replace(
      /<head>/i,
      `<head>\n${pdfStyles}`
    );
  } else if (htmlContent.includes('<html>')) {
    // Add head section with styles after html tag
    return htmlContent.replace(
      /<html>/i,
      `<html>\n<head>\n${pdfStyles}\n</head>`
    );
  } else {
    // Wrap content in full HTML structure
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Laporan Harian Warteg</title>
        ${pdfStyles}
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
  }
}
