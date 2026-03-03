import type { SlashCommandItem } from './SlashCommands.types';

function createTableHTML(rows: number, cols: number): string {
  const headCells = Array.from({ length: cols })
    .map(() => '<th><p><br></p></th>')
    .join('');
  const bodyRows = Array.from({ length: rows })
    .map(
      () =>
        `<tr>${Array.from({ length: cols })
          .map(() => '<td><p><br></p></td>')
          .join('')}</tr>`,
    )
    .join('');
  return `<table class=\"rte-table\"><thead><tr>${headCells}</tr></thead><tbody>${bodyRows}</tbody></table><p><br></p>`;
}

export function createDefaultItems(): SlashCommandItem[] {
  return [
    {
      id: 'paragraph',
      label: 'Paragraph',
      description: 'Switch to paragraph text',
      command: 'paragraph',
      keywords: ['text', 'normal', 'p'],
    },
    {
      id: 'h1',
      label: 'Heading 1',
      description: 'Large section heading',
      command: 'heading1',
      keywords: ['title', 'header', 'h1'],
    },
    {
      id: 'h2',
      label: 'Heading 2',
      description: 'Medium section heading',
      command: 'heading2',
      keywords: ['subtitle', 'header', 'h2'],
    },
    {
      id: 'h3',
      label: 'Heading 3',
      description: 'Small section heading',
      command: 'heading3',
      keywords: ['header', 'h3'],
    },
    {
      id: 'bulleted-list',
      label: 'Bulleted List',
      description: 'Create a bullet list',
      command: 'toggleBulletList',
      keywords: ['list', 'ul', 'bullet'],
    },
    {
      id: 'numbered-list',
      label: 'Numbered List',
      description: 'Create a numbered list',
      command: 'toggleOrderedList',
      keywords: ['list', 'ol', 'numbered'],
    },
    {
      id: 'blockquote',
      label: 'Blockquote',
      description: 'Insert a quote block',
      command: 'toggleBlockquote',
      keywords: ['quote', 'citation'],
    },
    {
      id: 'table-3x3',
      label: 'Table 3x3',
      description: 'Insert a 3 x 3 table',
      action: ({ insertHTML }) => insertHTML(createTableHTML(3, 3)),
      keywords: ['table', 'grid', 'rows', 'columns'],
    },
    {
      id: 'horizontal-rule',
      label: 'Divider',
      description: 'Insert a horizontal rule',
      command: 'insertHorizontalRule',
      keywords: ['hr', 'separator', 'line'],
    },
    {
      id: 'bold',
      label: 'Bold',
      description: 'Toggle bold formatting',
      command: 'toggleBold',
      keywords: ['strong', 'b'],
    },
    {
      id: 'italic',
      label: 'Italic',
      description: 'Toggle italic formatting',
      command: 'toggleItalic',
      keywords: ['emphasis', 'i'],
    },
    {
      id: 'underline',
      label: 'Underline',
      description: 'Toggle underline formatting',
      command: 'toggleUnderline',
      keywords: ['u'],
    },
    {
      id: 'strikethrough',
      label: 'Strikethrough',
      description: 'Toggle strikethrough formatting',
      command: 'toggleStrikethrough',
      keywords: ['strike', 's'],
    },
    {
      id: 'clear-formatting',
      label: 'Clear Formatting',
      description: 'Remove text formatting',
      command: 'clearFormatting',
      keywords: ['reset', 'plain'],
    },
  ];
}

