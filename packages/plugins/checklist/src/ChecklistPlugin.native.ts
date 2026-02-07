import type { Plugin } from '@editora/core';

/**
 * ChecklistPlugin - Native implementation for interactive todo lists
 * 
 * Features:
 * - Creates checkbox list items
 * - Toggle checkboxes on/off
 * - Convert regular list to checklist
 * - Useful for task lists, requirements, shopping lists
 * 
 * Commands:
 * - toggleChecklist: Convert to/from checklist
 */
export const ChecklistPlugin = (): Plugin => {
  return {
    name: 'checklist',
    
    // Initialize click handler when plugin is loaded
    init: () => {
      if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        const handleChecklistClick = (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          
          // Find the closest checklist item
          const checklistItem = target.closest('li[data-type="checklist-item"]') as HTMLElement;
          
          // Only toggle if we found a checklist item AND we're not clicking inside the paragraph text
          if (checklistItem && !target.closest('p')) {
            event.preventDefault();
            event.stopPropagation();
            
            // Toggle the checked state
            const isChecked = checklistItem.getAttribute("data-checked") === "true";
            checklistItem.setAttribute("data-checked", (!isChecked).toString());
            
            console.log('[ChecklistPlugin] Toggled checkbox:', !isChecked);
          }
        };
        
        // Set up the click handler
        document.addEventListener("click", handleChecklistClick);
        
        console.log('[ChecklistPlugin] Click handler initialized');
      }
    },
    
    // Schema definition for checklist nodes
    nodes: {
      checklist: {
        content: "checklistItem+",
        group: "block",
        parseDOM: [{ tag: 'ul[data-type="checklist"]' }],
        toDOM: () => ["ul", { "data-type": "checklist" }, 0],
      },
      checklistItem: {
        content: "paragraph",
        attrs: {
          checked: { default: false },
        },
        parseDOM: [
          {
            tag: 'li[data-type="checklist-item"]',
            getAttrs: (dom) => ({
              checked: (dom as HTMLElement).getAttribute("data-checked") === "true",
            }),
          },
        ],
        toDOM: (node) => [
          "li",
          {
            "data-type": "checklist-item",
            "data-checked": node?.attrs?.checked ? "true" : "false",
          },
          0,
        ],
      },
    },

    toolbar: [
      {
        label: 'Checklist',
        command: 'toggleChecklist',
        icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 4.48h-.71L2 3.43l.71-.7.69.68L4.81 2l.71.71-1.77 1.77zM6.99 3h8v1h-8V3zm0 3h8v1h-8V6zm8 3h-8v1h8V9zm-8 3h8v1h-8v-1zM3.04 7.48h.71l1.77-1.77-.71-.7L3.4 6.42l-.69-.69-.71.71 1.04 1.04zm.71 3.01h-.71L2 9.45l.71-.71.69.69 1.41-1.42.71.71-1.77 1.77zm-.71 3.01h.71l1.77-1.77-.71-.71-1.41 1.42-.69-.69-.71.7 1.04 1.05z"></path></g></svg>',
        shortcut: 'Mod-Shift-9'
      }
    ],

    commands: {
      toggleChecklist: () => {
        try {
          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) return false;

          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? (range.commonAncestorContainer.parentElement as HTMLElement)
            : (range.commonAncestorContainer as HTMLElement);
          
          const editorElement = container?.closest('[contenteditable="true"]');
          if (!editorElement) return false;

          // Check if we're in a list
          const listElement = container?.closest("li")?.closest("ul, ol");
          
          if (listElement) {
            const isChecklist = listElement.hasAttribute("data-type") && 
                               listElement.getAttribute("data-type") === "checklist";
            const isOrderedList = listElement.tagName.toLowerCase() === "ol";
            const isBulletList = listElement.tagName.toLowerCase() === "ul" && 
                                !listElement.hasAttribute("data-type");

            // Convert checklist back to paragraphs
            if (isChecklist) {
              const checklistItems = listElement.querySelectorAll('li[data-type="checklist-item"]');
              const paragraphs = Array.from(checklistItems)
                .map((item) => `<p>${item.innerHTML}</p>`)
                .join("");
              
              listElement.outerHTML = paragraphs;
              
              // Restore selection
              setTimeout(() => {
                const sel = window.getSelection();
                if (sel && editorElement) {
                  try {
                    const allParagraphs = editorElement.querySelectorAll("p");
                    const originalItem = container?.closest('li[data-type="checklist-item"]');
                    const itemIndex = originalItem ? Array.from(checklistItems).indexOf(originalItem) : -1;
                    
                    if (allParagraphs[itemIndex] && itemIndex >= 0) {
                      const targetP = allParagraphs[itemIndex];
                      const newRange = document.createRange();
                      newRange.setStart(targetP, targetP.childNodes.length);
                      newRange.setEnd(targetP, targetP.childNodes.length);
                      sel.removeAllRanges();
                      sel.addRange(newRange);
                    }
                  } catch {
                    console.warn("Could not restore selection after checklist removal");
                  }
                }
              }, 10);
              return true;
            } 
            // Convert ordered/bullet list to checklist
            else if (isOrderedList || isBulletList) {
              listElement.setAttribute("data-type", "checklist");
              listElement.querySelectorAll("li").forEach((li) => {
                li.setAttribute("data-type", "checklist-item");
                li.setAttribute("data-checked", "false");
              });
              return true;
            }
          }

          // Convert paragraph to checklist or create new checklist
          const selectedText = range.toString().trim();
          
          if (selectedText === "") {
            const blockElement = container?.closest("p, div, h1, h2, h3, h4, h5, h6");
            if (blockElement && blockElement.textContent?.trim()) {
              const checklistHTML = `
                <ul data-type="checklist">
                  <li data-type="checklist-item" data-checked="false">
                    <p>${blockElement.innerHTML}</p>
                  </li>
                </ul>
              `;
              blockElement.outerHTML = checklistHTML;
              
              // Restore selection
              setTimeout(() => {
                const sel = window.getSelection();
                if (sel && editorElement) {
                  try {
                    const checklistItem = editorElement.querySelector('li[data-type="checklist-item"]');
                    if (checklistItem) {
                      const p = checklistItem.querySelector("p");
                      if (p) {
                        const newRange = document.createRange();
                        newRange.setStart(p, p.childNodes.length);
                        newRange.setEnd(p, p.childNodes.length);
                        sel.removeAllRanges();
                        sel.addRange(newRange);
                      }
                    }
                  } catch {
                    console.warn("Could not restore selection after checklist insertion");
                  }
                }
              }, 10);
              return true;
            }
          }

          // Create new checklist with selected text or empty
          const checklistHTML = selectedText
            ? `
                <ul data-type="checklist">
                  <li data-type="checklist-item" data-checked="false">
                    <p>${selectedText}</p>
                  </li>
                </ul>
              `
            : `
                <ul data-type="checklist">
                  <li data-type="checklist-item" data-checked="false">
                    <p><br></p>
                  </li>
                </ul>
              `;

          document.execCommand("insertHTML", false, checklistHTML.trim());
          
          // Restore selection
          setTimeout(() => {
            const sel = window.getSelection();
            if (sel && editorElement) {
              try {
                const checklistItem = editorElement.querySelector('li[data-type="checklist-item"]');
                if (checklistItem) {
                  const p = checklistItem.querySelector("p");
                  if (p) {
                    const newRange = document.createRange();
                    newRange.setStart(p, p.childNodes.length);
                    newRange.setEnd(p, p.childNodes.length);
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                  }
                }
              } catch {
                console.warn("Could not restore selection after checklist insertion");
              }
            }
          }, 10);

          return true;
        } catch (error) {
          console.error('Failed to toggle checklist:', error);
          return false;
        }
      }
    },

    keymap: {
      'Mod-Shift-9': 'toggleChecklist'
    }
  };
};
