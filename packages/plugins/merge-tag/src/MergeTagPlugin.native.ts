import { Plugin } from '@editora/core';

/**
 * Merge Tag Plugin - Native Implementation
 * 
 * Features:
 * - Category-based tag organization (User, Company, Date, Custom)
 * - Search and filter functionality
 * - Preview pane with tag syntax
 * - Keyboard navigation
 * - Non-editable inline tags
 * - Accessible dialog UI
 */

interface MergeTag {
  key: string;
  label: string;
  category: string;
  preview?: string;
  description?: string;
}

const MERGE_TAG_CATEGORIES = {
  USER: {
    name: 'User',
    tags: [
      { key: 'first_name', label: 'First Name', category: 'User', preview: 'John' },
      { key: 'last_name', label: 'Last Name', category: 'User', preview: 'Doe' },
      { key: 'email', label: 'Email', category: 'User', preview: 'john@example.com' },
      { key: 'phone', label: 'Phone', category: 'User', preview: '+1-555-1234' },
      { key: 'full_name', label: 'Full Name', category: 'User', preview: 'John Doe' },
      { key: 'username', label: 'Username', category: 'User', preview: 'johndoe123' }
    ]
  },
  COMPANY: {
    name: 'Company',
    tags: [
      { key: 'company_name', label: 'Company Name', category: 'Company', preview: 'Acme Corp' },
      { key: 'company_address', label: 'Company Address', category: 'Company', preview: '123 Main St' },
      { key: 'company_phone', label: 'Company Phone', category: 'Company', preview: '+1-555-0000' },
      { key: 'company_email', label: 'Company Email', category: 'Company', preview: 'info@acme.com' },
      { key: 'company_website', label: 'Company Website', category: 'Company', preview: 'www.acme.com' }
    ]
  },
  DATE: {
    name: 'Date',
    tags: [
      { key: 'today', label: 'Today', category: 'Date', preview: new Date().toLocaleDateString() },
      { key: 'tomorrow', label: 'Tomorrow', category: 'Date', preview: new Date(Date.now() + 86400000).toLocaleDateString() },
      { key: 'next_week', label: 'Next Week', category: 'Date', preview: new Date(Date.now() + 604800000).toLocaleDateString() },
      { key: 'current_month', label: 'Current Month', category: 'Date', preview: new Date().toLocaleDateString('en-US', { month: 'long' }) },
      { key: 'current_year', label: 'Current Year', category: 'Date', preview: new Date().getFullYear().toString() }
    ]
  },
  CUSTOM: {
    name: 'Custom',
    tags: [
      { key: 'custom_field_1', label: 'Custom Field 1', category: 'Custom', preview: 'Custom value' },
      { key: 'custom_field_2', label: 'Custom Field 2', category: 'Custom', preview: 'Another value' }
    ]
  }
};

let savedSelection: Range | null = null;

const showMergeTagDialog = () => {
  // Save selection
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedSelection = selection.getRangeAt(0).cloneRange();
  }

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';

  const dialog = document.createElement('div');
  dialog.style.cssText = 'background: white; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);';

  let selectedCategory = 'USER';
  let searchTerm = '';
  let selectedTag: MergeTag | null = null;

  const renderDialog = () => {
    const currentCategoryTags = MERGE_TAG_CATEGORIES[selectedCategory as keyof typeof MERGE_TAG_CATEGORIES]?.tags || [];
    
    let filteredTags = currentCategoryTags;
    if (searchTerm.trim()) {
      filteredTags = currentCategoryTags.filter(tag =>
        tag.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filteredTags.length > 0 && !selectedTag) {
      selectedTag = filteredTags[0];
    }

    dialog.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e1e5e9; background: #f8f9fa;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Insert Merge Tag</h2>
        <button class="close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #6c757d; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
      </div>

      <div style="padding: 20px; overflow-y: auto; flex: 1;">
        <div style="margin-bottom: 16px;">
          <input 
            type="text" 
            id="search-input"
            placeholder="Search merge tags..." 
            value="${searchTerm}"
            style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;"
          />
        </div>

        <div class="tabs" style="display: flex; gap: 8px; margin-bottom: 16px; border-bottom: 2px solid #e1e5e9;">
          ${Object.entries(MERGE_TAG_CATEGORIES).map(([key, cat]) => `
            <button 
              class="tab-${key}" 
              style="padding: 10px 16px; background: none; border: none; cursor: pointer; border-bottom: 3px solid ${selectedCategory === key ? '#007bff' : 'transparent'}; color: ${selectedCategory === key ? '#007bff' : '#6c757d'}; font-weight: ${selectedCategory === key ? '600' : '500'}; transition: all 0.2s;"
            >
              ${cat.name}
            </button>
          `).join('')}
        </div>

        <div style="border: 1px solid #dee2e6; border-radius: 4px; max-height: 300px; overflow-y: auto; margin-bottom: 16px;">
          ${filteredTags.length > 0 ? filteredTags.map(tag => `
            <div 
              class="tag-item" 
              data-key="${tag.key}"
              style="padding: 12px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background-color 0.2s; background: ${selectedTag?.key === tag.key ? '#f8f9fa' : 'white'};"
            >
              <div style="font-weight: 600; color: #333; margin-bottom: 4px;">${tag.label}</div>
              ${tag.preview ? `<div style="font-size: 12px; color: #6c757d;">Preview: ${tag.preview}</div>` : ''}
            </div>
          `).join('') : '<div style="padding: 40px; text-align: center; color: #6c757d;">No merge tags found</div>'}
        </div>

        ${selectedTag ? `
          <div style="padding: 12px; background: #f8f9fa; border-radius: 4px; font-family: monospace; font-size: 14px; color: #495057;">
            <strong>Preview:</strong> <span style="color: #007bff;">{{ ${selectedTag.label} }}</span>
          </div>
        ` : ''}
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 1px solid #e1e5e9; background: #f8f9fa;">
        <button class="cancel-btn" style="padding: 10px 20px; background: #fff; border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; font-size: 14px;">Cancel</button>
        <button class="insert-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" ${!selectedTag ? 'disabled' : ''}>Insert</button>
      </div>
    `;
  };

  renderDialog();
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const closeDialog = () => document.body.removeChild(overlay);

  const insertTag = () => {
    if (!selectedTag || !savedSelection) {
      closeDialog();
      return;
    }

    const tagId = `merge-tag-${selectedTag.key}-${Date.now()}`;
    
    const span = document.createElement('span');
    span.className = 'rte-merge-tag';
    span.id = tagId;
    span.setAttribute('data-key', selectedTag.key);
    span.setAttribute('data-category', selectedTag.category);
    span.setAttribute('contenteditable', 'false');
    span.setAttribute('aria-label', `Merge tag: ${selectedTag.label}`);
    span.style.cssText = 'background-color: #e3f2fd; border: 1px solid #bbdefb; border-radius: 3px; padding: 2px 6px; margin: 0 2px; display: inline-block; white-space: nowrap; font-weight: 500; color: #1976d2; font-size: 0.9em; cursor: default;';
    span.textContent = `{{ ${selectedTag.label} }}`;

    savedSelection.deleteContents();
    savedSelection.insertNode(span);

    // Add space after tag
    const space = document.createTextNode(' ');
    savedSelection.setStartAfter(span);
    savedSelection.insertNode(space);
    savedSelection.setStartAfter(space);
    savedSelection.collapse(true);

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelection);
    }

    closeDialog();
  };

  const attachEventHandlers = () => {
    const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
    const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
    const insertBtn = dialog.querySelector('.insert-btn') as HTMLButtonElement;
    const searchInput = dialog.querySelector('#search-input') as HTMLInputElement;

    closeBtn?.addEventListener('click', closeDialog);
    cancelBtn?.addEventListener('click', closeDialog);
    insertBtn?.addEventListener('click', insertTag);

    searchInput?.addEventListener('input', (e) => {
      searchTerm = (e.target as HTMLInputElement).value;
      renderDialog();
      attachEventHandlers();
    });

    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        insertTag();
      } else if (e.key === 'Escape') {
        closeDialog();
      }
    });

    // Category tabs
    Object.keys(MERGE_TAG_CATEGORIES).forEach(key => {
      const tabBtn = dialog.querySelector(`.tab-${key}`) as HTMLButtonElement;
      tabBtn?.addEventListener('click', () => {
        selectedCategory = key;
        selectedTag = null;
        renderDialog();
        attachEventHandlers();
      });

      tabBtn?.addEventListener('mouseenter', () => {
        if (selectedCategory !== key) {
          tabBtn.style.color = '#495057';
        }
      });

      tabBtn?.addEventListener('mouseleave', () => {
        if (selectedCategory !== key) {
          tabBtn.style.color = '#6c757d';
        }
      });
    });

    // Tag items
    dialog.querySelectorAll('.tag-item').forEach(item => {
      const tagKey = item.getAttribute('data-key');
      const currentCategoryTags = MERGE_TAG_CATEGORIES[selectedCategory as keyof typeof MERGE_TAG_CATEGORIES]?.tags || [];
      const tag = currentCategoryTags.find(t => t.key === tagKey);

      item.addEventListener('click', () => {
        if (tag) {
          selectedTag = tag;
          renderDialog();
          attachEventHandlers();
        }
      });

      item.addEventListener('dblclick', () => {
        if (tag) {
          selectedTag = tag;
          insertTag();
        }
      });

      item.addEventListener('mouseenter', () => {
        if (selectedTag?.key !== tagKey) {
          (item as HTMLElement).style.background = '#f0f0f0';
        }
      });

      item.addEventListener('mouseleave', () => {
        if (selectedTag?.key !== tagKey) {
          (item as HTMLElement).style.background = 'white';
        }
      });
    });
  };

  attachEventHandlers();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });

  // Focus search input
  setTimeout(() => {
    const searchInput = dialog.querySelector('#search-input') as HTMLInputElement;
    searchInput?.focus();
  }, 100);
};

export const MergeTagPlugin = (): Plugin => ({
  name: "mergeTag",

  toolbar: [
    {
      label: "Merge Tag",
      command: "insertMergeTag",
      icon: "{{ }}",
      shortcut: "Mod-Shift-m",
    },
  ],

  commands: {
    insertMergeTag: () => {
      showMergeTagDialog();
      return true;
    },
  },

  keymap: {
    "Mod-Shift-m": "insertMergeTag",
  },
});
