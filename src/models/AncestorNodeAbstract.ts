import { TemplateResult, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import ArenaNodeScionInterface from 'interfaces/ArenaNodeScionInterface';
import Arena, { ArenaWithNodes, ArenaWithChildText } from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import RichTextManager from 'RichTextManager';
import NodeFactory from './NodeFactory';

export default abstract class AncestorNodeAbstract {
  public children: ArenaNodeScionInterface[] = [];

  constructor(
    public arena: ArenaWithNodes | ArenaWithChildText,
  ) {
  }

  getGlobalIndex(): string {
    return '0';
  }

  getHtml(): TemplateResult | string {
    return this.arena.template(html`
      ${repeat(this.children, (c, index) => index, (child) => child.getHtml())}
    `, this.getGlobalIndex());
  }

  insertText(
    text: string,
    offset: number,
    formatings?: RichTextManager,
  ): [ArenaNodeInterface, number] | undefined {
    if ('arenaForText' in this.arena) {
      const result = this.createAndInsertNode(this.arena.arenaForText, offset);
      if (result) {
        const [newNode] = result;
        newNode.insertText(text, 0, formatings);
        return [newNode, text.length];
      }
    }
    return undefined;
  }

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNodeInterface, ArenaNodeInterface, number,
  ] | undefined {
    if (this.arena.allowedArenas.includes(arena)) {
      const node = NodeFactory.createNode(arena, this);
      this.children.splice(offset, 0, node);
      return [node, this, offset + 1];
    }
    return undefined;
  }
}
