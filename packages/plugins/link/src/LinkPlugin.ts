import React from 'react';
import {
  Plugin,
  Command,
  EditorState,
  MarkType
} from '@rte-editor/core';

/**
 * Link plugin for rich text editor.
 * Provides comprehensive link management with URL validation and editing.
 */
export class LinkPlugin extends Plugin {
  constructor() {
    super({
      name: 'link',
      schema: {
        marks: {
          link: {
            attrs: {
              href: { default: null },
              title: { default: null },
              target: { default: '_blank' }
            },
            inclusive: false,
            parseDOM: [{
              tag: 'a[href]',
              getAttrs: (dom: HTMLElement) => ({
                href: dom.getAttribute('href'),
                title: dom.getAttribute('title'),
                target: dom.getAttribute('target')
              })
            }],
            toDOM: (mark) => ['a', {
              href: mark.attrs.href,
              title: mark.attrs.title,
              target: mark.attrs.target,
              class: 'rte-link'
            }, 0]
          }
        }
      },
      commands: {
        insertLink: (href: string, text?: string, attrs?: any) => insertLinkCommand(href, text, attrs),
        editLink: () => editLinkCommand(),
        removeLink: () => removeLinkCommand(),
        openLink: () => openLinkCommand()
      },
      toolbar: {
        items: [{
          id: 'insert-link',
          icon: '🔗', // Link symbol
          label: 'Insert Link',
          command: 'insertLink',
          active: (state: EditorState) => isLinkActive(state)
        }]
      },
      keybindings: {
        'Mod-k': 'insertLink' // Standard link shortcut
      }
    });
  }
}

/**
 * Check if link mark is active at current selection.
 */
function isLinkActive(state: EditorState): boolean {
  const linkMark = state.schema.marks.link;
  if (!linkMark) return false;

  const { from, $from, to, empty } = state.selection;

  if (empty) {
    return !!linkMark.isInSet(state.storedMarks || $from.marks());
  } else {
    return state.doc.rangeHasMark(from, to, linkMark);
  }
}

/**
 * Insert link command.
 */
function insertLinkCommand(href: string, text?: string, attrs: any = {}): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const linkMark = state.schema.marks.link;

    if (!linkMark) {
      return false;
    }

    // Validate URL
    if (!isValidUrl(href)) {
      console.warn('Invalid URL provided to insertLink:', href);
      return false;
    }

    if (dispatch) {
      const { from, to, empty } = state.selection;
      const tr = state.tr;

      // If no text is selected and no text provided, use the URL as text
      const linkText = text || (empty ? href : null);

      if (empty && linkText) {
        // Insert text and apply link
        tr.insertText(linkText);
        tr.addMark(from, from + linkText.length, linkMark.create({
          href,
          title: attrs.title,
          target: attrs.target || '_blank'
        }));
      } else if (!empty) {
        // Apply link to selected text
        tr.addMark(from, to, linkMark.create({
          href,
          title: attrs.title,
          target: attrs.target || '_blank'
        }));
      } else {
        // Store link mark for next text input
        tr.setStoredMarks([linkMark.create({
          href,
          title: attrs.title,
          target: attrs.target || '_blank'
        })]);
      }

      dispatch(tr);
    }

    return true;
  };
}

/**
 * Edit link command (opens dialog to edit existing link).
 */
function editLinkCommand(): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const linkMark = state.schema.marks.link;

    if (!linkMark || !isLinkActive(state)) {
      return false;
    }

    // In a real implementation, this would open a dialog
    // For now, we'll log the current link info
    const { $from, empty } = state.selection;
    const marks = empty ? state.storedMarks || $from.marks() : [];
    const link = marks.find(mark => mark.type === linkMark);

    if (link) {
      console.log('Current link:', link.attrs);
      // Would open edit dialog here
    }

    return true;
  };
}

/**
 * Remove link command.
 */
function removeLinkCommand(): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const linkMark = state.schema.marks.link;

    if (!linkMark) {
      return false;
    }

    const { from, to, empty } = state.selection;

    if (dispatch) {
      const tr = state.tr;

      if (empty) {
        // Remove from stored marks
        const storedMarks = state.storedMarks || [];
        tr.setStoredMarks(storedMarks.filter(mark => mark.type !== linkMark));
      } else {
        // Remove from selection
        tr.removeMark(from, to, linkMark);
      }

      dispatch(tr);
    }

    return true;
  };
}

/**
 * Open link command.
 */
function openLinkCommand(): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const linkMark = state.schema.marks.link;

    if (!linkMark || !isLinkActive(state)) {
      return false;
    }

    const { $from, empty } = state.selection;
    const marks = empty ? state.storedMarks || $from.marks() : [];
    const link = marks.find(mark => mark.type === linkMark);

    if (link && link.attrs.href) {
      window.open(link.attrs.href, link.attrs.target || '_blank');
      return true;
    }

    return false;
  };
}

/**
 * Validate URL format.
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    // Check for relative URLs or common patterns
    const relativePattern = /^\/|^#/;
    const emailPattern = /^mailto:/;
    const telPattern = /^tel:/;

    return relativePattern.test(url) ||
           emailPattern.test(url) ||
           telPattern.test(url);
  }
}

/**
 * Create a link plugin instance.
 */
export function createLinkPlugin(): LinkPlugin {
  return new LinkPlugin();
}