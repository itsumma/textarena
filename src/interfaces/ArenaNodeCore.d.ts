import { TemplateResult } from 'lit-html';
import RichTextManager from 'RichTextManager';
import Arena from './Arena';
import ArenaNode from './ArenaNode';

export default interface ArenaNodeCore {
  arena: Arena;

  insertText(
    text: string | RichTextManager,
    offset: number,
  ): [ArenaNode, number] | undefined;

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNode, ArenaNode, number,
  ] | undefined;

  getHtml(): TemplateResult | string;

  getGlobalIndex(): string;
}
