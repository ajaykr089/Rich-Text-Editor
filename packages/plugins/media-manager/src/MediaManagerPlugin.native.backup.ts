import { Plugin } from '@editora/core';

/**
 * Media Manager Plugin - Native Implementation
 * 
 * Features:
 * - Insert images and videos with full dialog UI
 * - Drag & drop file upload
 * - URL input with dimensions
 * - Inline resize handles (drag corners to resize)
 * - Floating toolbar on image selection
 * - Link images
 */

let savedSelection: Range | null = null;
let selectedMedia: HTMLImageElement | HTMLVideoElement | null = null;
let floatingToolbar: HTMLDivElement | null = null;
let resizeHandles: HTMLDivElement[] = [];
let isResizing = false;
let currentHandle: string | null = null;
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let aspectRatio = 1;

declare global {
  interface Window {
    __mediaManagerInitialized?: boolean;
  }
}

const showMediaDialog = (type: 'image' | 'video') => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedSelection = selection.getRangeAt(0).cloneRange();
  }

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 99999;';

  const dialog = document.createElement('div');
  dialog.style.cssText = 'background: white; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);';

  let activeTab: 'upload' | 'url' = 'upload';
  let urlValue = '';
  let widthValue = '';
  let heightValue = '';
  let altValue = '';

  const renderDialog = () => {
    dialog.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e1e5e9; background: #f8f9fa;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Insert ${type === 'image' ? 'Image' : 'Video'}</h2>
        <button class="close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #6c757d; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
      </div>

      <div class="tabs" style="display: flex; border-bottom: 1px solid #e1e5e9;">
        <button class="tab-upload" style="flex: 1; padding: 12px; border: none; background: ${activeTab === 'upload' ? '#007bff' : '#f8f9fa'}; color: ${activeTab === 'upload' ? 'white' : '#495057'}; cursor: pointer; font-weight: 500;">📤 Upload</button>
        <button class="tab-url" style="flex: 1; padding: 12px; border: none; background: ${activeTab === 'url' ? '#007bff' : '#f8f9fa'}; color: ${activeTab === 'url' ? 'white' : '#495057'}; cursor: pointer; font-weight: 500;">🔗 URL</button>
      </div>

      <div style="padding: 20px; overflow-y: auto; flex: 1;">
        ${activeTab === 'upload' ? `
          <div id="upload-section">
            <div class="dropzone" style="border: 2px dashed #ced4da; border-radius: 8px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.3s;">
              <div style="font-size: 48px; margin-bottom: 10px;">📁</div>
              <p style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px;">Drag and drop your ${type} here</p>
              <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px;">or click to browse</p>
              <p style="margin: 0; color: #6c757d; font-size: 12px;">Max file size: 50MB</p>
            </div>
            <input type="file" id="file-input" accept="${type === 'image' ? 'image/*' : 'video/*'}" style="display: none;">
            <div id="upload-progress" style="display: none; margin-top: 20px;">
              <div style="background: #e9ecef; border-radius: 4px; height: 8px; overflow: hidden;">
                <div id="progress-bar" style="background: #007bff; height: 100%; width: 0%; transition: width 0.3s;"></div>
              </div>
              <p id="progress-text" style="margin-top: 8px; text-align: center; color: #6c757d; font-size: 14px;">Uploading...</p>
            </div>
          </div>
        ` : `
          <div id="url-section">
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">URL:</label>
              <input type="text" id="url-input" placeholder="https://example.com/${type}.${type === 'image' ? 'jpg' : 'mp4'}" value="${urlValue}" style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
            </div>
            ${type === 'image' ? `
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Alt Text (for accessibility):</label>
                <input type="text" id="alt-input" placeholder="Describe the image" value="${altValue}" style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
              </div>
            ` : ''}
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
              <div>
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Width (px):</label>
                <input type="number" id="width-input" placeholder="Auto" value="${widthValue}" style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
              </div>
              <div>
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Height (px):</label>
                <input type="number" id="height-input" placeholder="Auto" value="${heightValue}" style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
              </div>
            </div>
            ${urlValue ? `
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Preview:</label>
                <div style="border: 1px solid #dee2e6; border-radius: 4px; padding: 10px; background: #f8f9fa; text-align: center;">
                  ${type === 'image' ? `<img src="${urlValue}" alt="Preview" style="max-width: 100%; max-height: 200px;">` : `<video src="${urlValue}" controls style="max-width: 100%; max-height: 200px;"></video>`}
                </div>
              </div>
            ` : ''}
          </div>
        `}
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 1px solid #e1e5e9; background: #f8f9fa;">
        <button class="cancel-btn" style="padding: 10px 20px; background: #fff; border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; font-size: 14px;">Cancel</button>
        <button id="insert-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" ${!urlValue && activeTab === 'url' ? 'disabled' : ''}>Insert</button>
      </div>
    `;
  };

  renderDialog();
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const closeDialog = () => document.body.removeChild(overlay);

  const insertMedia = () => {
    if (!urlValue) return;

    const mediaEl = type === 'image' ? document.createElement('img') : document.createElement('video');
    mediaEl.src = urlValue;
    mediaEl.setAttribute('data-media-type', type);
    
    if (type === 'image' && altValue) {
      (mediaEl as HTMLImageElement).alt = altValue;
    }
    if (widthValue) {
      mediaEl.style.width = `${widthValue}px`;
      mediaEl.setAttribute('width', widthValue);
    }
    if (heightValue) {
      mediaEl.style.height = `${heightValue}px`;
      mediaEl.setAttribute('height', heightValue);
    }
    
    if (type === 'video') {
      (mediaEl as HTMLVideoElement).controls = true;
    }

    if (!widthValue && !heightValue) {
      mediaEl.style.cssText = 'max-width: 100%; height: auto; display: block; margin: 1em 0; cursor: pointer;';
    } else {
      mediaEl.style.cssText = `display: block; margin: 1em 0; cursor: pointer; ${widthValue ? `width: ${widthValue}px;` : 'max-width: 100%;'} ${heightValue ? `height: ${heightValue}px;` : 'height: auto;'}`;
    }
    
    if (savedSelection) {
      savedSelection.deleteContents();
      savedSelection.insertNode(mediaEl);
    }

    closeDialog();
  };

  const handleFileUpload = async (file: File) => {
    const progressDiv = dialog.querySelector('#upload-progress') as HTMLDivElement;
    const progressBar = dialog.querySelector('#progress-bar') as HTMLDivElement;
    const progressText = dialog.querySelector('#progress-text') as HTMLParagraphElement;

    if (progressDiv && progressBar && progressText) {
      progressDiv.style.display = 'block';

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;
        progressBar.style.width = `${progress}%`;
      }, 200);

      try {
        const reader = new FileReader();
        reader.onload = () => {
          clearInterval(interval);
          progressBar.style.width = '100%';
          progressText.textContent = '✅ Upload complete';
          
          setTimeout(() => {
            urlValue = reader.result as string;
            activeTab = 'url';
            renderDialog();
            attachEventHandlers();
          }, 500);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        clearInterval(interval);
        progressText.textContent = '❌ Upload failed';
      }
    }
  };

  const attachEventHandlers = () => {
    const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
    const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
    const insertBtn = dialog.querySelector('#insert-btn') as HTMLButtonElement;
    const tabUpload = dialog.querySelector('.tab-upload') as HTMLButtonElement;
    const tabUrl = dialog.querySelector('.tab-url') as HTMLButtonElement;

    closeBtn?.addEventListener('click', closeDialog);
    cancelBtn?.addEventListener('click', closeDialog);
    insertBtn?.addEventListener('click', insertMedia);

    tabUpload?.addEventListener('click', () => {
      activeTab = 'upload';
      renderDialog();
      attachEventHandlers();
    });

    tabUrl?.addEventListener('click', () => {
      activeTab = 'url';
      renderDialog();
      attachEventHandlers();
    });

    if (activeTab === 'upload') {
      const dropzone = dialog.querySelector('.dropzone') as HTMLDivElement;
      const fileInput = dialog.querySelector('#file-input') as HTMLInputElement;

      dropzone?.addEventListener('click', () => fileInput?.click());
      
      dropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#007bff';
        dropzone.style.background = '#f0f8ff';
      });

      dropzone?.addEventListener('dragleave', () => {
        dropzone.style.borderColor = '#ced4da';
        dropzone.style.background = 'transparent';
      });

      dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#ced4da';
        dropzone.style.background = 'transparent';
        const file = e.dataTransfer?.files[0];
        if (file) handleFileUpload(file);
      });

      fileInput?.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleFileUpload(file);
      });
    }

    if (activeTab === 'url') {
      const urlInput = dialog.querySelector('#url-input') as HTMLInputElement;
      const altInput = dialog.querySelector('#alt-input') as HTMLInputElement;
      const widthInput = dialog.querySelector('#width-input') as HTMLInputElement;
      const heightInput = dialog.querySelector('#height-input') as HTMLInputElement;

      urlInput?.addEventListener('input', () => {
        urlValue = urlInput.value;
        renderDialog();
        attachEventHandlers();
      });

      altInput?.addEventListener('input', () => {
        altValue = altInput.value;
      });

      widthInput?.addEventListener('input', () => {
        widthValue = widthInput.value;
      });

      heightInput?.addEventListener('input', () => {
        heightValue = heightInput.value;
      });
    }
  };

  attachEventHandlers();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
};

// Create resize handles
const createResizeHandles = () => {
  const positions = ['nw', 'ne', 'sw', 'se'];
  positions.forEach(pos => {
    const handle = document.createElement('div');
    handle.className = `media-resize-handle-${pos}`;
    handle.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: #007bff;
      border: 2px solid white;
      border-radius: 50%;
      cursor: ${pos}-resize;
      z-index: 10001;
      display: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    `;
    handle.setAttribute('data-position', pos);
    document.body.appendChild(handle);
    resizeHandles.push(handle);
  });
};

// Update resize handle positions
const updateResizeHandles = () => {
  if (!selectedMedia) {
    resizeHandles.forEach(h => h.style.display = 'none');
    return;
  }

  const rect = selectedMedia.getBoundingClientRect();
  const positions = {
    nw: { x: rect.left - 5, y: rect.top - 5 },
    ne: { x: rect.right - 5, y: rect.top - 5 },
    sw: { x: rect.left - 5, y: rect.bottom - 5 },
    se: { x: rect.right - 5, y: rect.bottom - 5 }
  };

  resizeHandles.forEach(handle => {
    const pos = handle.getAttribute('data-position') as keyof typeof positions;
    const coord = positions[pos];
    handle.style.left = `${coord.x}px`;
    handle.style.top = `${coord.y}px`;
    handle.style.display = 'block';
  });
};

// Show floating toolbar
const showFloatingToolbar = (media: HTMLImageElement | HTMLVideoElement) => {
  if (floatingToolbar) floatingToolbar.remove();

  floatingToolbar = document.createElement('div');
  floatingToolbar.style.cssText = `
    position: fixed;
    background: white;
    border: 1px solid #ced4da;
    border-radius: 6px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    display: flex;
    gap: 4px;
    padding: 6px;
    z-index: 10000;
  `;

  const buttonStyle = 'padding: 8px 12px; border: none; background: white; cursor: pointer; border-radius: 4px; font-size: 14px; transition: background 0.2s; hover:background: #f8f9fa;';

  floatingToolbar.innerHTML = `
    <button class="btn-link" title="Add/Edit Link" style="${buttonStyle}">🔗 Link</button>
    <button class="btn-resize" title="Resize" style="${buttonStyle}">📐 Resize</button>
    <button class="btn-remove" title="Remove" style="${buttonStyle}">🗑️ Remove</button>
  `;

  const updatePosition = () => {
    if (!floatingToolbar || !selectedMedia) return;
    const rect = selectedMedia.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    floatingToolbar.style.top = `${rect.top + scrollTop - 50}px`;
    floatingToolbar.style.left = `${rect.left + rect.width / 2 - 120}px`;
  };

  updatePosition();
  document.body.appendChild(floatingToolbar);

  // Add hover effects
  floatingToolbar.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      (btn as HTMLElement).style.background = '#f8f9fa';
    });
    btn.addEventListener('mouseleave', () => {
      (btn as HTMLElement).style.background = 'white';
    });
  });

  floatingToolbar.querySelector('.btn-link')?.addEventListener('click', () => {
    const existingLink = (media as HTMLElement).closest('a');
    const currentHref = existingLink?.getAttribute('href') || '';
    const nextHref = prompt('Enter link URL (leave blank to remove):', currentHref);
    
    if (nextHref !== null) {
      const normalized = nextHref.trim() ? (nextHref.startsWith('http') ? nextHref : `https://${nextHref}`) : '';
      
      if (!normalized && existingLink) {
        existingLink.replaceWith(media);
      } else if (normalized) {
        if (existingLink) {
          existingLink.setAttribute('href', normalized);
        } else {
          const link = document.createElement('a');
          link.href = normalized;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          media.replaceWith(link);
          link.appendChild(media);
        }
      }
    }
  });

  floatingToolbar.querySelector('.btn-resize')?.addEventListener('click', () => {
    const width = prompt('Enter width in pixels:', String(media.width || media.offsetWidth));
    if (width && !isNaN(parseInt(width))) {
      const w = parseInt(width);
      media.style.width = `${w}px`;
      media.setAttribute('width', String(w));
      updateResizeHandles();
      updatePosition();
    }
  });

  floatingToolbar.querySelector('.btn-remove')?.addEventListener('click', () => {
    if (confirm('Remove this media?')) {
      media.remove();
      if (floatingToolbar) {
        floatingToolbar.remove();
        floatingToolbar = null;
      }
      selectedMedia = null;
      updateResizeHandles();
    }
  });

  window.addEventListener('scroll', updatePosition);
  window.addEventListener('resize', updatePosition);
};

// Initialize media manager
if (typeof window !== 'undefined' && !window.__mediaManagerInitialized) {
  window.__mediaManagerInitialized = true;

  const initMediaManager = () => {
    createResizeHandles();

    // Handle media click
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Check if clicked on media
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        const media = target as HTMLImageElement | HTMLVideoElement;
        
        // Only handle if inside contenteditable
        if (media.closest('[contenteditable="true"]')) {
          e.preventDefault();
          e.stopPropagation();
          selectedMedia = media;
          showFloatingToolbar(media);
          updateResizeHandles();
          return;
        }
      }

      // Check if clicked on toolbar buttons
      if (!target.closest('.btn-link, .btn-resize, .btn-remove')) {
        // Clicked outside - clear selection
        if (floatingToolbar && !target.closest('button')) {
          floatingToolbar.remove();
          floatingToolbar = null;
          selectedMedia = null;
          updateResizeHandles();
        }
      }
    });

    // Resize handlers
    resizeHandles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        if (!selectedMedia) return;
        e.preventDefault();
        e.stopPropagation();

        isResizing = true;
        currentHandle = handle.getAttribute('data-position');
        startX = e.clientX;
        startY = e.clientY;

        const rect = selectedMedia.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        aspectRatio = startWidth / startHeight;

        document.body.style.userSelect = 'none';
        document.body.style.cursor = `${currentHandle}-resize`;
      });
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing || !selectedMedia || !currentHandle) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      switch (currentHandle) {
        case 'se':
          newWidth = startWidth + deltaX;
          newHeight = startHeight + deltaY;
          break;
        case 'sw':
          newWidth = startWidth - deltaX;
          newHeight = startHeight + deltaY;
          break;
        case 'ne':
          newWidth = startWidth + deltaX;
          newHeight = startHeight - deltaY;
          break;
        case 'nw':
          newWidth = startWidth - deltaX;
          newHeight = startHeight - deltaY;
          break;
      }

      // Maintain aspect ratio (shift key optional)
      if (e.shiftKey || true) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
      }

      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);

      selectedMedia.style.width = `${newWidth}px`;
      selectedMedia.style.height = `${newHeight}px`;
      selectedMedia.setAttribute('width', String(Math.round(newWidth)));
      selectedMedia.setAttribute('height', String(Math.round(newHeight)));

      updateResizeHandles();
      if (floatingToolbar && selectedMedia) {
        const rect = selectedMedia.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        floatingToolbar.style.top = `${rect.top + scrollTop - 50}px`;
        floatingToolbar.style.left = `${rect.left + rect.width / 2 - 120}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        currentHandle = null;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    });

    // Update on scroll/resize
    window.addEventListener('scroll', updateResizeHandles);
    window.addEventListener('resize', updateResizeHandles);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMediaManager);
  } else {
    setTimeout(initMediaManager, 100);
  }
}

export const MediaManagerPlugin = (): Plugin => ({
  name: 'mediaManager',
  
  toolbar: [
    {
      label: 'Image',
      command: 'insertImage',
      icon: '<svg width="24px" height="24px" viewBox="0 0 32 32" enable-background="new 0 0 32 32"><g><rect fill="none" height="22" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" width="30" x="1" y="5"></rect><polygon fill="none" points="31,27 21,17 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><polygon fill="none" points="18,20 9,11 1,19 1,27 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><circle cx="19" cy="11" fill="none" r="2" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></circle></g></svg>'
    },
    {
      label: 'Video',
      command: 'insertVideo',
      icon: '<svg width="24" height="24" focusable="false"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fill-rule="nonzero"></path></svg>'
    }
  ],
  
  commands: {
    insertImage: () => {
      showMediaDialog('image');
      return true;
    },
    
    insertVideo: () => {
      showMediaDialog('video');
      return true;
    }
  },
  
  keymap: {
    'Mod-Shift-i': 'insertImage'
  }
});

  const renderDialog = () => {
    dialog.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e1e5e9; background: #f8f9fa;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Insert ${type === 'image' ? 'Image' : 'Video'}</h2>
        <button class="close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #6c757d; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
      </div>

      <div class="tabs" style="display: flex; border-bottom: 1px solid #e1e5e9;">
        <button class="tab-upload" style="flex: 1; padding: 12px; border: none; background: ${activeTab === 'upload' ? '#007bff' : '#f8f9fa'}; color: ${activeTab === 'upload' ? 'white' : '#495057'}; cursor: pointer; font-weight: 500;">📤 Upload</button>
        <button class="tab-url" style="flex: 1; padding: 12px; border: none; background: ${activeTab === 'url' ? '#007bff' : '#f8f9fa'}; color: ${activeTab === 'url' ? 'white' : '#495057'}; cursor: pointer; font-weight: 500;">🔗 URL</button>
      </div>

      <div style="padding: 20px; overflow-y: auto; flex: 1;">
        ${activeTab === 'upload' ? `
          <div id="upload-section">
            <div class="dropzone" style="border: 2px dashed #ced4da; border-radius: 8px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.3s;">
              <div style="font-size: 48px; margin-bottom: 10px;">📁</div>
              <p style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px;">Drag and drop your ${type} here</p>
              <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px;">or click to browse</p>
              <p style="margin: 0; color: #6c757d; font-size: 12px;">Max file size: 50MB</p>
            </div>
            <input type="file" id="file-input" accept="${type === 'image' ? 'image/*' : 'video/*'}" style="display: none;">
            <div id="upload-progress" style="display: none; margin-top: 20px;">
              <div style="background: #e9ecef; border-radius: 4px; height: 8px; overflow: hidden;">
                <div id="progress-bar" style="background: #007bff; height: 100%; width: 0%; transition: width 0.3s;"></div>
              </div>
              <p id="progress-text" style="margin-top: 8px; text-align: center; color: #6c757d; font-size: 14px;">Uploading...</p>
            </div>
          </div>
        ` : `
          <div id="url-section">
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">URL:</label>
              <input type="text" id="url-input" placeholder="https://example.com/${type}.${type === 'image' ? 'jpg' : 'mp4'}" value="${urlValue}" style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
            </div>
            ${type === 'image' ? `
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Alt Text (for accessibility):</label>
                <input type="text" id="alt-input" placeholder="Describe the image" value="${altValue}" style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
              </div>
            ` : ''}
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
              <div>
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Width (px):</label>
                <input type="number" id="width-input" placeholder="Auto" value="${widthValue}" style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
              </div>
              <div>
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Height (px):</label>
                <input type="number" id="height-input" placeholder="Auto" value="${heightValue}" style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
              </div>
            </div>
            ${urlValue ? `
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Preview:</label>
                <div style="border: 1px solid #dee2e6; border-radius: 4px; padding: 10px; background: #f8f9fa; text-align: center;">
                  ${type === 'image' ? `<img src="${urlValue}" alt="Preview" style="max-width: 100%; max-height: 200px;">` : `<video src="${urlValue}" controls style="max-width: 100%; max-height: 200px;"></video>`}
                </div>
              </div>
            ` : ''}
          </div>
        `}
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 1px solid #e1e5e9; background: #f8f9fa;">
        <button class="cancel-btn" style="padding: 10px 20px; background: #fff; border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; font-size: 14px;">Cancel</button>
        <button id="insert-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" ${!urlValue && activeTab === 'url' ? 'disabled' : ''}>Insert</button>
      </div>
    `;
  };

  renderDialog();
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
  const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
  const tabUpload = dialog.querySelector('.tab-upload') as HTMLButtonElement;
  const tabUrl = dialog.querySelector('.tab-url') as HTMLButtonElement;

  const closeDialog = () => document.body.removeChild(overlay);

  const insertMedia = () => {
    if (!urlValue) return;

    const mediaEl = type === 'image' ? document.createElement('img') : document.createElement('video');
    mediaEl.src = urlValue;
    
    if (type === 'image' && altValue) {
      (mediaEl as HTMLImageElement).alt = altValue;
    }
    if (widthValue) mediaEl.width = parseInt(widthValue);
    if (heightValue) mediaEl.height = parseInt(heightValue);
    
    if (type === 'video') {
      (mediaEl as HTMLVideoElement).controls = true;
    }

    mediaEl.style.cssText = 'max-width: 100%; height: auto; display: block; margin: 1em 0; cursor: pointer;';
    
    if (savedSelection) {
      savedSelection.deleteContents();
      savedSelection.insertNode(mediaEl);
    }

    closeDialog();
  };

  const handleFileUpload = async (file: File) => {
    const uploadSection = dialog.querySelector('#upload-section') as HTMLDivElement;
    const progressDiv = dialog.querySelector('#upload-progress') as HTMLDivElement;
    const progressBar = dialog.querySelector('#progress-bar') as HTMLDivElement;
    const progressText = dialog.querySelector('#progress-text') as HTMLParagraphElement;

    progressDiv.style.display = 'block';

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) progress = 90;
      progressBar.style.width = `${progress}%`;
    }, 200);

    try {
      // Convert to base64 (offline mode)
      const reader = new FileReader();
      reader.onload = () => {
        clearInterval(interval);
        progressBar.style.width = '100%';
        progressText.textContent = '✅ Upload complete';
        
        setTimeout(() => {
          urlValue = reader.result as string;
          activeTab = 'url';
          renderDialog();
          attachEventHandlers();
        }, 500);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      clearInterval(interval);
      progressText.textContent = '❌ Upload failed';
    }
  };

  const attachEventHandlers = () => {
    const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
    const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
    const insertBtn = dialog.querySelector('#insert-btn') as HTMLButtonElement;
    const tabUpload = dialog.querySelector('.tab-upload') as HTMLButtonElement;
    const tabUrl = dialog.querySelector('.tab-url') as HTMLButtonElement;

    closeBtn?.addEventListener('click', closeDialog);
    cancelBtn?.addEventListener('click', closeDialog);
    insertBtn?.addEventListener('click', insertMedia);

    tabUpload?.addEventListener('click', () => {
      activeTab = 'upload';
      renderDialog();
      attachEventHandlers();
    });

    tabUrl?.addEventListener('click', () => {
      activeTab = 'url';
      renderDialog();
      attachEventHandlers();
    });

    if (activeTab === 'upload') {
      const dropzone = dialog.querySelector('.dropzone') as HTMLDivElement;
      const fileInput = dialog.querySelector('#file-input') as HTMLInputElement;

      dropzone?.addEventListener('click', () => fileInput?.click());
      
      dropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#007bff';
        dropzone.style.background = '#f0f8ff';
      });

      dropzone?.addEventListener('dragleave', () => {
        dropzone.style.borderColor = '#ced4da';
        dropzone.style.background = 'transparent';
      });

      dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#ced4da';
        dropzone.style.background = 'transparent';
        const file = e.dataTransfer?.files[0];
        if (file) handleFileUpload(file);
      });

      fileInput?.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleFileUpload(file);
      });
    }

    if (activeTab === 'url') {
      const urlInput = dialog.querySelector('#url-input') as HTMLInputElement;
      const altInput = dialog.querySelector('#alt-input') as HTMLInputElement;
      const widthInput = dialog.querySelector('#width-input') as HTMLInputElement;
      const heightInput = dialog.querySelector('#height-input') as HTMLInputElement;

      urlInput?.addEventListener('input', () => {
        urlValue = urlInput.value;
        renderDialog();
        attachEventHandlers();
      });

      altInput?.addEventListener('input', () => {
        altValue = altInput.value;
      });

      widthInput?.addEventListener('input', () => {
        widthValue = widthInput.value;
      });

      heightInput?.addEventListener('input', () => {
        heightValue = heightInput.value;
      });
    }
  };

  attachEventHandlers();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
};

// Initialize image selection and floating toolbar
if (typeof window !== 'undefined' && !window.__mediaManagerInitialized) {
  window.__mediaManagerInitialized = true;

  const initMediaManager = () => {
    let floatingToolbar: HTMLDivElement | null = null;

    const showFloatingToolbar = (img: HTMLImageElement) => {
      if (floatingToolbar) floatingToolbar.remove();

      floatingToolbar = document.createElement('div');
      floatingToolbar.style.cssText = 'position: absolute; background: white; border: 1px solid #ced4da; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: flex; gap: 4px; padding: 4px; z-index: 10000;';

      floatingToolbar.innerHTML = `
        <button class="btn-link" title="Link" style="padding: 6px 10px; border: none; background: white; cursor: pointer; border-radius: 3px; font-size: 14px;">🔗</button>
        <button class="btn-resize" title="Resize" style="padding: 6px 10px; border: none; background: white; cursor: pointer; border-radius: 3px; font-size: 14px;">📐</button>
        <button class="btn-remove" title="Remove" style="padding: 6px 10px; border: none; background: white; cursor: pointer; border-radius: 3px; font-size: 14px;">🗑️</button>
      `;

      const updatePosition = () => {
        const rect = img.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        floatingToolbar!.style.top = `${rect.top + scrollTop - 40}px`;
        floatingToolbar!.style.left = `${rect.left + rect.width / 2 - 75}px`;
      };

      updatePosition();
      document.body.appendChild(floatingToolbar);

      floatingToolbar.querySelector('.btn-link')?.addEventListener('click', () => {
        const existingLink = img.closest('a');
        const currentHref = existingLink?.getAttribute('href') || '';
        const nextHref = prompt('Enter link URL (leave blank to remove):', currentHref);
        
        if (nextHref !== null) {
          const normalized = nextHref.trim() ? (nextHref.startsWith('http') ? nextHref : `https://${nextHref}`) : '';
          
          if (!normalized && existingLink) {
            existingLink.replaceWith(img);
          } else if (normalized) {
            if (existingLink) {
              existingLink.setAttribute('href', normalized);
            } else {
              const link = document.createElement('a');
              link.href = normalized;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              img.replaceWith(link);
              link.appendChild(img);
            }
          }
        }
      });

      floatingToolbar.querySelector('.btn-resize')?.addEventListener('click', () => {
        const width = prompt('Enter width in pixels:', String(img.width || ''));
        if (width) img.width = parseInt(width);
      });

      floatingToolbar.querySelector('.btn-remove')?.addEventListener('click', () => {
        if (confirm('Remove this image?')) {
          img.remove();
          floatingToolbar?.remove();
          floatingToolbar = null;
        }
      });

      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    };

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const img = target.closest('img');
      
      if (img && img.closest('[contenteditable="true"]')) {
        e.preventDefault();
        selectedImage = img as HTMLImageElement;
        showFloatingToolbar(img as HTMLImageElement);
      } else if (!target.closest('.btn-link, .btn-resize, .btn-remove') && floatingToolbar) {
        floatingToolbar.remove();
        floatingToolbar = null;
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMediaManager);
  } else {
    setTimeout(initMediaManager, 100);
  }
}

export const MediaManagerPlugin = (): Plugin => ({
  name: 'mediaManager',
  
  toolbar: [
    {
      label: 'Image',
      command: 'insertImage',
      icon: '<svg width="24px" height="24px" viewBox="0 0 32 32" enable-background="new 0 0 32 32"><g><rect fill="none" height="22" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" width="30" x="1" y="5"></rect><polygon fill="none" points="31,27 21,17 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><polygon fill="none" points="18,20 9,11 1,19 1,27 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><circle cx="19" cy="11" fill="none" r="2" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></circle></g></svg>'
    },
    {
      label: 'Video',
      command: 'insertVideo',
      icon: '<svg width="24" height="24" focusable="false"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fill-rule="nonzero"></path></svg>'
    }
  ],
  
  commands: {
    insertImage: () => {
      showMediaDialog('image');
      return true;
    },
    
    insertVideo: () => {
      showMediaDialog('video');
      return true;
    }
  },
  
  keymap: {
    'Mod-Shift-i': 'insertImage'
  }
});
