import { TemplateResult, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';

import AnyArena from '../interfaces/arena/AnyArena';
import ArenaAncestor from '../interfaces/arena/ArenaAncestor';
import ArenaCursor from '../interfaces/ArenaCursor';
import ArenaCursorAncestor from '../interfaces/ArenaCursorAncestor';
import { ArenaFormatings } from '../interfaces/ArenaFormating';
import ArenaNode, { ArenaNodeChild, ArenaNodeMediator, ArenaNodeParent } from '../interfaces/ArenaNode';
import RichTextManager from '../helpers/RichTextManager';
import NodeFactory from './NodeFactory';
import AbstractParentNode from './AbstractParentNode';

// TODO сделать вариант когда у нас фиксированное количество дочерних нод,
// например callout (title, paragraph)
// или quote (title, section).

export default class MediatorNode
  extends AbstractParentNode<ArenaAncestor>
  implements ArenaNodeMediator {
  readonly root: false = false;

  readonly hasParent: true = true;

  readonly hasText: false = false;

  readonly inline: false = false;

  readonly single: false = false;

  constructor(
    arena: ArenaAncestor,
    public parent: ArenaNodeParent,
    children?: ArenaNodeChild[],
  ) {
    super(arena, children);
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

  public setParent(parent: ArenaNodeParent): void {
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
        if (arena.hasText || (arena.hasChildren && arena.arenaForText)) {
          return this.children[i].getTextCursor(index === -1 ? -1 : 0);
        }
      }
    } else {
      for (let i = 0; i < this.children.length; i += 1) {
        const { arena } = this.children[i];
        if (arena.hasText || (arena.hasChildren && arena.arenaForText)) {
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

  canCreateNode(arena: AnyArena): boolean {
    return !this.arena.protected && this.arena.allowedArenas.includes(arena);
  }

  public createAndInsertNode(
    arena: AnyArena,
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

  insertChildren(
    nodes: (ArenaNode & ArenaNodeScion)[],
    offset?: number,
  ): (ArenaNode & ArenaNodeScion)[] {
    let index = offset || 0;
    if (this.arena.protected) {
      let rest: (ArenaNodeScion | ArenaNodeText)[] = [...nodes];
      for (let i = offset || 0; i < this.children.length; i += 1) {
        if (rest.length === 0) {
          break;
        }
        const child = this.children[i];
        if ('hasText' in child && 'hasText' in rest[0]) {
          const inserted = rest.shift();
          if (inserted && 'hasText' in inserted) {
            child.insertText(inserted.getText(), 0);
          }
        } else if ('hasChildren' in child) {
          rest = child.insertChildren(rest, child.children.length);
        }
      }
      return rest;
    }
    const rest: (ArenaNodeScion | ArenaNodeText)[] = [];
    nodes.forEach((node) => {
      if (this.arena.allowedArenas.includes(node.arena)) {
        node.setParent(this);
        this.children.splice(index, 0, node);
        index += 1;
      } else if ('hasText' in node && this.arena.arenaForText) {
        const newNode = NodeFactory.createNode(this.arena.arenaForText, this);
        newNode.insertText(node.getText(), 0);
        this.children.splice(index, 0, newNode);
        index += 1;
      } else {
        rest.push(node);
      }
    });
    return rest;
  }

  public removeChild(index: number): ArenaCursorAncestor {
    if (!this.arena.protected) {
      this.children.splice(index, 1);
      // return this.checkChildren(index);
    }
    return { node: this, offset: index };
  }

  public cutChildren(start: number, length?: number): (ArenaNode & ArenaNodeScion)[] {
    let result: (ArenaNodeScion | ArenaNodeText)[] = [];
    if (!this.arena.protected) {
      if (length === undefined) {
        result = this.children.splice(start);
      } else {
        result = this.children.splice(start, length);
      }
      // this.mergeChildren(start);
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

  public clone(): ArenaNodeMediator {
    return new MediatorNode(
      this.arena,
      this.children.map((child) => child.clone()),
    );
  }
}
