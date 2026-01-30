import React, { ReactNode, useRef } from 'react';

interface HistoryPluginProviderProps {
  children: ReactNode;
}

export const HistoryPluginProvider: React.FC<HistoryPluginProviderProps> = ({ children }) => {
  // DOM undo/redo stack for a11y auto-fix
  const domUndoStack = useRef<Array<() => void>>([]);
  const domRedoStack = useRef<Array<() => void>>([]);

  // Command registry and dispatcher
  const commandHandlers = useRef<Record<string, (...args: any[]) => void>>({});
  const registerCommand = (command: string, handler: (...args: any[]) => void) => {
    commandHandlers.current[command] = handler;
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };
  if (typeof window !== 'undefined' && !(window as any).execEditorCommand) {
    (window as any).execEditorCommand = (cmd: string, ...args: any[]) => {
      if (commandHandlers.current[cmd]) {
        commandHandlers.current[cmd](...args);
      }
    };
  }

  React.useEffect(() => {
    // Native undo/redo for contenteditable
    registerCommand('undo', () => {
      document.execCommand('undo', false);
    });
    registerCommand('redo', () => {
      document.execCommand('redo', false);
    });

    // DOM attribute set for a11y auto-fix
    registerCommand('setAttribute', (el: HTMLElement, attr: string, value: string) => {
      const prev = el.getAttribute(attr);
      el.setAttribute(attr, value);
      domUndoStack.current.push(() => {
        if (prev == null) el.removeAttribute(attr);
        else el.setAttribute(attr, prev);
      });
      domRedoStack.current = [];
    });

    // DOM auto-fix for a11y
    registerCommand('autoFixA11y', (issue: any) => {
      const el = issue.element;
      if (!el) return;
      const rule = (window as any).a11yRuleRegistry?.find((r: any) => r.id === issue.rule);
      let undoFn = null;
      if (rule && rule.fix) {
        const prevAttrs: Record<string, string | null> = {};
        for (const attr of el.getAttributeNames()) {
          prevAttrs[attr] = el.getAttribute(attr);
        }
        rule.fix(issue);
        undoFn = () => {
          for (const attr of Object.keys(prevAttrs)) {
            if (prevAttrs[attr] == null) el.removeAttribute(attr);
            else el.setAttribute(attr, prevAttrs[attr]!);
          }
        };
      }
      if (undoFn) domUndoStack.current.push(undoFn);
      domRedoStack.current = [];
    });

    // Undo/redo for DOM changes
    registerCommand('undoDom', () => {
      const fn = domUndoStack.current.pop();
      if (fn) {
        fn();
        domRedoStack.current.push(fn);
      }
    });
    registerCommand('redoDom', () => {
      const fn = domRedoStack.current.pop();
      if (fn) {
        fn();
        domUndoStack.current.push(fn);
      }
    });
        // DOM text content set for a11y auto-fix
    registerCommand('setText', (el: HTMLElement, value: string) => {
      const prev = el.textContent;
      el.textContent = value;
      domUndoStack.current.push(() => {
        el.textContent = prev ?? '';
      });
      domRedoStack.current = [];
    });
  }, []);

  return <>{children}</>;
};
