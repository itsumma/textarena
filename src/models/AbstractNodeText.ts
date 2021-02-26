import { TemplateResult } from 'lit-html';
import Arena, { ArenaWithText, ArenaWithRichText } from 'interfaces/Arena';
import ArenaNodeCore from 'interfaces/ArenaNodeCore';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import AbstractNodeScion from './AbstractNodeScion';

export default abstract class AbstractNodeText
  extends AbstractNodeScion {
  hasText: true = true;

  constructor(
    public arena: ArenaWithText | ArenaWithRichText,
    public parent: ArenaNodeAncestor,
  ) {
    super(arena, parent);
  }

  getIndex(): number {
    return this.parent.children.indexOf(this as ArenaNodeScion);
  }

  getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  createAndInsertNode(arena: Arena): [
    ArenaNodeCore, ArenaNodeCore, number,
  ] | undefined {
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  }

  getText(): TemplateResult | string {
    return '';
  }

  getHtml(): TemplateResult | string {
    return this.arena.template(this.getText(), this.getGlobalIndex());
  }
}
