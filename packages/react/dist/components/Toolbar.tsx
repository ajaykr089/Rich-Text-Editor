import React from 'react';
import { useEditorContext } from '../context/EditorContext';
import { ToolbarItem } from '@rte-editor/core';

/**
 * Props for the Toolbar component.
 */
export interface ToolbarProps {
  className?: string;
  items?: ToolbarItem[];
}

/**
 * Toolbar component that renders editor controls.
 */
export const Toolbar: React.FC<ToolbarProps> = ({ className, items }) => {
  const { state, dispatch, plugins } = useEditorContext();

  // Collect toolbar items from plugins if not provided
  const toolbarItems = items || plugins.flatMap(plugin => {
    const config = plugin.getToolbarConfig();
    return config?.items || [];
  });

  const handleCommand = (commandName: string) => {
    // Find and execute the command
    for (const plugin of plugins) {
      const commands = plugin.getCommands();
      if (commands[commandName]) {
        commands[commandName](state, dispatch);
        break;
      }
    }
  };

  return (
    <div className={`rte-toolbar ${className || ''}`}>
      {toolbarItems.map((item) => (
        <ToolbarButton
          key={item.id}
          item={item}
          state={state}
          onCommand={handleCommand}
        />
      ))}
    </div>
  );
};

/**
 * Props for the ToolbarButton component.
 */
interface ToolbarButtonProps {
  item: ToolbarItem;
  state: any;
  onCommand: (command: string) => void;
}

/**
 * Individual toolbar button component.
 */
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ item, state, onCommand }) => {
  const isActive = item.active ? item.active(state) : false;
  const isEnabled = item.enabled ? item.enabled(state) : true;

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent button from stealing focus
    e.preventDefault();
    
    if (isEnabled) {
      onCommand(item.command);
    }
  };

  return (
    <button
      type="button"
      className={`rte-toolbar-button ${
        isActive ? 'rte-toolbar-button--active' : ''
      } ${
        !isEnabled ? 'rte-toolbar-button--disabled' : ''
      }`}
      onMouseDown={handleMouseDown}
      disabled={!isEnabled}
      title={item.label}
      aria-label={item.label}
    >
      {typeof item.icon === 'string' ? (
        <span className="rte-toolbar-button__icon">{item.icon}</span>
      ) : (
        item.icon
      )}
      {item.label && (
        <span className="rte-toolbar-button__label">{item.label}</span>
      )}
    </button>
  );
};

export { ToolbarButton };