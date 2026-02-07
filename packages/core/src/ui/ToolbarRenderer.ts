/**
 * ToolbarRenderer - Framework-agnostic toolbar rendering
 */

import { Plugin, ToolbarItem } from '../plugins/Plugin';

export interface ToolbarConfig {
  items?: string; // "undo redo | bold italic | media table"
  sticky?: boolean;
  position?: 'top' | 'bottom';
  floating?: boolean;
}

export interface ToolbarButton {
  id: string;
  label: string;
  command: string;
  icon?: string;
  type?: 'button' | 'dropdown' | 'input' | 'separator' | 'inline-menu';
  options?: Array<{ label: string; value: string }>;
  active?: boolean;
  disabled?: boolean;
}

export class ToolbarRenderer {
  private config: ToolbarConfig;
  private plugins: Plugin[];
  private container?: HTMLElement;
  private commandHandler?: (command: string, value?: any) => void;

  constructor(config: ToolbarConfig, plugins: Plugin[]) {
    this.config = config;
    this.plugins = plugins;
  }

  /**
   * Set command handler for toolbar buttons
   */
  setCommandHandler(handler: (command: string, value?: any) => void): void {
    this.commandHandler = handler;
  }

  /**
   * Parse toolbar string into button groups
   */
  private parseToolbarString(toolbarString: string): ToolbarButton[][] {
    const groups: ToolbarButton[][] = [];
    const sections = toolbarString.split('|').map(s => s.trim());
    
    const allToolbarItems = this.getAvailableToolbarItems();
    const itemMap = new Map(allToolbarItems.map(item => [item.command, item]));
    
    sections.forEach(section => {
      const buttons: ToolbarButton[] = [];
      const commands = section.split(/\s+/).filter(Boolean);
      
      commands.forEach(cmd => {
        const item = itemMap.get(cmd);
        if (item) {
          buttons.push({
            id: cmd,
            label: item.label,
            command: item.command,
            icon: item.icon,
            type: item.type === 'separator' ? 'separator' : (item.type || 'button'),
            options: item.options,
          });
        }
      });
      
      if (buttons.length > 0) {
        groups.push(buttons);
      }
    });
    
    return groups;
  }

  /**
   * Get all available toolbar items from plugins
   */
  private getAvailableToolbarItems(): ToolbarItem[] {
    const items = this.plugins.flatMap(p => p.toolbar || []);
    console.log('[ToolbarRenderer] Available toolbar items:', items.length, items.map(i => i.command));
    return items;
  }

  /**
   * Render toolbar to DOM element
   */
  render(container: HTMLElement): void {
    this.container = container;
    container.innerHTML = '';
    container.className = 'editora-toolbar';
    
    if (this.config.sticky) {
      container.classList.add('editora-toolbar-sticky');
    }
    
    if (this.config.position) {
      container.classList.add(`editora-toolbar-${this.config.position}`);
    }
    
    const toolbarString = this.config.items || this.getDefaultToolbarString();
    const buttonGroups = this.parseToolbarString(toolbarString);
    
    buttonGroups.forEach((group, groupIndex) => {
      const groupEl = document.createElement('div');
      groupEl.className = 'editora-toolbar-group';
      
      group.forEach(button => {
        if (button.type === 'separator') {
          const separator = document.createElement('div');
          separator.className = 'editora-toolbar-separator';
          groupEl.appendChild(separator);
        } else if (button.type === 'dropdown') {
          const dropdownEl = this.createDropdown(button);
          groupEl.appendChild(dropdownEl);
        } else if (button.type === 'inline-menu') {
          const inlineMenuEl = this.createInlineMenu(button);
          groupEl.appendChild(inlineMenuEl);
        } else {
          const buttonEl = this.createButton(button);
          groupEl.appendChild(buttonEl);
        }
      });
      
      container.appendChild(groupEl);
      
      // Add separator between groups (except last)
      if (groupIndex < buttonGroups.length - 1) {
        const separator = document.createElement('div');
        separator.className = 'editora-toolbar-separator';
        container.appendChild(separator);
      }
    });
  }

  /**
   * Create a toolbar button element
   */
  private createButton(button: ToolbarButton): HTMLElement {
    const el = document.createElement('button');
    el.className = 'editora-toolbar-button';
    el.type = 'button';
    el.title = button.label;
    el.setAttribute('data-command', button.command);
    
    if (button.icon) {
      // Check if it's an SVG icon
      if (button.icon.startsWith('<svg') && button.icon.endsWith('</svg>')) {
        // Create a wrapper span for the SVG with proper styling
        const iconWrapper = document.createElement('span');
        iconWrapper.className = 'editora-toolbar-icon';
        iconWrapper.innerHTML = button.icon;
        el.appendChild(iconWrapper);
      } else {
        // Plain text icon or HTML
        el.innerHTML = button.icon;
      }
    } else {
      el.textContent = button.label;
    }
    
    if (button.active) {
      el.classList.add('active');
    }
    
    if (button.disabled) {
      el.disabled = true;
    }
    
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.commandHandler) {
        this.commandHandler(button.command);
      }
    });
    
    return el;
  }

  /**
   * Create a dropdown element
   */
  private createDropdown(button: ToolbarButton): HTMLElement {
    const container = document.createElement('div');
    container.className = 'editora-toolbar-dropdown';
    
    const trigger = document.createElement('button');
    trigger.className = 'editora-toolbar-button editora-toolbar-dropdown-trigger';
    trigger.type = 'button';
    trigger.textContent = button.label;
    
    const menu = document.createElement('div');
    menu.className = 'editora-toolbar-dropdown-menu';
    menu.style.display = 'none';
    
    if (button.options) {
      button.options.forEach(option => {
        const item = document.createElement('button');
        item.className = 'editora-toolbar-dropdown-item';
        item.type = 'button';
        item.textContent = option.label;
        item.setAttribute('data-value', option.value);
        
        item.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.commandHandler) {
            this.commandHandler(button.command, option.value);
          }
          menu.style.display = 'none';
        });
        
        menu.appendChild(item);
      });
    }
    
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });
    
    container.appendChild(trigger);
    container.appendChild(menu);
    
    return container;
  }

  /**
   * Create an inline menu element (like dropdown but triggered by button click)
   */
  private createInlineMenu(button: ToolbarButton): HTMLElement {
    const container = document.createElement('div');
    container.className = 'editora-toolbar-dropdown editora-toolbar-inline-menu';
    
    const trigger = document.createElement('button');
    trigger.className = 'editora-toolbar-button';
    trigger.type = 'button';
    trigger.title = button.label;
    
    // Add icon if available
    if (button.icon) {
      if (button.icon.startsWith('<svg') && button.icon.endsWith('</svg>')) {
        const iconWrapper = document.createElement('span');
        iconWrapper.className = 'editora-toolbar-icon';
        iconWrapper.innerHTML = button.icon;
        trigger.appendChild(iconWrapper);
      } else {
        trigger.innerHTML = button.icon;
      }
    } else {
      trigger.textContent = button.label;
    }
    
    const menu = document.createElement('div');
    menu.className = 'editora-toolbar-dropdown-menu';
    menu.style.display = 'none';
    
    if (button.options) {
      button.options.forEach(option => {
        const item = document.createElement('button');
        item.className = 'editora-toolbar-dropdown-item';
        item.type = 'button';
        item.textContent = option.label;
        item.setAttribute('data-value', option.value);
        
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (this.commandHandler) {
            this.commandHandler(button.command, option.value);
          }
          menu.style.display = 'none';
        });
        
        menu.appendChild(item);
      });
    }
    
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Close all other menus
      const allMenus = this.container?.querySelectorAll('.editora-toolbar-dropdown-menu');
      allMenus?.forEach(m => {
        if (m !== menu) {
          (m as HTMLElement).style.display = 'none';
        }
      });
      
      // Toggle this menu
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target as Node)) {
        menu.style.display = 'none';
      }
    });
    
    container.appendChild(trigger);
    container.appendChild(menu);
    
    return container;
  }

  /**
   * Get default toolbar string if none provided
   */
  private getDefaultToolbarString(): string {
    const items = this.getAvailableToolbarItems();
    return items.map(item => item.command).join(' ');
  }

  /**
   * Update button state
   */
  updateButtonState(command: string, state: { active?: boolean; disabled?: boolean }): void {
    if (!this.container) return;
    
    const button = this.container.querySelector(`[data-command="${command}"]`) as HTMLButtonElement;
    if (button) {
      if (state.active !== undefined) {
        button.classList.toggle('active', state.active);
      }
      if (state.disabled !== undefined) {
        button.disabled = state.disabled;
      }
    }
  }

  /**
   * Destroy toolbar
   */
  destroy(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.commandHandler = undefined;
  }
}
