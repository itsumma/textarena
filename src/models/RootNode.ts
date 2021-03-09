import { TemplateResult, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import ArenaModel from 'ArenaModel';
import Arena, { ArenaAncestor } from 'interfaces/Arena';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import RichTextManager from 'RichTextManager';
import NodeFactory from './NodeFactory';

// У корневого может быть разрешены либо параграфы (заголовки), либо секции (и большие картинки)

export default class RootNode implements ArenaNodeAncestor {
  hasChildren: true = true;

  public children: ArenaNodeScion[] = [];

  constructor(
    public arena: ArenaAncestor,
  ) {
  }

  getGlobalIndex(): string {
    return '0';
  }

  getHtml(model: ArenaModel): TemplateResult | string {
    return this.arena.getTemplate(html`
      ${repeat(this.children, (c, index) => index, (child) => child.getHtml(model))}
    `, this.getGlobalIndex());
  }

  insertText(
    text: string | RichTextManager,
    offset: number,
  ): [ArenaNode, number] | undefined {
    if (this.arena.arenaForText) {
      const newNode = this.createAndInsertNode(this.arena.arenaForText, offset);
      if (newNode) {
        return newNode.insertText(text, 0);
      }
    }
    return undefined;
  }

  getTextNode(): ArenaNodeText | undefined {
    return undefined;
  }

  createAndInsertNode(arena: Arena, offset: number): ArenaNodeScion | ArenaNodeText | undefined {
    if (this.arena.allowedArenas.includes(arena)) {
      const node = NodeFactory.createNode(arena, this);
      this.children.splice(offset, 0, node);
      return node;
    }
    return undefined;
  }

  public removeChild(index: number): void {
    this.children.splice(index, 1);
  }

  public removeChildren(start: number, length?: number): void {
    this.children.splice(start, length);
  }

  public getChild(index: number): ArenaNodeScion | undefined {
    return this.children[index] || undefined;
  }
}
