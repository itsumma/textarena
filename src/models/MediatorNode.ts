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

// TODO сделать вариант когда у нас фиксированное количество дочерних нод,
// например callout (title, paragraph)
// или quote (title, section).

export default class MediatorNode implements ArenaNodeScion, ArenaNodeAncestor {
  readonly hasParent: true = true;

  readonly hasChildren: true = true;

  public children: (ArenaNodeScion | ArenaNodeText)[] = [];

  constructor(
    public arena: ArenaAncestor,
    public parent: ArenaNodeAncestor,
  ) {
    if (arena.protected) {
      this.children = arena.protectedChildren.map(
        (childArena) => NodeFactory.createNode(childArena, this),
      );
    }
  }

  public getIndex(): number {
    return this.parent.children.indexOf(this);
  }

  public isLastChild(): boolean {
    return this.parent.children.indexOf(this) === this.parent.children.length - 1;
  }

  public getGlobalIndex(): string {
    return `${this.parent.getGlobalIndex()}.${this.getIndex().toString()}`;
  }

  public getParent(): ArenaCursorAncestor {
    return { node: this.parent, offset: this.getIndex() };
  }

  public setParent(parent: ArenaNodeAncestor | (ArenaNodeAncestor & ArenaNodeScion)): void {
    this.parent = parent;
  }

  public getUnprotectedParent(): ArenaCursorAncestor | undefined {
    if (this.parent.arena.protected) {
      return this.parent.getUnprotectedParent();
    }
    return { node: this.parent, offset: this.getIndex() };
  }

  public getHtml(frms: ArenaFormatings): TemplateResult | string {
    if (this.children.length === 0) {
      return '';
    }
    return this.arena.getTemplate(
      html`
        ${repeat(this.children, (c, index) => index, (child) => child.getHtml(frms))}
      `,
      this.getGlobalIndex(),
      this.attributes,
    );
  }

  public getOutputHtml(frms: ArenaFormatings, deep = 0): string {
    return this.arena.getOutputTemplate(
      this.children.map((child) => child.getOutputHtml(frms, deep + 1)).join('\n'),
      deep,
      this.attributes,
    );
  }

  public insertText(
    text: string | RichTextManager,
    offset: number,
  ): ArenaCursor {
    if (this.arena.arenaForText) {
      const newNode = this.createAndInsertNode(this.arena.arenaForText, offset);
      if (newNode) {
        return newNode.insertText(text, 0);
      }
    }
    return this.parent.insertText(text, this.getIndex() + 1);
  }

  getTextCursor(index: number): ArenaCursor {
    if (!this.arena.arenaForText) {
      return this.parent.getTextCursor(this.getIndex());
    }
    if (index === -1) {
      for (let i = this.children.length - 1; i >= 0; i -= 1) {
        const { arena } = this.children[i];
        if ('allowText' in arena || ('arenaForText' in arena && arena.arenaForText)) {
          return this.children[i].getTextCursor(index === -1 ? -1 : 0);
        }
      }
    } else {
      for (let i = 0; i < this.children.length; i += 1) {
        const { arena } = this.children[i];
        if ('allowText' in arena || ('arenaForText' in arena && arena.arenaForText)) {
          return this.children[i].getTextCursor(index === -1 ? -1 : 0);
        }
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

  public createAndInsertNode(
    arena: Arena,
    offset: number,
  ): ArenaNodeScion | ArenaNodeText | undefined {
    if (this.arena.protected) {
      const { protectedChildren } = this.arena;
      if (offset < protectedChildren.length) {
        for (let i = 0; i < protectedChildren.length; i += 1) {
          if (protectedChildren[i] === arena) {
            return this.children[i];
          }
        }
      }
    } else if (this.arena.allowedArenas.includes(arena)) {
      const node = NodeFactory.createNode(arena, this);
      this.children.splice(offset, 0, node);
      return node;
    }
    return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
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

  public removeChild(index: number): ArenaCursorAncestor {
    if (!this.arena.protected) {
      this.children.splice(index, 1);
      return this.checkChildren(index);
    }
    return { node: this, offset: index };
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

  public removeChildren(start: number, length?: number): void {
    this.cutChildren(start, length);
  }

  public getChild(index: number): ArenaNodeScion | undefined {
    return this.children[index] || undefined;
  }

  public remove(): ArenaCursorAncestor {
    return this.parent.removeChild(this.getIndex());
  }

  protected checkChildren(index: number): ArenaCursorAncestor {
    if (this.children.length === 0) {
      return this.remove();
    }
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

  public setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  public getAttribute(name: string): string {
    return this.attributes[name] || '';
  }

  protected attributes: { [key: string] :string } = {};
}
