import ArenaCursor from '../interfaces/ArenaCursor';
import ArenaCursorAncestor from '../interfaces/ArenaCursorAncestor';
import { ArenaFormatings } from '../interfaces/ArenaFormating';
import RichTextManager from '../helpers/RichTextManager';
import { ArenaNodeRoot } from '../interfaces/ArenaNode';
import AbstractParentNode from './AbstractParentNode';
import ArenaRoot from '../interfaces/arena/ArenaRoot';

// У корневого может быть разрешены либо параграфы (заголовки), либо секции (и большие картинки)

export default class RootNode extends AbstractParentNode<ArenaRoot>
  implements ArenaNodeRoot {
  readonly root: true = true;

  readonly hasParent: false = false;

  // constructor(
  //   arena: ArenaRoot,
  //   children?: ArenaNodeChild[],
  // ) {
  //   super(arena, children);
  // }

  getGlobalIndex(): string {
    return '0';
  }

  public getParent(): ArenaCursorAncestor {
    return { node: this, offset: 0 };
  }

  public getUnprotectedParent(): ArenaCursorAncestor | undefined {
    return undefined;
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

  public clone(): ArenaNodeRoot {
    return new RootNode(
      this.arena,
      this.children.map((child) => child.clone()),
    );
  }
}
