import React, { useMemo } from 'react';
import { Editor, PluginManager, Plugin } from '@rte-editor/core';
import { Toolbar } from './Toolbar';
import { EditorContent } from './EditorContent';

interface RichTextEditorProps {
  plugins: Plugin[];
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ plugins, className }) => {
  const editor = useMemo(() => {
    const pluginManager = new PluginManager();
    plugins.forEach(p => pluginManager.register(p));
    return new Editor(pluginManager);
  }, [plugins]);

  return (
    <div className={`rte-editor ${className || ''}`}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
