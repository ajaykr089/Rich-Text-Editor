import type { Plugin } from '@editora/core';
import { ImageDialog } from '@editora/core/ui';

/**
 * ImagePlugin - Native implementation for image insertion
 * 
 * Features:
 * - Opens image dialog for URL/upload
 * - Inserts images with alt text, dimensions, alignment
 * - Uses native ImageDialog component
 * - Supports image node in schema
 * 
 * Commands:
 * - openImageDialog: Opens the image insertion dialog
 * - insertImage: Inserts an image with specified attributes
 */
export const ImagePlugin = (): Plugin => {
  let imageDialog: ImageDialog | null = null;

  return {
    name: 'image',
    
    nodes: {
      image: {
        inline: false,
        attrs: {
          src: { default: null },
          alt: { default: null },
          title: { default: null },
          width: { default: null },
          height: { default: null },
          align: { default: null }
        },
        group: 'block',
        draggable: true,
        parseDOM: [
          {
            tag: 'img[src]',
            getAttrs: (dom) => {
              const element = dom as HTMLElement;
              return {
                src: element.getAttribute('src'),
                alt: element.getAttribute('alt'),
                title: element.getAttribute('title'),
                width: element.getAttribute('width'),
                height: element.getAttribute('height'),
                align: element.style.float || element.getAttribute('align')
              };
            }
          }
        ],
        toDOM: (node) => {
          const attrs: any = {
            src: node.attrs.src,
            alt: node.attrs.alt || '',
            title: node.attrs.title || ''
          };
          
          if (node.attrs.width) attrs.width = node.attrs.width;
          if (node.attrs.height) attrs.height = node.attrs.height;
          if (node.attrs.align) attrs.style = `float: ${node.attrs.align}`;
          
          return ['img', attrs];
        }
      }
    },

    toolbar: [
      {
        label: 'Insert Image',
        command: 'openImageDialog',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>`,
        shortcut: 'Mod-Shift-i'
      }
    ],

    commands: {
      openImageDialog: () => {
        // Create and show image dialog
        if (!imageDialog) {
          imageDialog = new ImageDialog({
            onSubmit: (imageData) => {
              // Insert the image
              const { src, alt, title, width, height, align } = imageData;
              
              // Create img element
              const img = document.createElement('img');
              img.src = src;
              if (alt) img.alt = alt;
              if (title) img.title = title;
              if (width) img.width = parseInt(width);
              if (height) img.height = parseInt(height);
              if (align) img.style.float = align;
              
              // Insert at cursor position
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(img);
                
                // Move cursor after image
                range.setStartAfter(img);
                range.setEndAfter(img);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          });
        }

        imageDialog.show();
        return true;
      },

      insertImage: (attrs?: { src: string; alt?: string; title?: string; width?: string; height?: string; align?: string }) => {
        if (!attrs || !attrs.src) return false;
        
        try {
          const img = document.createElement('img');
          img.src = attrs.src;
          if (attrs.alt) img.alt = attrs.alt;
          if (attrs.title) img.title = attrs.title;
          if (attrs.width) img.width = parseInt(attrs.width);
          if (attrs.height) img.height = parseInt(attrs.height);
          if (attrs.align) img.style.float = attrs.align;
          
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(img);
            
            range.setStartAfter(img);
            range.setEndAfter(img);
            selection.removeAllRanges();
            selection.addRange(range);
            
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to insert image:', error);
          return false;
        }
      }
    },

    keymap: {
      'Mod-Shift-i': 'openImageDialog'
    }
  };
};
