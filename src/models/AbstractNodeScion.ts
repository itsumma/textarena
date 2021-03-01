import { TemplateResult } from 'lit-html';
import Arena from 'interfaces/Arena';
import ArenaNodeCore from 'interfaces/ArenaNodeCore';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNode from 'interfaces/ArenaNode';
import RichTextManager from 'RichTextManager';

export default abstract class AbstractNodeScion implements ArenaNodeScion {
  hasParent: true = true;

  constructor(
    public arena: Arena,
    public parent: ArenaNodeAncestor,
  ) {
  }

  getIndex(): number {
    return this.parent.children.indexOf(this);
  }

  getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  createAndInsertNode(arena: Arena): [
    ArenaNode, ArenaNode, number,
  ] | undefined {
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  }

  insertText(
    text: string | RichTextManager,
    offset: number,
  ): [ArenaNode, number] | undefined {
    return [this, offset];
  }

  getTemplate(): TemplateResult | string {
    return '';
  }

  getHtml(): TemplateResult | string {
    return this.arena.template(this.getTemplate(), this.getGlobalIndex());
  }

  remove(): void {
    this.parent.removeChild(this.getIndex());
  }
}
