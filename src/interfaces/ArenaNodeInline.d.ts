import { TemplateResult } from 'lit-html';
import Arena from './Arena';
import { ArenaFormatings } from './ArenaFormating';

export default interface ArenaNodeInline {
  inline: true;

  readonly arena: Arena;

  getHtml(model: ArenaFormatings): TemplateResult | string;

  getOutputHtml(model: ArenaFormatings, deep?: number): string;

  getTags(): [string, string];

  setAttribute(name: string, value: string): void;
}
