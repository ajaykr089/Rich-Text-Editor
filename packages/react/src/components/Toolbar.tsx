import React, { useState } from 'react';
import { Editor } from '@rte-editor/core';
import { ToolbarItem } from '@rte-editor/core';

interface ToolbarProps {
  editor: Editor;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const items = editor.pluginManager.getToolbarItems();

  const handleCommand = (command: string, value?: string) => {
    const contentEl = document.querySelector('.rte-content') as HTMLElement;
    if (contentEl) {
      contentEl.focus();
    }

    const commandMap: Record<string, () => void> = {
      toggleBold: () => document.execCommand('bold', false),
      toggleItalic: () => document.execCommand('italic', false),
      toggleUnderline: () => document.execCommand('underline', false),
      toggleBulletList: () => document.execCommand('insertUnorderedList', false),
      toggleOrderedList: () => document.execCommand('insertOrderedList', false),
      setBlockType: () => {
        if (value) document.execCommand('formatBlock', false, value);
      }
    };

    commandMap[command]?.();
    setOpenDropdown(null);
    
    if (contentEl) {
      contentEl.focus();
    }
  };

  return (
    <div className="rte-toolbar">
      {items.map((item, idx) => (
        <div key={idx} className="rte-toolbar-item">
          {item.type === 'dropdown' ? (
            <div className="rte-toolbar-dropdown">
              <button
                className="rte-toolbar-button"
                onClick={() => setOpenDropdown(openDropdown === item.command ? null : item.command)}
              >
                {item.label} ▼
              </button>
              {openDropdown === item.command && (
                <div className="rte-toolbar-dropdown-menu">
                  {item.options?.map((opt) => (
                    <div
                      key={opt.value}
                      className="rte-toolbar-dropdown-item"
                      onClick={() => handleCommand(item.command, opt.value)}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              className="rte-toolbar-button"
              onClick={() => handleCommand(item.command)}
              title={item.label}
            >
              {item.icon || item.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
