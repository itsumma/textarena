import { TemplateResult, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import Arena, { ArenaWithNodes, ArenaWithChildText } from 'interfaces/Arena';
import ArenaNodeCore from 'interfaces/ArenaNodeCore';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import RichTextManager from 'RichTextManager';
import NodeFactory from './NodeFactory';

// У корневого может быть разрешены либо параграфы (заголовки), либо секции (и большие картинки)

export default class RootNode implements ArenaNodeAncestor {
  hasChildren: true = true;

  public children: ArenaNodeScion[] = [];

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
  ): [ArenaNodeCore, number] | undefined {
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
    ArenaNodeCore, ArenaNodeCore, number,
  ] | undefined {
    if (this.arena.allowedArenas.includes(arena)) {
      const node = NodeFactory.createNode(arena, this);
      this.children.splice(offset, 0, node);
      return [node, this, offset + 1];
    }
    return undefined;
  }

  public removeChild(index: number): void {
    this.children.splice(index, 1);
  }

  public removeChildren(start: number, length?: number): void {
    this.children.splice(start, length);
  }
}
