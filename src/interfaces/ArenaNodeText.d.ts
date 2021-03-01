import RichTextManager from 'RichTextManager';
import { ArenaWithText, ArenaWithRichText } from './Arena';
import ArenaNodeScion from './ArenaNodeScion';

export default interface ArenaNodeText extends ArenaNodeScion {
  hasText: true;

  arena: ArenaWithText | ArenaWithRichText;

  removeText(start: number, end?: number): void;

  getText(): string | RichTextManager;

  cutText(start: number, end?: number): string | RichTextManager;

  getTextLength(): number;
}
