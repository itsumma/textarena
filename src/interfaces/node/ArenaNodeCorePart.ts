import { TemplateResult } from 'lit-html';
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

  getGlobalIndex(): string;

  getId(): string;

  getTemplate(frms: ArenaFormatings): TemplateResult | string;

  getPublicHtml(frms: ArenaFormatings): string;

  getOutputHtml(frms: ArenaFormatings, start?: number, end?: number): string;

  getPlainText(start?: number, end?: number): string;

  getOpenTag(): string;

  getCloseTag(): string;

  getTextCursor(index?: number): ArenaCursorText | undefined;

  setAttribute(name: string, value: string | boolean | number): void;

  setAttributes(attrs: ArenaAttributes): void;

  getAttribute(name: string): string | boolean | number;

  clone(): T;
}
