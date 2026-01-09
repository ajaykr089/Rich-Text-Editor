import React, { useEffect, useRef, useCallback } from 'react';
import { useEditorContext } from '../context/EditorContext';

/**
 * Props for the EditorContent component.
 */
export interface EditorContentProps {
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
}

/**
 * EditorContent component that renders the editable document area.
 */
export const EditorContent: React.FC<EditorContentProps> = ({
  className,
  placeholder,
  readOnly = false
}) => {
  const { state, dispatch } = useEditorContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  // Handle input without causing re-renders
  const handleInput = useCallback(() => {
    if (readOnly || isInternalUpdate.current) return;
    
    // Don't update state on every input to prevent cursor jumping
    // State will be updated on blur or command execution
  }, [readOnly]);

  // Handle blur to sync content
  const handleBlur = useCallback(() => {
    if (readOnly || !contentRef.current) return;
    
    const content = contentRef.current.innerHTML;
    const tr = state.tr.setMeta('content', content);
    dispatch(tr);
  }, [readOnly, state, dispatch]);

  // Handle key events
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) return;

    const key = event.key;
    const ctrlOrCmd = event.ctrlKey || event.metaKey;

    // Find matching keybinding in plugins
    for (const plugin of state.plugins) {
      const keybindings = plugin.getKeyBindings();
      const shortcut = ctrlOrCmd ? `Mod-${key.toLowerCase()}` : key;
      
      if (keybindings[shortcut]) {
        event.preventDefault();
        
        const commands = plugin.getCommands();
        const command = commands[keybindings[shortcut]];
        if (command) {
          command(state, dispatch);
        }
        break;
      }
    }
  }, [readOnly, state, dispatch]);

  // Only update innerHTML when absolutely necessary
  useEffect(() => {
    if (contentRef.current && !isInternalUpdate.current) {
      const html = serializeDocument(state.doc);
      
      // Only update if content is significantly different
      if (contentRef.current.innerHTML !== html && html !== '<p></p>') {
        isInternalUpdate.current = true;
        contentRef.current.innerHTML = html;
        isInternalUpdate.current = false;
      }
    }
  }, [state.version]); // Only update on version changes, not every state change

  return (
    <div
      ref={contentRef}
      className={`rte-content ${className || ''}`}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      role="textbox"
      aria-multiline="true"
      aria-label="Rich text editor"
    />
  );
};

/**
 * Simple document serializer.
 */
function serializeDocument(doc: any): string {
  return doc.textContent || '<p></p>';
}