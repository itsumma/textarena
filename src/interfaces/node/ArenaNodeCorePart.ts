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

  // createAndInsertNode(arena: ChildArena, offset: number):
  //   ChildArenaNode | undefined;

  // TODO createAndInsertNode(arena: Arena, offset: number):
  //  ArenaNode & ArenaNodeScion | Exception;

  getGlobalIndex(): string;

  getHtml(model: ArenaFormatings): TemplateResult | string;

  getOutputHtml(frms: ArenaFormatings, deep?: number, start?: number, end?: number): string;

  getTextCursor(index?: number): ArenaCursorText | undefined;

  setAttribute(name: string, value: string): void;

  setAttributes(attrs: ArenaAttributes): void;

  getAttribute(name: string): string;

  clone(): T;
}
