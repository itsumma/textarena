import { TemplateResult } from 'lit-html';
import ArenaInline from './arena/ArenaInline';
import { ArenaFormatings } from './ArenaFormating';

export default interface ArenaNodeInline {
  readonly arena: ArenaInline;

  readonly hasParent: false;
  readonly hasChildren: false;
  readonly hasText: false;
  readonly inline: true;
  readonly single: false;

  getHtml(model: ArenaFormatings): TemplateResult | string;

  getOutputHtml(model: ArenaFormatings, deep?: number): string;

  getTags(): [string, string];

  getAttribute(name: string): string;

  setAttribute(name: string, value: string): void;

  clone(): ArenaNodeInline;
}
