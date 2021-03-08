import { TemplateResult, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import { ArenaAncestor } from 'interfaces/Arena';
import ArenaModel from 'ArenaModel';
import RichTextManager from 'RichTextManager';
import NodeFactory from './NodeFactory';

export default abstract class AbstractNodeAncestor {
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
    return this.arena.template(html`
      ${repeat(this.children, (c, index) => index, (child) => child.getHtml(model))}
    `, this.getGlobalIndex());
  }

  insertText(
    text: string | RichTextManager,
    offset: number,
  ): [ArenaNode, number] | undefined {
    if ('arenaForText' in this.arena) {
      const result = this.createAndInsertNode(this.arena.arenaForText, offset);
      if (result) {
        const [newNode] = result;
        return newNode.insertText(text, 0);
      }
    }
    return undefined;
  }

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNode, ArenaNode, number,
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

  public getChild(index: number): ArenaNodeScion | undefined {
    return this.children[index] || undefined;
  }
}
