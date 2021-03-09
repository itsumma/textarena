import RichTextManager from 'RichTextManager';
import ArenaNodeScion from './ArenaNodeScion';
import { ArenaWithText } from './Arena';

export default interface ArenaNodeText extends ArenaNodeScion {
  hasText: true;

  readonly arena: ArenaWithText;

  removeText(start: number, end?: number): void;

  getText(): string | RichTextManager;

  getRawText(): string;

  cutText(start: number, end?: number): string | RichTextManager;

  getTextLength(): number;

  insertFormating(name: string, start: number, end: number): void;

  toggleFormating(name: string, start: number, end: number): void;
}
