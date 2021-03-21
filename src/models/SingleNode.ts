import { TemplateResult } from 'lit-html';
import ArenaCursorText from '../interfaces/ArenaCursorText';
import RichTextManager from '../helpers/RichTextManager';
import { ArenaFormatings } from '../interfaces/ArenaFormating';
import AbstractNode from './AbstractNode';
import { ArenaSingleInterface, ChildArena } from '../interfaces/Arena';
import { ArenaNodeSingle, ChildArenaNode, ParentArenaNode } from '../interfaces/ArenaNode';

export default class SingleNode
  extends AbstractNode<ArenaSingleInterface>
  implements ArenaNodeSingle {
  readonly hasParent: true = true;

  readonly hasChildren: false = false;

  readonly hasText: false = false;

  readonly inline: false = false;

  readonly single: true = true;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    public arena: ArenaSingleInterface,
    // parent?: ParentArenaNode,
  ) {
    super();
    // this.parent = parent;
  }

  public getHtml(): TemplateResult | string {
    return this.arena.getTemplate(undefined, this.getGlobalIndex(), this.attributes);
  }

  public getOutputHtml(_frms: ArenaFormatings, deep = 0): string {
    return this.arena.getOutputTemplate('', deep, this.attributes);
  }

  public insertText(
    text: string | RichTextManager,
  ): ArenaCursorText {
    return this.parent.insertText(text, this.getIndex() + 1);
  }

  public getTextCursor(): ArenaCursorText {
    return this.parent.getTextCursor(this.getIndex());
  }

  // public createAndInsertNode(arena: ChildArena): ChildArenaNode | undefined {
  //   return this.parent.createAndInsertNode(arena, this.getIndex() + 1);
  // }

  public clone(): SingleNode {
    return new SingleNode(
      this.arena,
      // this.parent,
    );
  }
}
