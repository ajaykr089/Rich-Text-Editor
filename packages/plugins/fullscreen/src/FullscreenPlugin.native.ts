import { Plugin } from '@editora/core';

/**
 * Fullscreen Plugin - Native Implementation
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 * 
 * Provides fullscreen editing mode with:
 * - CSS-based fullscreen (no Fullscreen API dependency)
 * - Escape key to exit
 * - Button state tracking
 * - Smooth transitions
 * - Body scroll lock
 */

// Track fullscreen state
let isFullscreen = false;
let editorElement: HTMLElement | null = null;
let fullscreenButton: HTMLButtonElement | null = null;

// CSS classes and styles
const FULLSCREEN_CLASS = 'rte-fullscreen-active';
const FULLSCREEN_BUTTON_SELECTOR = '[data-command="toggleFullscreen"]';

/**
 * Apply fullscreen styles to editor
 */
const applyFullscreenStyles = () => {
  if (!editorElement) return;

  // Add fullscreen class
  editorElement.classList.add(FULLSCREEN_CLASS);

  // Apply inline styles for maximum compatibility
  editorElement.style.position = 'fixed';
  editorElement.style.top = '0';
  editorElement.style.left = '0';
  editorElement.style.right = '0';
  editorElement.style.bottom = '0';
  editorElement.style.width = '100%';
  editorElement.style.height = '100%';
  editorElement.style.maxWidth = '100%';
  editorElement.style.maxHeight = '100%';
  editorElement.style.borderRadius = '0';
  editorElement.style.zIndex = '9999';
  editorElement.style.margin = '0';
  editorElement.style.padding = '0';
  editorElement.style.boxShadow = 'none';
  editorElement.style.display = 'flex';
  editorElement.style.flexDirection = 'column';
  editorElement.style.background = 'white';

  // Lock body scroll
  document.body.style.overflow = 'hidden';
  document.body.classList.add('fullscreen-active');

  // Update button state
  if (fullscreenButton) {
    fullscreenButton.setAttribute('data-active', 'true');
    fullscreenButton.style.backgroundColor = 'var(--rte-color-primary, #007bff)';
    fullscreenButton.style.color = 'white';
    
    const svg = fullscreenButton.querySelector('svg');
    if (svg) {
      svg.style.fill = 'white';
      svg.style.stroke = 'white';
    }
  }
};

/**
 * Remove fullscreen styles from editor
 */
const removeFullscreenStyles = () => {
  if (!editorElement) return;

  // Remove fullscreen class
  editorElement.classList.remove(FULLSCREEN_CLASS);

  // Clear inline styles
  editorElement.style.position = '';
  editorElement.style.top = '';
  editorElement.style.left = '';
  editorElement.style.right = '';
  editorElement.style.bottom = '';
  editorElement.style.width = '';
  editorElement.style.height = '';
  editorElement.style.maxWidth = '';
  editorElement.style.maxHeight = '';
  editorElement.style.borderRadius = '';
  editorElement.style.zIndex = '';
  editorElement.style.margin = '';
  editorElement.style.padding = '';
  editorElement.style.boxShadow = '';
  editorElement.style.display = '';
  editorElement.style.flexDirection = '';
  editorElement.style.background = '';

  // Unlock body scroll
  document.body.style.overflow = '';
  document.body.classList.remove('fullscreen-active');

  // Update button state
  if (fullscreenButton) {
    fullscreenButton.setAttribute('data-active', 'false');
    fullscreenButton.style.backgroundColor = '';
    fullscreenButton.style.color = '';
    
    const svg = fullscreenButton.querySelector('svg');
    if (svg) {
      svg.style.fill = '';
      svg.style.stroke = '';
    }
  }
};

/**
 * Toggle fullscreen mode
 */
export const toggleFullscreen = (): boolean => {
  try {
    // Find editor element if not already cached
    if (!editorElement) {
      editorElement = document.querySelector('[data-editora-editor]') as HTMLElement;
      if (!editorElement) {
        console.warn('Editor element not found');
        return false;
      }
    }

    // Find button if not already cached
    if (!fullscreenButton) {
      fullscreenButton = document.querySelector(FULLSCREEN_BUTTON_SELECTOR) as HTMLButtonElement;
    }

    // Toggle state
    isFullscreen = !isFullscreen;

    if (isFullscreen) {
      applyFullscreenStyles();
    } else {
      removeFullscreenStyles();
    }

    return true;
  } catch (error) {
    console.error('Fullscreen toggle failed:', error);
    return false;
  }
};

/**
 * Exit fullscreen mode
 */
export const exitFullscreen = (): void => {
  if (isFullscreen) {
    isFullscreen = false;
    removeFullscreenStyles();
  }
};

/**
 * Check if currently in fullscreen mode
 */
export const isFullscreenActive = (): boolean => {
  return isFullscreen;
};

/**
 * Setup fullscreen event listeners
 */
const setupFullscreenListeners = () => {
  // Handle Escape key to exit fullscreen
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullscreen) {
      exitFullscreen();
    }
  };

  // Setup listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  // Cleanup function
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown);
    }
  };
};

// Initialize listeners on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFullscreenListeners);
  } else {
    setupFullscreenListeners();
  }
}

export const FullscreenPlugin = (): Plugin => ({
  name: 'fullscreen',
  
  toolbar: [
    {
      label: 'Fullscreen',
      command: 'toggleFullscreen',
      type: 'button',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>'
    }
  ],
  
  commands: {
    toggleFullscreen
  },
  
  keymap: {
    'Escape': () => {
      if (isFullscreen) {
        exitFullscreen();
        return true;
      }
      return false;
    }
  }
});
