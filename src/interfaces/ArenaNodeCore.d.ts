import ArenaModel from 'ArenaModel';
import { TemplateResult } from 'lit-html';
import RichTextManager from 'RichTextManager';
import ArenaNode from './ArenaNode';
import Arena from './Arena';
import ArenaNodeText from './ArenaNodeText';
import ArenaNodeScion from './ArenaNodeScion';

export default interface ArenaNodeCore {
  readonly arena: Arena;

  insertText(
    text: string | RichTextManager,
    offset: number,
    keepFormatings?: boolean,
  ): [ArenaNode, number] | undefined;

  createAndInsertNode(arena: Arena, offset: number): ArenaNodeScion | ArenaNodeText | undefined;

  getHtml(model: ArenaModel): TemplateResult | string;

  getGlobalIndex(): string;

  getTextNode(): ArenaNodeText | undefined;
}
