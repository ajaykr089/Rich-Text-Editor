import React from 'react';
import {
  Plugin,
  Command,
  EditorState,
  NodeType,
  Fragment
} from '@rte-editor/core';

/**
 * Image upload configuration.
 */
export interface ImageUploadConfig {
  /** Upload endpoint URL */
  uploadUrl?: string;
  /** HTTP method for upload */
  method?: 'POST' | 'PUT';
  /** Additional headers */
  headers?: Record<string, string>;
  /** File size limit in bytes */
  maxSize?: number;
  /** Allowed MIME types */
  allowedTypes?: string[];
  /** Custom upload function */
  uploadFunction?: (file: File) => Promise<string>;
}

/**
 * Image plugin for rich text editor.
 * Provides comprehensive image handling with upload, drag-drop, and custom node views.
 */
export class ImagePlugin extends Plugin {
  private config: ImageUploadConfig;

  constructor(config: ImageUploadConfig = {}) {
    super({
      name: 'image',
      schema: {
        nodes: {
          image: {
            inline: true,
            attrs: {
              src: { default: null },
              alt: { default: '' },
              title: { default: '' },
              width: { default: null },
              height: { default: null },
              align: { default: 'center' }, // left, center, right
              caption: { default: '' }
            },
            group: 'inline',
            draggable: true,
            parseDOM: [{
              tag: 'img[src]',
              getAttrs: (dom: HTMLElement) => ({
                src: dom.getAttribute('src'),
                alt: dom.getAttribute('alt') || '',
                title: dom.getAttribute('title') || ''
              })
            }],
            toDOM: (node) => ['img', node.attrs]
          }
        }
      },
      commands: {
        insertImage: (src: string, attrs?: any) => insertImageCommand(src, attrs),
        uploadImage: () => uploadImageCommand()
      },
      toolbar: {
        items: [{
          id: 'insert-image',
          icon: '🖼️', // Image icon
          label: 'Insert Image',
          command: 'uploadImage'
        }]
      },
      keybindings: {
        // No default keybinding for image insertion (use toolbar)
      },
      nodeViews: {
        image: ImageNodeView
      }
    });

    this.config = {
      uploadUrl: '/api/upload',
      method: 'POST',
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      ...config
    };
  }

  /**
   * Get the upload configuration.
   */
  getUploadConfig(): ImageUploadConfig {
    return this.config;
  }

  /**
   * Validate an image file.
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    if (this.config.maxSize && file.size > this.config.maxSize) {
      return { valid: false, error: `File size exceeds ${this.config.maxSize} bytes` };
    }

    if (this.config.allowedTypes && !this.config.allowedTypes.includes(file.type)) {
      return { valid: false, error: `File type ${file.type} not allowed` };
    }

    return { valid: true };
  }

  /**
   * Upload an image file.
   */
  async uploadFile(file: File): Promise<string> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    if (this.config.uploadFunction) {
      return this.config.uploadFunction(file);
    }

    // Default upload implementation
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(this.config.uploadUrl!, {
      method: this.config.method,
      headers: this.config.headers,
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.url || result.src;
  }
}

/**
 * Insert image command.
 */
function insertImageCommand(src: string, attrs: any = {}): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const imageType = state.schema.nodes.image;

    if (!imageType) {
      return false;
    }

    if (dispatch) {
      const node = imageType.create({
        src,
        alt: attrs.alt || '',
        title: attrs.title || '',
        ...attrs
      });

      const tr = state.tr;
      tr.replaceSelectionWith(node);
      dispatch(tr);
    }

    return true;
  };
}

/**
 * Upload image command (triggers file picker).
 */
function uploadImageCommand(): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // The actual upload would be handled by the plugin's uploadFile method
      // This is just the command interface
      console.log('Selected file:', file.name);
      // In a real implementation, this would trigger the upload and insert
    };

    input.click();
    return true;
  };
}

/**
 * Custom node view for image rendering with interactive controls.
 */
const ImageNodeView: any = (node: any, view: any, getPos: () => number) => {
  const dom = document.createElement('div');
  dom.className = 'rte-image-wrapper';

  const img = document.createElement('img');
  img.src = node.attrs.src;
  img.alt = node.attrs.alt || '';
  img.title = node.attrs.title || '';
  img.className = 'rte-image';

  // Apply styling
  if (node.attrs.width) img.style.width = node.attrs.width + 'px';
  if (node.attrs.height) img.style.height = node.attrs.height + 'px';
  img.style.display = 'block';
  img.style.margin = node.attrs.align === 'center' ? '0 auto' :
                    node.attrs.align === 'right' ? '0 0 0 auto' : '0';

  // Caption
  let caption: HTMLElement | null = null;
  if (node.attrs.caption) {
    caption = document.createElement('figcaption');
    caption.className = 'rte-image-caption';
    caption.textContent = node.attrs.caption;
  }

  // Controls overlay (shown on hover)
  const controls = document.createElement('div');
  controls.className = 'rte-image-controls';
  controls.innerHTML = `
    <button class="rte-image-edit" title="Edit">✏️</button>
    <button class="rte-image-resize" title="Resize">↔️</button>
    <button class="rte-image-align-left" title="Align Left">⬅️</button>
    <button class="rte-image-align-center" title="Align Center">⬌</button>
    <button class="rte-image-align-right" title="Align Right">➡️</button>
    <button class="rte-image-delete" title="Delete">🗑️</button>
  `;

  // Add elements to wrapper
  dom.appendChild(img);
  if (caption) dom.appendChild(caption);
  dom.appendChild(controls);

  // Control event handlers
  controls.querySelector('.rte-image-edit')?.addEventListener('click', () => {
    // Open edit dialog
    console.log('Edit image');
  });

  controls.querySelector('.rte-image-delete')?.addEventListener('click', () => {
    // Delete image
    const tr = view.state.tr;
    tr.delete(getPos(), getPos() + 1);
    view.dispatch(tr);
  });

  controls.querySelector('.rte-image-align-left')?.addEventListener('click', () => {
    updateImageAlignment('left');
  });

  controls.querySelector('.rte-image-align-center')?.addEventListener('click', () => {
    updateImageAlignment('center');
  });

  controls.querySelector('.rte-image-align-right')?.addEventListener('click', () => {
    updateImageAlignment('right');
  });

  const updateImageAlignment = (align: string) => {
    const tr = view.state.tr;
    tr.setNodeMarkup(getPos(), null, { ...node.attrs, align });
    view.dispatch(tr);
  };

  // Show/hide controls on hover
  dom.addEventListener('mouseenter', () => {
    controls.style.display = 'flex';
  });

  dom.addEventListener('mouseleave', () => {
    controls.style.display = 'none';
  });

  return {
    dom,
    update: (node: any) => {
      // Update image attributes
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || '';
      img.title = node.attrs.title || '';

      if (node.attrs.width) img.style.width = node.attrs.width + 'px';
      if (node.attrs.height) img.style.height = node.attrs.height + 'px';
      img.style.margin = node.attrs.align === 'center' ? '0 auto' :
                        node.attrs.align === 'right' ? '0 0 0 auto' : '0';

      // Update caption
      if (node.attrs.caption) {
        if (!caption) {
          caption = document.createElement('figcaption');
          caption.className = 'rte-image-caption';
          dom.insertBefore(caption, controls);
        }
        caption.textContent = node.attrs.caption;
      } else if (caption) {
        dom.removeChild(caption);
        caption = null;
      }

      return true;
    },
    destroy: () => {
      // Cleanup
    }
  };
};

/**
 * Create an image plugin instance.
 */
export function createImagePlugin(config?: ImageUploadConfig): ImagePlugin {
  return new ImagePlugin(config);
}