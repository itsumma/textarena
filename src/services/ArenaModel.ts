import { TemplateResult } from 'lit-html';

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

type ArenaMark = {
  attributes: string[],
  arena: AnyArena,
};

type FormatingMark = {
  attributes: string[],
  formating: ArenaFormating
};

export default class ArenaModel {
  public readonly rootArenaName = '__ROOT__';

  get model(): ArenaNodeRoot {
    if (!this.rootNode) {
      throw new Error('Root node not defined');
    }
    return this.rootNode;
  }

  constructor(protected asm: ArenaServiceManager) {
  }

  public setDefaultTextArena(
    arena: ArenaMediatorInterface | ArenaTextInterface,
  ): void {
    this.rootArena = ArenaFactory.createRoot({
      root: true,
      name: this.rootArenaName,
      tag: '',
      attributes: [],
      allowedArenas: [arena],
      arenaForText: arena,
    });
    this.arenasByName[this.rootArena.name] = this.rootArena;
    this.rootNode = NodeFactory.createRootNode(this.rootArena);
  }

  getOutputHtml(): string {
    return this.model.getOutputHtml(this.getFormatings());
  }

  getHtml(): TemplateResult | string {
    return this.model.getHtml(this.getFormatings());
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
        if (!this.areanMarks[tag]) {
          this.areanMarks[tag] = [];
        }
        this.areanMarks[tag].push({
          attributes,
          arena,
        });
        this.areanMarks[tag].sort((a, b) => b.attributes.length - a.attributes.length);
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
    markers.forEach(({ tag, attributes }) => {
      if (!this.formatingMarks[tag]) {
        this.formatingMarks[tag] = [];
      }
      this.formatingMarks[tag].push({
        attributes,
        formating,
      });
    });
    return formating;
  }

  public getArena(name: string): AnyArena | undefined {
    return this.arenasByName[name];
  }

  public getFormatings(): ArenaFormatings {
    return this.formatingsByName;
  }

  public getArenaMarks(tagName: string): ArenaMark[] | undefined {
    return this.areanMarks[tagName];
  }

  public getFormatingMarks(tagName: string): FormatingMark[] | undefined {
    return this.formatingMarks[tagName];
  }

  public getTextNodeById(id: string): ArenaNodeText | undefined {
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
      if (cursor && cursor.hasText) {
        return cursor;
      }
    }
    return undefined;
  }

  public getNodeById(id: string): AnyArenaNode | undefined {
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

  public insertHtml(selection: ArenaSelection, html: string): ArenaSelection {
    let newSelection = selection;
    if (!selection.isCollapsed()) {
      newSelection = this.removeSelection(selection, 'backward');
    }
    const result = this.asm.parser.insertHtmlToModel(
      html,
      newSelection.startNode,
      newSelection.startOffset,
    );
    if (result) {
      newSelection.setBoth(result[0] as ArenaNodeText, result[1]);
    }
    return newSelection;
  }

  private applyMiddlewares(cursor: ArenaCursorText): ArenaCursorText {
    let result = cursor;
    if (cursor.node.arena.hasText) {
      const { middlewares } = cursor.node.arena;
      for (let i = 0; i < middlewares.length; i += 1) {
        result = middlewares[i](result);
      }
    }
    return result;
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
    let cursor = newSelection.startNode.insertText(text, newSelection.startOffset, true);
    if (typing) {
      cursor = this.applyMiddlewares(cursor);
    }
    newSelection.setCursor(cursor);
    return newSelection;
  }

  public removeSelection(selection: ArenaSelection, direction: Direction): ArenaSelection {
    const newSelection = selection;
    if (selection.isCollapsed()) {
      const { node, offset } = newSelection.getCursor();
      if (direction === 'forward') {
        if (node.getTextLength() === offset) {
          const nextSibling = this.getNextSibling(node);
          if (!nextSibling) {
            return newSelection;
          }
          const cursor = nextSibling.getTextCursor(0);
          if (node.getTextLength() === 0) {
            node.remove();
            newSelection.setCursor(cursor);
          } else {
            node.insertText(cursor.node.cutText(0), offset);
            cursor.node.remove();
          }
        } else {
          node.removeText(offset, offset + 1);
        }
      }
      if (direction === 'backward') {
        if (offset === 0) {
          // At the begining of the text node
          const newNode = this.getOutFromMediator(node);
          if (newNode) {
            newSelection.setBoth(newNode, 0);
          } else {
            // nowhere to get out
            const prevSibling = node.parent.getChild(node.getIndex() - 1);
            if (!prevSibling) {
              return newSelection;
            }
            const cursor = prevSibling.getTextCursor(-1);
            if (node.getTextLength() !== 0) {
              cursor.node.insertText(node.getText(), cursor.offset);
            }
            node.remove();
            newSelection.setCursor(cursor);
          }
        } else {
          node.removeText(offset - 1, offset);
          newSelection.setBoth(node, offset - 1);
        }
      }
      return newSelection;
    }
    const toRemove: ChildArenaNode[] = [];
    this.runNodesOfSelection(
      newSelection,
      (node: ChildArenaNode, start?: number, end?: number) => {
        if (start === undefined && end === undefined) {
          if (node.hasParent) {
            toRemove.push(node);
          }
        } else if (node.hasText) {
          node.removeText(start || 0, end);
        }
      },
    );
    toRemove.forEach((node) => node.remove());
    const {
      startNode,
      startOffset,
      endNode,
    } = newSelection;
    if (startNode !== endNode) {
      if (startNode.getTextLength() === 0) {
        startNode.remove();
        if (endNode.getTextLength() === 0) {
          const aCursor = endNode.remove();
          const cursor = aCursor.node.insertText('', aCursor.offset);
          newSelection.setCursor(cursor);
        } else {
          newSelection.setBoth(endNode, 0);
        }
      } else {
        startNode.insertText(
          endNode.getText(),
          startOffset,
        );
        endNode.remove();
        newSelection.setBoth(startNode, startOffset);
      }
    } else {
      newSelection.setBoth(startNode, startOffset);
    }
    return newSelection;
  }

  public breakSelection(selection: ArenaSelection): ArenaSelection {
    let newSelection = selection;
    if (!selection.isCollapsed()) {
      newSelection = this.removeSelection(selection, 'backward');
    }
    const { node, offset } = newSelection.getCursor();
    const { parent, arena } = node;
    if (offset === 0) {
      // At the begining of the text node
      if (node.getTextLength() === 0) {
        // Text is empty. Try to get out from this node (ex. in a list)
        const newNode = this.getOutFromMediator(node);
        if (newNode) {
          newSelection.setBoth(newNode, 0);
        } else {
          // nowhere to get out
          const nextArena = arena.nextArena || arena;
          const nextNode = parent.createAndInsertNode(nextArena, node.getIndex() + 1);
          if (nextNode) {
            const cursor = nextNode.getTextCursor(0);
            newSelection.setCursor(cursor);
          }
        }
      } else {
        const newNode = parent.createAndInsertNode(arena, node.getIndex());
        if (newNode) {
          newNode.getTextCursor(0);
        }
      }
    } else {
      const nextArena = arena.nextArena || arena;
      const newNode = parent.createAndInsertNode(nextArena, node.getIndex() + 1);
      if (newNode) {
        const text = node.cutText(offset);
        const cursor = newNode.insertText(text, 0);
        newSelection.setCursor({ ...cursor, offset: 0 });
      }
    }
    return newSelection;
  }

  public moveChild(selection: ArenaSelection, direction: 'up' | 'down'): ArenaSelection {
    if (selection.isSameNode()) {
      const node = selection.startNode;
      const index = node.getIndex();
      if (direction === 'up' && index === 0) {
        return selection;
      }
      if (direction === 'down' && node.isLastChild()) {
        return selection;
      }
      const children = node.parent.cutChildren(index, 1);
      if (direction === 'up') {
        node.parent.insertChildren(children, index - 1);
      } else {
        node.parent.insertChildren(children, index + 1);
      }
    }
    return selection;
  }

  protected getParentWhoCanCreateNode(
    node: AnyArenaNode,
    arena: ArenaTextInterface,
  ): ArenaCursorAncestor | undefined {
    if (!node.hasParent) {
      return undefined;
    }
    if (node.parent.arena.protected) {
      return undefined;
    }
    const { parent } = node;
    const offset = node.getIndex();
    if (parent.isAllowedNode(arena)) {
      return {
        node: parent,
        offset,
      };
    }
    if (parent.hasParent) {
      const grandpa = parent.parent;
      if (offset === 0) {
        // try to create before parent
        return this.getParentWhoCanCreateNode(parent, arena);
      }
      // separate parent in two
      const secondParent = grandpa.createAndInsertNode(
        parent.arena,
        parent.getIndex() + 1,
      );
      if (secondParent && secondParent.hasChildren) {
        secondParent.insertChildren(parent.cutChildren(offset));
        // try to create between parents
        return this.getParentWhoCanCreateNode(secondParent, arena);
      }
    }
    return undefined;
  }

  protected transformNode(
    node: AnyArenaNode,
    arena: ArenaTextInterface,
  ): ArenaNodeText | undefined {
    if (node.hasText) {
      const cursor = this.getParentWhoCanCreateNode(node, arena);
      if (cursor) {
        const newNode = cursor.node.createAndInsertNode(
          arena,
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

  protected applyTextArenaToSelection(
    selection: ArenaSelection,
    arena: ArenaTextInterface,
  ): ArenaSelection {
    const {
      startNode, startOffset, endNode, endOffset,
    } = selection;
    const newSelection = selection.clone();
    const toTransform: AnyArenaNode[] = [];
    this.runNodesOfSelection(
      selection,
      (node: AnyArenaNode) => {
        toTransform.push(node);
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
    const commonAncestorCursor = this.runNodesOfSelection(
      selection,
    );
    if (!commonAncestorCursor) {
      return selection;
    }
    const [commonAncestor, start, end] = commonAncestorCursor;
    if (!commonAncestor.isAllowedNode(arena)) {
      return selection;
    }
    const childrentToWrap = commonAncestor.cutChildren(start, end - start + 1);
    const newNode = commonAncestor.createAndInsertNode(arena, end + 1);
    if (newNode && newNode.hasChildren) {
      const rest = newNode.insertChildren(childrentToWrap);
      if (rest.length) {
        commonAncestor.insertChildren(rest, newNode.getIndex() + 1);
      }
    }
    return selection;
  }

  protected tryToFindAncestor(node: AnyArenaNode, arena) {
    if (node.hasParent) {
      if (node.arena === arena) {
        return node;
      }
      return this.tryToFindAncestor(node.parent, arena);
    }
    return undefined;
  }

  protected tryToFindAncestor2(node: AnyArenaNode, arena) {
    if (node.hasParent) {
      if (node.parent.arena.allowedArenas.includes(arena)) {
        return node;
      }
      return this.tryToFindAncestor2(node.parent, arena);
    }
    return undefined;
  }

  protected unwrapNode(node: AnyArenaNode & ParentArenaNode) {
    const { parent } = node;
    const offset = node.getIndex();
    const children = node.cutChildren(0);
    // TODO catch rest nodes
    parent.insertChildren(children, offset);
    node.remove();
  }

  public toggleArenaForSelection(
    selection: ArenaSelection,
    arena: ArenaMediatorInterface,
  ): ArenaSelection {
    if (arena.protected) {
      return selection;
    }
    if (arena.group) {
      return selection;
    }
    const commonAncestorCursor = this.runNodesOfSelection(
      selection,
    );
    if (!commonAncestorCursor) {
      return selection;
    }
    const newSelection = selection.clone();
    const [commonAncestor, start, end] = commonAncestorCursor;
    const ancestor = this.tryToFindAncestor(commonAncestor, arena);
    if (ancestor) {
      this.unwrapNode(ancestor);
      return newSelection;
    }
    let dad;
    let childrentToWrap;
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
        if (child.arena === arena) {
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
            const newNode = dad.createAndInsertNode(arena, offset);
            (newNode as ParentArenaNode).insertChildren(toWrap, 0);
            // if (toWrap.length === i) {
            //   newSelection.setStartNode(newNode.getChild(0), startOffset);
            // }
            offset += 1;
            toWrap = [];
          }
          dad.insertChildren([child], offset);
          offset += 1;
        }
      }
      if (toWrap.length > 0) {
        const newNode = dad.createAndInsertNode(arena, offset);
        (newNode as ParentArenaNode).insertChildren(toWrap, 0);
        // if (toWrap.length === childrentToWrap.length) {
        //   newSelection.setStartNode(newNode.getChild(0), startOffset);
        // }
        // newSelection.setEndNode(newNode.getChild(toWrap.length - 1), endOffset);
      }
      dad.mergeChildren();
    }
    return newSelection;
  }

  public insertBeforeSelected(selection: ArenaSelection, arena: AnyArena): ArenaSelection {
    if (!selection.isSameNode()) {
      return selection;
    }
    const { node } = selection.getCursor();
    if (node.parent.isAllowedNode(arena)) {
      node.parent.createAndInsertNode(arena, node.getIndex());
    }
    return selection;
  }

  public applyArenaToSelection(
    selection: ArenaSelection,
    arena: ArenaMediatorInterface | ArenaTextInterface,
  ): ArenaSelection {
    if (arena.hasText) {
      this.applyTextArenaToSelection(selection, arena);
    }
    if (arena.hasChildren) {
      if (arena.protected) {
        return this.applyProtectedArenaToSelection(selection, arena);
      }
      if (arena.group) {
        //
        return selection;
      }
      return this.toggleArenaForSelection(selection, arena);
    }
    return selection;
  }

  public applyFormationToSelection(
    selection: ArenaSelection,
    formating: ArenaFormating,
  ): ArenaSelection {
    if (selection.isCollapsed()) {
      const { node, offset } = selection.getCursor();
      node.togglePromiseFormating(formating, offset);
    } else {
      this.runNodesOfSelection(
        selection,
        (node: AnyArenaNode, start?: number, end?: number) => {
          if (node.hasText) {
            node.toggleFormating(formating.name, start || 0, end || node.getTextLength());
          }
          if (node.hasChildren) {
            this.runOfChildren(node, (n: AnyArenaNode) => {
              if (n.hasText) {
                n.toggleFormating(formating.name, 0, n.getTextLength());
              }
            });
          }
        },
      );
    }
    return selection;
  }

  public addInlineNode(
    selection: ArenaSelection,
    arena: ArenaInlineInterface,
  ): ArenaNodeInline | undefined {
    if (selection.isSameNode() && !selection.isCollapsed()) {
      const { startNode, startOffset, endOffset } = selection;
      return startNode.addInlineNode(arena, startOffset, endOffset);
    }
    return undefined;
  }

  public getInlineNode(
    selection: ArenaSelection,
    arena: ArenaInlineInterface,
  ): ArenaNodeInline | undefined {
    if (selection.isSameNode()) {
      const { startNode, startOffset, endOffset } = selection;
      return startNode.getInlineNode(arena, startOffset, endOffset);
    }
    return undefined;
  }

  public removeInlineNode(selection: ArenaSelection, node: ArenaNodeInline): void {
    if (selection.isSameNode()) {
      const { startNode } = selection;
      return startNode.removeInlineNode(node);
    }
    return undefined;
  }

  public updateInlineNode(selection: ArenaSelection, node: ArenaNodeInline): void {
    if (selection.isSameNode() && !selection.isCollapsed()) {
      const { startNode, startOffset, endOffset } = selection;
      startNode.updateInlineNode(node, startOffset, endOffset);
    }
  }

  public runNodesOfSelection(
    selection: ArenaSelection,
    callback?: (node: ChildArenaNode, start?: number, end?: number) => void,
  ): [ ParentArenaNode, number, number ] | undefined {
    const {
      startNode,
      startOffset,
      endNode,
      endOffset,
    } = selection;
    if (selection.isSameNode()) {
      if (callback) {
        callback(startNode, startOffset, endOffset);
      }
      const index = startNode.getIndex();
      return [startNode.parent, index, index];
    }
    const commonAncestorCursor = this.getCommonAncestor(startNode, endNode);
    if (!commonAncestorCursor) {
      return undefined;
    }
    if (!callback) {
      return commonAncestorCursor;
    }
    const [commonAncestor] = commonAncestorCursor;

    let startCursor: ArenaCursorAncestor = startNode.getParent();
    const startNodes: AnyArenaNode[] = [];
    while (startCursor.node !== commonAncestor) {
      const len = startCursor.node.children.length;
      for (let i = startCursor.offset + 1; i < len; i += 1) {
        const child = startCursor.node.getChild(i);
        if (child) {
          startNodes.push(child);
        }
      }
      startCursor = startCursor.node.getParent();
    }

    let endCursor: ArenaCursorAncestor = endNode.getParent();
    const endNodes: AnyArenaNode[] = [];
    while (endCursor.node !== commonAncestor) {
      for (let i = 0; i < endCursor.offset; i += 1) {
        const child = endCursor.node.getChild(i);
        if (child) {
          endNodes.push(child);
        }
      }
      endCursor = endCursor.node.getParent();
    }

    callback(startNode, startOffset);
    startNodes.forEach((n) => callback(n));
    for (let i = startCursor.offset + 1; i < endCursor.offset; i += 1) {
      const child = commonAncestor.getChild(i);
      if (child) {
        callback(child);
      }
    }
    endNodes.reverse().forEach((n) => callback(n));
    callback(endNode, 0, endOffset);
    return commonAncestorCursor;
  }

  protected arenas: AnyArena[] = [];

  protected arenasByName: { [name: string]: AnyArena } = { };

  protected formatings: ArenaFormating[] = [];

  protected formatingsByName: ArenaFormatings = {};

  protected areanMarks: { [tag: string]: ArenaMark[] } = { };

  protected formatingMarks: { [tag: string]: FormatingMark[] } = { };

  protected rootArena: ArenaRootInterface | undefined;

  protected rootNode: ArenaNodeRoot | undefined;

  protected separateNode(
    node: ArenaNodeMediator,
    offset: number,
  ): undefined | ParentArenaNode {
    if (offset === 0 || offset >= node.children.length) {
      return undefined;
    }
    if (node.arena.protected) {
      return undefined;
    }
    const newNode = node.parent.createAndInsertNode(node.arena, node.getIndex() + 1);
    if (!newNode || !(newNode.hasChildren)) {
      return undefined;
    }
    newNode.insertChildren(node.cutChildren(offset));
    return newNode;
  }

  protected getOutFromMediator(node: ArenaNodeText): ArenaNodeText | undefined {
    const { parent } = node;
    const grandpaCursor = parent.getUnprotectedParent();
    if (grandpaCursor && grandpaCursor.node.arena.arenaForText) {
      // Try to get out from this node (ex. in a list)
      const index = node.getIndex();
      if (parent.hasParent && parent.parent === grandpaCursor.node) {
        // try to separate
        this.separateNode(parent, index);
      } else if (index > 0 && !node.isLastChild()) {
        return undefined;
      }
      const text = node.getText();
      const offset = grandpaCursor.offset + (index === 0 ? 0 : 1);
      const cursor = grandpaCursor.node.insertText(text, offset);
      node.remove();
      return cursor.node;
    }
    return undefined;
  }

  protected getNextSibling(node: AnyArenaNode): ArenaNodeText | undefined {
    if (!(node.hasParent)) {
      return undefined;
    }
    const next = node.parent.getChild(node.getIndex() + 1);
    if (next) {
      return next.getTextCursor(0).node;
    }
    return this.getNextSibling(node.parent);
  }

  protected runOfChildren(node: AnyArenaNode, callback: (n: AnyArenaNode) => void): void {
    if (node.hasChildren) {
      node.children.forEach((child) => {
        this.runOfChildren(child, callback);
      });
    } else {
      callback(node);
    }
  }

  protected getAncestors(node: AnyArenaNode): ArenaCursorAncestor[] {
    if (node.hasParent) {
      return [
        ...this.getAncestors(node.parent),
        { node: node.parent, offset: node.getIndex() },
      ];
    }
    return [];
  }

  protected getCommonAncestor(nodeA: AnyArenaNode, nodeB: AnyArenaNode):
    [ ParentArenaNode, number, number ] | undefined {
    if (nodeA === nodeB) {
      return undefined;
    }
    const ancestorsForA = this.getAncestors(nodeA);
    const ancestorsForB = this.getAncestors(nodeB);
    const commonMaxDeep = Math.min(ancestorsForA.length, ancestorsForB.length);
    if (commonMaxDeep === 0) {
      return undefined;
    }
    let result: [ ParentArenaNode, number, number ] | undefined;
    for (let i = 0; i < commonMaxDeep; i += 1) {
      if (ancestorsForA[i].node === ancestorsForB[i].node) {
        result = [ancestorsForA[i].node, ancestorsForA[i].offset, ancestorsForB[i].offset];
      } else {
        break;
      }
    }
    return result;
  }

  public getOrCreateNodeForText(
    node: AnyArenaNode,
    offset?: number,
  ): ArenaCursorText | undefined {
    if (node.hasText) {
      return {
        node,
        offset: offset === undefined ? node.getTextLength() : offset,
      };
    }
    if (node.hasChildren && node.arena.arenaForText) {
      // TODO for protected do not create node, but get from children
      let newNode:
        ChildArenaNode | undefined = NodeFactory.createChildNode(node.arena.arenaForText);
      newNode = node.insertNode(newNode, offset);
      if (newNode) {
        return this.getOrCreateNodeForText(newNode);
      }
    }
    if (node.hasParent) {
      return this.getOrCreateNodeForText(node.parent, node.getIndex() + 1);
    }
    return undefined
  }
}
