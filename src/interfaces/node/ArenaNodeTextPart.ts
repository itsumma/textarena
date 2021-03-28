import RichTextManager from '../../helpers/RichTextManager';
import ArenaFormating from '../ArenaFormating';
import ArenaCursorText from '../ArenaCursorText';
import { ArenaInlineInterface, ArenaTextInterface } from '../Arena';
import { ArenaNodeInline } from '../ArenaNode';

export default interface ArenaNodeTextPart {
  readonly arena: ArenaTextInterface;

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
  ): ArenaCursorText;

  removeText(start: number, end?: number): void;

  cutText(start: number, end?: number): RichTextManager;

  clearText(): void;

  getTextLength(): number;

  isEmpty(): boolean;

  insertFormating(name: string, start: number, end: number): void;

  toggleFormating(name: string, start: number, end: number): void;

  togglePromiseFormating(formating: ArenaFormating, offset: number): void;

  ltrim(): void;

  rtrim(): void;

  clearSpaces(): void;

  addInlineNode(
    arena: ArenaInlineInterface,
    start: number,
    end: number,
  ): ArenaNodeInline | undefined;

  getInlineNode(
    arena: ArenaInlineInterface,
    start: number,
    end: number,
  ): ArenaNodeInline | undefined;

  removeInlineNode(node: ArenaNodeInline): void;

  updateInlineNode(node: ArenaNodeInline, start: number, end: number): void;
}
