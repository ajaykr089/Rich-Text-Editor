import React, { useState } from 'react';
import { Editor } from '@rte-editor/core';
import { ToolbarItem } from '@rte-editor/core';
import { usePluginContext } from './PluginManager';

interface ToolbarProps {
  editor: Editor;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  editor
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const items = editor.pluginManager.getToolbarItems();
  const { executeCommand } = usePluginContext();

  const handleCommand = (command: string, value?: string) => {
    console.log(`Executing command: ${command} with value: ${value}`);
    const contentEl = document.querySelector('.rte-content') as HTMLElement;
    if (contentEl) {
      contentEl.focus();
    }

    // Use plugin context to execute all commands
    executeCommand(command, value);
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
