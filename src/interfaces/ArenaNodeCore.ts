import { TemplateResult } from 'lit-html';
import RichTextManager from '../helpers/RichTextManager';
import Arena from './Arena';
import ArenaNodeText from './ArenaNodeText';
import ArenaNodeScion from './ArenaNodeScion';
import ArenaCursor from './ArenaCursor';
import ArenaCursorAncestor from './ArenaCursorAncestor';
import ArenaNode from './ArenaNode';
import { ArenaFormatings } from './ArenaFormating';

export default interface ArenaNodeCore {
  readonly arena: Arena;

  insertText(
    text: string | RichTextManager,
    offset: number,
    keepFormatings?: boolean,
  ): ArenaCursor;

  // tot merge neighbors
  createAndInsertNode(arena: Arena, offset: number):
    ArenaNode & (ArenaNodeScion | ArenaNodeText) | undefined;

  getHtml(model: ArenaFormatings): TemplateResult | string;

  getOutputHtml(model: ArenaFormatings, deep?: number): string;

  getGlobalIndex(): string;

  getTextCursor(index: number): ArenaCursor;

  getParent(): ArenaCursorAncestor;

  getUnprotectedParent(): ArenaCursorAncestor | undefined;

  setAttribute(name: string, value: string): void;

  getAttribute(name: string): string;
}
