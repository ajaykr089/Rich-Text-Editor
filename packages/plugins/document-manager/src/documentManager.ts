import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow } from 'docx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getApiUrl, getApiHeaders } from './constants';

/**
 * Standalone Document Manager utilities for import/export operations
 */

/**
 * Import content from Word document
 */
export async function importFromWord(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(new Error(`Failed to import Word document: ${error}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Export content to Word document
 */
export async function exportToWord(htmlContent: string, filename: string = 'document.docx'): Promise<void> {
  try {
    // Send request to configured API server for document processing
    const apiUrl = getApiUrl('exportWord');
    const headers = getApiHeaders();

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        htmlContent,
        filename
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to export document');
    }

    // Create blob from response and download
    const blob = await response.blob();
    downloadBlob(blob, filename);
  } catch (error) {
    throw new Error(`Failed to export to Word: ${error}`);
  }
}

/**
 * Export content to PDF
 */
export async function exportToPdf(
  htmlContent: string,
  filename: string = 'document.pdf',
  element?: HTMLElement
): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 20;

    if (element) {
      // Use html2canvas for better rendering of complex content
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    } else {
      // Fallback to basic text rendering
      const lines = htmlToPlainText(htmlContent).split('\n');
      let y = margin;

      lines.forEach((line) => {
        if (y > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin, y);
        y += 7; // Line height
      });
    }

    pdf.save(filename);
  } catch (error) {
    throw new Error(`Failed to export to PDF: ${error}`);
  }
}

/**
 * Convert HTML content to DOCX document
 */
function htmlToDocx(htmlContent: string): Document {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  const children: (Paragraph | Table)[] = [];

  // Process each child element
  Array.from(tempDiv.children).forEach((element) => {
    if (element.tagName === 'P') {
      children.push(createParagraphFromElement(element));
    } else if (element.tagName === 'TABLE') {
      children.push(createTableFromElement(element));
    } else if (element.tagName === 'UL' || element.tagName === 'OL') {
      // Handle lists
      children.push(...createListFromElement(element));
    } else {
      // Default to paragraph
      children.push(createParagraphFromElement(element));
    }
  });

  return new Document({
    sections: [{
      properties: {},
      children
    }]
  });
}

/**
 * Create a paragraph from HTML element
 */
function createParagraphFromElement(element: Element): Paragraph {
  const textContent = element.textContent || '';
  const isBold = element.querySelector('strong, b') !== null;
  const isItalic = element.querySelector('em, i') !== null;

  return new Paragraph({
    children: [
      new TextRun({
        text: textContent,
        bold: isBold,
        italics: isItalic
      })
    ]
  });
}

/**
 * Create a table from HTML table element
 */
function createTableFromElement(tableElement: Element): Table {
  const rows: TableRow[] = [];
  const htmlRows = tableElement.querySelectorAll('tr');

  htmlRows.forEach((htmlRow) => {
    const cells: TableCell[] = [];
    const htmlCells = htmlRow.querySelectorAll('td, th');

    htmlCells.forEach((htmlCell) => {
      cells.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: htmlCell.textContent || ''
                })
              ]
            })
          ]
        })
      );
    });

    rows.push(new TableRow({ children: cells }));
  });

  return new Table({
    rows
  });
}

/**
 * Create list items from HTML list element
 */
function createListFromElement(listElement: Element): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const items = listElement.querySelectorAll('li');

  items.forEach((item) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `• ${item.textContent || ''}`
          })
        ],
        indent: { left: 720 } // 0.5 inch indent
      })
    );
  });

  return paragraphs;
}

/**
 * Convert HTML to plain text for PDF fallback
 */
function htmlToPlainText(htmlContent: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  return tempDiv.textContent || tempDiv.innerText || '';
}

/**
 * Download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
