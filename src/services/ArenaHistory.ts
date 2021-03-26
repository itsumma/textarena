/* eslint-disable no-bitwise */
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaNodeRoot, AnyArenaNode } from '../interfaces/ArenaNode';
import Textarena from '../Textarena';
import ArenaServiceManager from './ArenaServiceManager';
import NodeRegistry from '../helpers/NodeRegistry';

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

  public save(selection: ArenaSelection | undefined): void {
    if (this.currentIndex < this.log.length - 1) {
      this.log.splice(this.currentIndex + 1);
    }
    // const { startNode, startOffset, endNode, endOffset, direction } = selection;
    // const startId = startNode.getGlobalIndex();
    // const endId = endNode.getGlobalIndex();
    // const newStartNode = this.asm.model.getTextNodeById(startId);
    // const newEndNode = this.asm.model.getTextNodeById(endId);
    // const sel = new ArenaSelection(
    //   startNode,
    //   selection.startOffset,
    //   endNode,
    //   e.data.endOffset,
    //   e.data.direction,
    // );
    const root = this.asm.model.model.clone();
    const registry = new NodeRegistry();
    this.registerNode(registry, root);
    const sel = selection?.clone();
    this.log.push([
      root,
      registry,
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

  protected applyCurrent(): ArenaSelection | undefined {
    const [root, registry, sel] = this.log[this.currentIndex];
    this.asm.model.setRegistry(registry);
    this.asm.model.setRoot(
      root,
    );
    return sel;
  }

  protected registerNode(registry: NodeRegistry, node: AnyArenaNode): void {
    registry.set(node.getId(), node);
    if (node.hasChildren) {
      node.children.forEach((child) => {
        this.registerNode(registry, child);
      });
    }
  }

  protected log: [ArenaNodeRoot, NodeRegistry, ArenaSelection | undefined][] = [];

  protected currentIndex = 0;
}
