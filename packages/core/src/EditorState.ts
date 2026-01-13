import { Node, Schema } from './schema/Node';

export interface EditorSelection {
  anchor: number;
  head: number;
}

export class EditorState {
  doc: Node;
  selection: EditorSelection;
  schema: Schema;

  constructor(doc: Node, selection: EditorSelection, schema: Schema) {
    this.doc = doc;
    this.selection = selection;
    this.schema = schema;
  }

  static create(schema: Schema, content?: Node): EditorState {
    const doc = content || schema.node('doc', {}, [schema.node('paragraph')]);
    return new EditorState(doc, { anchor: 0, head: 0 }, schema);
  }

  apply(doc: Node, selection?: EditorSelection): EditorState {
    return new EditorState(doc, selection || this.selection, this.schema);
  }
}
