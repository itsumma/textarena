import { TemplateResult } from 'lit-html';
import RichTextManager from '../helpers/RichTextManager';
import AnyArena from './arena/AnyArena';
import ArenaCursor from './ArenaCursor';
import { ArenaNodeChild } from './ArenaNode';
import { ArenaFormatings } from './ArenaFormating';
import ArenaCursorAncestor from './ArenaCursorAncestor';

export default interface ArenaNodeCorePart<T> {
  readonly arena: AnyArena;

  readonly hasParent: boolean;
  readonly hasChildren: boolean;
  readonly hasText: boolean;
  readonly inline: boolean;
  readonly single: boolean;

  insertText(
    text: string | RichTextManager,
    offset: number,
    keepFormatings?: boolean,
  ): ArenaCursor;

  createAndInsertNode(arena: AnyArena, offset: number):
    ArenaNodeChild | undefined;

  // TODO createAndInsertNode(arena: Arena, offset: number):
  //  ArenaNode & ArenaNodeScion | Exception;

  getGlobalIndex(): string;

  getUnprotectedParent(): ArenaCursorAncestor | undefined;

  getHtml(model: ArenaFormatings): TemplateResult | string;

  getOutputHtml(model: ArenaFormatings, deep?: number): string;

  getTextCursor(index: number): ArenaCursor;

  setAttribute(name: string, value: string): void;

  getAttribute(name: string): string;

  clone(): T;
}
