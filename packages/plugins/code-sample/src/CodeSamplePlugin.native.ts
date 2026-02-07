import { Plugin } from '@editora/core';

/**
 * Code Sample Plugin - Native Implementation
 * 
 * Inserts code blocks with syntax highlighting.
 */
export const CodeSamplePlugin = (): Plugin => ({
  name: 'codeSample',
  
  toolbar: [
    {
      label: 'Code Block',
      command: 'insertCodeBlock',
      icon: '{ ; }',
      shortcut: 'Mod-Shift-c'
    }
  ],
  
  commands: {
    insertCodeBlock: () => {
      try {
        // Prompt for language
        const language = prompt('Enter programming language (e.g., javascript, python, html):', 'javascript');
        if (!language) return false;

        // Prompt for code
        const code = prompt('Enter code:', '// Your code here');
        if (code === null) return false;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return false;

        const range = selection.getRangeAt(0);
        
        // Create code block
        const pre = document.createElement('pre');
        pre.style.cssText = 'background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; padding: 1em; overflow-x: auto; margin: 1em 0;';
        pre.setAttribute('data-language', language);
        
        const codeEl = document.createElement('code');
        codeEl.style.cssText = 'font-family: "Courier New", Courier, monospace; font-size: 14px; white-space: pre;';
        codeEl.textContent = code;
        
        pre.appendChild(codeEl);
        range.insertNode(pre);
        
        // Move cursor after code block
        range.setStartAfter(pre);
        range.setEndAfter(pre);
        selection.removeAllRanges();
        selection.addRange(range);

        return true;
      } catch (error) {
        console.error('Failed to insert code block:', error);
        return false;
      }
    }
  },
  
  keymap: {
    'Mod-Shift-c': 'insertCodeBlock'
  }
});
