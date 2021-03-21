import RichTextManager from '../helpers/RichTextManager';
import ArenaWithText from './arena/ArenaWithText';
import ArenaInline from './arena/ArenaInline';
import ArenaNodeInline from './ArenaNodeInline';
import ArenaFormating from './ArenaFormating';
import ArenaCursor from './ArenaCursor';

export default interface ArenaNodeTextPart {
  readonly arena: ArenaWithText;

  readonly hasParent: true;
  readonly hasChildren: false;
  readonly hasText: true;
  readonly inline: false;
  readonly single: false;

  getText(): RichTextManager;

  getRawText(): string;

  insertText(
    text: string | RichTextManager,
    offset: number,
    keepFormatings?: boolean,
  ): ArenaCursor;

  removeText(start: number, end?: number): void;

  cutText(start: number, end?: number): RichTextManager;

  getTextLength(): number;

  insertFormating(name: string, start: number, end: number): void;

  toggleFormating(name: string, start: number, end: number): void;

  togglePromiseFormating(formating: ArenaFormating, offset: number): void;

  ltrim(): void;

  rtrim(): void;

  clearSpaces(): void;

  addInlineNode(arena: ArenaInline, start: number, end: number): ArenaNodeInline | undefined;

  getInlineNode(arena: ArenaInline, start: number, end: number): ArenaNodeInline | undefined;

  removeInlineNode(node: ArenaNodeInline): void;

  updateInlineNode(node: ArenaNodeInline, start: number, end: number): void;
}
