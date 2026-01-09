// Core editor classes
export { EditorState, Transaction, AddMarkStep, RemoveMarkStep, ReplaceStep } from './EditorState';
export type { EditorStateConfig, StepResult, Step } from './EditorState';

// Main Editor class
export { Editor } from './Editor';
export type { EditorConfig } from './Editor';

// Command system
export { CommandManager, createCommandManager } from './commands/CommandManager';
export type { Command } from './commands/CommandManager';

// Selection system
export { Selection, TextSelection, NodeSelection, ResolvedPos, Slice } from './Selection';

// Document model
export { Node, NodeType } from './model/Node';
export type { NodeSpec, Attrs, DOMOutputSpec, ParseRule, AttributeSpec } from './model/Node';

export { Mark, MarkType } from './model/Mark';
export type { MarkSpec } from './model/Mark';

export { Fragment } from './model/Fragment';

// Schema system
export { Schema, defaultSchema } from './schema/Schema';
export type { SchemaSpec } from './schema/Schema';

// Security
export { Sanitizer, ContentValidator, createSanitizer, defaultSanitizer } from './security/Sanitizer';
export type { SanitizeConfig } from './security/Sanitizer';

// Plugins
export { Plugin } from './plugins/Plugin';
export type { PluginSpec, PluginContext, ToolbarItem, MenuItem, KeyBinding, SchemaExtension, CommandMap, KeyMap, ToolbarConfig, PluginHooks, NodeViewFactory, MarkViewFactory } from './plugins/Plugin';
export { PluginManager, createPluginManager } from './plugins/PluginManager';

