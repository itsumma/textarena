import { TemplateResult } from 'lit-html';
import RichTextManager from 'RichTextManager';
import Arena from './Arena';

export default interface ArenaNodeCore {
  arena: Arena;

  insertText(
    text: string,
    offset: number,
    formatings?: RichTextManager,
  ): [ArenaNodeCore, number] | undefined;

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNodeCore, ArenaNodeCore, number,
  ] | undefined;

  getHtml(): TemplateResult | string;

  getGlobalIndex(): string;
}
