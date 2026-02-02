import { Plugin } from '@editora/core';
import { FootnotePluginProvider } from './FootnotePluginProvider';
import { findContentElement, findEditorContainer, findEditorContainerFromSelection, queryScopedElements, getScopedElementById } from '../../shared/editorContainerHelpers';

/**
 * Footnote Plugin for Rich Text Editor
 *
 * Manages inline references and footnote content with:
 * - Auto-numbering and renumbering
 * - Bidirectional links (reference ↔ footnote)
 * - Safe deletion of references/footnotes
 * - Paste normalization
 * - Multi-page print support
 *
 * Constraints:
 * - Footnotes must live at document end in a semantic <section>
 * - Each footnote ID must be unique
 * - References must never point to missing nodes
 * - Page break cannot split footnote container
 *
 * Integrations:
 * - Print: Renders at bottom of page
 * - Page Break: Cannot split footnote container
 * - Anchor: Optional anchors inside footnotes allowed
 * - Code Sample: Code allowed inside footnote content
 */
export const FootnotePlugin = (): Plugin => ({
  name: 'footnote',
  toolbar: [
    {
      label: 'Footnote',
      command: 'insertFootnote',
      type: 'button',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="4" width="14" height="2" rx="1" /><rect x="3" y="8" width="18" height="2" rx="1" /><rect x="3" y="12" width="16" height="2" rx="1" /><rect x="3" y="16" width="10" height="1.5" rx="0.75" /><text x="19" y="11" font-size="9" font-weight="600" fill="currentColor" font-family="system-ui, sans-serif"> 1 </text></svg>'
    }
  ],
  context: {
    provider: FootnotePluginProvider
  }
});

/**
 * Footnote state management
 * Tracks all footnotes and their references
 */
interface FootnoteData {
  id: string;
  number: number;
  content: string;
}

const footnoteRegistry = new Map<string, FootnoteData>();

/**
 * Get or create footnote container
 * Always at the end of the contenteditable content
 */
function getFootnoteContainer(editorContainer: HTMLDivElement | null): HTMLElement {
  if (!editorContainer) {
    console.warn('Editor container not found for footnotes');
    editorContainer = document.querySelector('[data-editora-editor]') as HTMLDivElement;
  }
  
  let container = editorContainer?.querySelector('.rte-footnotes') as HTMLElement;
  
  if (!container) {
    container = document.createElement('section');
    container.className = 'rte-footnotes';
    container.setAttribute('data-type', 'footnotes');
    container.setAttribute('contenteditable', 'true');
    
    const ol = document.createElement('ol');
    container.appendChild(ol);
    
    // Append to the content area (at the end)
    const contentEditable = findContentElement(editorContainer);
    if (contentEditable) {
      // Find the parent container if needed
      const parent = contentEditable.parentElement;
      parent?.appendChild(container);
    } else {
      console.warn('Could not find contenteditable element for footnotes');
    }
  }
  
  return container;
}

/**
 * Insert Footnote Command
 *
 * Inserts a footnote reference at the current cursor position
 * and creates/updates the footnote container at document end
 */
export const insertFootnoteCommand = (content: string = '') => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // Generate unique footnote ID
  const footnoteId = `fn-${Date.now()}`;
  const nextNumber = getNextFootnoteNumber();

  // Create reference element
  const reference = document.createElement('sup');
  reference.className = 'rte-footnote-ref';
  reference.setAttribute('data-footnote-id', footnoteId);
  reference.setAttribute('data-number', nextNumber.toString());
  reference.textContent = nextNumber.toString();

  // Insert reference at cursor and collapse selection after it
  try {
    range.insertNode(reference);
    range.setStartAfter(reference);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  } catch (e) {
    console.error('Error inserting footnote reference:', e);
    return;
  }

  // Get or create footnote container
  // Find editor from the inserted reference
  const editorContainer = findEditorContainer(reference);
  const container = getFootnoteContainer(editorContainer);
  const ol = container.querySelector('ol');

  // Create footnote item
  const li = document.createElement('li');
  li.id = footnoteId;
  li.className = 'rte-footnote-item';
  li.setAttribute('data-type', 'footnote');
  li.setAttribute('data-number', nextNumber.toString());

  // Add content
  const contentDiv = document.createElement('div');
  contentDiv.className = 'rte-footnote-content';
  contentDiv.setAttribute('contenteditable', 'true');
  contentDiv.textContent = content || `Footnote ${nextNumber}`;
  li.appendChild(contentDiv);

  // Add back reference
  const backRef = document.createElement('a');
  backRef.className = 'rte-footnote-backref';
  backRef.href = `#ref-${footnoteId}`;
  backRef.setAttribute('aria-label', `Back to reference ${nextNumber}`);
  backRef.textContent = '↩';
  li.appendChild(backRef);

  // Append to footnote list
  ol?.appendChild(li);

  // Register footnote
  footnoteRegistry.set(footnoteId, {
    id: footnoteId,
    number: nextNumber,
    content
  });
};

/**
 * Get next footnote number
 * Counts existing footnotes and returns next number
 */
function getNextFootnoteNumber(): number {
  const editorContainer = findEditorContainerFromSelection() || document.querySelector('[data-editora-editor]') as HTMLDivElement;
  const container = editorContainer?.querySelector('.rte-footnotes');
  if (!container) return 1;

  const items = container.querySelectorAll('li[data-type="footnote"]');
  return items.length + 1;
}

/**
 * Renumber all footnotes
 * Called when a footnote is deleted or reordered
 */
export const renumberAllFootnotes = () => {
  const editorContainer = findEditorContainerFromSelection() || document.querySelector('[data-editora-editor]') as HTMLDivElement;
  const container = editorContainer?.querySelector('.rte-footnotes');
  if (!container) return;

  const items = container.querySelectorAll('li[data-type="footnote"]');
  const references = editorContainer?.querySelectorAll('.rte-footnote-ref');

  let number = 1;

  items.forEach(item => {
    const footnoteId = item.id;
    
    // Update footnote item
    item.setAttribute('data-number', number.toString());
    const contentDiv = item.querySelector('.rte-footnote-content');
    
    // Update reference
    const ref = editorContainer?.querySelector(`.rte-footnote-ref[data-footnote-id="${footnoteId}"]`);
    if (ref) {
      ref.setAttribute('data-number', number.toString());
      ref.textContent = number.toString();
    }

    // Update registry
    const footnoteData = footnoteRegistry.get(footnoteId);
    if (footnoteData) {
      footnoteData.number = number;
    }

    number++;
  });
};

/**
 * Delete footnote and its reference
 * Automatically renumbers remaining footnotes
 */
export const deleteFootnote = (footnoteId: string) => {
  const editorContainer = findEditorContainerFromSelection() || document.querySelector('[data-editora-editor]') as HTMLDivElement;
  const reference = editorContainer?.querySelector(`.rte-footnote-ref[data-footnote-id="${footnoteId}"]`);
  const footnoteItem = getScopedElementById(editorContainer, footnoteId);

  if (reference) reference.remove();
  if (footnoteItem) footnoteItem.remove();

  footnoteRegistry.delete(footnoteId);
  renumberAllFootnotes();
};

/**
 * Handle footnote reference deletion
 * When user deletes a reference, also delete the corresponding footnote
 */
export const handleFootnoteReferenceDeletion = (element: HTMLElement) => {
  if (element.classList.contains('rte-footnote-ref')) {
    const footnoteId = element.getAttribute('data-footnote-id');
    if (footnoteId) {
      deleteFootnote(footnoteId);
      return true;
    }
  }
  return false;
};

/**
 * Sanitize pasted content
 * When content with footnotes is pasted, resolve ID collisions
 */
export const sanitizeFootnotesPaste = (pastedHTML: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(pastedHTML, 'text/html');

  // Find all footnote references and footnotes
  const references = doc.querySelectorAll('.rte-footnote-ref');
  const idMap = new Map<string, string>();

  // Rename all IDs to avoid collisions
  references.forEach(ref => {
    const oldId = ref.getAttribute('data-footnote-id');
    if (oldId && !idMap.has(oldId)) {
      const newId = `fn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      idMap.set(oldId, newId);
      ref.setAttribute('data-footnote-id', newId);
    }
  });

  // Update footnote items
  const footnotes = doc.querySelectorAll('li[data-type="footnote"]');
  footnotes.forEach(fn => {
    const oldId = fn.id;
    if (idMap.has(oldId)) {
      fn.id = idMap.get(oldId)!;
    }
  });

  return doc.body.innerHTML;
};
