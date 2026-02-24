import type { Plugin } from '@editora/core';

/**
 * SpecialCharactersPlugin - Native implementation
 * 
 * Features:
 * - Dialog with 8 categorized tabs (All, Currency, Text, Quotation, Mathematical, Extended Latin, Symbols, Arrows)
 * - Search/filter characters by name or symbol
 * - Grid display with hover effects
 * - Click to insert at cursor
 * - Responsive design
 * - Complete character sets with descriptions
 */

type CharacterCategory =
  | "all"
  | "currency"
  | "text"
  | "quotation"
  | "mathematical"
  | "extended-latin"
  | "symbols"
  | "arrows";

const characterSets: Record<
  CharacterCategory,
  { name: string; characters: string[] }
> = {
  all: {
    name: "All",
    characters: [
      "€", "£", "¥", "¢", "₹", "₽", "₩", "₿", "₺", "₴", "₦", "₨", "₪", "₫", "₭", "₮", "₯", "₰", "₱", "₲", "₳", "₴", "₵", "₶", "₷", "₹", "₺", "₼", "₽", "₾", "₿",
      '"', "'", "«", "»", "„", "‟", "‹", "›", "‚", "‛", "〝", "〞", "〟", "‟", "„",
      "©", "®", "™", "°", "§", "¶", "†", "‡", "•", "‣", "⁃", "‰", "‱", "′", "″", "‴", "‵", "‶", "‷", "※", "‼", "‽", "‾", "‿", "⁀", "⁁", "⁂", "⁃", "⁇", "⁈", "⁉",
      "+", "-", "×", "÷", "=", "≠", "≈", "≡", "≤", "≥", "<", ">", "±", "∓", "∴", "∵", "∶", "∷", "∸", "∹", "∺", "∻", "∼", "∽", "∾", "∿", "≀", "≁", "≂", "≃", "≄", "≅", "≆", "≇", "≈", "≉", "≊", "≋", "≌", "≍", "≎", "≏", "≐", "≑", "≒", "≓", "≔", "≕", "≖", "≗", "≘", "≙", "≚", "≛", "≜", "≝", "≞", "≟", "≠", "≡", "≢", "≣", "≤", "≥", "≦", "≧", "≨", "≩", "≪", "≫", "≬", "≭", "≮", "≯", "≰", "≱", "≲", "≳", "≴", "≵", "≶", "≷", "≸", "≹", "≺", "≻", "≼", "≽", "≾", "≿",
      "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ",
      "¡", "¿", "‽", "‼", "⁇", "⁈", "⁉", "※", "‾", "‿", "⁀", "⁁", "⁂", "⁃",
      "←", "↑", "→", "↓", "↔", "↕", "↖", "↗", "↘", "↙", "↚", "↛", "↜", "↝", "↞", "↟", "↠", "↡", "↢", "↣", "↤", "↥", "↦", "↧", "↨", "↩", "↪", "↫", "↬", "↭", "↮", "↯", "↰", "↱", "↲", "↳", "↴", "↵", "↶", "↷", "↸", "↹", "↺", "↻", "↼", "↽", "↾", "↿", "⇀", "⇁", "⇂", "⇃", "⇄", "⇅", "⇆", "⇇", "⇈", "⇉", "⇊", "⇋", "⇌", "⇍", "⇎", "⇏", "⇐", "⇑", "⇒", "⇓", "⇔", "⇕", "⇖", "⇗", "⇘", "⇙", "⇚", "⇛", "⇜", "⇝", "⇞", "⇟", "⇠", "⇡", "⇢", "⇣", "⇤", "⇥", "⇦", "⇧", "⇨", "⇩", "⇪", "⇫", "⇬", "⇭", "⇮", "⇯", "⇰", "⇱", "⇲", "⇳", "⇴", "⇵", "⇶", "⇷", "⇸", "⇹", "⇺", "⇻", "⇼", "⇽", "⇾", "⇿",
    ],
  },
  currency: {
    name: "Currency",
    characters: ["€", "£", "¥", "¢", "₹", "₽", "₩", "₿", "₺", "₴", "₦", "₨", "₪", "₫", "₭", "₮", "₯", "₰", "₱", "₲", "₳", "₵", "₶", "₷", "₼", "₾", "₿"],
  },
  text: {
    name: "Text",
    characters: ["©", "®", "™", "°", "§", "¶", "†", "‡", "•", "‣", "⁃", "‰", "‱", "′", "″", "‴", "‵", "‶", "‷", "※", "‼", "‽", "‾", "‿", "⁀", "⁁", "⁂"],
  },
  quotation: {
    name: "Quotation",
    characters: ['"', "'", "«", "»", "„", "‟", "‹", "›", "‚", "‛", "〝", "〞", "〟"],
  },
  mathematical: {
    name: "Mathematical",
    characters: ["+", "-", "×", "÷", "=", "≠", "≈", "≡", "≤", "≥", "<", ">", "±", "∓", "∴", "∵", "∶", "∷", "∸", "∹", "∺", "∻", "∼", "∽", "∾", "∿", "≀", "≁", "≂", "≃", "≄", "≅", "≆", "≇", "≉", "≊", "≋", "≌", "≍", "≎", "≏", "≐", "≑", "≒", "≓", "≔", "≕", "≖", "≗", "≘", "≙", "≚", "≛", "≜", "≝", "≞", "≟", "≢", "≣", "≦", "≧", "≨", "≩", "≪", "≫", "≬", "≭", "≮", "≯", "≰", "≱", "≲", "≳", "≴", "≵", "≶", "≷", "≸", "≹", "≺", "≻", "≼", "≽", "≾", "≿"],
  },
  "extended-latin": {
    name: "Extended Latin",
    characters: ["À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ"],
  },
  symbols: {
    name: "Symbols",
    characters: ["¡", "¿", "‽", "‼", "⁇", "⁈", "⁉", "※", "‾", "‿", "⁀", "⁁", "⁂", "⁃"],
  },
  arrows: {
    name: "Arrows",
    characters: ["←", "↑", "→", "↓", "↔", "↕", "↖", "↗", "↘", "↙", "↚", "↛", "↜", "↝", "↞", "↟", "↠", "↡", "↢", "↣", "↤", "↥", "↦", "↧", "↨", "↩", "↪", "↫", "↬", "↭", "↮", "↯", "↰", "↱", "↲", "↳", "↴", "↵", "↶", "↷", "↸", "↹", "↺", "↻", "↼", "↽", "↾", "↿", "⇀", "⇁", "⇂", "⇃", "⇄", "⇅", "⇆", "⇇", "⇈", "⇉", "⇊", "⇋", "⇌", "⇍", "⇎", "⇏", "⇐", "⇑", "⇒", "⇓", "⇔", "⇕", "⇖", "⇗", "⇘", "⇙", "⇚", "⇛", "⇜", "⇝", "⇞", "⇟", "⇠", "⇡", "⇢", "⇣", "⇤", "⇥", "⇦", "⇧", "⇨", "⇩", "⇪", "⇫", "⇬", "⇭", "⇮", "⇯", "⇰", "⇱", "⇲", "⇳", "⇴", "⇵", "⇶", "⇷", "⇸", "⇹", "⇺", "⇻", "⇼", "⇽", "⇾", "⇿"],
  },
};

const descriptions: Record<string, string> = {
  "€": "euro", "£": "pound", "¥": "yen", "¢": "cent", "₹": "rupee", "₽": "ruble", "₩": "won", "₿": "bitcoin",
  '"': "quote", "'": "apostrophe", "«": "left angle quote", "»": "right angle quote", "„": "low quote",
  "©": "copyright", "®": "registered", "™": "trademark", "°": "degree", "§": "section", "¶": "paragraph",
  "†": "dagger", "‡": "double dagger", "•": "bullet", "‰": "per mille", "′": "prime", "″": "double prime",
  "+": "plus", "-": "minus", "×": "multiplication", "÷": "division", "=": "equals", "≠": "not equal",
  "≈": "approximately", "≡": "identical", "≤": "less or equal", "≥": "greater or equal", "±": "plus minus",
  "À": "a grave", "Á": "a acute", "Â": "a circumflex", "Ã": "a tilde", "Ä": "a diaeresis", "Ç": "c cedilla",
  "←": "left arrow", "↑": "up arrow", "→": "right arrow", "↓": "down arrow", "↔": "left right arrow",
};

// Module-level flag
let isDialogOpen = false;
const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark';

const getEditorContentFromSelection = (): HTMLElement | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const anchorNode = selection.anchorNode;
  const anchorElement = anchorNode instanceof HTMLElement ? anchorNode : anchorNode?.parentElement;
  return (anchorElement?.closest('.rte-content, .editora-content') as HTMLElement | null) || null;
};

const isDarkThemeContext = (editorContent?: HTMLElement | null): boolean => {
  const source = editorContent || getEditorContentFromSelection();
  if (!source) return false;
  return Boolean(source.closest(DARK_THEME_SELECTOR));
};

/**
 * Inject dialog styles into document head
 */
const injectStyles = (): void => {
  if (typeof document === 'undefined') return;
  const styleId = 'special-characters-plugin-styles';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .special-characters-overlay {
      --rte-sc-overlay-bg: rgba(15, 23, 36, 0.56);
      --rte-sc-dialog-bg: #ffffff;
      --rte-sc-dialog-text: #101828;
      --rte-sc-border: #d6dbe4;
      --rte-sc-subtle-bg: #f7f9fc;
      --rte-sc-subtle-hover: #eef2f7;
      --rte-sc-muted-text: #5f6b7d;
      --rte-sc-accent: #1f75fe;
      --rte-sc-accent-strong: #165fd6;
      --rte-sc-ring: rgba(31, 117, 254, 0.18);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--rte-sc-overlay-bg);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
      box-sizing: border-box;
    }

    .special-characters-overlay.rte-ui-theme-dark {
      --rte-sc-overlay-bg: rgba(2, 8, 20, 0.72);
      --rte-sc-dialog-bg: #202938;
      --rte-sc-dialog-text: #e8effc;
      --rte-sc-border: #49566c;
      --rte-sc-subtle-bg: #2a3444;
      --rte-sc-subtle-hover: #344256;
      --rte-sc-muted-text: #a5b1c5;
      --rte-sc-accent: #58a6ff;
      --rte-sc-accent-strong: #4598f4;
      --rte-sc-ring: rgba(88, 166, 255, 0.22);
    }

    .special-characters-dialog {
      background: var(--rte-sc-dialog-bg);
      color: var(--rte-sc-dialog-text);
      border: 1px solid var(--rte-sc-border);
      border-radius: 12px;
      box-shadow: 0 24px 48px rgba(10, 15, 24, 0.28);
      max-width: 800px;
      width: 90%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .special-characters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--rte-sc-border);
      background: linear-gradient(180deg, rgba(127, 154, 195, 0.08) 0%, rgba(127, 154, 195, 0) 100%);
    }

    .special-characters-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--rte-sc-dialog-text);
    }

    .special-characters-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--rte-sc-muted-text);
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: background-color 0.16s ease, color 0.16s ease;
    }

    .special-characters-close:hover {
      background-color: var(--rte-sc-subtle-hover);
      color: var(--rte-sc-dialog-text);
    }

    .special-characters-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .special-characters-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .special-characters-search {
      padding: 16px 16px 0 16px;
    }

    .special-characters-search-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--rte-sc-border);
      border-radius: 8px;
      font-size: 14px;
      color: var(--rte-sc-dialog-text);
      background-color: var(--rte-sc-subtle-bg);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      box-sizing: border-box;
    }

    .special-characters-search-input::placeholder {
      color: var(--rte-sc-muted-text);
    }

    .special-characters-search-input:focus {
      outline: none;
      border-color: var(--rte-sc-accent);
      box-shadow: 0 0 0 3px var(--rte-sc-ring);
    }

    .special-characters-tabs {
      display: flex;
      flex-direction: column;
      width: 180px;
      border-right: 1px solid var(--rte-sc-border);
      background-color: var(--rte-sc-subtle-bg);
    }

    .special-characters-tab {
      padding: 12px 16px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
      color: var(--rte-sc-muted-text);
      border-bottom: 1px solid var(--rte-sc-border);
      transition: all 0.2s ease;
    }

    .special-characters-tab:hover {
      background-color: var(--rte-sc-subtle-hover);
      color: var(--rte-sc-dialog-text);
    }

    .special-characters-tab.active {
      background-color: var(--rte-sc-accent);
      color: #fff;
      font-weight: 500;
    }

    .special-characters-grid {
      padding: 16px;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
      gap: 8px;
    }

    .special-characters-item {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--rte-sc-border);
      background: var(--rte-sc-subtle-bg);
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.2s ease;
      color: var(--rte-sc-dialog-text);
    }

    .special-characters-item:hover {
      background-color: var(--rte-sc-accent);
      border-color: var(--rte-sc-accent);
      color: #fff;
      transform: scale(1.05);
    }

    .special-characters-item:active {
      transform: scale(0.95);
    }

    .special-characters-no-results {
      grid-column: 1 / -1;
      text-align: center;
      color: var(--rte-sc-muted-text);
      font-size: 14px;
      padding: 40px 20px;
      background-color: var(--rte-sc-subtle-bg);
      border-radius: 8px;
      border: 1px solid var(--rte-sc-border);
    }

    @media (max-width: 768px) {
      .special-characters-dialog {
        width: 95%;
        max-height: 90vh;
      }

      .special-characters-content {
        flex-direction: column;
      }

      .special-characters-tabs {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--rte-sc-border);
        flex-direction: row;
        overflow-x: auto;
      }

      .special-characters-tab {
        border-bottom: none;
        border-right: 1px solid var(--rte-sc-border);
        white-space: nowrap;
      }
    }
  `;
  
  document.head.appendChild(style);
};

/**
 * Insert character at cursor position
 */
const insertCharacter = (character: string): void => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(character);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

/**
 * Show special characters dialog
 */
const showSpecialCharactersDialog = (editorContent?: HTMLElement | null): void => {
  if (typeof window === 'undefined' || isDialogOpen) return;
  
  isDialogOpen = true;
  injectStyles();

  let activeTab: CharacterCategory = 'all';
  let searchQuery = '';

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'special-characters-overlay';
  if (isDarkThemeContext(editorContent)) {
    overlay.classList.add('rte-ui-theme-dark');
  }

  // Create dialog
  const dialog = document.createElement('div');
  dialog.className = 'special-characters-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');

  // Render function
  const render = () => {
    // Filter characters
    const currentCharacters = characterSets[activeTab].characters.filter(char => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return char.toLowerCase().includes(query) || 
             (descriptions[char] || '').toLowerCase().includes(query);
    });

    dialog.innerHTML = `
      <div class="special-characters-header">
        <h2>Insert Special Characters</h2>
        <button class="special-characters-close">×</button>
      </div>
      <div class="special-characters-content">
        <div class="special-characters-tabs">
          ${(Object.keys(characterSets) as CharacterCategory[]).map(category => `
            <button class="special-characters-tab ${activeTab === category ? 'active' : ''}" data-category="${category}">
              ${characterSets[category].name}
            </button>
          `).join('')}
        </div>
        <div class="special-characters-main-content">
          <div class="special-characters-search">
            <input type="text" placeholder="Search characters..." value="${searchQuery}" class="special-characters-search-input">
          </div>
          <div class="special-characters-grid">
            ${currentCharacters.length > 0 
              ? currentCharacters.map(char => `
                  <button class="special-characters-item" data-char="${char}" title="${descriptions[char] || char}">
                    ${char}
                  </button>
                `).join('')
              : `<div class="special-characters-no-results">No characters found for "${searchQuery}"</div>`
            }
          </div>
        </div>
      </div>
    `;

    // Event listeners
    const closeBtn = dialog.querySelector('.special-characters-close');
    closeBtn?.addEventListener('click', closeDialog);

    // Tab switching
    dialog.querySelectorAll('.special-characters-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const category = (e.target as HTMLElement).getAttribute('data-category') as CharacterCategory;
        if (category) {
          activeTab = category;
          render();
        }
      });
    });

    // Search
    const searchInput = dialog.querySelector('.special-characters-search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      searchQuery = (e.target as HTMLInputElement).value;
      render();
    });

    // Character insertion
    dialog.querySelectorAll('.special-characters-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const char = (e.target as HTMLElement).getAttribute('data-char');
        if (char) {
          insertCharacter(char);
          closeDialog();
        }
      });
    });
  };

  const closeDialog = () => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    isDialogOpen = false;
    document.removeEventListener('keydown', handleEscape);
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeDialog();
    }
  };

  // Overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDialog();
    }
  });

  document.addEventListener('keydown', handleEscape);

  // Initial render
  render();
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
};

export const SpecialCharactersPlugin = (): Plugin => ({
  name: 'specialCharacters',
  
  toolbar: [{
    label: 'Special Characters',
    command: 'insertSpecialCharacter',
    icon: '<svg width="24" height="24" focusable="false"><path d="M15 18h4l1-2v4h-6v-3.3l1.4-1a6 6 0 0 0 1.8-2.9 6.3 6.3 0 0 0-.1-4.1 5.8 5.8 0 0 0-3-3.2c-.6-.3-1.3-.5-2.1-.5a5.1 5.1 0 0 0-3.9 1.8 6.3 6.3 0 0 0-1.3 6 6.2 6.2 0 0 0 1.8 3l1.4.9V20H4v-4l1 2h4v-.5l-2-1L5.4 15A6.5 6.5 0 0 1 4 11c0-1 .2-1.9.6-2.7A7 7 0 0 1 6.3 6C7.1 5.4 8 5 9 4.5c1-.3 2-.5 3.1-.5a8.8 8.8 0 0 1 5.7 2 7 7 0 0 1 1.7 2.3 6 6 0 0 1 .2 4.8c-.2.7-.6 1.3-1 1.9a7.6 7.6 0 0 1-3.6 2.5v.5Z" fill-rule="evenodd"></path></svg>'
  }],
  
  commands: {
    insertSpecialCharacter: (_args, context) => {
      const editorContent = context?.contentElement instanceof HTMLElement
        ? context.contentElement
        : getEditorContentFromSelection();
      showSpecialCharactersDialog(editorContent);
      return true;
    }
  },
  
  keymap: {}
});
