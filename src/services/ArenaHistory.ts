/* eslint-disable no-bitwise */
import { ArenaSelection } from '../helpers';
import { ArenaNodeRoot } from '../interfaces';
import Textarena from '../Textarena';
import { ArenaServiceManager } from './ArenaServiceManager';

type SelectionIndexes = [string, number, string, number, 'forward' | 'backward'];

export class ArenaHistory {
  constructor(protected asm: ArenaServiceManager) {
    this.asm.commandManager.registerCommand(
      'undo',
      (textarena: Textarena, selection: ArenaSelection) => this.undo(selection) || selection,
      false,
    );
    this.asm.commandManager.registerShortcut(
      'Ctrl + KeyZ',
      'undo',
    );
    this.asm.commandManager.registerCommand(
      'redo',
      (textarena: Textarena, selection: ArenaSelection) => this.redo(selection) || selection,
      false,
    );
    this.asm.commandManager.registerShortcut(
      'Ctrl + Shift + KeyZ',
      'redo',
    );
  }

  public reset(selection: ArenaSelection | undefined): void {
    this.log = [];
    this.currentIndex = 0;
    this.save(selection);
  }

  public save(selection: ArenaSelection | undefined, typing = false): void {
    const root = this.asm.model.model.clone();
    const sel = selection ? this.getSelectionIndexes(selection) : undefined;
    if (this.currentIndex < this.log.length - 1) {
      this.log.splice(this.currentIndex + 1);
    } else if (typing && this.typed) {
      this.log.splice(this.currentIndex);
    }
    if (typing) {
      this.typed = true;
    }
    this.log.push([
      root,
      sel,
    ]);
    this.currentIndex = this.log.length - 1;
  }

  public undo(selection: ArenaSelection): ArenaSelection | undefined {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      return this.applyCurrent();
    }
    return selection;
  }

  public redo(selection: ArenaSelection): ArenaSelection | undefined {
    if (this.currentIndex < this.log.length - 1) {
      this.currentIndex += 1;
      return this.applyCurrent();
    }
    return selection;
  }

  public resetTyped(): void {
    this.typed = false;
  }

  protected applyCurrent(): ArenaSelection | undefined {
    const [root, sel] = this.log[this.currentIndex];
    const newRoot = root.clone();
    this.asm.model.setRoot(
      newRoot,
    );
    return sel ? this.getSelectionFromIndexes(sel) : undefined;
  }

  protected getSelectionFromIndexes(sel: SelectionIndexes): ArenaSelection | undefined {
    const startNode = this.asm.model.getTextNodeById(sel[0]);
    const endNode = this.asm.model.getTextNodeById(sel[2]);
    if (startNode && endNode) {
      return new ArenaSelection(
        startNode,
        sel[1],
        endNode,
        sel[3],
        sel[4],
      );
    }
    return undefined;
  }

  protected getSelectionIndexes(selection: ArenaSelection): SelectionIndexes {
    return [
      selection.startNode.getGlobalIndex(),
      selection.startOffset,
      selection.endNode.getGlobalIndex(),
      selection.endOffset,
      selection.direction,
    ];
  }

  protected log: [ArenaNodeRoot, SelectionIndexes | undefined][] = [];

  protected currentIndex = 0;

  protected typed = false;
}
