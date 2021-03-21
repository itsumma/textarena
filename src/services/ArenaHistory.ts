/* eslint-disable no-bitwise */
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaNodeRoot } from '../interfaces/ArenaNode';
import Textarena from '../Textarena';
import ArenaServiceManager from './ArenaServiceManager';

export default class ArenaHistory {
  log: [ArenaNodeRoot, ArenaSelection][] = [];

  currentIndex = 0;

  constructor(protected asm: ArenaServiceManager) {
    this.asm.eventManager.subscribe('modelChanged', (e) => {
      if (typeof e === 'object' && e.data instanceof ArenaSelection) {
        if (this.currentIndex < this.log.length - 1) {
          this.log.splice(this.currentIndex);
        }
        const root = this.asm.model.model.clone();
        const startId = e.data.startNode.getGlobalIndex();
        const endId = e.data.endNode.getGlobalIndex();
        const sel = new ArenaSelection(
          this.asm.model.getTextNodeById(startId),
          e.data.startOffset,
          this.asm.model.getTextNodeById(endId),
          e.data.endOffset,
          e.data.direction,
        );
        this.log.push([
          root,
          sel,
        ]);
        this.currentIndex = this.log.length - 1;
      }
    });
    this.asm.commandManager.registerCommand(
      'undo',
      (textarena: Textarena, selection: ArenaSelection) => {
        if (this.currentIndex > 0) {
          this.currentIndex -= 1;
          const [root, sel] = this.log[this.currentIndex];
          this.asm.model.setRoot(
            root,
          );
          return sel;
        }
        return selection;
      },
    );
    this.asm.commandManager.registerShortcut(
      'Ctrl + KeyZ',
      'undo',
    );
    this.asm.commandManager.registerCommand(
      'redo',
      (textarena: Textarena, selection: ArenaSelection) => {
        if (this.currentIndex < this.log.length - 1) {
          this.currentIndex += 1;
          const [root, sel] = this.log[this.currentIndex];
          this.asm.model.setRoot(
            root,
          );
          return sel;
        }
        return selection;
      },
    );
    this.asm.commandManager.registerShortcut(
      'Ctrl + Shift + KeyZ',
      'redo',
    );
  }
}
