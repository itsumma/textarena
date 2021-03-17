import RichTextManager from 'helpers/RichTextManager';
import ArenaNodeScion from './ArenaNodeScion';
import ArenaWithText from './ArenaWithText';
import ArenaInline from './ArenaInline';
import ArenaNodeInline from './ArenaNodeInline';

export default interface ArenaNodeText extends ArenaNodeScion {
  hasText: true;

  readonly arena: ArenaWithText;

  removeText(start: number, end?: number): void;

  getText(): RichTextManager;

  getRawText(): string;

  cutText(start: number, end?: number): RichTextManager;

  getTextLength(): number;

  insertFormating(name: string, start: number, end: number): void;

  toggleFormating(name: string, start: number, end: number): void;

  ltrim(): void;

  rtrim(): void;

  clearSpaces(): void;

  addInlineNode(arena: ArenaInline, start: number, end: number): ArenaNodeInline | undefined;

  getInlineNode(arena: ArenaInline, start: number, end: number): ArenaNodeInline | undefined;

  removeInlineNode(node: ArenaNodeInline): void;

  updateInlineNode(node: ArenaNodeInline, start: number, end: number): void;
}
