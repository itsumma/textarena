import { TemplateResult, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import ArenaAncestor from '../interfaces/arena/ArenaAncestor';
import ChildArena from '../interfaces/arena/ChildArena';
import ArenaCursorAncestor from '../interfaces/ArenaCursorAncestor';
import { ArenaFormatings } from '../interfaces/ArenaFormating';
import { ArenaNodeChild, ArenaNodeParent } from '../interfaces/ArenaNode';
import ArenaNodeAncestorPart from '../interfaces/ArenaNodeAncestorPart';
import AbstractNode from './AbstractNode';
import NodeFactory from './NodeFactory';

export default abstract class AbstractParentNode<TArena extends ArenaAncestor>
  extends AbstractNode<TArena>
  implements ArenaNodeAncestorPart {
  readonly hasParent: boolean = false;

  readonly hasChildren: true = true;

  readonly hasText: false = false;

  readonly inline: false = false;

  readonly single: false = false;

  get automerge(): boolean {
    return this.arena.automerge;
  }

  get group(): boolean {
    return this.arena.group;
  }

  get protected(): boolean {
    return this.arena.protected;
  }

  public children: ArenaNodeChild[] = [];

  constructor(
    arena: TArena,
    children?: ArenaNodeChild[],
  ) {
    super(arena);
    if (children) {
      this.children = children;
    }
  }

  getHtml(frms: ArenaFormatings): TemplateResult | string {
    // let pseudoCursorBefore: TemplateResult | string = '';
    // let pseudoCursorAfter: TemplateResult | string = '';
    // if (this.children.length > 0) {
    //   if (!('hasText' in this.children[0])) {
    //     pseudoCursorBefore = html`<div class="pseudo-cursor"><br/></div>`;
    //   }
    //   if (!('hasText' in this.children[this.children.length - 1])) {
    //     pseudoCursorAfter = html`<div class="pseudo-cursor"><br/></div>`;
    //   }
    // }
    return this.arena.getTemplate(
      html`
        ${repeat(this.children, (c, index) => index, (child) => child.getHtml(frms))}
      `,
      this.getGlobalIndex(),
      {},
    );
  }

  canCreateNode(arena: ChildArena): boolean {
    return !this.arena.protected && this.arena.allowedArenas.includes(arena);
  }

  createAndInsertNode(arena: ChildArena, offset: number): ArenaNodeChild | undefined {
    if (this.arena.allowedArenas.includes(arena)) {
      const node = NodeFactory.createNode(arena, this);
      this.children.splice(offset, 0, node);
      return node;
    }
    return undefined;
  }

  public removeChild(index: number): ArenaCursorAncestor {
    if (index < 0 || index >= this.children.length) {
      return { node: this, offset: 0 };
    }
    this.children.splice(index, 1);
    return this.mergeChildren(index);
  }

  public cutChildren(start: number, length?: number): ArenaNodeChild[] {
    let result: ArenaNodeChild[] = [];
    if (!this.arena.protected) {
      if (length === undefined) {
        result = this.children.splice(start);
      } else {
        result = this.children.splice(start, length);
      }
      this.mergeChildren(start);
    }
    return result;
  }

  insertChildren(
    nodes: ArenaNodeChild[],
    offset?: number,
  ): ArenaNodeChild[] {
    let index = offset || 0;
    const rest: ArenaNodeChild[] = [];
    nodes.forEach((node) => {
      if (this.arena.allowedArenas.includes(node.arena)) {
        node.setParent(this as unknown as ArenaNodeParent);
        this.children.splice(index, 0, node);
        index += 1;
      } else if (node.hasText && this.arena.arenaForText) {
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

  public removeChildren(start: number, length?: number): void {
    this.cutChildren(start, length);
  }

  public getChild(index: number): ArenaNodeChild | undefined {
    return this.children[index] || undefined;
  }

  public mergeChildren(index: number): ArenaCursorAncestor {
    let newIndex = index;
    for (let i = 1; i < this.children.length; i += 1) {
      const child = this.children[i];
      const prev = this.children[i - 1];
      if (child.hasChildren && child.automerge) {
        if (prev.hasChildren && child.arena === prev.arena) {
          prev.insertChildren(
            child.children,
            prev.children.length,
          );
        } else if (child.children.length !== 0) {
          break;
        }
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
