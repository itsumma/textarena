import { TemplateResult, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';

import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import Arena, { ArenaAncestor } from 'interfaces/Arena';
import ArenaModel from 'ArenaModel';
import RichTextManager from 'RichTextManager';
import NodeFactory from './NodeFactory';

// TODO сделать вариант когда у нас фиксированное количество дочерних нод,
// например callout (title, paragraph)
// или quote (title, section).

export default class MediatorNode implements ArenaNodeScion, ArenaNodeAncestor {
  hasParent: true = true;

  hasChildren: true = true;

  public children: ArenaNodeScion[] = [];

  constructor(
    public arena: ArenaAncestor,
    public parent: ArenaNodeAncestor,
  ) {
  }

  public getIndex(): number {
    return this.parent.children.indexOf(this);
  }

  public getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  public getHtml(model: ArenaModel): TemplateResult | string {
    return this.arena.getTemplate(html`
      ${repeat(this.children, (c, index) => index, (child) => child.getHtml(model))}
    `, this.getGlobalIndex());
  }

  public insertText(
    text: string | RichTextManager,
    offset: number,
  ): [ArenaNode, number] | undefined {
    if (this.arena.arenaForText) {
      const result = this.createAndInsertNode(this.arena.arenaForText, offset);
      if (result) {
        const [newNode] = result;
        return newNode.insertText(text, 0);
      }
    }
    return this.parent.insertText(text, this.getIndex() + 1);
  }

  public createAndInsertNode(arena: Arena, offset: number): [
    ArenaNode, ArenaNode, number,
  ] | undefined {
    if (this.arena.allowedArenas.includes(arena)) {
      const node = NodeFactory.createNode(arena, this);
      this.children.splice(offset, 0, node);
      return [node, this, offset + 1];
    }
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
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

  public remove(): void {
    this.parent.removeChild(this.getIndex());
  }
}
