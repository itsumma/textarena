import { TemplateResult, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import Arena from '../interfaces/Arena';
import ArenaAncestor from '../interfaces/ArenaAncestor';
import ArenaCursor from '../interfaces/ArenaCursor';
import ArenaCursorAncestor from '../interfaces/ArenaCursorAncestor';
import { ArenaFormatings } from '../interfaces/ArenaFormating';
import ArenaNodeAncestor from '../interfaces/ArenaNodeAncestor';
import ArenaNodeScion from '../interfaces/ArenaNodeScion';
import ArenaNodeText from '../interfaces/ArenaNodeText';
import RichTextManager from '../helpers/RichTextManager';
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

  public getUnprotectedParent(): ArenaCursorAncestor | undefined {
    return undefined;
  }

  getHtml(frms: ArenaFormatings): TemplateResult | string {
    return this.arena.getTemplate(
      html`
        ${repeat(this.children, (c, index) => index, (child) => child.getHtml(frms))}
      `,
      this.getGlobalIndex(),
      {},
    );
  }

  public getOutputHtml(frms: ArenaFormatings): string {
    return this.children.map((child) => child.getOutputHtml(frms, 0)).join('\n\n');
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
    for (let i = start; i <= end; i += index === -1 ? -1 : 1) {
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

  public removeChild(index: number): ArenaCursorAncestor {
    this.children.splice(index, 1);
    return this.checkChildren(index);
  }

  public cutChildren(start: number, length?: number): (ArenaNodeScion | ArenaNodeText)[] {
    let result: (ArenaNodeScion | ArenaNodeText)[] = [];
    if (!this.arena.protected) {
      if (length === undefined) {
        result = this.children.splice(start);
      } else {
        result = this.children.splice(start, length);
      }
      this.checkChildren(start);
    }
    return result;
  }

  insertChildren(nodes: (ArenaNodeScion | ArenaNodeText)[], offset?: number): void {
    let index = offset || 0;
    nodes.forEach((node) => {
      if (this.arena.allowedArenas.includes(node.arena)) {
        node.setParent(this);
        this.children.splice(index, 0, node);
        index += 1;
      }
    });
  }

  public removeChildren(start: number, length?: number): void {
    this.cutChildren(start, length);
  }

  public getChild(index: number): ArenaNodeScion | undefined {
    return this.children[index] || undefined;
  }

  public setAttribute(): void {
    //
  }

  public getAttribute(): string {
    return '';
  }

  protected checkChildren(index: number): ArenaCursorAncestor {
    let newIndex = index;
    for (let i = 1; i < this.children.length; i += 1) {
      const child = this.children[i];
      const prev = this.children[i - 1];
      if (child.arena.automerge && child.arena === prev.arena) {
        (prev as unknown as ArenaNodeAncestor).insertChildren(
          (child as unknown as ArenaNodeAncestor).children,
        );
        this.children.splice(i, 1);
        if (i >= newIndex) {
          newIndex -= 1;
        }
        i -= 1;
      }
    }
    return { node: this, offset: newIndex };
  }
}
