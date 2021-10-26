import { TemplateResult } from 'lit';
import ArenaAttribute from '../ArenaAttribute';
import ArenaCursorText from '../ArenaCursorText';
import { ArenaFormatings } from '../ArenaFormating';
import NodeAttributes from '../NodeAttributes';

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

  getOutput(type: string, frms: ArenaFormatings): string;

  getDataHtml(frms: ArenaFormatings, start?: number, end?: number): string;

  getPlainText(start?: number, end?: number): string;

  getOpenTag(): string;

  getCloseTag(): string;

  getTextCursor(index?: number): ArenaCursorText | undefined;

  setAttribute(name: string, value: ArenaAttribute): void;

  setAttributes(attrs: NodeAttributes): void;

  getAttribute(name: string): ArenaAttribute;

  getAttributes(): NodeAttributes;

  clone(): T;
}
