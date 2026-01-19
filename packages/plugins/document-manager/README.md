# Document Manager Plugin

A Rich Text Editor plugin that provides comprehensive document import and export functionality.

## Features

- **📥 Word Import**: Import content from Microsoft Word (.docx) files
- **📄 Word Export**: Export editor content to Microsoft Word (.docx) format
- **📋 PDF Export**: Export editor content to PDF format

## Installation

```bash
npm install @rte-editor/document-manager
```

## Usage

### Basic Setup

```tsx
import React from 'react';
import { RichTextEditor } from '@rte-editor/react';
import {
  DocumentManagerPlugin,
  DocumentManagerProvider,
  // ... other plugins
} from '@rte-editor/plugins';

const plugins = [
  // ... other plugins
  DocumentManagerPlugin()
];

function App() {
  return (
    <RichTextEditor plugins={plugins} />
  );
}
```

### Using the Document Manager Hook

```tsx
import { useDocumentManager } from '@rte-editor/document-manager';

function MyComponent() {
  const { importFromWord, exportToWord, exportToPdf } = useDocumentManager();

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const htmlContent = await importFromWord(file);
          // Set content in your editor
          editor.setContent(htmlContent);
        } catch (error) {
          console.error('Import failed:', error);
        }
      }
    };
    input.click();
  };

  const handleExportWord = async () => {
    const htmlContent = editor.getContent();
    await exportToWord(htmlContent, 'my-document.docx');
  };

  const handleExportPdf = async () => {
    const htmlContent = editor.getContent();
    const editorElement = document.querySelector('[contenteditable]');
    await exportToPdf(htmlContent, 'my-document.pdf', editorElement);
  };

  return (
    <div>
      <button onClick={handleImport}>Import Word</button>
      <button onClick={handleExportWord}>Export Word</button>
      <button onClick={handleExportPdf}>Export PDF</button>
    </div>
  );
}
```

## API Reference

### DocumentManagerProvider

Context provider that supplies document management functionality.

```tsx
<DocumentManagerProvider>
  <YourEditorComponent />
</DocumentManagerProvider>
```

### useDocumentManager Hook

Returns functions for document import/export operations.

```tsx
const { importFromWord, exportToWord, exportToPdf } = useDocumentManager();
```

#### Methods

- `importFromWord(file: File): Promise<string>` - Imports content from a Word document
- `exportToWord(htmlContent: string, filename?: string): Promise<void>` - Exports to Word format
- `exportToPdf(htmlContent: string, filename?: string, element?: HTMLElement): Promise<void>` - Exports to PDF

### DocumentManagerPlugin

Plugin configuration for the toolbar.

```tsx
DocumentManagerPlugin(): Plugin
```

Adds three toolbar buttons:
- 📥 Import Word
- 📄 Export Word
- 📋 Export PDF

## Dependencies

This plugin requires the following dependencies:

- `mammoth`: For Word document import
- `docx`: For Word document export
- `jspdf`: For PDF generation
- `html2canvas`: For high-quality PDF rendering

## Supported Formats

### Word Import
- Microsoft Word (.docx) files
- Basic formatting (bold, italic, lists, tables)
- Images and media (limited support)

### Word Export
- Converts HTML content to DOCX format
- Preserves basic formatting
- Supports paragraphs, tables, and lists

### PDF Export
- High-quality PDF generation
- Supports complex layouts and styling
- Uses html2canvas for accurate rendering

## Limitations

- Word import: Complex formatting may not be perfectly preserved
- Word export: Advanced features like custom styles are not supported
- PDF export: Requires DOM element for best results

## Browser Support

- Modern browsers with File API support
- ES6+ compatible environments
- React 18+

## Contributing

Contributions are welcome! Please see the main project documentation for contribution guidelines.

## License

MIT License - see LICENSE file for details.
