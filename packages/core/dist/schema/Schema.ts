import { NodeType, NodeSpec } from '../model/Node';
import { MarkType, MarkSpec, Mark } from '../model/Mark';

/**
 * Schema defines the structure and types allowed in a document.
 * It contains specifications for all node and mark types.
 */
export class Schema {
  readonly nodes: Record<string, NodeType>;
  readonly marks: Record<string, MarkType>;
  readonly spec: SchemaSpec;

  constructor(spec: SchemaSpec) {
    this.spec = spec;
    this.nodes = this.createNodeTypes(spec.nodes);
    this.marks = this.createMarkTypes(spec.marks, this);
  }

  /**
   * Create node types from specifications.
   */
  private createNodeTypes(nodeSpecs: Record<string, NodeSpec>): Record<string, NodeType> {
    const nodes: Record<string, NodeType> = {};

    for (const [name, spec] of Object.entries(nodeSpecs)) {
      nodes[name] = new NodeType(name, spec, this);
    }

    return nodes;
  }

  /**
   * Create mark types from specifications.
   */
  private createMarkTypes(markSpecs: Record<string, MarkSpec>, schema: Schema): Record<string, MarkType> {
    const marks: Record<string, MarkType> = {};

    for (const [name, spec] of Object.entries(markSpecs)) {
      marks[name] = new MarkType(name, spec, schema);
    }

    return marks;
  }

  /**
   * Check if a node type is allowed as a child of another node type.
   */
  allowsNodeType(parentType: NodeType, childType: NodeType): boolean {
    const content = parentType.spec.content;
    if (!content) return false;

    // Parse content expression (simplified)
    // This would need more sophisticated parsing for complex expressions
    const allowedTypes = content.split(/\s+/);
    return allowedTypes.some(type => {
      if (type === 'text') return childType.isText;
      if (type === 'inline') return childType.isInline;
      if (type === 'block') return childType.isBlock;
      return childType.name === type;
    });
  }

  /**
   * Get the text node type.
   */
  get text(): NodeType {
    return this.nodes.text;
  }

  /**
   * Get the document node type.
   */
  get doc(): NodeType {
    return this.nodes.doc;
  }

  /**
   * Get the paragraph node type.
   */
  get paragraph(): NodeType {
    return this.nodes.paragraph;
  }

  /**
   * Convert to JSON representation.
   */
  toJSON(): SchemaSpec {
    return this.spec;
  }
}

/**
 * Specification for a complete schema.
 */
export interface SchemaSpec {
  nodes: Record<string, NodeSpec>;
  marks: Record<string, MarkSpec>;
  topNode?: string;
}

/**
 * Default schema with basic node and mark types.
 */
export const defaultSchema = new Schema({
  nodes: {
    doc: {
      content: 'block+'
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM: () => ['p', 0]
    },
    heading: {
      attrs: {
        level: { default: 1, validate: (value: number) => value >= 1 && value <= 6 }
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
        { tag: 'h4', attrs: { level: 4 } },
        { tag: 'h5', attrs: { level: 5 } },
        { tag: 'h6', attrs: { level: 6 } }
      ],
      toDOM: (node) => [`h${node.attrs.level}`, 0]
    },
    text: {
      group: 'inline',
      isText: true
    }
  },
  marks: {
    bold: {
      parseDOM: [
        { tag: 'strong' },
        { tag: 'b', getAttrs: (node: HTMLElement | string) => typeof node === 'string' ? null : node.style.fontWeight !== 'normal' && null },
        { style: 'font-weight=400', clearMark: (m: Mark) => m.type.name === 'strong' },
        { style: 'font-weight', getAttrs: (value: string | HTMLElement) => typeof value === 'string' && /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null }
      ],
      toDOM: () => ['strong', 0]
    },
    italic: {
      parseDOM: [
        { tag: 'i' },
        { tag: 'em' },
        { style: 'font-style=italic' }
      ],
      toDOM: () => ['em', 0]
    },
    underline: {
      parseDOM: [
        { tag: 'u' },
        { style: 'text-decoration=underline' }
      ],
      toDOM: () => ['u', 0]
    }
  }
});