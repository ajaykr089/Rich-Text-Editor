import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { MediaDialog } from './components/MediaDialogAdvanced';
import { RichTextEditorAdapter } from './adapters/EditorAdapter';
import { MediaManager } from './MediaManager';
import { ImageResizer } from './utils/resizable';
import { usePluginContext } from '../../../react/src/components/PluginManager';
import './components/MediaDialogAdvanced.css';
import './components/MediaResize.css';

interface MediaContextType {
  openImageDialog: () => void;
  openVideoDialog: () => void;
  setManager: (manager: MediaManager | null) => void;
  manager: MediaManager | null;
}

const MediaContext = createContext<MediaContextType | null>(null);

export const useMediaContext = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMediaContext must be used within MediaProvider');
  }
  return context;
};

interface MediaProviderProps {
  children: ReactNode;
  mediaConfig?: {
    uploadUrl: string;
    libraryUrl: string;
    maxFileSize: number;
    allowedTypes: string[];
  };
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ children, mediaConfig }) => {
  const { registerCommand } = usePluginContext();

  const [manager, setManager] = useState<MediaManager | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'image' | 'video'>('image');
  const resizerRef = useRef<ImageResizer | null>(null);

  const openImageDialog = () => {
    setDialogType('image');
    setDialogOpen(true);
  };

  const openVideoDialog = () => {
    setDialogType('video');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (mediaConfig) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        const contentEl = document.querySelector('.rte-content') as HTMLElement;
        if (contentEl) {
          const adapter = new RichTextEditorAdapter(contentEl);
          const mediaManager = new MediaManager(adapter, mediaConfig);
          setManager(mediaManager);

          // Initialize image resizer
          if (!resizerRef.current) {
            resizerRef.current = new ImageResizer(contentEl);
          }
        }
      }, 100);
    }

    // Cleanup on unmount
    return () => {
      if (resizerRef.current) {
        resizerRef.current.destroy();
        resizerRef.current = null;
      }
    };
  }, [mediaConfig]);

  React.useEffect(() => {
    registerCommand('insertImage', openImageDialog);
    registerCommand('insertVideo', openVideoDialog);
  }, [registerCommand]);

  const contextValue: MediaContextType = {
    openImageDialog,
    openVideoDialog,
    setManager,
    manager,
  };

  return (
    <MediaContext.Provider value={contextValue}>
      {children}
      {dialogOpen && manager && (
        <MediaDialog manager={manager} type={dialogType} onClose={closeDialog} />
      )}
    </MediaContext.Provider>
  );
};
