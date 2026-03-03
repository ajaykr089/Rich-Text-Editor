export interface SlashCommandActionContext {
  editor: HTMLElement;
  editorRoot: HTMLElement;
  query: string;
  trigger: string;
  executeCommand: (command: string, value?: any) => boolean;
  insertHTML: (html: string) => boolean;
}

export interface SlashCommandItem {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  command?: string;
  commandValue?: any;
  insertHTML?: string;
  action?: (context: SlashCommandActionContext) => boolean | void | Promise<boolean | void>;
}

export interface SlashCommandsPluginOptions {
  triggerChar?: string;
  minChars?: number;
  maxQueryLength?: number;
  maxSuggestions?: number;
  requireBoundary?: boolean;
  includeDefaultItems?: boolean;
  items?: SlashCommandItem[];
  itemRenderer?: (item: SlashCommandItem, query: string) => string;
  emptyStateText?: string;
  panelLabel?: string;
}

