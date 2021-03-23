import { TemplateResult } from 'lit-html';
import RichTextManager from '../helpers/RichTextManager';
import ArenaCursorAncestor from './ArenaCursorAncestor';
import { ArenaFormatings } from './ArenaFormating';
import { AnyArena } from './Arena';
import ArenaCursorText from './ArenaCursorText';

export default interface ArenaNodeCore {
  readonly arena: AnyArena;

  insertText(
    text: string | RichTextManager,
    offset: number,
    keepFormatings?: boolean,
  ): ArenaCursorText;

  // createAndInsertNode(arena: Arena, offset: number):
  //   ArenaNode & (ArenaNodeScion | ArenaNodeText) | undefined;

  getHtml(model: ArenaFormatings): TemplateResult | string;

  getOutputHtml(model: ArenaFormatings, deep?: number): string;

  getGlobalIndex(): string;

  getTextCursor(index: number): ArenaCursorText | undefined;

  getParent(): ArenaCursorAncestor;

  getUnprotectedParent(): ArenaCursorAncestor | undefined;

  setAttribute(name: string, value: string): void;

  getAttribute(name: string): string;
}
