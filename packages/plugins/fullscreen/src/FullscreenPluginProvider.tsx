import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Editor } from '@editora/core';
import styles from './FullscreenPlugin.module.css';

interface FullscreenContextType {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

interface FullscreenPluginProviderProps {
  children: ReactNode;
  editor?: Editor;
}

export const FullscreenPluginProvider: React.FC<FullscreenPluginProviderProps> = ({
  children,
  editor
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  React.useEffect(() => {
    // Register commands with global system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(
        "toggleFullscreen",
        toggleFullscreen,
      );
    }
  }, [toggleFullscreen]);

  // Handle editor commands for fullscreen
  React.useEffect(() => {
    if (!editor) return;

    const handleCommand = (command: string) => {
      if (command === 'toggleFullscreen') {
        toggleFullscreen();
      }
    };

    // Register command handler (if editor supports it)
    // This would depend on your Editor implementation
  }, [editor, toggleFullscreen]);

  // Handle escape key to exit fullscreen
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Apply fullscreen styles to document and update button state
  React.useEffect(() => {
    const editorElement = document.querySelector('[data-editora-editor]');
    const fullscreenButton = document.querySelector('[data-command="toggleFullscreen"]') as HTMLButtonElement;
    
    if (!editorElement) return;

    if (isFullscreen) {
      editorElement.classList.add(styles.fullscreenActive);
      document.body.style.overflow = 'hidden';
      if (fullscreenButton) {
        fullscreenButton.setAttribute('data-active', 'true');
      }
    } else {
      editorElement.classList.remove(styles.fullscreenActive);
      document.body.style.overflow = '';
      if (fullscreenButton) {
        fullscreenButton.setAttribute('data-active', 'false');
      }
    }

    return () => {
      editorElement.classList.remove(styles.fullscreenActive);
      document.body.style.overflow = '';
      if (fullscreenButton) {
        fullscreenButton.setAttribute('data-active', 'false');
      }
    };
  }, [isFullscreen]);

  return (
    <FullscreenContext.Provider value={{ isFullscreen, toggleFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
};

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (!context) {
    throw new Error('useFullscreen must be used within FullscreenPluginProvider');
  }
  return context;
};
