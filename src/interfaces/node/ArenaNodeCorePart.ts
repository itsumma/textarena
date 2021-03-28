import { TemplateResult } from 'lit-html';
import RichTextManager from '../../helpers/RichTextManager';
import ArenaCursorText from '../ArenaCursorText';
import { ArenaFormatings } from '../ArenaFormating';
import ArenaAttributes from '../ArenaAttributes';

export default interface ArenaNodeCorePart<T> {
  readonly id: string;

  readonly hasParent: boolean;
  readonly hasChildren: boolean;
  readonly hasText: boolean;
  readonly inline: boolean;
  readonly single: boolean;

  insertText(
    text: string | RichTextManager,
    offset: number,
    keepFormatings?: boolean,
  ): ArenaCursorText;

  getGlobalIndex(): string;

  getId(): string;

  getTemplate(frms: ArenaFormatings): TemplateResult | string;

  getPublicHtml(frms: ArenaFormatings): string;

  getOutputHtml(frms: ArenaFormatings, deep?: number, start?: number, end?: number): string;

  getPlainText(start?: number, end?: number): string;

  getOpenTag(): string;

  getCloseTag(): string;

  getTextCursor(index?: number): ArenaCursorText | undefined;

  setAttribute(name: string, value: string | boolean | number): void;

  setAttributes(attrs: ArenaAttributes): void;

  getAttribute(name: string): string | boolean | number;

  clone(): T;
}
