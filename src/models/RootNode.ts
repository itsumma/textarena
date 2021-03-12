import { TemplateResult, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import ArenaModel from 'ArenaModel';
import Arena from 'interfaces/Arena';
import ArenaCursor from 'interfaces/ArenaCursor';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import ArenaCursorAncestor from 'interfaces/ArenaCursorAncestor';
import ArenaAncestor from 'interfaces/ArenaAncestor';
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

  public getParent(): ArenaCursorAncestor {
    return { node: this, offset: 0 };
  }

  public getUnprotectedParent(): ArenaCursorAncestor {
    return { node: this, offset: 0 };
  }

  getHtml(model: ArenaModel): TemplateResult | string {
    return this.arena.getTemplate(html`
      ${repeat(this.children, (c, index) => index, (child) => child.getHtml(model))}
    `, this.getGlobalIndex());
  }

  insertText(
    text: string | RichTextManager,
    offset: number,
  ): ArenaCursor {
    if (!this.arena.arenaForText) {
      throw new Error('Arena for text not found');
    }
    const newNode = this.createAndInsertNode(this.arena.arenaForText, offset);
    if (!newNode) {
      throw new Error(`Arena "${this.arena.arenaForText.name}" was not created`);
    }
    return newNode.insertText(text, 0);
  }

  getTextCursor(index: number): ArenaCursor {
    if (!this.arena.arenaForText) {
      throw new Error('Root node has not arena for text');
    }
    const start = index === -1 ? this.children.length - 1 : 0;
    const end = index === -1 ? 0 : this.children.length - 1;
    for (let i = start; i <= end; i += 1) {
      const { arena } = this.children[i];
      if ('allowText' in arena || ('arenaForText' in arena && arena.arenaForText)) {
        return this.children[i].getTextCursor(index === -1 ? -1 : 0);
      }
    }
    const newNode = this.createAndInsertNode(
      this.arena.arenaForText,
      index === -1 ? this.children.length : index,
    );
    if (newNode) {
      return newNode.getTextCursor(0);
    }
    throw new Error('Arena for text was not created');
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
