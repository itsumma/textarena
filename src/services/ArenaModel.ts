import { TemplateResult } from 'lit';
import ArenaFactory from '../arenas/ArenaFactory';
import { Direction } from '../events/RemoveEvent';
import ArenaSelection from '../helpers/ArenaSelection';
import {
  AnyArena, ArenaInlineInterface, ArenaMediatorInterface,
  ArenaRootInterface, ArenaTextInterface, ChildArena,
} from '../interfaces/Arena';
import {
  AnyArenaNode, ArenaNodeRoot, ArenaNodeText,
  ArenaNodeInline, ArenaNodeMediator,
  ChildArenaNode, ParentArenaNode,
} from '../interfaces/ArenaNode';
import ArenaCursorText from '../interfaces/ArenaCursorText';
import ArenaCursorAncestor from '../interfaces/ArenaCursorAncestor';
import ArenaFormating, { ArenaFormatings, TagAndAttributes } from '../interfaces/ArenaFormating';
import ArenaOptionsChild from '../interfaces/ArenaOptions';
import NodeFactory from '../models/NodeFactory';

import ArenaServiceManager from './ArenaServiceManager';
import NodeRegistry from '../helpers/NodeRegistry';
import utils from '../utils';
import { ArenaInterval } from '../interfaces/ArenaInterval';

export type ArenaMark = {
  attributes: string[],
  excludeAttributes?: string[],
  arena: AnyArena,
};

export type FormatingMark = {
  attributes: string[],
  excludeAttributes?: string[],
  formating: ArenaFormating
};

export default class ArenaModel {
  public readonly rootArenaName = '__ROOT__';

  constructor(protected asm: ArenaServiceManager) {
  }

  get model(): ArenaNodeRoot {
    if (!this.rootNode) {
      throw new Error('Root node not defined');
    }
    return this.rootNode;
  }

  public getRegistry(): NodeRegistry {
    return this.registry;
  }

  public setRegistry(registry: NodeRegistry): void {
    this.registry = registry;
  }

  public setRoot(root: ArenaNodeRoot): void {
    this.rootNode = root;
  }

  // #region Arenas and Formatings

  public setDefaultTextArena(
    arena: ArenaMediatorInterface | ArenaTextInterface,
  ): void {
    this.rootArena = ArenaFactory.createRoot({
      root: true,
      name: this.rootArenaName,
      tag: '',
      attributes: {},
      allowedArenas: [arena],
      arenaForText: arena,
    });
    this.arenasByName[this.rootArena.name] = this.rootArena;
    this.createNewRoot();
  }

  public createNewRoot(): void {
    if (this.rootArena) {
      this.rootNode = NodeFactory.createRootNode(this.rootArena);
    }
  }

  public registerArena(
    arenaOptions: ArenaOptionsChild,
    markers?: TagAndAttributes[],
    parentArenas?: string[],
  ): ChildArena | ArenaInlineInterface {
    const arena = ArenaFactory.createChild(arenaOptions);
    this.arenas.push(arena);
    this.arenasByName[arena.name] = arena;
    if (!arena.inline && parentArenas) {
      parentArenas.forEach((parentName) => {
        const parentArena = this.arenasByName[parentName];
        if (!parentArena) {
          throw new Error(`Arena "${parentName}" not found`);
        }
        if (!parentArena.hasChildren) {
          throw new Error(`Arena "${parentName}" has not children`);
        }
        parentArena.addAllowedChild(arena);
      });
    }
    if (markers) {
      markers.forEach(({ tag, attributes }) => {
        if (!this.arenaMarks[tag]) {
          this.arenaMarks[tag] = [];
        }
        this.arenaMarks[tag].push({
          attributes,
          arena,
        });
        this.arenaMarks[tag].sort((a, b) => b.attributes.length - a.attributes.length);
      });
    }
    return arena;
  }

  public registerFormating(
    formating: ArenaFormating,
    markers: TagAndAttributes[],
  ): ArenaFormating {
    this.formatings.push(formating);
    this.formatingsByName[formating.name] = formating;
    markers.forEach(({ tag, ...formatingMark }) => {
      if (!this.formatingMarks[tag]) {
        this.formatingMarks[tag] = [];
      }
      this.formatingMarks[tag].push({
        ...formatingMark,
        formating,
      });
    });
    return formating;
  }

  public getArena(name: string): AnyArena | undefined {
    return this.arenasByName[name];
  }

  public getArenas(): AnyArena[] {
    return this.arenas;
  }

  public getFormatings(): ArenaFormatings {
    return this.formatingsByName;
  }

  public getArenaMarks(tagName: string): ArenaMark[] | undefined {
    return this.arenaMarks[tagName];
  }

  public getFormatingMarks(tagName: string): FormatingMark[] | undefined {
    return this.formatingMarks[tagName];
  }
  // #endregion

  // #region Exporting

  /** Data for storing */
  public getDataHtml(): string {
    return this.model.getDataHtml(this.getFormatings());
  }

  /** Tempate for rendering in the editor */
  public getTemplate(): TemplateResult | string {
    return this.model.getTemplate(this.getFormatings());
  }

  /** Output string for external */
  public getOutput(type: string): string {
    return this.model.getOutput(type, this.getFormatings());
  }

  public getPlainTextOfSelection(selection: ArenaSelection): string {
    if (selection.isCollapsed()) {
      return '';
    }
    const result: string[] = [];
    utils.modelTree.runThroughSelection(
      selection,
      (node: AnyArenaNode, start?: number, end?: number) => {
        result.push(node.getPlainText(start, end));
      },
    );
    return result.join('\n');
  }

  public getDataHtmlOfSelection(selection: ArenaSelection): string {
    if (selection.isCollapsed()) {
      return '';
    }
    let result = '';
    const frms = this.getFormatings();
    const oneNode = selection.isSameNode();
    utils.modelTree.runThroughSelection(
      selection,
      (node: AnyArenaNode, start?: number, end?: number) => {
        let nodeContent = node.getDataHtml(frms, start, end);
        if (node.hasParent && node.parent.group && !oneNode) {
          if (start !== undefined || node.isFirstChild()) {
            nodeContent = node.parent.getOpenTag() + nodeContent;
          }
          if (end !== undefined || node.isLastChild()) {
            nodeContent += node.parent.getCloseTag();
          }
        }
        result += nodeContent;
      },
    );
    if (oneNode) {
      const { startNode, startOffset, endOffset } = selection;
      if (startNode.hasText
        && startOffset === 0
        && endOffset === startNode.getTextLength() - 1
      ) {
        const { parent } = startNode;
        result = parent.getOpenTag() + result + parent.getCloseTag();
      }
    }
    return result;
  }

  public getJson(): string {
    return '';
  }

  // #endregion

  /** */
  public createChildNode(arena: ChildArena, isNew = false): ChildArenaNode {
    const node = NodeFactory.createChildNode(arena, this.registry, isNew);
    return node;
  }

  /** */
  public createInlineNode(arena: ArenaInlineInterface): ArenaNodeInline {
    const node = NodeFactory.createInlineNode(arena);
    return node;
  }

  /** */
  public getTextCursor(
    node: AnyArenaNode,
    offset: number,
  ): ArenaCursorText {
    if (node.hasText) {
      return {
        node,
        offset,
      };
    }
    if (node.hasChildren && node.arena.arenaForText) {
      const child = node.getChild(offset - 1);
      if (child) {
        const cursor = this.getOrCreateNodeForText(child, undefined, true);
        if (cursor) {
          return cursor;
        }
      }
      const cursor2 = this.getOrCreateNodeForText(node, offset);
      if (cursor2) {
        return cursor2;
      }
    }
    throw new Error('Text cursor not found');
  }

  /**
   * TODO split in two methods: with creating and without
   * Find or create text node in children or ancestors.
   * @param node AnyArenaNode
   * @param offset number
   * @returns ArenaCursorText | undefined
   */
  public getOrCreateNodeForText(
    node: AnyArenaNode,
    offset?: number,
    onlyChild = false,
    forceCreate = false,
  ): ArenaCursorText | undefined {
    if (node.hasText) {
      return {
        node,
        offset: offset === undefined ? node.getTextLength() : offset,
      };
    }
    if (node.hasChildren && node.arena.arenaForText) {
      if (!forceCreate && (node.protected || !offset)) { // offset === 0 or undefined
        if (offset === undefined) {
          for (let i = node.children.length - 1; i >= 0; i -= 1) {
            const cursor = this.getOrCreateNodeForText(node.children[i], undefined, true);
            if (cursor) {
              return cursor;
            }
          }
        } else {
          for (let i = 0; i < node.children.length; i += 1) {
            const cursor = this.getOrCreateNodeForText(node.children[i], 0, true);
            if (cursor) {
              return cursor;
            }
          }
        }
      }
      if (!node.protected) {
        let newNode:
          ChildArenaNode | undefined = this.createChildNode(node.arena.arenaForText);
        newNode = node.insertNode(newNode, offset);
        if (newNode) {
          return this.getOrCreateNodeForText(newNode);
        }
      }
    }
    if (!onlyChild && node.hasParent) {
      return this.getOrCreateNodeForText(
        node.parent,
        offset === undefined ? node.getIndex() : node.getIndex() + 1,
      );
    }
    return undefined;
  }

  /**
   * Try to create new node described by arena in given parent and offset.
   * @param arena ChildArena
   * @param parent ParentArenaNode
   * @param offset number
   * @returns ChildArenaNode | undefined
   */
  public createAndInsertNode(
    arena: ChildArena,
    parent: AnyArenaNode,
    offset: number,
    before = false,
    onlyChild = false,
    isNew = false,
    replace = false,
  ): ChildArenaNode | undefined {
    if (parent.hasText) {
      if (onlyChild) {
        return undefined;
      }
      const { node, offset: parentOffset } = this.splitTextNode({ node: parent, offset });
      return this.createAndInsertNode(
        arena,
        node,
        parentOffset,
        parentOffset === 0,
        false,
        isNew,
        replace,
      );
    }
    if (parent.single) {
      return undefined;
    }
    if (parent.isAllowedNode(arena)) {
      const newNode = this.createChildNode(arena, isNew);
      if (replace) {
        parent.removeChild(offset);
      }
      return parent.insertNode(newNode, offset);
    }
    if (arena.defaultParentArena && parent.isAllowedNode(arena.defaultParentArena)) {
      const newParentNode = this.createChildNode(arena.defaultParentArena, isNew);
      if (newParentNode.hasChildren) {
        parent.insertNode(newParentNode, offset);
        const newNode = this.createChildNode(arena, isNew);
        return newParentNode.insertNode(newNode, offset);
      }
    }
    if (parent.protected) {
      if (before) {
        for (let i = offset; i >= 0; i -= 1) {
          const child = parent.getChild(i);
          if (child && child.hasChildren) {
            const node = this.createAndInsertNode(
              arena,
              child,
              parent.children.length,
              true,
              true,
              isNew,
              replace,
            );
            if (node) {
              return node;
            }
          }
        }
      } else {
        for (let i = offset; i < parent.children.length; i += 1) {
          const child = parent.getChild(i);
          if (child && child.hasChildren) {
            const node = this.createAndInsertNode(
              arena,
              child,
              0,
              false,
              true,
              isNew,
              replace,
            );
            if (node) {
              return node;
            }
          }
        }
      }
    }
    if (!onlyChild && parent.hasParent) {
      // this.splitMediatorNode(parent, offset);
      const secondParent = this.splitMediatorNode(parent, offset);
      let parentOffset = offset === 0 ? parent.getIndex() : parent.getIndex() + 1;
      if (secondParent) {
        parentOffset = secondParent.getIndex();
      }
      return this.createAndInsertNode(
        arena,
        parent.parent,
        parentOffset,
        before,
        false,
        isNew,
        replace,
      );
    }
    return undefined;
  }

  /**
   * Find in model tree the text node with global id equal given id parameter.
   * @param id: string
   * @returns ArenaNodeText | undefined
   */
  public getTextNodeById(id: string): ArenaNodeText | undefined {
    const node = this.getNodeById(id);
    if (node?.hasText) {
      return node;
    }
    return undefined;
  }

  /**
   * Find in model tree the node with global id equal given id parameter.
   * @param id: string
   * @returns AnyArenaNode | undefined
   */
  public getNodeById(id: string): AnyArenaNode | undefined {
    // return this.registry.get(id);
    const path = id.split('.').map((i) => parseInt(i, 10));
    let cursor: AnyArenaNode | undefined = this.model;
    if (path.shift() === 0) {
      path.forEach((i) => {
        if (cursor && cursor.hasChildren) {
          cursor = cursor.children[i];
        } else {
          cursor = undefined;
        }
      });
    }
    return cursor;
  }

  public insertHtmlToModel(selection: ArenaSelection, html: string): ArenaSelection {
    let newSelection = selection;
    if (!selection.isCollapsed()) {
      newSelection = this.removeSelection(selection, 'backward');
    }
    const [node, offset] = this.asm.parser.insertHtmlToModel(
      html,
      newSelection.startNode,
      newSelection.startOffset,
    );
    const cursor = this.getTextCursor(node, offset);
    newSelection.setCursor(cursor);
    return newSelection;
  }

  public insertTextToModel(
    selection: ArenaSelection,
    text: string,
    typing = false,
  ): ArenaSelection {
    let newSelection = selection;
    if (!selection.isCollapsed()) {
      newSelection = this.removeSelection(selection, 'backward');
    }
    const { startNode, startOffset } = newSelection;
    if (typing) {
      const textCursor = this.getOrCreateNodeForText(startNode, startOffset, false, true);
      if (textCursor) {
        const newCursor = textCursor.node.insertText(text, textCursor.offset, true);
        newSelection.setCursor(newCursor);
      }
    } else {
      const lines = text.split('\n');
      const firstLine = lines.shift();
      if (firstLine !== undefined) {
        const textCursor = this.getOrCreateNodeForText(startNode, startOffset, false, true);
        if (textCursor) {
          let cursor: ArenaCursorText | undefined = textCursor.node
            .insertText(firstLine, newSelection.startOffset);
          lines.forEach((line) => {
            if (cursor) {
              const nextArena = cursor.node.arena.nextArena || cursor.node.arena;
              const newNode = this.createAndInsertNode(
                nextArena,
                cursor.node.parent,
                cursor.node.getIndex() + 1,
              );
              if (newNode) {
                const newCursor = this.getOrCreateNodeForText(newNode, 0);
                if (newCursor) {
                  cursor = newCursor.node.insertText(line, newCursor.offset);
                } else {
                  cursor = undefined;
                }
              } else {
                cursor = undefined;
              }
            }
          });
          if (cursor) {
            newSelection.setCursor(cursor);
          }
        }
      }
    }
    return newSelection;
  }

  public removeNodeById(id: string): ArenaCursorAncestor | undefined {
    const node = this.getNodeById(id);
    if (node && node.hasParent) {
      this.asm.eventManager.fire('removeNode', node);
      return node.remove();
    }
    return undefined;
  }

  /**
   * Remove selected text and all nodes between selections ends
   * @param selection
   * @param direction
   * @returns
   */
  public removeSelection(selection: ArenaSelection, direction: Direction): ArenaSelection {
    const newSelection = selection;
    if (selection.isCollapsed()) {
      const { node, offset } = newSelection.getCursor();
      if (direction === 'forward') {
        if (!node.hasText) {
          //
        } else if (node.getTextLength() === offset) {
          // const nextSibling = this.getNextSibling(node);
          const nextSibling = node.parent.getChild(node.getIndex() + 1);
          if (!nextSibling) {
            return newSelection;
          }
          if (nextSibling.hasChildren && nextSibling.protected) {
            const cursor = this.getOrCreateNodeForText(nextSibling, 0);
            if (cursor) {
              if (node.getTextLength() === 0) {
                node.remove();
              }
              newSelection.setCursor(cursor);
            }
            return newSelection;
          }
          if (nextSibling.single) {
            this.asm.eventManager.fire('removeNode', nextSibling);
            nextSibling.remove();
            return newSelection;
          }
          const cursor = this.getOrCreateNodeForText(nextSibling, 0);
          // const cursor = nextSibling.getTextCursor(0);
          if (cursor) {
            if (node.getTextLength() === 0) {
              this.asm.eventManager.fire('removeNode', node);
              node.remove();
              newSelection.setCursor(cursor);
            } else {
              node.insertText(cursor.node.cutText(0), offset);
              this.asm.eventManager.fire('removeNode', node);
              cursor.node.remove();
            }
          }
        } else {
          node.removeText(offset, offset + 1);
        }
      }
      if (direction === 'backward') {
        if (!node.hasText) {
          //
        } else if (offset === 0) {
          // At the begining of the text node
          const newNode = this.getOutFromMediator(node, true);
          if (newNode) {
            newSelection.setBoth(newNode, 0);
          } else {
            // nowhere to get out
            const prevSibling = node.parent.getChild(node.getIndex() - 1);
            if (!prevSibling) {
              // TODO go to prev parent
              return newSelection;
            }
            if (prevSibling.hasChildren && prevSibling.protected) {
              const cursor = this.getOrCreateNodeForText(prevSibling);
              if (cursor) {
                if (node.getTextLength() === 0) {
                  node.remove();
                }
                newSelection.setCursor(cursor);
              }
              return newSelection;
            }
            if (prevSibling.single) {
              this.asm.eventManager.fire('removeNode', prevSibling);
              prevSibling.remove();
              return newSelection;
            }
            if (prevSibling.hasText && prevSibling.getTextLength() === 0) {
              this.asm.eventManager.fire('removeNode', prevSibling);
              prevSibling.remove();
              return newSelection;
            }
            // const cursor = prevSibling.getTextCursor(-1);
            const cursor = this.getOrCreateNodeForText(prevSibling);
            if (cursor) {
              if (node.getTextLength() !== 0) {
                cursor.node.insertText(node.getText(), cursor.offset);
              }
              this.asm.eventManager.fire('removeNode', node);
              node.remove();
              newSelection.setCursor(cursor);
            }
          }
        } else {
          node.removeText(offset - 1, offset);
          newSelection.setBoth(node, offset - 1);
        }
      }
      return newSelection;
    }
    const toRemove: ChildArenaNode[] = [];
    utils.modelTree.runThroughSelection(
      newSelection,
      (node: AnyArenaNode, start?: number, end?: number) => {
        if (start === undefined && end === undefined) {
          if (node.hasParent) {
            toRemove.push(node);
          }
        } else if (node.hasText) {
          node.removeText(start || 0, end);
        }
      },
    );
    toRemove.forEach((node) => {
      this.asm.eventManager.fire('removeNode', node);
      node.remove();
    });
    const {
      startNode,
      startOffset,
      endNode,
    } = newSelection;
    if (newSelection.isSameNode()) {
      newSelection.setBoth(startNode, startOffset);
    } else {
      // eslint-disable-next-line no-lonely-if
      if (startNode.hasText && endNode.hasText) {
        if (startNode.getTextLength() === 0) {
          this.asm.eventManager.fire('removeNode', startNode);
          startNode.remove();
          if (endNode.getTextLength() === 0) {
            this.asm.eventManager.fire('removeNode', endNode);
            const aCursor = endNode.remove();
            const cursor = this.getOrCreateNodeForText(aCursor.node, aCursor.offset);
            if (!cursor) {
              throw Error('Cannot create text node');
            }
            newSelection.setCursor(cursor);
          } else {
            newSelection.setBoth(endNode, 0);
          }
        } else {
          if (startNode.hasText && endNode.hasText) {
            startNode.insertText(
              endNode.getText(),
              startOffset,
            );
          }
          this.asm.eventManager.fire('removeNode', endNode);
          endNode.remove();
          newSelection.setBoth(startNode, startOffset);
        }
      } else if (endNode.hasText) {
        newSelection.setBoth(endNode, 0);
      } else {
        newSelection.setBoth(startNode, startOffset);
      }
    }
    return newSelection;
  }

  /**
   * Remove selected nodes and split selected node in two nodes.
   * If current node is empty, try split uprotected parent in two
   * or get out of protected node, if cursor in the end of parent.
   * @param selection
   * @returns
   */
  public breakSelection(selection: ArenaSelection): ArenaSelection {
    let newSelection = selection;
    if (!selection.isCollapsed()) {
      newSelection = this.removeSelection(selection, 'backward');
    }
    const cursor = newSelection.getCursor();
    const { node, offset } = cursor;
    if (!node.hasText) {
      const textCursor = this.getOrCreateNodeForText(node, offset, false, true);
      if (textCursor) {
        newSelection.setCursor(textCursor);
      }
      return newSelection;
    }
    const { parent, arena } = node;
    const nextArena = arena.nextArena || arena;
    if (offset === 0) {
      // At the begining of the text node
      if (node.isEmpty()) {
        // Text is empty. Trying to get out from this node (ex. in a list)
        const outNode = this.getOutFromMediator(node);
        if (outNode) {
          newSelection.setBoth(outNode, 0);
        } else {
          // nowhere to get out
          const newNode = this.createAndInsertNode(nextArena, parent, node.getIndex() + 1);
          if (newNode) {
            // const cursor = newNode.getTextCursor(0);
            const secondCursor = this.getOrCreateNodeForText(newNode, 0);
            if (secondCursor) {
              newSelection.setCursor(secondCursor);
            }
          }
        }
      } else {
        const newNode = this.createAndInsertNode(nextArena, parent, node.getIndex(), true);
        if (newNode) {
          this.getOrCreateNodeForText(newNode, 0);
        }
      }
    } else {
      // const secondCursor = this.splitTextNode(cursor);
      // newSelection.setCursor();
      const newNode = this.createAndInsertNode(nextArena, parent, node.getIndex() + 1);
      if (newNode) {
        const newCursor = this.getOrCreateNodeForText(newNode, 0);
        // const cursor = newNode.getTextCursor(0);
        if (newCursor) {
          const text = node.cutText(offset);
          const cursor2 = newCursor.node.insertText(text, newCursor.offset);
          newSelection.setCursor({ ...cursor2, offset: 0 });
        }
      }
    }
    return newSelection;
  }

  /**
   * Breaks the text node into two. Returns the parent of both and the offset between them
   * @param param0 ArenaCursorText
   * @returns ArenaCursorAncestor
   */
  public splitTextNode(
    { node, offset }: ArenaCursorText,
  ): ArenaCursorAncestor {
    const { parent, arena } = node;
    const before = offset <= 0;
    if (before) {
      return {
        node: parent,
        offset: node.getIndex(),
      };
    }
    const after = offset >= node.getTextLength();
    if (after) {
      return {
        node: parent,
        offset: node.getIndex() + 1,
      };
    }
    const newOffset = node.getIndex() + (before ? 0 : 1);
    const nextArena = before ? arena : arena.nextArena || arena;
    const newNode = this.createAndInsertNode(
      nextArena,
      parent,
      newOffset,
    );
    if (newNode) {
      const newCursor = this.getOrCreateNodeForText(newNode, 0);
      if (newCursor) {
        const text = node.cutText(offset);
        newCursor.node.insertText(text, newCursor.offset);
      }
    }
    return {
      node: parent,
      offset: newOffset,
    };
  }

  /** */
  public moveChild(selection: ArenaSelection, direction: 'up' | 'down'): ArenaSelection {
    const node = selection.startNode;
    if (selection.isSameNode() && node.hasText) {
      this.moveNode(node, direction);
    }
    return selection;
  }

  protected moveNode(node: AnyArenaNode, direction: 'up' | 'down'): void {
    if (!node.hasParent) {
      return;
    }
    if (node.parent.protected) {
      this.moveNode(node.parent, direction);
      return;
    }
    const index = node.getIndex();
    if ((direction === 'up' && index === 0)
     || (direction === 'down' && node.isLastChild())) {
      this.moveNode(node.parent, direction);
      return;
    }
    const children = node.parent.cutChildren(index, 1);
    if (direction === 'up') {
      node.parent.insertChildren(children, index - 1);
    } else {
      node.parent.insertChildren(children, index + 1);
    }
  }

  /** */
  public insertBeforeSelected(
    selection: ArenaSelection,
    arena: ChildArena,
    replace = false,
  ): [ArenaSelection, AnyArenaNode | undefined] {
    if (!selection.isSameNode()) {
      return [selection, undefined];
    }
    const { node, offset } = selection.getCursor();
    let insertedNode: AnyArenaNode | undefined;
    if (node.hasText) {
      if (node.parent.isAllowedNode(arena)) {
        insertedNode = this.createAndInsertNode(
          arena,
          node.parent,
          node.getIndex(),
          false,
          false,
          true,
          replace,
        );
      }
    } else if (node.hasChildren) {
      if (node.isAllowedNode(arena)) {
        insertedNode = this.createAndInsertNode(arena, node, offset, false, false, true, replace);
      }
    }
    return [selection, insertedNode];
  }

  /**
   *
   * @param selection
   * @param arena
   * @returns
   */
  public applyArenaToSelection(
    selection: ArenaSelection,
    arena: ArenaMediatorInterface | ArenaTextInterface,
  ): ArenaSelection {
    if (arena.hasText) {
      return this.applyTextArenaToSelection(selection, arena);
    }
    if (arena.hasChildren) {
      if (arena.protected) {
        return this.applyProtectedArenaToSelection(selection, arena);
      }
      if (arena.group) {
        return this.toggleGroupArenaForSelection(selection, arena);
      }
      return this.toggleSimpleMediatorArenaForSelection(selection, arena);
    }
    return selection;
  }

  /**
   * Apply given formation to all selected nodes, including child nodes.
   * @param selection ArenaSelection
   * @param formating ArenaFormating
   * @returns ArenaSelection
   */
  public applyFormationToSelection(
    selection: ArenaSelection,
    formating: ArenaFormating,
  ): ArenaSelection {
    if (selection.isCollapsed()) {
      const { node, offset } = selection.getCursor();
      if (node.hasText) {
        node.togglePromiseFormating(formating, offset);
      }
    } else {
      utils.modelTree.runThroughSelection(
        selection,
        (node: AnyArenaNode, start?: number, end?: number) => {
          if (node.hasText) {
            utils.text.toggleFormating(formating.name, node, start, end);
          }
          if (node.hasChildren) {
            const startIndex = start || 0;
            const endIndex = end === undefined ? node.children.length : end;
            for (let i = startIndex; i < endIndex; i += 1) {
              const n = node.getChild(i);
              if (n) {
                if (n.hasText) {
                  n.toggleFormating(formating.name, 0, n.getTextLength());
                }
                if (n.hasChildren) {
                  utils.modelTree.runOfChildren(n, (someNode: AnyArenaNode) => {
                    if (someNode.hasText) {
                      someNode.toggleFormating(formating.name, 0, someNode.getTextLength());
                    }
                  });
                }
              }
            }
          }
        },
      );
    }
    return selection;
  }

  public clearFormationInSelection(
    selection: ArenaSelection,
  ): ArenaSelection {
    utils.modelTree.runThroughSelection(
      selection,
      (node: AnyArenaNode, start?: number, end?: number) => {
        if (node.hasText) {
          node.clearFormatings(start || 0, end || node.getTextLength());
          if (node.arena.nextArena
            && node.arena.nextArena.hasText
            && node.arena.nextArena !== node.arena
            && node.parent.isAllowedNode(node.arena.nextArena)) {
            const newNode = this.createChildNode(node.arena.nextArena);
            if (newNode) {
              node.parent.insertNode(newNode, node.getIndex());
              const textCursor = this.getOrCreateNodeForText(newNode, 0, false, true);
              if (textCursor) {
                textCursor.node.insertText(node.getText(), textCursor.offset);
                if (selection.startNode === node) {
                  selection.setStartNode(newNode as ArenaNodeText, selection.startOffset);
                }
                if (selection.endNode === node) {
                  selection.setEndNode(newNode as ArenaNodeText, selection.endOffset);
                }
                node.remove();
              }
            }
          }
        }
        if (node.hasChildren) {
          utils.modelTree.runOfChildren(node, (n: AnyArenaNode) => {
            if (n.hasText) {
              n.clearFormatings(start || 0, end || n.getTextLength());
            }
          });
        }
      },
    );
    return selection;
  }

  public getInlineInterval(
    selection: ArenaSelection,
  ): ArenaInterval | undefined {
    const { startNode, startOffset, endOffset } = selection;
    if (selection.isSameNode() && startNode.hasText) {
      return startNode.getInlineInterval(startOffset, endOffset);
    }
    return undefined;
  }

  // #region [Inline Node]
  public addInlineNode(
    selection: ArenaSelection,
    arena: ArenaInlineInterface,
  ): ArenaNodeInline | undefined {
    const { startNode, startOffset, endOffset } = selection;
    if (selection.isSameNode() && !selection.isCollapsed() && startNode.hasText) {
      const node = this.createInlineNode(arena);
      return startNode.addInlineNode(node, startOffset, endOffset);
    }
    return undefined;
  }

  public getInlineNode(
    selection: ArenaSelection,
    arena: ArenaInlineInterface,
  ): [ArenaNodeText, ArenaNodeInline] | undefined {
    const { startNode, startOffset, endOffset } = selection;
    if (selection.isSameNode() && startNode.hasText) {
      const inlineNode = startNode.getInlineNode(arena, startOffset, endOffset);
      if (inlineNode) {
        return [startNode, inlineNode];
      }
    }
    return undefined;
  }

  public removeInlineNode(selection: ArenaSelection, node: ArenaNodeInline): void {
    const { startNode } = selection;
    if (selection.isSameNode() && startNode.hasText) {
      return startNode.removeInlineNode(node);
    }
    return undefined;
  }

  public updateInlineNode(selection: ArenaSelection, node: ArenaNodeInline): void {
    const { startNode, startOffset, endOffset } = selection;
    if (selection.isSameNode() && !selection.isCollapsed() && startNode.hasText) {
      startNode.updateInlineNode(node, startOffset, endOffset);
    }
  }
  // #endregion

  public isAllowedNode(node: AnyArenaNode, arena: ChildArena): boolean {
    if (node.hasText) {
      return node.parent.isAllowedNode(arena);
    }
    if (node.hasChildren) {
      return node.isAllowedNode(arena);
    }
    return false;
  }

  protected registry = new NodeRegistry();

  protected arenas: AnyArena[] = [];

  protected arenasByName: { [name: string]: AnyArena } = { };

  protected formatings: ArenaFormating[] = [];

  protected formatingsByName: ArenaFormatings = {};

  protected arenaMarks: { [tag: string]: ArenaMark[] } = { };

  protected formatingMarks: { [tag: string]: FormatingMark[] } = { };

  protected rootArena: ArenaRootInterface | undefined;

  protected rootNode: ArenaNodeRoot | undefined;

  /** Split non protected node into two.
   * If offset in start or end of the givven node splitting is not necessary. */
  protected splitMediatorNode(
    node: ArenaNodeMediator,
    offset: number,
  ): undefined | ArenaNodeMediator {
    if (offset === 0 || offset >= node.children.length) {
      return undefined;
    }
    if (node.arena.protected) {
      return undefined;
    }
    if (node.parent.arena.protected) {
      return undefined;
    }
    const newNode = this.createAndInsertNode(
      node.arena,
      node.parent,
      node.getIndex() + 1,
    );
    if (!newNode || !(newNode.hasChildren)) {
      return undefined;
    }
    newNode.insertChildren(node.cutChildren(offset));
    return newNode;
  }

  /**  */
  public getOutFromMediator(
    node: ArenaNodeText,
    onlyGroup = false,
  ): ArenaNodeText | undefined {
    const { parent } = node;
    if (!parent.hasParent) {
      return undefined;
    }
    if (onlyGroup && parent.protected) {
      return undefined;
    }
    const index = node.getIndex();
    if (onlyGroup && !parent.group && index > 0) {
      return undefined;
    }
    const grandpaCursor = parent.getUnprotectedParent();
    if (grandpaCursor && grandpaCursor.node.arena.arenaForText) {
      // Try to get out from this node (ex. in a list)
      if (parent.hasParent && parent.parent === grandpaCursor.node) {
        // try to separate
        if (!parent.arena.group) {
          return undefined;
        }
        this.splitMediatorNode(parent, index);
      } else if (!node.isLastChild()
        || parent.children.length < 2
        || !node.isEmpty()) {
        return undefined;
      }
      let { offset } = grandpaCursor;
      if (index > 0 || parent.children.length === 1) {
        offset += 1;
      }
      const cursor = this.getOrCreateNodeForText(grandpaCursor.node, offset, false, true);
      // const cursor = grandpaCursor.node.insertText(text, offset);
      if (cursor) {
        const text = node.cutText(0);
        cursor.node.insertText(text, cursor.offset);
        node.remove();
        return cursor.node;
      }
    }
    return undefined;
  }

  // protected getNextSibling(
  //   node: AnyArenaNode,
  // ): ArenaNodeText | ArenaNodeSingle | undefined {
  //   if (!(node.hasParent)) {
  //     return undefined;
  //   }
  //   const next = node.parent.getChild(node.getIndex() + 1);
  //   if (next && next.single) {
  //     return next;
  //   }
  //   if (next?.hasChildren && next.protected) {
  //     return undefined;
  //   }
  //   if (next) {
  //     const cursor = this.getOrCreateNodeForText(next, 0);
  //     if (cursor) {
  //       // return next.getTextCursor(0).node;
  //       return cursor.node;
  //     }
  //   }
  //   return this.getNextSibling(node.parent);
  // }

  // #region [Apply text Arena]

  protected applyTextArenaToSelection(
    selection: ArenaSelection,
    arena: ArenaTextInterface,
  ): ArenaSelection {
    const {
      startNode, startOffset, endNode, endOffset,
    } = selection;
    const newSelection = selection.clone();
    const toTransform: AnyArenaNode[] = [];
    if (selection.isCollapsed()) {
      if (startNode.hasText) {
        const newNode = this.transformNode(startNode, arena);
        if (newNode) {
          newSelection.setBoth(newNode, startOffset);
        }
      } else if (startNode.hasChildren && startNode.isAllowedNode(arena)) {
        const newNode = this.createAndInsertNode(
          arena,
          startNode,
          startOffset,
        ) as ArenaNodeText;
        if (newNode) {
          newSelection.setBoth(newNode, 0);
        }
      }
      return newSelection;
    }
    utils.modelTree.runThroughSelection(
      selection,
      (node: AnyArenaNode, start, end) => {
        if (node.arena !== arena) {
          if (toTransform.length && end === 0) {
            // skip last node if it not selected
          } else {
            toTransform.push(node);
          }
        }
      },
    );
    toTransform.forEach((n) => {
      const newNode = this.transformNode(n, arena);
      if (newNode) {
        if (n === startNode) {
          newSelection.setStartNode(newNode, startOffset);
        }
        if (n === endNode) {
          newSelection.setEndNode(newNode, endOffset);
        }
      }
    });
    return newSelection;
  }

  protected transformNode(
    node: AnyArenaNode,
    arena: ArenaTextInterface,
  ): ArenaNodeText | undefined {
    if (node.hasText) {
      const cursor = this.getParentWhoCanCreateNode(node, arena);
      if (cursor) {
        const newNode = this.createAndInsertNode(
          arena,
          cursor.node,
          cursor.offset,
        ) as ArenaNodeText;
        if (newNode) {
          newNode.insertText(node.getText(), 0);
          node.remove();
          return newNode;
        }
      }
    } else if (node.hasChildren) {
      [...node.children].forEach((child) => this.transformNode(child, arena));
    }
    return undefined;
  }

  protected getParentWhoCanCreateNode(
    node: AnyArenaNode,
    arena: ArenaTextInterface,
    after = false,
  ): ArenaCursorAncestor | undefined {
    if (!node.hasParent) {
      return undefined;
    }
    const { parent } = node;
    if (parent.arena.protected) {
      return undefined;
    }
    const offset = node.getIndex() + (after ? 1 : 0);
    if (parent.isAllowedNode(arena)) {
      return {
        node: parent,
        offset,
      };
    }
    if (parent.hasParent) {
      //  && parent.group
      const secondParent = this.splitMediatorNode(parent, node.getIndex());
      if (secondParent) {
        return this.getParentWhoCanCreateNode(secondParent, arena);
      }
      if (offset === 0) {
        // try to create before parent
        return this.getParentWhoCanCreateNode(parent, arena);
      }
      return this.getParentWhoCanCreateNode(parent, arena, true);
    }
    return undefined;
  }

  // [Apply text Arena]
  // #endregion

  protected toggleGroupArenaForSelection(
    selection: ArenaSelection,
    arena: ArenaMediatorInterface,
  ): ArenaSelection {
    const newSelection = selection.clone();
    const toWrap: ChildArenaNode[] = [];
    const toUnwrap: ArenaNodeMediator[] = [];
    const commonAncestorCursor = utils.modelTree.runThroughSelection(
      selection,
      (node: AnyArenaNode) => {
        if (node.hasParent
          && node.parent.isAllowedNode(arena)
          && arena.allowedArenas.includes(node.arena)
        ) {
          toWrap.push(node);
        } else if (node.hasParent
          && node.arena === arena
          && node.hasChildren
        ) {
          toUnwrap.push(node);
        } else if (node.hasParent
          && node.parent.arena === arena
          && node.parent.hasParent) {
          toUnwrap.push(node.parent);
        } else if (node.hasChildren && node.isAllowedNode(arena)) {
          node.children.forEach((n) => {
            if (n.arena === arena
              && n.hasChildren
            ) {
              toUnwrap.push(n);
            } else if (arena.allowedArenas.includes(n.arena)) {
              toWrap.push(n);
            }
          });
        }
      },
    );
    if (commonAncestorCursor) {
      const [commonAncestor] = commonAncestorCursor;
      const parentToUnwrap = utils.modelTree.findNodeUp(
        commonAncestor,
        (node) => node.arena === arena,
      );
      if (parentToUnwrap && parentToUnwrap.hasParent && parentToUnwrap.hasChildren) {
        const { parent } = parentToUnwrap;
        for (let i = 0; i < parentToUnwrap.children.length; i += 1) {
          if (!parentToUnwrap.parent.isAllowedNode(parentToUnwrap.children[i].arena)) {
            return newSelection;
          }
        }
        parent.insertChildren(parentToUnwrap.children, parentToUnwrap.getIndex());
        parent.mergeChildren(0);
        parentToUnwrap.remove();
        return newSelection;
      }
      if (toWrap.length === 0 && toUnwrap.length === 0) {
        const nodeToWrap = utils.modelTree.findNodeUp(
          commonAncestor,
          (node) => node.hasParent && node.parent.isAllowedNode(arena),
        );
        if (nodeToWrap
          && nodeToWrap.hasParent
          && arena.allowedArenas.includes(nodeToWrap.arena)
        ) {
          toWrap.push(nodeToWrap);
        }
      }
    }
    if (toWrap.length > 0) {
      toWrap.forEach((node) => {
        const { parent } = node;
        const newParent = this.createChildNode(arena) as ArenaNodeMediator;
        parent.insertNode(newParent, node.getIndex());
        const children = parent.cutChildren(node.getIndex(), 1);
        newParent.insertChildren(children);
        parent.mergeChildren(0);
      });
    } else if (toUnwrap.length > 0) {
      toUnwrap.forEach((node) => {
        const { parent } = node;
        const offset = node.getIndex();
        for (let i = 0; i < node.children.length; i += 1) {
          if (!node.parent.isAllowedNode(node.children[i].arena)) {
            return;
          }
        }
        const children = node.cutChildren(0);
        parent.insertChildren(children, node.getIndex());
        if (selection.startNode === parent
          && selection.startOffset === offset
        ) {
          //
        }
        const { offset: newOffset } = node.remove();
        if (selection.endNode === parent
          && selection.endOffset === offset
        ) {
          newSelection.setEndNode(parent, newOffset);
        }
      });
    } else if (selection.isCollapsed()) {
      // const { node, offset } = selection.getCursor();
      // if (node.hasChildren && node.isAllowedNode(arena)) {
      //   const newNode = this.createAndInsertNode(
      //     arena,
      //     node,
      //     offset,
      //   ) as ArenaNodeMediator;
      //   if (newNode) {
      //     const cursor2 = this.getTextCursor(newNode, 0);
      //     if (cursor2) {
      //       newSelection.setCursor(cursor2);
      //     }
      //   }
      // }
    }
    return newSelection;
  }

  /**
   * Wrap selected nodes by protected Node described by given Arena.
   * All selected children will be took of and inserted in new Node, if it allow Arena.
   * Rest children will be back in them ancestor after new Node.
   * @param selection ArenaSelection
   * @param arena ArenaAncestor
   * @returns ArenaSelection
   */
  protected applyProtectedArenaToSelection(
    selection: ArenaSelection,
    arena: ArenaMediatorInterface,
  ): ArenaSelection {
    const commonAncestorCursor = utils.modelTree.runThroughSelection(
      selection,
    );
    if (!commonAncestorCursor) {
      return selection;
    }
    const [commonAncestor, start, end] = commonAncestorCursor;
    if (!commonAncestor.hasChildren || !commonAncestor.isAllowedNode(arena)) {
      return selection;
    }
    const newNode = this.createAndInsertNode(arena, commonAncestor, start);
    if (newNode && newNode.hasChildren) {
      const childrentToWrap = commonAncestor.cutChildren(start + 1, end - start + 1);
      const rest = newNode.insertChildren(childrentToWrap);
      if (rest.length) {
        commonAncestor.insertChildren(rest, newNode.getIndex() + 1);
      }
      // const cursor = newNode.getTextCursor(0);
      const cursor = this.getOrCreateNodeForText(newNode, 0);
      if (cursor) {
        selection.setCursor(cursor);
      }
    }
    return selection;
  }

  // #region [Toggle simple non group Arena]

  protected toggleSimpleMediatorArenaForSelection(
    selection: ArenaSelection,
    arena: ArenaMediatorInterface,
  ): ArenaSelection {
    const commonAncestorCursor = utils.modelTree.runThroughSelection(
      selection,
    );
    if (!commonAncestorCursor) {
      return selection;
    }
    const newSelection = selection.clone();
    const [commonAncestor, start, end] = commonAncestorCursor;
    if (!commonAncestor.hasChildren) {
      return newSelection;
    }
    const ancestor = this.tryToFindAncestor(commonAncestor, arena);
    if (ancestor) {
      this.unwrapNode(ancestor);
      return newSelection;
    }
    let dad: ParentArenaNode;
    let childrentToWrap: ChildArenaNode[];
    let offset = start;
    if (commonAncestor.isAllowedNode(arena)) {
      dad = commonAncestor;
      childrentToWrap = dad.cutChildren(start, end - start + 1);
      offset = start;
    } else {
      const toWrap = this.tryToFindAncestor2(commonAncestor, arena);
      if (!toWrap) {
        return newSelection;
      }
      dad = toWrap.parent;
      offset = toWrap.getIndex();
      childrentToWrap = dad.cutChildren(offset, 1);
    }
    let wrap = false;
    for (let i = 0; i < childrentToWrap.length; i += 1) {
      const child = childrentToWrap[i];
      if (arena.allowedArenas.includes(child.arena)
      // || (arena.arenaForText && 'hasText' in child)
      ) {
        wrap = true;
        break;
      }
    }
    if (!wrap) {
      childrentToWrap.forEach((child) => {
        if (child.arena === arena && child.hasChildren) {
          const children = child.cutChildren(0);
          dad.insertChildren(children, offset);
          offset += children.length;
        } else {
          dad.insertChildren([child], offset);
          offset += 1;
        }
      });
    } else {
      let toWrap = [];
      for (let i = 0; i < childrentToWrap.length; i += 1) {
        const child = childrentToWrap[i];
        if (arena.allowedArenas.includes(child.arena)
        // || (arena.arenaForText && 'hasText' in child)
        ) {
          toWrap.push(child);
        } else {
          if (toWrap.length > 0) {
            const newNode = this.createAndInsertNode(arena, dad, offset);
            // const newNode = dad.createAndInsertNode(arena, offset);
            if (newNode) {
              (newNode as ParentArenaNode).insertChildren(toWrap, 0);
              offset += 1;
              toWrap = [];
            }
            // if (toWrap.length === i) {
            //   newSelection.setStartNode(newNode.getChild(0), startOffset);
            // }
          }
          dad.insertChildren([child], offset);
          offset += 1;
        }
      }
      if (toWrap.length > 0) {
        const newNode = this.createAndInsertNode(arena, dad, offset);
        if (newNode) {
          (newNode as ParentArenaNode).insertChildren(toWrap, 0);
        }
        // if (toWrap.length === childrentToWrap.length) {
        //   newSelection.setStartNode(newNode.getChild(0), startOffset);
        // }
        // newSelection.setEndNode(newNode.getChild(toWrap.length - 1), endOffset);
      }
      dad.mergeChildren(0);
    }
    return newSelection;
  }

  protected tryToFindAncestor(
    node: AnyArenaNode,
    arena: ArenaMediatorInterface,
  ): ArenaNodeMediator | undefined {
    if (node.hasParent) {
      if (node.arena === arena && node.hasChildren) {
        return node;
      }
      return this.tryToFindAncestor(node.parent, arena);
    }
    return undefined;
  }

  protected tryToFindAncestor2(
    node: ParentArenaNode,
    arena: ArenaMediatorInterface,
  ): ArenaNodeMediator | undefined {
    if (node.hasParent) {
      if (node.parent.arena.allowedArenas.includes(arena)) {
        return node;
      }
      return this.tryToFindAncestor2(node.parent, arena);
    }
    return undefined;
  }

  protected unwrapNode(node: ArenaNodeMediator): void {
    const { parent } = node;
    const offset = node.getIndex();
    const children = node.cutChildren(0);
    const childrenToInsert: ChildArenaNode[] = [];
    children.forEach((child) => {
      if (parent.isAllowedNode(child.arena)) {
        childrenToInsert.push(child);
      } else if (child.hasText) {
        const newNode = this.createChildNode(parent.arena.arenaForText);
        if (newNode) {
          const textCursor = this.getOrCreateNodeForText(newNode, 0, false, true);
          if (textCursor) {
            textCursor.node.insertText(child.getText(), 0);
            childrenToInsert.push(newNode);
          }
        }
      }
    });
    // TODO catch rest nodes
    parent.insertChildren(childrenToInsert, offset);
    node.remove();
  }
  // #endregion
}
