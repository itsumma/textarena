import { TemplateResult, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { ChildArena, ParentArena } from '../interfaces/Arena';
import ArenaCursorText from '../interfaces/ArenaCursorText';
import ArenaCursorAncestor from '../interfaces/ArenaCursorAncestor';
import { ArenaFormatings } from '../interfaces/ArenaFormating';
import { ChildArenaNode, ParentArenaNode } from '../interfaces/ArenaNode';
import AbstractNode from './AbstractNode';
// import NodeFactory from './NodeFactory';

export default abstract class AbstractParentNode<
  TArena extends ParentArena
>
  extends AbstractNode {
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

  public children: ChildArenaNode[] = [];

  constructor(
    public arena: TArena,
    children?: ChildArenaNode[],
  ) {
    super();
    if (children) {
      children.forEach((child) => child.setParent(this as unknown as ParentArenaNode));
      this.children = children;
    }
  }

  public getHtml(frms: ArenaFormatings): TemplateResult | string {
    // TODO pseudoCursor
    // let pseudoCursorBefore: TemplateResult | string = '';
    // let pseudoCursorAfter: TemplateResult | string = '';
    // if (this.children.length > 0) {
    //   if (!this.children[0].hasText) {
    //     pseudoCursorBefore = html`<div class="pseudo-cursor"><br/></div>`;
    //   }
    //   if (!this.children[this.children.length - 1].hasText) {
    //     pseudoCursorAfter = html`<div class="pseudo-cursor"><br/></div>`;
    //   }
    // }
    if (this.children.length === 0) {
      return '';
    }
    const id = this.getGlobalIndex();
    const content = this.arena.getTemplate(
      html`
        ${repeat(this.children, (c, index) => index, (child) => child.getHtml(frms))}
      `,
      id,
      this.attributes,
    );
    if (this.protected) {
      const removeButton = html`<textarena-remove node-id="${id}">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512.001 512.001" xml:space="preserve">
      <g>
        <path d="M294.111,256.001L504.109,46.003c10.523-10.524,10.523-27.586,0-38.109c-10.524-10.524-27.587-10.524-38.11,0L256,217.892
          L46.002,7.894c-10.524-10.524-27.586-10.524-38.109,0s-10.524,27.586,0,38.109l209.998,209.998L7.893,465.999
          c-10.524,10.524-10.524,27.586,0,38.109c10.524,10.524,27.586,10.523,38.109,0L256,294.11l209.997,209.998
          c10.524,10.524,27.587,10.523,38.11,0c10.523-10.524,10.523-27.586,0-38.109L294.111,256.001z" fill="currentColor"/>
      </g>
      </svg>
      </textarena-remove>`;
      return html`
        <textarena-node>${removeButton}${content}</textarena-node>
      `;
    }
    return content;
  }

  public getOutputHtml(frms: ArenaFormatings, deep = 0): string {
    return this.arena.getOutputTemplate(
      this.children.map((child) => child.getOutputHtml(frms, deep + 1)).join('\n'),
      deep,
      this.attributes,
    );
  }

  public getTextCursor(index?: number): ArenaCursorText | undefined {
    if (!this.arena.arenaForText) {
      return undefined;
    }
    if (index === undefined) {
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
    return undefined;
  }

  public insertText(
  ): ArenaCursorText {
    // if (this.arena.arenaForText) {
    //   const newNode = this.createAndInsertNode(this.arena.arenaForText, offset);
    //   if (!newNode) {
    //     throw new Error(`Arena "${this.arena.arenaForText.name}" was not created`);
    //   }
    //   return newNode.insertText(text, 0);
    // }
    // if (this.parent) {
    //   return this.parent.insertText(text, this.getIndex() + 1);
    // }
    throw new Error('Arena for text not found');
  }

  public isAllowedNode(arena: ChildArena): boolean {
    return this.arena.allowedArenas.includes(arena);
  }

  // createAndInsertNode(arena: ChildArena, offset: number): ChildArenaNode | undefined {
  //   if (this.arena.protected) {
  //     const { protectedChildren } = this.arena;
  //     if (offset < protectedChildren.length) {
  //       for (let i = 0; i < protectedChildren.length; i += 1) {
  //         if (protectedChildren[i] === arena) {
  //           return this.children[i];
  //         }
  //       }
  //     }
  //   } else if (this.arena.allowedArenas.includes(arena)) {
  //     // const node = NodeFactory.createChildNode(arena, this as unknown as ParentArenaNode);
  //     // this.children.splice(offset, 0, node);
  //     // return node;
  //   }
  //   if (this.parent) {
  //     return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  //   }
  //   return undefined;
  // }

  public insertNode(node: ChildArenaNode, offset?: number):
    ChildArenaNode | undefined {
    if (this.arena.protected) {
      for (let i = 0; i < this.children.length; i += 1) {
        const child = this.children[i];
        if (child.arena === node.arena) {
          return child;
        }
      }
    } else {
      const index = offset === undefined ? this.children.length : offset;
      node.setParent(this as unknown as ParentArenaNode);
      this.children.splice(index, 0, node);
      return node;
    }
    return undefined;
  }

  public getChild(index: number): ChildArenaNode | undefined {
    return this.children[index] || undefined;
  }

  public removeChild(index: number): ArenaCursorAncestor {
    if (this.arena.protected) {
      return {
        node: this as unknown as ParentArenaNode,
        offset: index,
      };
    }
    if (index < 0
      || index >= this.children.length) {
      return {
        node: this as unknown as ParentArenaNode,
        offset: 0,
      };
    }
    this.children.splice(index, 1);
    return this.mergeChildren(index);
  }

  public getChildren(): ChildArenaNode[] {
    return this.children;
  }

  public insertChildren(
    nodes: ChildArenaNode[],
    offset?: number,
  ): ChildArenaNode[] {
    let index = offset || 0;
    if (this.arena.protected) {
      let rest: ChildArenaNode[] = [...nodes];
      for (let i = offset || 0; i < this.children.length; i += 1) {
        if (rest.length === 0) {
          break;
        }
        const child = this.children[i];
        if (child.hasText && rest[0].hasText) {
          const inserted = rest.shift();
          if (inserted && inserted.hasText) {
            child.insertText(inserted.getText(), 0);
          }
        } else if (child.hasChildren) {
          rest = child.insertChildren(rest, child.children.length);
        }
      }
      return rest;
    }
    const rest: ChildArenaNode[] = [];
    nodes.forEach((node) => {
      if (this.arena.allowedArenas.includes(node.arena)) {
        node.setParent(this as unknown as ParentArenaNode);
        this.children.splice(index, 0, node);
        index += 1;
      // } else if (node.hasText && this.arena.arenaForText) {
      //   const newNode = NodeFactory.createChildNode(
      //     this.arena.arenaForText,
      //     this as unknown as ParentArenaNode,
      //   );
      //   newNode.insertText(node.getText(), 0);
      //   this.children.splice(index, 0, newNode);
      //   index += 1;
      } else {
        rest.push(node);
      }
    });
    return rest;
  }

  public mergeChildren(index: number): ArenaCursorAncestor {
    if (this.hasParent && this.children.length === 0) {
      return this.remove();
    }
    let newIndex = index;
    for (let i = 0; i < this.children.length; i += 1) {
      const child = this.children[i];
      const prev = i > 0 ? this.children[i - 1] : undefined;
      if (child.hasChildren && child.automerge) {
        if (prev && prev.hasChildren && child.arena === prev.arena) {
          prev.insertChildren(
            child.children,
            prev.children.length,
          );
        } else if (child.children.length !== 0) {
          // eslint-disable-next-line no-continue
          continue;
        }
        this.children.splice(i, 1);
        if (i >= newIndex) {
          newIndex -= 1;
        }
        i -= 1;
      }
    }
    return {
      node: this as unknown as ParentArenaNode,
      offset: newIndex,
    };
  }

  public cutChildren(start: number, length?: number): ChildArenaNode[] {
    let result: ChildArenaNode[] = [];
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
    // this.mergeChildren(start);
  }
}
