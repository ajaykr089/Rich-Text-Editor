import React from 'react';
import {
  Plugin,
  Command,
  EditorState,
  NodeType,
  Fragment
} from '@rte-editor/core';

/**
 * Supported programming languages for syntax highlighting.
 */
export const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'php',
  'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'html', 'css',
  'scss', 'sass', 'less', 'json', 'xml', 'yaml', 'markdown', 'sql',
  'bash', 'shell', 'powershell', 'dockerfile', 'makefile', 'nginx',
  'apache', 'htaccess'
];

/**
 * Code block plugin for rich text editor.
 * Provides syntax-highlighted code blocks with language selection and copy functionality.
 */
export class CodeBlockPlugin extends Plugin {
  constructor() {
    super({
      name: 'codeblock',
      schema: {
        nodes: {
          code_block: {
            content: 'text*',
            marks: '',
            group: 'block',
            code: true,
            defining: true,
            attrs: {
              language: { default: '' },
              filename: { default: '' }
            },
            parseDOM: [{
              tag: 'pre',
              preserveWhitespace: 'full',
              getAttrs: (node: HTMLElement) => ({
                language: node.getAttribute('data-language') || '',
                filename: node.getAttribute('data-filename') || ''
              })
            }],
            toDOM: (node) => [
              'pre',
              {
                'data-language': node.attrs.language,
                'data-filename': node.attrs.filename,
                class: 'rte-code-block'
              },
              ['code', { class: `language-${node.attrs.language}` }, 0]
            ]
          }
        }
      },
      commands: {
        insertCodeBlock: (language?: string, filename?: string) => insertCodeBlockCommand(language, filename),
        setLanguage: (language: string) => setLanguageCommand(language),
        copyCodeBlock: () => copyCodeBlockCommand()
      },
      toolbar: {
        items: [{
          id: 'insert-code-block',
          icon: '</>', // Code symbol
          label: 'Code Block',
          command: 'insertCodeBlock'
        }]
      },
      keybindings: {
        'Mod-Alt-C': 'insertCodeBlock', // Ctrl+Alt+C
        'Mod-Shift-C': 'insertCodeBlock' // Ctrl+Shift+C
      },
      nodeViews: {
        code_block: CodeBlockNodeView
      }
    });
  }
}

/**
 * Insert code block command.
 */
function insertCodeBlockCommand(language: string = '', filename: string = ''): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const codeBlockType = state.schema.nodes.code_block;

    if (!codeBlockType) {
      return false;
    }

    if (dispatch) {
      const { from, to } = state.selection;
      const selectedText = state.doc.textBetween(from, to, '\n');

      const codeBlock = codeBlockType.create(
        { language, filename },
        selectedText ? state.schema.text(selectedText) : undefined
      );

      const tr = state.tr;
      tr.replaceSelectionWith(codeBlock);

      // If no text was selected, position cursor inside the code block
      if (!selectedText) {
        const resolvedPos = tr.doc.resolve(tr.selection.from + 1);
        tr.setSelection(state.schema.nodes.text ? resolvedPos : tr.selection);
      }

      dispatch(tr);
    }

    return true;
  };
}

/**
 * Set language for current code block.
 */
function setLanguageCommand(language: string): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const { $from } = state.selection;
    let codeBlockFound = false;

    // Find the code block containing the current position
    state.doc.nodesBetween($from.pos, $from.pos, (node, pos) => {
      if (node.type.name === 'code_block') {
        if (dispatch) {
          const tr = state.tr;
          tr.setNodeMarkup(pos, null, { ...node.attrs, language });
          dispatch(tr);
        }
        codeBlockFound = true;
        return false;
      }
      return true;
    });

    return codeBlockFound;
  };
}

/**
 * Copy code block content to clipboard.
 */
function copyCodeBlockCommand(): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const { $from } = state.selection;
    let codeContent = '';

    state.doc.nodesBetween($from.pos, $from.pos, (node) => {
      if (node.type.name === 'code_block') {
        codeContent = node.textContent;
        return false;
      }
      return true;
    });

    if (codeContent) {
      navigator.clipboard.writeText(codeContent).catch(err => {
        console.error('Failed to copy code:', err);
      });
      return true;
    }

    return false;
  };
}

/**
 * Custom node view for code block rendering with syntax highlighting and controls.
 */
const CodeBlockNodeView: any = (node: any, view: any, getPos: () => number) => {
  const dom = document.createElement('div');
  dom.className = 'rte-code-block-wrapper';

  const pre = document.createElement('pre');
  pre.className = 'rte-code-block';
  pre.setAttribute('data-language', node.attrs.language || '');

  const code = document.createElement('code');
  code.className = `language-${node.attrs.language || 'text'}`;
  code.textContent = node.textContent;

  pre.appendChild(code);

  // Header with language and controls
  const header = document.createElement('div');
  header.className = 'rte-code-block-header';

  const languageLabel = document.createElement('span');
  languageLabel.className = 'rte-code-language';
  languageLabel.textContent = node.attrs.language || 'text';

  const controls = document.createElement('div');
  controls.className = 'rte-code-controls';

  const copyButton = document.createElement('button');
  copyButton.className = 'rte-code-copy';
  copyButton.textContent = '📋 Copy';
  copyButton.title = 'Copy code';

  const languageSelect = document.createElement('select');
  languageSelect.className = 'rte-code-language-select';

  // Add language options
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select language...';
  languageSelect.appendChild(defaultOption);

  SUPPORTED_LANGUAGES.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang;
    if (lang === node.attrs.language) {
      option.selected = true;
    }
    languageSelect.appendChild(option);
  });

  controls.appendChild(languageSelect);
  controls.appendChild(copyButton);

  header.appendChild(languageLabel);
  header.appendChild(controls);

  dom.appendChild(header);
  dom.appendChild(pre);

  // Event handlers
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(node.textContent).then(() => {
      copyButton.textContent = '✅ Copied!';
      setTimeout(() => {
        copyButton.textContent = '📋 Copy';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  });

  languageSelect.addEventListener('change', (e) => {
    const newLanguage = (e.target as HTMLSelectElement).value;
    const tr = view.state.tr;
    tr.setNodeMarkup(getPos(), null, { ...node.attrs, language: newLanguage });
    view.dispatch(tr);

    languageLabel.textContent = newLanguage || 'text';
    code.className = `language-${newLanguage || 'text'}`;
  });

  return {
    dom,
    contentDOM: code,
    update: (node: any) => {
      // Update content and attributes
      code.textContent = node.textContent;
      pre.setAttribute('data-language', node.attrs.language || '');
      code.className = `language-${node.attrs.language || 'text'}`;
      languageLabel.textContent = node.attrs.language || 'text';

      // Update select value
      languageSelect.value = node.attrs.language || '';

      return true;
    },
    destroy: () => {
      // Cleanup
    }
  };
};

/**
 * Create a code block plugin instance.
 */
export function createCodeBlockPlugin(): CodeBlockPlugin {
  return new CodeBlockPlugin();
}