import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import Arena, { ArenaSingle } from 'interfaces/Arena';
import RichTextManager from 'RichTextManager';
import { TemplateResult } from 'lit-html';

export default class SingleNode implements ArenaNodeScion {
  hasParent: true = true;

  constructor(
    public arena: ArenaSingle,
    public parent: ArenaNodeAncestor,
  ) {
  }

  getIndex(): number {
    return this.parent.children.indexOf(this);
  }

  getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  insertText(
    text: string | RichTextManager,
  ): [ArenaNode, number] | undefined {
    return this.parent.insertText(text, this.getIndex() + 1);
  }

  createAndInsertNode(arena: Arena): [
    ArenaNode, ArenaNode, number,
  ] | undefined {
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  }

  remove(): void {
    this.parent.removeChild(this.getIndex());
  }

  getHtml(): TemplateResult | string {
    return this.arena.getTemplate('', this.getGlobalIndex());
  }
}
