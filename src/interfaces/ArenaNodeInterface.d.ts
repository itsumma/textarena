import { TemplateResult } from 'lit-html';
import RichTextManager from 'RichTextManager';
import Arena from './Arena';

export default interface ArenaNodeInterface {
  arena: Arena;

  insertText(
    text: string,
    offset: number,
    formatings?: RichTextManager,
  ): [ArenaNodeInterface, number] | undefined;

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNodeInterface, ArenaNodeInterface, number,
  ] | undefined;

  getHtml(): TemplateResult | string;

  getGlobalIndex(): string;
}
