/* eslint-disable no-bitwise */
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaNodeRoot, AnyArenaNode } from '../interfaces/ArenaNode';
import Textarena from '../Textarena';
import ArenaServiceManager from './ArenaServiceManager';
import NodeRegistry from '../helpers/NodeRegistry';

type SelectionIndexes = [string, number, string, number, 'forward' | 'backward'];

export default class ArenaHistory {
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
    if (this.currentIndex < this.log.length - 1) {
      console.log('this.log.splice(this.currentIndex + 1)', `index: ${this.currentIndex}`, `log len: ${this.log.length}`);
      this.log.splice(this.currentIndex + 1);
      console.log('this.log.length', this.log.length);
    }
    const root = this.asm.model.model.clone();
    const registry = new NodeRegistry();
    console.log('FIRSTTT', this.log.length === 0 || this.log[0][0].children[0]?.getOutputHtml());
    console.log('BEFFFFFFFOre', this.log.length, root.children[0].getOutputHtml());
    this.log.push([
      root,
      registry,
      selection ? this.getSelectionIndexes(selection) : undefined,
    ]);
    console.log('FIRSTTT', this.log[0][0].children[0].getOutputHtml());
    this.currentIndex = this.log.length - 1;
  }

  public undo(selection: ArenaSelection): ArenaSelection | undefined {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      console.log('FIRSTTT', this.log[0][0].children[0].getOutputHtml());
      console.log('UNDOOOOOOOOO', this.currentIndex, this.log[this.currentIndex][0].children[0].getOutputHtml());
      return this.applyCurrent();
    }
    return selection;
  }

  public redo(selection: ArenaSelection): ArenaSelection | undefined {
    if (this.currentIndex < this.log.length - 1) {
      this.currentIndex += 1;
      console.log('FIRSTTT', this.log[0][0].children[0].getOutputHtml());
      console.log('REEEEEEEEEEDOOOOOOO', this.currentIndex, this.log[this.currentIndex][0].children[0].getOutputHtml());
      return this.applyCurrent();
    }
    return selection;
  }

  protected applyCurrent(): ArenaSelection | undefined {
    const [root, registry, sel] = this.log[this.currentIndex];
    const newRoot = root.clone();
    this.asm.model.setRegistry(registry);
    this.asm.model.setRoot(
      newRoot,
    );
    return sel ? this.getSelectionFromIndexes(sel) : undefined;
  }

  protected registerNode(registry: NodeRegistry, node: AnyArenaNode): void {
    registry.set(node.getId(), node);
    if (node.hasChildren) {
      node.children.forEach((child) => {
        this.registerNode(registry, child);
      });
    }
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

  protected log: [ArenaNodeRoot, NodeRegistry, SelectionIndexes | undefined][] = [];

  protected currentIndex = 0;
}
