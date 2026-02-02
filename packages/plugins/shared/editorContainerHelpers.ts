/**
 * Utility functions for plugins to access the editor container in a multi-instance safe way
 * 
 * These functions help plugins find their parent editor container and perform scoped DOM queries
 * instead of using global selectors that only work with the first editor instance on a page.
 */

/**
 * Find the editor container from the current selection
 * This is the most reliable way to find the active editor when executing commands
 * 
 * @returns The editor container div or null if no selection or editor not found
 */
export function findEditorContainerFromSelection(): HTMLDivElement | null {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) {
    return null;
  }
  
  const range = selection.getRangeAt(0);
  const node = range.startContainer;
  
  // Get the element (text nodes need their parent)
  const element = node.nodeType === Node.TEXT_NODE 
    ? node.parentElement 
    : node as HTMLElement;
    
  return findEditorContainer(element);
}

/**
 * Find the parent editor container for a given element
 * Walks up the DOM tree looking for [data-editora-editor] attribute
 * 
 * @param element - Starting element to search from (usually a toolbar, plugin element, etc)
 * @returns The editor container div or null if not found
 */
export function findEditorContainer(element: HTMLElement | null): HTMLDivElement | null {
  if (!element) return null;
  
  // If element itself is the editor container, return it
  if (element.hasAttribute('data-editora-editor')) {
    return element as HTMLDivElement;
  }
  
  // Walk up the DOM tree looking for editor container
  let current = element.parentElement;
  while (current) {
    if (current.hasAttribute('data-editora-editor')) {
      return current as HTMLDivElement;
    }
    current = current.parentElement;
  }
  
  return null;
}

/**
 * Get the content element (.rte-content) for a given editor container
 * Uses scoped selector instead of global document.querySelector
 * 
 * @param editorContainer - The editor container element
 * @returns The content element or null if not found
 */
export function getContentElement(editorContainer: HTMLDivElement | null): HTMLElement | null {
  if (!editorContainer) {
    console.warn('[Editora] Editor container not found');
    return null;
  }
  return editorContainer.querySelector('.rte-content') as HTMLElement | null;
}

/**
 * Get the content element by first finding the parent editor container from a given element
 * This is the most common usage pattern in plugins
 * 
 * @param fromElement - Element to start searching from (e.g., this in event handler)
 * @returns The content element or null if not found
 */
export function findContentElement(fromElement: HTMLElement | null): HTMLElement | null {
  const container = findEditorContainer(fromElement);
  return getContentElement(container);
}

/**
 * Query elements within the editor container scope
 * Useful for finding specific elements like footnotes, merge tags, anchors, etc.
 * 
 * @param editorContainer - The editor container element
 * @param selector - CSS selector to find within the container
 * @returns NodeList of matching elements
 */
export function queryScopedElements(
  editorContainer: HTMLDivElement | null,
  selector: string
): NodeListOf<Element> {
  if (!editorContainer) {
    // Fallback to global selector for backward compatibility, but warn
    console.warn(`[Editora] Editor container not found, using global selector fallback for "${selector}"`);
    return document.querySelectorAll(selector);
  }
  return editorContainer.querySelectorAll(selector);
}

/**
 * Get a single scoped element
 * 
 * @param editorContainer - The editor container element
 * @param selector - CSS selector to find within the container
 * @returns First matching element or null
 */
export function queryScopedElement(
  editorContainer: HTMLDivElement | null,
  selector: string
): Element | null {
  if (!editorContainer) {
    // Fallback to global selector for backward compatibility, but warn
    console.warn(`[Editora] Editor container not found, using global selector fallback for "${selector}"`);
    return document.querySelector(selector);
  }
  return editorContainer.querySelector(selector);
}

/**
 * Get an element by ID within editor container scope
 * IDs like footnote IDs, anchor IDs, merge tag IDs should be scoped to the editor
 * 
 * @param editorContainer - The editor container element
 * @param id - Element ID to find
 * @returns Element with that ID or null
 */
export function getScopedElementById(
  editorContainer: HTMLDivElement | null,
  id: string
): HTMLElement | null {
  if (!editorContainer) {
    // Fallback for backward compatibility
    return document.getElementById(id);
  }
  
  // Use querySelector with ID selector within container scope
  return editorContainer.querySelector(`#${id}`) as HTMLElement | null;
}

/**
 * Event handler helper - Extract editor container from event and get content element
 * Common pattern: In event handlers, get the target element and find the editor container
 * 
 * @param event - DOM event
 * @returns Object with editorContainer and contentElement
 */
export function getEditorElementsFromEvent(event: Event): {
  editorContainer: HTMLDivElement | null;
  contentElement: HTMLElement | null;
} {
  const target = event.target as HTMLElement;
  const editorContainer = findEditorContainer(target);
  const contentElement = getContentElement(editorContainer);
  return { editorContainer, contentElement };
}

/**
 * Check if an element is within an editor instance
 * 
 * @param element - Element to check
 * @returns True if element is inside an editor container
 */
export function isInEditor(element: HTMLElement | null): boolean {
  return findEditorContainer(element) !== null;
}

/**
 * Helper for getting selection from a specific editor
 * Ensures selection is within the correct editor instance
 * 
 * @param editorContainer - The editor container element
 * @returns Selection if it's within this editor, or null otherwise
 */
export function getEditorSelection(editorContainer: HTMLDivElement | null): Selection | null {
  const selection = window.getSelection();
  if (!selection || !editorContainer) return null;
  
  const contentElement = getContentElement(editorContainer);
  if (!contentElement) return null;
  
  // Check if selection is within this editor's content
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (contentElement.contains(range.startContainer) && contentElement.contains(range.endContainer)) {
      return selection;
    }
  }
  
  return null;
}

/**
 * Helper for commands that need to know which editor they're being executed on
 * Extract editor context from toolbar button or command origin
 * 
 * @param element - Button or element that triggered the command
 * @returns Editor container or null
 */
export function getEditorContextFromCommand(element: HTMLElement | null): HTMLDivElement | null {
  // First, try to find the editor container directly
  const fromElement = findEditorContainer(element);
  if (fromElement) return fromElement;
  
  // If element is a toolbar button, it might be outside editor container
  // Try to find it through document.activeElement (the focused editor)
  const activeElement = document.activeElement as HTMLElement;
  if (activeElement && activeElement.classList?.contains('rte-content')) {
    return findEditorContainer(activeElement);
  }
  
  return null;
}
