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
