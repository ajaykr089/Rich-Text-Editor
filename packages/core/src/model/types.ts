/**
 * Attributes for nodes and marks.
 */
export type Attrs = { [key: string]: any };

/**
 * Specification for a node or mark attribute.
 */
export interface AttributeSpec {
  default?: any;
  validate?: (value: any) => boolean;
}

/**
 * Parse rule for DOM parsing.
 */
export interface ParseRule {
  tag?: string;
  style?: string;
  attrs?: { [key: string]: any };
  getAttrs?: (node: HTMLElement | string) => any | null;
  clearMark?: (mark: any) => boolean;
}

/**
 * DOM output specification.
 */
export type DOMOutputSpec = string | [string, ...any[]];