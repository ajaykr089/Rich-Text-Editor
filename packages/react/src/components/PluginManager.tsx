import React, { createContext, useContext, ReactNode } from 'react';
import { Plugin } from '@rte-editor/core';

// Plugin Context Types
interface PluginContextType {
  executeCommand: (command: string, params?: any) => void;
  registerCommand: (command: string, handler: (params?: any) => void) => void;
  getCommandHandler: (command: string) => ((params?: any) => void) | undefined;
}

const PluginContext = createContext<PluginContextType | null>(null);

export const usePluginContext = () => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePluginContext must be used within PluginProvider');
  }
  return context;
};

// Plugin Provider Component
interface PluginProviderProps {
  plugins: Plugin[];
  children: ReactNode;
}

export const PluginProvider: React.FC<PluginProviderProps> = ({ plugins, children }) => {
  const commandHandlers = new Map<string, (params?: any) => void>();

  const executeCommand = (command: string, params?: any) => {
    const handler = commandHandlers.get(command);
    if (handler) {
      handler(params);
    } else {
      console.warn(`No handler registered for command: ${command}`);
    }
  };

  const registerCommand = (command: string, handler: (params?: any) => void) => {
    commandHandlers.set(command, handler);
  };

  const getCommandHandler = (command: string) => {
    return commandHandlers.get(command);
  };

  const contextValue: PluginContextType = {
    executeCommand,
    registerCommand,
    getCommandHandler,
  };

  return (
    <PluginContext.Provider value={contextValue}>
      {children}
    </PluginContext.Provider>
  );
};

// Individual Plugin Providers
export const BoldPluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('toggleBold', () => {
      document.execCommand('bold', false);
    });
  }, [registerCommand]);

  return <>{children}</>;
};

export const ItalicPluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('toggleItalic', () => {
      document.execCommand('italic', false);
    });
  }, [registerCommand]);

  return <>{children}</>;
};

export const UnderlinePluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('toggleUnderline', () => {
      document.execCommand('underline', false);
    });
  }, [registerCommand]);

  return <>{children}</>;
};

export const StrikethroughPluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('toggleStrikethrough', () => {
      document.execCommand('strikeThrough', false);
    });
  }, [registerCommand]);

  return <>{children}</>;
};

export const CodePluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('toggleCode', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const code = document.createElement('code');
        range.surroundContents(code);
      }
    });
  }, [registerCommand]);

  return <>{children}</>;
};

export const ListPluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('toggleBulletList', () => {
      document.execCommand('insertUnorderedList', false);
    });

    registerCommand('toggleOrderedList', () => {
      document.execCommand('insertOrderedList', false);
    });
  }, [registerCommand]);

  return <>{children}</>;
};

export const BlockquotePluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('toggleBlockquote', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const currentBlock =
          range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? range.commonAncestorContainer.parentElement
            : range.commonAncestorContainer;

        const blockquote = (currentBlock as Element)?.closest?.("blockquote");
        if (blockquote) {
          // Already in blockquote, convert to paragraph
          document.execCommand("formatBlock", false, "p");
        } else {
          // Not in blockquote, convert to blockquote
          document.execCommand("formatBlock", false, "blockquote");
        }
      }
    });
  }, [registerCommand]);

  return <>{children}</>;
};

export const ClearFormattingPluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('clearFormatting', () => {
      // Remove all formatting from selected text
      document.execCommand('removeFormat', false);
      // Also remove links if present
      document.execCommand('unlink', false);
    });
  }, [registerCommand]);

  return <>{children}</>;
};

export const HistoryPluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('undo', () => {
      document.execCommand('undo', false);
    });

    registerCommand('redo', () => {
      document.execCommand('redo', false);
    });
  }, [registerCommand]);

  return <>{children}</>;
};

export const HeadingPluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('setBlockType', (value?: string) => {
      if (value === "blockquote") {
        // Toggle blockquote - check if current selection is already in a blockquote
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const currentBlock =
            range.commonAncestorContainer.nodeType === Node.TEXT_NODE
              ? range.commonAncestorContainer.parentElement
              : range.commonAncestorContainer;

          const blockquote = (currentBlock as Element)?.closest?.(
            "blockquote"
          );
          if (blockquote) {
            // Already in blockquote, convert to paragraph
            document.execCommand("formatBlock", false, "p");
          } else {
            // Not in blockquote, convert to blockquote
            document.execCommand("formatBlock", false, "blockquote");
          }
        }
      } else if (value) {
        document.execCommand("formatBlock", false, value);
      }
    });
  }, [registerCommand]);

  return <>{children}</>;
};

export const DocumentManagerPluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    // Import commands will trigger file dialogs
    registerCommand('importWord', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.docx';
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            // Get the editor element to set content
            const editorElement = document.querySelector('[contenteditable="true"]') as HTMLElement;
            if (editorElement) {
              // Import the Word document
              const { importFromWord } = await import('../../../plugins/document-manager/src/documentManager');
              const htmlContent = await importFromWord(file);

              // Set the content in the editor by dispatching an input event
              editorElement.innerHTML = htmlContent;
              editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            }
          } catch (error) {
            console.error('Import failed:', error);
            alert('Failed to import Word document. Please check the console for details.');
          }
        }
      };
      input.click();
    });

    registerCommand('exportWord', async () => {
      try {
        // Get the editor content
        const editorElement = document.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editorElement) {
          const htmlContent = editorElement.innerHTML;

          // Export to Word
          const { exportToWord } = await import('../../../plugins/document-manager/src/documentManager');
          await exportToWord(htmlContent, 'document.docx');
        }
      } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export to Word. Please check the console for details.');
      }
    });

    registerCommand('exportPdf', async () => {
      try {
        // Get the editor content
        const editorElement = document.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editorElement) {
          const htmlContent = editorElement.innerHTML;

          // Export to PDF
          const { exportToPdf } = await import('../../../plugins/document-manager/src/documentManager');
          await exportToPdf(htmlContent, 'document.pdf', editorElement);
        }
      } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export to PDF. Please check the console for details.');
      }
    });
  }, [registerCommand]);

  return <>{children}</>;
};
