import ArenaModel from 'ArenaModel';
import { TemplateResult } from 'lit-html';
import RichTextManager from 'RichTextManager';
import ArenaNode from './ArenaNode';
import Arena from './Arena';

export default interface ArenaNodeCore {
  readonly arena: Arena;

  insertText(
    text: string | RichTextManager,
    offset: number,
    keepFormatings?: boolean,
  ): [ArenaNode, number] | undefined;

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNode, ArenaNode, number,
  ] | undefined;

  getHtml(model: ArenaModel): TemplateResult | string;

  getGlobalIndex(): string;
}
