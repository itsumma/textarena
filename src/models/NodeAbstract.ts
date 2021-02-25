import Arena, { AbstractArena } from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import RichTextManager from 'RichTextManager';
import { TemplateResult } from 'lit-html';

export default abstract class NodeAbstract implements ArenaNodeInterface {
  constructor(
    public arena: Arena,
  ) {
  }

  getGlobalIndex(): string {
    return '0';
  }

  getHtml(): TemplateResult | string {
    return '';
  }

  insertText(
    text: string,
    offset: number,
    formatings?: RichTextManager,
  ): [ArenaNodeInterface, number] | undefined {
    return undefined;
  }

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNodeInterface, ArenaNodeInterface, number,
  ] | undefined {
    return undefined;
  }
}
