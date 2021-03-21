import { TemplateResult } from 'lit-html';
import RichTextManager from '../../helpers/RichTextManager';
import ArenaCursorText from '../ArenaCursorText';
import { ArenaFormatings } from '../ArenaFormating';

export default interface ArenaNodeCorePart<T> {
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

  getOutputHtml(model: ArenaFormatings, deep?: number): string;

  getTextCursor(index: number): ArenaCursorText;

  setAttribute(name: string, value: string): void;

  getAttribute(name: string): string;

  clone(): T;
}
