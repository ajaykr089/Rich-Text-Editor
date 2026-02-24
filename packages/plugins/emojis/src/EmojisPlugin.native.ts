import type { Plugin } from '@editora/core';
import { emojisSets, descriptions, type EmojiCategory } from './Constants';

/**
 * EmojisPlugin - Native implementation for emoji insertion
 * 
 * Features:
 * - Full-featured emoji picker dialog
 * - Categorized emojis (All, Symbols, People, Animals & Nature, Food & Drink, Activity, Travel & Places, Objects, Flags)
 * - Search/filter emojis by name or description
 * - Click to insert
 * - Responsive design
 * - Keyboard shortcut (Mod-Shift-j)
 * 
 * Commands:
 * - openEmojiDialog: Opens the emoji picker dialog
 * - insertEmoji: Inserts a specific emoji
 * 
 * UI/UX Features:
 * - Vertical tabs for categories (or horizontal on mobile)
 * - Search input with real-time filtering
 * - Grid layout with hover effects
 * - No results message when search returns empty
 * - Professional styling matching React design system
 */

let dialogElement: HTMLElement | null = null;
let activeTab: EmojiCategory = 'all';
let searchQuery = '';
// Store the selection range before opening the dialog
let savedSelectionRange: Range | null = null;
const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark';

export const EmojisPlugin = (): Plugin => {
  return {
    name: "emojis",

    toolbar: [
      {
        label: "Insert Emoji",
        command: "openEmojiDialog",
        icon: '<svg width="24" height="24" focusable="false"><path d="M9 11c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm6 0c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm-3 5.5c2.1 0 4-1.5 4.4-3.5H7.6c.5 2 2.3 3.5 4.4 3.5ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" fill-rule="nonzero"></path></svg>',
        shortcut: "Mod-Shift-j",
        type: "button",
      },
    ],

    commands: {
      openEmojiDialog: (_args, context) => {
        // Try to get the correct editor content element from context
        const editorContent = context?.contentElement || getActiveEditorContent();
        if (editorContent) {
          createEmojiDialog(editorContent);
          return true;
        }
        return false;
      },

      insertEmoji: (emoji?: string, context?) => {
        if (!emoji) return false;
        const editorContent = context?.contentElement || getActiveEditorContent();
        if (!editorContent) return false;
        try {
          insertEmoji(emoji, editorContent);
          return true;
        } catch (error) {
          // No console log in production
          return false;
        }
      },
    },

    keymap: {
      "Mod-Shift-j": "openEmojiDialog",
    },
  };
};

function createEmojiDialog(editorContent: HTMLElement): void {
  activeTab = 'all';
  searchQuery = '';

  // Save the current selection range before opening the dialog
  const selection = window.getSelection();
  savedSelectionRange = null;
  if (selection && selection.rangeCount > 0 && editorContent.contains(selection.anchorNode)) {
    savedSelectionRange = selection.getRangeAt(0).cloneRange();
  }

  const overlay = document.createElement('div');
  overlay.className = 'emojis-overlay';
  if (isDarkThemeContext(editorContent)) {
    overlay.classList.add('rte-ui-theme-dark');
  }
  overlay.onclick = closeDialog;

  const dialog = document.createElement('div');
  dialog.className = 'emojis-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.onclick = (e) => e.stopPropagation();

  const categories = Object.keys(emojisSets) as EmojiCategory[];

  dialog.innerHTML = `
    <div class="rte-dialog-header emojis-header">
      <h3>Insert Emojis</h3>
      <button class="rte-dialog-close emojis-close">×</button>
    </div>
    <div class="rte-dialog-body emojis-content">
      <div class="emojis-tabs">
        ${categories.map(category => `
          <button class="emojis-tab ${category === activeTab ? 'active' : ''}" data-category="${category}">
            ${emojisSets[category].name}
          </button>
        `).join('')}
      </div>
      <div class="emojis-main-content">
        <div class="emojis-search">
          <svg class="emojis-search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search emojis..." 
            class="emojis-search-input"
            id="emoji-search-input"
          />
        </div>
        <div class="emojis-grid" id="emojis-grid">
          ${renderEmojiGrid(activeTab, searchQuery)}
        </div>
      </div>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  dialogElement = overlay;

  // Add event listeners
  setupEmojiDialogEventListeners(dialog, editorContent);

  injectEmojiDialogStyles();

  setTimeout(() => {
    (dialog.querySelector('#emoji-search-input') as HTMLInputElement)?.focus();
  }, 100);
}

function setupEmojiDialogEventListeners(dialog: HTMLElement, editorContent: HTMLElement): void {
  dialog.querySelector('.emojis-close')?.addEventListener('click', closeDialog);

  dialog.querySelectorAll('.emojis-tab').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const category = (e.target as HTMLElement).getAttribute('data-category') as EmojiCategory;
      if (category) switchEmojiTab(dialog, category, editorContent);
    });
  });

  const searchInput = dialog.querySelector('#emoji-search-input') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    updateEmojiGrid(dialog, editorContent);
  });

  // Initial emoji click handlers
  updateEmojiGrid(dialog, editorContent);
}

function switchEmojiTab(dialog: HTMLElement, category: EmojiCategory, editorContent: HTMLElement): void {
  activeTab = category;
  dialog.querySelectorAll('.emojis-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === category);
  });
  updateEmojiGrid(dialog, editorContent);
}

function updateEmojiGrid(dialog: HTMLElement, editorContent: HTMLElement): void {
  const grid = dialog.querySelector('#emojis-grid');
  if (grid) {
    grid.innerHTML = renderEmojiGrid(activeTab, searchQuery);
    grid.querySelectorAll('.emojis-item').forEach((item) => {
      item.addEventListener('click', () => {
        const emoji = item.textContent?.trim() || '';
        if (emoji) {
          insertEmoji(emoji, editorContent);
          closeDialog();
        }
      });
    });
  }
}

function renderEmojiGrid(category: EmojiCategory, search: string): string {
  let emojis = emojisSets[category].emojis;

  // Filter by search query
  if (search.trim()) {
    emojis = emojis.filter(emoji => {
      // Search by emoji itself
      if (emoji.toLowerCase().includes(search.toLowerCase())) {
        return true;
      }

      // Search by Unicode name/description
      const description = descriptions[emoji] || '';
      return description.toLowerCase().includes(search.toLowerCase());
    });
  }

  if (emojis.length === 0 && search.trim()) {
    return `<div class="emojis-no-results">No emojis found for "${search}"</div>`;
  }

  return emojis.map((emoji, index) => `
    <button 
      class="emojis-item" 
      title="Insert ${emoji}"
      data-emoji="${emoji}"
    >
      ${emoji}
    </button>
  `).join('');
}

function closeDialog(): void {
  if (dialogElement) {
    document.body.removeChild(dialogElement);
    dialogElement = null;
  }
}

// Helper function to insert emoji at cursor
function insertEmoji(emoji: string, editorContent: HTMLElement): void {
  editorContent.focus();
  let selection = window.getSelection();
  // Restore the saved selection range if available
  if (savedSelectionRange) {
    selection?.removeAllRanges();
    selection?.addRange(savedSelectionRange);
    savedSelectionRange = null;
  }
  selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(emoji);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
// Helper to get the currently focused editor content element (fallback)
function getActiveEditorContent(): HTMLElement | null {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const anchor = selection.anchorNode;
    const anchorElement = anchor instanceof HTMLElement ? anchor : anchor?.parentElement;
    const fromSelection = anchorElement?.closest('.editora-content, .rte-content') as HTMLElement | null;
    if (fromSelection) return fromSelection;
  }

  // Try to find the focused .editora-content or .rte-content
  const active = document.activeElement as HTMLElement | null;
  if (active && (active.classList.contains('editora-content') || active.classList.contains('rte-content'))) {
    return active;
  }
  // Fallback: first editor content in DOM
  return document.querySelector('.editora-content, .rte-content') as HTMLElement | null;
}

function isDarkThemeContext(editorContent?: HTMLElement | null): boolean {
  const source = editorContent || getActiveEditorContent();
  if (!source) return false;
  return Boolean(source.closest(DARK_THEME_SELECTOR));
}

function injectEmojiDialogStyles(): void {
  if (document.getElementById('emojis-dialog-styles')) return;

  const style = document.createElement('style');
  style.id = 'emojis-dialog-styles';
  style.textContent = `
    .emojis-overlay {
      --rte-emoji-overlay-bg: rgba(15, 23, 36, 0.56);
      --rte-emoji-dialog-bg: #ffffff;
      --rte-emoji-dialog-text: #101828;
      --rte-emoji-border: #d6dbe4;
      --rte-emoji-subtle-bg: #f7f9fc;
      --rte-emoji-subtle-hover: #eef2f7;
      --rte-emoji-muted-text: #5f6b7d;
      --rte-emoji-accent: #1f75fe;
      --rte-emoji-accent-strong: #165fd6;
      --rte-emoji-ring: rgba(31, 117, 254, 0.18);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--rte-emoji-overlay-bg);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
      box-sizing: border-box;
    }

    .emojis-overlay.rte-ui-theme-dark {
      --rte-emoji-overlay-bg: rgba(2, 8, 20, 0.72);
      --rte-emoji-dialog-bg: #202938;
      --rte-emoji-dialog-text: #e8effc;
      --rte-emoji-border: #49566c;
      --rte-emoji-subtle-bg: #2a3444;
      --rte-emoji-subtle-hover: #344256;
      --rte-emoji-muted-text: #a5b1c5;
      --rte-emoji-accent: #58a6ff;
      --rte-emoji-accent-strong: #4598f4;
      --rte-emoji-ring: rgba(88, 166, 255, 0.22);
    }

    .emojis-dialog {
      background: var(--rte-emoji-dialog-bg);
      color: var(--rte-emoji-dialog-text);
      border: 1px solid var(--rte-emoji-border);
      border-radius: 12px;
      box-shadow: 0 24px 48px rgba(10, 15, 24, 0.28);
      max-width: 800px;
      width: 90%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .emojis-header {
      border-bottom: 1px solid var(--rte-emoji-border);
      background: linear-gradient(180deg, rgba(127, 154, 195, 0.08) 0%, rgba(127, 154, 195, 0) 100%);
    }

    .emojis-header h3 {
      color: var(--rte-emoji-dialog-text);
    }

    .emojis-close {
      color: var(--rte-emoji-muted-text);
      border-radius: 8px;
      transition: background-color 0.16s ease, color 0.16s ease;
    }

    .emojis-close:hover {
      background-color: var(--rte-emoji-subtle-hover);
      color: var(--rte-emoji-dialog-text);
    }

    .emojis-content {
      display: flex;
      flex: 1;
      overflow: hidden;
      padding: 0;
    }

    .emojis-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .emojis-search {
      padding: 16px 16px 0 16px;
      position: relative;
    }

    .emojis-search-icon {
      position: absolute;
      left: 28px;
      top: 27px;
      color: var(--rte-emoji-muted-text);
      pointer-events: none;
      z-index: 1;
    }

    .emojis-search-input {
      width: calc(100% - 24px);
      padding: 10px 12px 10px 40px;
      border: 1px solid var(--rte-emoji-border);
      border-radius: 8px;
      font-size: 14px;
      color: var(--rte-emoji-dialog-text);
      background-color: var(--rte-emoji-subtle-bg);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .emojis-search-input:focus {
      outline: none;
      border-color: var(--rte-emoji-accent);
      box-shadow: 0 0 0 3px var(--rte-emoji-ring);
    }

    .emojis-search:focus-within .emojis-search-icon {
      color: var(--rte-emoji-accent);
    }

    .emojis-search-input::placeholder {
      color: var(--rte-emoji-muted-text);
    }

    .emojis-tabs {
      display: flex;
      flex-direction: column;
      width: 180px;
      border-right: 1px solid var(--rte-emoji-border);
      background-color: var(--rte-emoji-subtle-bg);
    }

    .emojis-tab {
      padding: 12px 16px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
      color: var(--rte-emoji-muted-text);
      border-bottom: 1px solid var(--rte-emoji-border);
      transition: all 0.2s ease;
    }

    .emojis-tab:hover {
      background-color: var(--rte-emoji-subtle-hover);
      color: var(--rte-emoji-dialog-text);
    }

    .emojis-tab.active {
      background-color: var(--rte-emoji-accent);
      color: #fff;
      font-weight: 500;
    }

    .emojis-tab.active:hover {
      background-color: var(--rte-emoji-accent-strong);
    }

    .emojis-grid {
      padding: 16px;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
      gap: 8px;
    }

    .emojis-item {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--rte-emoji-border);
      background: var(--rte-emoji-subtle-bg);
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.2s ease;
      color: var(--rte-emoji-dialog-text);
    }

    .emojis-item:hover {
      background-color: var(--rte-emoji-accent);
      border-color: var(--rte-emoji-accent);
      color: #fff;
      transform: scale(1.05);
    }

    .emojis-item:active {
      transform: scale(0.95);
    }

    .emojis-no-results {
      grid-column: 1 / -1;
      text-align: center;
      color: var(--rte-emoji-muted-text);
      font-size: 14px;
      padding: 40px 20px;
      background-color: var(--rte-emoji-subtle-bg);
      border-radius: 8px;
      border: 1px solid var(--rte-emoji-border);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .emojis-dialog {
        width: 95%;
        max-height: 90vh;
      }

      .emojis-content {
        flex-direction: column;
      }

      .emojis-tabs {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--rte-emoji-border);
        flex-direction: row;
        overflow-x: auto;
      }

      .emojis-tab {
        border-bottom: none;
        border-right: 1px solid var(--rte-emoji-border);
        white-space: nowrap;
        min-width: 80px;
      }

      .emojis-grid {
        grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
        gap: 6px;
      }

      .emojis-item {
        width: 36px;
        height: 36px;
        font-size: 16px;
      }
    }
  `;
  
  document.head.appendChild(style);
}
