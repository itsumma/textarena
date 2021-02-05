import { TemplateResult } from 'lit-html';
import RichTextManager from 'RichTextManager';
import Arena from './Arena';

export default interface ArenaNodeInterface {
  arena: Arena;

  insertText(
    text: string,
    offset: number,
    formatings: RichTextManager | undefined,
  ): [ArenaNodeInterface, number];

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNodeInterface | undefined, ArenaNodeInterface, number,
  ];

  getHtml(): TemplateResult;
}
