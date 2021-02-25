import { TemplateResult } from 'lit-html';
import Arena, { ArenaWithText } from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import ArenaNodeScionInterface from 'interfaces/ArenaNodeScionInterface';
import ArenaNodeAncestorInterface from 'interfaces/ArenaNodeAncestorInterface';

export default abstract class ScionNodeAbstract implements ArenaNodeScionInterface {
  constructor(
    public arena: ArenaWithText,
    public parent: ArenaNodeAncestorInterface,
  ) {
  }

  getMyIndex(): number {
    return this.parent.children.indexOf(this);
  }

  getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getMyIndex().toString()}`;
  }

  createAndInsertNode(arena: Arena): [
    ArenaNodeInterface, ArenaNodeInterface, number,
  ] | undefined {
    return this.parent.createAndInsertNode(arena, this.getMyIndex() + 1);
  }

  insertText(
    text: string,
    offset: number,
  ): [ArenaNodeInterface, number] | undefined {
    return [this, offset + text.length];
  }

  getText(): TemplateResult | string {
    return '';
  }

  getHtml(): TemplateResult | string {
    return this.arena.template(this.getText(), this.getGlobalIndex());
  }
}
