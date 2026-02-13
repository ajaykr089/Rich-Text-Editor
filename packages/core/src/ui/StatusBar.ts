/**
 * StatusBar - Editor status information display
 */

export interface StatusBarConfig {
  enabled?: boolean;
  position?: 'top' | 'bottom';
}

export interface StatusInfo {
  wordCount?: number;
  charCount?: number;
  lineCount?: number;
  language?: string;
  cursorPosition?: {
    line: number;
    column: number;
  };
  selectionInfo?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
    selectedChars: number;
    selectedWords: number;
  };
  custom?: Record<string, string>;
}

export class StatusBar {
  private config: StatusBarConfig;
  private container?: HTMLElement;
  private statusInfo: StatusInfo = {};

  constructor(config: StatusBarConfig = {}) {
    this.config = config;
  }

  /**
   * Create and mount status bar
   */
  create(parentElement: HTMLElement): HTMLElement {
    const container = document.createElement('div');
    container.className = 'editora-statusbar';
    
    if (this.config.position) {
      container.classList.add(`editora-statusbar-${this.config.position}`);
    }
    
    this.container = container;
    parentElement.appendChild(container);
    
    return container;
  }

  /**
   * Update status information
   */
  update(info: StatusInfo): void {
    this.statusInfo = { ...this.statusInfo, ...info };
    this.render();
  }

  /**
   * Render status bar content
   */
  private render(): void {
    if (!this.container) return;

    this.container.innerHTML = '';

    // Create left section
    const leftSection = document.createElement('div');
    leftSection.className = 'editora-statusbar-left';

    // Create right section
    const rightSection = document.createElement('div');
    rightSection.className = 'editora-statusbar-right';

    // Left section: Cursor position and selection info
    const leftItems: string[] = [];

    if (this.statusInfo.selectionInfo) {
      const sel = this.statusInfo.selectionInfo;
      if (sel.startLine === sel.endLine && sel.startColumn === sel.endColumn) {
        // Cursor position only
        leftItems.push(`Ln ${sel.startLine}, Col ${sel.startColumn}`);
      } else {
        // Selection info
        if (sel.startLine === sel.endLine) {
          leftItems.push(`Ln ${sel.startLine}, Col ${sel.startColumn}-${sel.endColumn}`);
        } else {
          leftItems.push(`Ln ${sel.startLine}:${sel.startColumn} - ${sel.endLine}:${sel.endColumn}`);
        }
        leftItems.push(`${sel.selectedChars} chars selected`);
      }
    } else if (this.statusInfo.cursorPosition) {
      const pos = this.statusInfo.cursorPosition;
      leftItems.push(`Ln ${pos.line}, Col ${pos.column}`);
    }

    if (this.statusInfo.language) {
      leftItems.push(this.statusInfo.language);
    }

    // Right section: Word count and character count
    const rightItems: string[] = [];

    if (this.statusInfo.wordCount !== undefined) {
      rightItems.push(`${this.statusInfo.wordCount} words`);
    }

    if (this.statusInfo.charCount !== undefined) {
      rightItems.push(`${this.statusInfo.charCount} chars`);
    }

    if (this.statusInfo.lineCount !== undefined) {
      rightItems.push(`${this.statusInfo.lineCount} lines`);
    }

    // Add custom items to right section
    if (this.statusInfo.custom) {
      Object.entries(this.statusInfo.custom).forEach(([key, value]) => {
        rightItems.push(`${key}: ${value}`);
      });
    }

    // Render left section
    leftItems.forEach((item, index) => {
      const span = document.createElement('span');
      span.className = 'editora-statusbar-item';
      span.textContent = item;
      leftSection.appendChild(span);

      if (index < leftItems.length - 1) {
        const separator = document.createElement('span');
        separator.className = 'editora-statusbar-separator';
        separator.textContent = '|';
        leftSection.appendChild(separator);
      }
    });

    // Render right section
    rightItems.forEach((item, index) => {
      const span = document.createElement('span');
      span.className = 'editora-statusbar-item';
      span.textContent = item;
      rightSection.appendChild(span);

      if (index < rightItems.length - 1) {
        const separator = document.createElement('span');
        separator.className = 'editora-statusbar-separator';
        separator.textContent = '|';
        rightSection.appendChild(separator);
      }
    });

    // Add sections to container
    this.container.appendChild(leftSection);
    this.container.appendChild(rightSection);
  }

  /**
   * Destroy status bar
   */
  destroy(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = undefined;
  }
}
