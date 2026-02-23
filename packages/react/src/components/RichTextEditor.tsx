import React, { useMemo, useEffect, useRef } from 'react';
import { Editor, PluginManager, Plugin } from '@editora/core';
import { StatusBar } from '@editora/core';
import { Toolbar } from './Toolbar';
import { EditorContent } from './EditorContent';
import { FloatingToolbar } from './FloatingToolbar';
import { DynamicProviderWrapper } from './DynamicProviderWrapper';
import { RichTextEditorProps, EditorAPI } from '../types';
import { mergeConfig } from '../utils/mergeConfig';
import { getCursorPosition, countLines, calculateTextStats, getSelectionInfo } from '@editora/core';

// Plugin Providers - These are now handled by DynamicProviderWrapper
// Each plugin can define its own provider through the context property
// Only essential providers are imported directly here

// Global command registry
const commandRegistry = new Map<string, (params?: any) => void>();

// Initialize global command functions
if (typeof window !== 'undefined') {
  (window as any).registerEditorCommand = (command: string, handler: (params?: any) => void) => {
    commandRegistry.set(command, handler);
  };

  (window as any).executeEditorCommand = (command: string, params?: any) => {
    const handler = commandRegistry.get(command);
    if (handler) {
      return handler(params);
    } else {
      console.warn(`No handler registered for command: ${command}`);
      return false;
    }
  };
}

const EditorCore: React.FC<RichTextEditorProps> = (props) => {
  const config = useMemo(() => mergeConfig(props), [
    props.id,
    props.className,
    props.value,
    props.defaultValue,
    props.placeholder,
    props.plugins,
    props.toolbar,
    props.menubar,
    props.contextMenu,
    props.media,
    props.paste,
    props.history,
    props.language,
    props.spellcheck,
    props.autosave,
    props.accessibility,
    props.performance,
    props.content,
    props.security,
    props.floatingToolbar,
    props.mediaConfig,
  ]);
  
  const editorRef = useRef<Editor | null>(null);
  const apiRef = useRef<EditorAPI | null>(null);
  const onInitRef = useRef(props.onInit);
  const onDestroyRef = useRef(props.onDestroy);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<StatusBar | null>(null);
  const statusBarElementRef = useRef<HTMLDivElement>(null);
  
  // Keep callback refs up to date
  useEffect(() => {
    onInitRef.current = props.onInit;
    onDestroyRef.current = props.onDestroy;
  });

  const editor = useMemo(() => {
    const pluginManager = new PluginManager();
    config.plugins.forEach(p => {
      pluginManager.register(p);
      
      // Register commands from native plugins in global registry for backward compatibility
      if (p.commands && typeof window !== 'undefined') {
        Object.entries(p.commands).forEach(([commandName, commandFn]) => {
          commandRegistry.set(commandName, commandFn);
        });
      }
    });
    const editorInstance = new Editor(pluginManager);
    editorRef.current = editorInstance;
    return editorInstance;
  }, [config.plugins]);

  // Build EditorAPI - only run once on mount
  useEffect(() => {
    const api: EditorAPI = {
      getHTML: () => {
        const contentEl = editorContainerRef.current?.querySelector('.rte-content') as HTMLElement;
        return contentEl?.innerHTML || '';
      },
      setHTML: (html: string) => {
        const contentEl = editorContainerRef.current?.querySelector('.rte-content') as HTMLElement;
        if (contentEl) {
          contentEl.innerHTML = html;
        }
      },
      execCommand: (name: string, value?: any) => {
        if (typeof window !== 'undefined' && (window as any).executeEditorCommand) {
          (window as any).executeEditorCommand(name, value);
        }
      },
      registerCommand: (name: string, fn: (params?: any) => void) => {
        if (typeof window !== 'undefined' && (window as any).registerEditorCommand) {
          (window as any).registerEditorCommand(name, fn);
        }
      },
      focus: () => {
        const contentEl = editorContainerRef.current?.querySelector('.rte-content') as HTMLElement;
        contentEl?.focus();
      },
      blur: () => {
        const contentEl = editorContainerRef.current?.querySelector('.rte-content') as HTMLElement;
        contentEl?.blur();
      },
      destroy: () => {
        // Cleanup logic
        if (onDestroyRef.current) {
          onDestroyRef.current();
        }
      },
      onChange: (fn: (html: string) => void) => {
        // Subscribe to changes and return unsubscribe function
        return () => {};
      },
      getState: () => ({
        plugins: config.plugins,
        config,
      }),
      toolbar: { 
        items: (editor as any).toolbar?.items || [],
      },
    };
    
    apiRef.current = api;
    
    // Call onInit if provided
    if (onInitRef.current) {
      onInitRef.current(api);
    }
    
    return () => {
      if (onDestroyRef.current) {
        onDestroyRef.current();
      }
    };
  }, []); // Empty deps - only run once on mount

  // Status bar setup, updates, and event handling
  useEffect(() => {
    if (config.statusbar.enabled && statusBarElementRef.current && editorContainerRef.current) {
      // Create status bar if it doesn't exist
      if (!statusBarRef.current) {
        statusBarRef.current = new StatusBar({
          enabled: true,
          position: config.statusbar.position
        });
        statusBarRef.current.create(statusBarElementRef.current);
      }

      // Set up status bar updates
      const contentEl = editorContainerRef.current.querySelector('.rte-content') as HTMLElement;
      if (contentEl) {
        const hasFocusWithinEditor = () => {
          const activeElement = document.activeElement;
          return !!activeElement && (activeElement === contentEl || contentEl.contains(activeElement));
        };

        const getSelectionRangeInEditor = (): Range | null => {
          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) return null;

          const range = selection.getRangeAt(0);
          const commonAncestor = range.commonAncestorContainer;
          return contentEl.contains(commonAncestor) ? range : null;
        };

        const updateStatusBar = (fromSelectionEvent = false) => {
          const rangeInEditor = getSelectionRangeInEditor();
          const isRelevantSelectionChange = !!rangeInEditor || hasFocusWithinEditor();

          // Ignore selection changes that belong to other editors/DOM areas.
          if (fromSelectionEvent && !isRelevantSelectionChange) {
            return;
          }

          const text = contentEl.textContent || '';
          const { words, chars } = calculateTextStats(text);
          const lines = countLines(contentEl);

          let cursorPosition, selectionInfo;

          if (rangeInEditor) {
            cursorPosition = getCursorPosition(contentEl, rangeInEditor);

            if (!rangeInEditor.collapsed) {
              selectionInfo = getSelectionInfo(rangeInEditor, cursorPosition);
              cursorPosition = undefined; // Don't show cursor position when text is selected
            }
          }

          statusBarRef.current?.update({
            wordCount: words,
            charCount: chars,
            lineCount: lines,
            cursorPosition,
            selectionInfo
          });
        };

        const handleInput = () => updateStatusBar();
        const handleSelectionChange = () => updateStatusBar(true);
        const handleFocus = () => updateStatusBar();
        const handleBlur = () => updateStatusBar();

        // Add event listeners for real-time updates
        contentEl.addEventListener('input', handleInput);
        contentEl.addEventListener('focus', handleFocus);
        contentEl.addEventListener('blur', handleBlur);
        document.addEventListener('selectionchange', handleSelectionChange);

        // Initial update
        updateStatusBar();

        // Store cleanup function
        return () => {
          contentEl.removeEventListener('input', handleInput);
          contentEl.removeEventListener('focus', handleFocus);
          contentEl.removeEventListener('blur', handleBlur);
          document.removeEventListener('selectionchange', handleSelectionChange);
        };
      }
    } else {
      // Destroy status bar if disabled
      if (statusBarRef.current) {
        statusBarRef.current.destroy();
        statusBarRef.current = null;
      }
    }

    return () => {
      if (statusBarRef.current) {
        statusBarRef.current.destroy();
        statusBarRef.current = null;
      }
    };
  }, [config.statusbar.enabled, config.statusbar.position]);

  const floatingToolbarEnabled = config.toolbar.floating ?? false;
  const toolbarPosition = (config.toolbar as any).position || 'top';
  const stickyToolbar = config.toolbar.sticky ?? false;
  const showMoreOptions = config.toolbar.showMoreOptions ?? true;

  return (
    <DynamicProviderWrapper plugins={config.plugins}>
      <div
        ref={editorContainerRef}
        id={config.id}
        data-editora-editor
        className={`rte-editor ${config.className || ""}`}
        dir={config.language.direction}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {toolbarPosition !== 'bottom' && (
          <Toolbar 
            editor={editor}
            position={toolbarPosition}
            sticky={stickyToolbar}
            floating={floatingToolbarEnabled}
            showMoreOptions={showMoreOptions}
          />
        )}
        <EditorContent 
          editor={editor}
          defaultValue={config.defaultValue}
          value={config.value}
          placeholder={config.placeholder}
          onChange={config.onChange}
          pasteConfig={config.paste}
          contentConfig={config.content}
          securityConfig={config.security}
          performanceConfig={config.performance}
          autosaveConfig={config.autosave}
        />
        {toolbarPosition === 'bottom' && (
          <Toolbar 
            editor={editor}
            position={toolbarPosition}
            sticky={stickyToolbar}
            floating={floatingToolbarEnabled}
            showMoreOptions={showMoreOptions}
          />
        )}
        <FloatingToolbar
          editor={editor}
          isEnabled={floatingToolbarEnabled}
        />
        {config.statusbar.enabled && (
          <div 
            ref={statusBarElementRef}
            className="editora-statusbar-container"
            style={{ order: config.statusbar.position === 'top' ? -1 : 1 }}
          />
        )}
      </div>
    </DynamicProviderWrapper>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  return <EditorCore {...props} />;
};
