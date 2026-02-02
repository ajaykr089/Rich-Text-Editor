import React, { ReactNode } from 'react';
import { EmbedIframeDialog } from './EmbedIframeDialog';
import { findContentElement, findEditorContainerFromSelection } from '../../shared/editorContainerHelpers';

interface EmbedIframePluginProviderProps {
  children: ReactNode;
}

export const EmbedIframePluginProvider: React.FC<EmbedIframePluginProviderProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const commandRegistered = React.useRef(false);

  // Register command immediately when component mounts
  React.useLayoutEffect(() => {
    if (!commandRegistered.current && typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('openEmbedIframeDialog', () => {
        setIsDialogOpen(true);
      });
      commandRegistered.current = true;
    }
  }, []);

  const handleEmbed = (data: {
    src: string;
    width: string;
    height: string;
    aspectRatio: string;
    name?: string;
    title?: string;
    longDescription?: string;
    descriptionUrl?: string;
    showBorder: boolean;
    enableScrollbar: boolean;
  }) => {
    // Find editor from selection rather than activeElement (which may be dialog button)
    const editorContainer = findEditorContainerFromSelection();
    const contentEl = editorContainer ? findContentElement(editorContainer) : null;
    
    if (contentEl) {
      contentEl.focus();

      // Small delay to ensure focus is set
      setTimeout(() => {
        const attributes = [
          `src="${data.src}"`,
          `width="${data.width}"`,
          `height="${data.height}"`,
          'allowfullscreen',
          `frameborder="${data.showBorder ? '1' : '0'}"`,
          `scrolling="${data.enableScrollbar ? 'auto' : 'no'}"`,
        ];

        if (data.name) attributes.push(`name="${data.name}"`);
        if (data.title) attributes.push(`title="${data.title}"`);
        if (data.longDescription) attributes.push(`longdesc="${data.longDescription}"`);

        // Add CSS classes for responsive behavior
        const classes = [];
        if (data.aspectRatio !== 'inline') {
          classes.push(`rte-iframe-${data.aspectRatio}`);
        }

        const classAttr = classes.length > 0 ? `class="${classes.join(' ')}"` : '';
        const dataAttr = `data-aspect-ratio="${data.aspectRatio}"`;

        const iframeHtml = `<iframe ${attributes.join(' ')} ${classAttr} ${dataAttr}></iframe>`;

        const result = document.execCommand('insertHTML', false, iframeHtml);

        if (!result) {
          // Alternative approach: insert at cursor position using selection
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = iframeHtml;
            const fragment = document.createDocumentFragment();
            while (tempDiv.firstChild) {
              fragment.appendChild(tempDiv.firstChild);
            }
            range.insertNode(fragment);
          }
        }
      }, 10);
    }
  };

  return (
    <>
      {children}
      <EmbedIframeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onEmbed={handleEmbed}
      />
    </>
  );
};
