import { TemplateResult } from 'lit-html';

import ArenaFactory from '../arenas/ArenaFactory';

import { Direction } from '../events/RemoveEvent';

import Arena from '../interfaces/Arena';
import ArenaCursor from '../interfaces/ArenaCursor';
import ArenaCursorAncestor from '../interfaces/ArenaCursorAncestor';
import ArenaFormating, { ArenaFormatings, TagAndAttributes } from '../interfaces/ArenaFormating';
import ArenaInline from '../interfaces/ArenaInline';
import ArenaNode from '../interfaces/ArenaNode';
import ArenaNodeAncestor from '../interfaces/ArenaNodeAncestor';
import ArenaNodeInline from '../interfaces/ArenaNodeInline';
import ArenaNodeScion from '../interfaces/ArenaNodeScion';
import ArenaNodeText from '../interfaces/ArenaNodeText';
import ArenaOptions from '../interfaces/ArenaOptions';
import ArenaRoot from '../interfaces/ArenaRoot';
import ArenaWithText from '../interfaces/ArenaWithText';

import ArenaSelection from '../helpers/ArenaSelection';

import RootNode from '../models/RootNode';

import ArenaServiceManager from './ArenaServiceManager';

type ArenaMark = {
  attributes: string[],
  arena: Arena,
};

type FormatingMark = {
  attributes: string[],
  formating: ArenaFormating
};

export default class ArenaModel {
  public readonly rootArenaName = '__ROOT__';

  constructor(protected asm: ArenaServiceManager) {
    this.rootArena = this.registerArena({
      name: this.rootArenaName,
      tag: '',
      attributes: [],
      hasChildren: true,
    }) as ArenaRoot;
    this.rootModel = new RootNode(this.rootArena);
  }

  getOutputHtml(): string {
    return this.rootModel.getOutputHtml(this.getFormatings());
  }

  getHtml(): TemplateResult | string {
    return this.rootModel.getHtml(this.getFormatings());
  }

  get model(): ArenaNodeAncestor {
    return this.rootModel;
  }

  public registerArena(
    arenaOptions: ArenaOptions,
    markers?: TagAndAttributes[],
    parentArenas?: string[],
  ): Arena {
    const arena = ArenaFactory.create(arenaOptions);
    this.arenas.push(arena);
    this.arenasByName[arena.name] = arena;
    if (parentArenas) {
      parentArenas.forEach((parentName) => {
        const parentArena = this.arenasByName[parentName];
        if (!parentArena) {
          throw new Error(`Arena "${parentName}" not found`);
        }
        if (!('hasChildren' in parentArena)) {
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

  public getArena(name: string): Arena | undefined {
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
    let cursor: ArenaNode | RootNode | undefined = this.rootModel;
    if (path.shift() === 0) {
      path.forEach((i) => {
        if (cursor && 'hasChildren' in cursor) {
          cursor = cursor.children[i];
        } else {
          cursor = undefined;
        }
      });
      if (cursor && 'hasText' in cursor) {
        return cursor;
      }
    }
    return undefined;
  }

  public getNodeById(id: string): ArenaNode | undefined {
    const path = id.split('.').map((i) => parseInt(i, 10));
    let cursor: ArenaNode | RootNode | undefined = this.rootModel;
    if (path.shift() === 0) {
      path.forEach((i) => {
        if (cursor && 'hasChildren' in cursor) {
          cursor = cursor.children[i];
        } else {
          cursor = undefined;
        }
      });
    }
    return cursor;
  }

  public getAncestors(node: ArenaNode): ArenaCursorAncestor[] {
    if ('hasParent' in node) {
      return [
        ...this.getAncestors(node.parent),
        { node: node.parent, offset: node.getIndex() },
      ];
    }
    return [];
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

  private applyMiddlewares(cursor: ArenaCursor): ArenaCursor {
    let result = cursor;
    if ('allowText' in cursor.node.arena) {
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
    const toRemove: ArenaNodeScion[] = [];
    this.runNodesOfSelection(
      newSelection,
      (node: ArenaNode, start?: number, end?: number) => {
        if (start === undefined && end === undefined) {
          if ('hasParent' in node) {
            toRemove.push(node);
          }
        } else if ('hasText' in node) {
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
    node: ArenaNode,
    arena: ArenaWithText,
  ): ArenaCursorAncestor | undefined {
    if (!('hasParent' in node)) {
      return undefined;
    }
    if (node.parent.arena.protected) {
      return undefined;
    }
    const { parent } = node;
    const offset = node.getIndex();
    if (parent.canCreateNode(arena)) {
      return {
        node: parent,
        offset,
      };
    }
    if ('hasParent' in parent) {
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
      if (secondParent && 'hasChildren' in secondParent) {
        secondParent.insertChildren(parent.cutChildren(offset));
        // try to create between parents
        return this.getParentWhoCanCreateNode(secondParent, arena);
      }
    }
    return undefined;
  }

  protected tryToCreateNode(
    parent: ArenaNodeAncestor & ArenaNode,
    offset: number,
    arena: ArenaWithText,
  ): ArenaNodeText | undefined {
    if (parent.arena.protected) {
      return undefined;
    }
    if (parent.canCreateNode(arena)) {
      const newNode = parent.createAndInsertNode(
        arena,
        offset,
      ) as ArenaNodeText;
      return newNode;
    }
    if ('hasParent' in parent) {
      if (offset === 0) {
        // try to create before parent
        return this.tryToCreateNode(parent.parent, parent.getIndex(), arena);
      }
      if (offset >= parent.children.length) {
        // try to create after parent
        return this.tryToCreateNode(parent.parent, parent.getIndex() + 1, arena);
      }
      // separate parent in two
      const secondParent = parent.parent.createAndInsertNode(parent.arena, parent.getIndex() + 1);
      if (secondParent && 'hasChildren' in secondParent) {
        secondParent.insertChildren(parent.cutChildren(offset));
        // try to create between parents
        return this.tryToCreateNode(parent.parent, parent.getIndex() + 1, arena);
      }
    }
    return undefined;
  }

  protected transformNode(node: ArenaNode, arena: ArenaWithText): ArenaNodeText | undefined {
    if ('hasText' in node) {
      const cursor = this.getParentWhoCanCreateNode(node, arena);
      if (cursor) {
        const newNode = cursor.node.createAndInsertNode(
          arena,
          cursor.offset,
        ) as ArenaNodeText;
        // const newNode = this.tryToCreateNode(node.parent, node.getIndex() + 1, arena);
        if (newNode) {
          newNode.insertText(node.getText(), 0);
          node.remove();
          return newNode;
        }
      }
    } else if ('hasChildren' in node) {
      if (node.arena.protected || node.canCreateNode(arena)) {
        [...node.children].forEach((child) => this.transformNode(child, arena));
      } else if ('hasParent' in node) {
        [...node.children].forEach((child) => this.transformNode(child, arena));
        // const cursor = this.getParentWhoCanCreateNode(node, arena);
        // if (cursor) {
        //   (node as ArenaNodeAncestor).children.forEach((child) => {
        //     if ('hasText' in child) {
        //       const newNode = cursor.node.createAndInsertNode(
        //         arena,
        //         cursor.offset,
        //       ) as ArenaNodeText;
        //       if (newNode) {
        //         cursor.offset += 1;
        //         newNode.insertText(child.getText(), 0);
        //         child.remove();
        //         return newNode;
        //       }
        //     } else if ('hasChildren' in child) {
        //       this.transformNode(child, arena);
        //     }
        //   });
        // }
      }
    }
    return undefined;
  }

  public transformModel(selection: ArenaSelection, arena: ArenaWithText): ArenaSelection {
    const {
      startNode, startOffset, endNode, endOffset,
    } = selection;
    const newSelection = selection.clone();
    const toTransform: ArenaNode[] = [];
    const commonAncestor = this.runNodesOfSelection(
      selection,
      (node: ArenaNode) => {
        toTransform.push(node);
        // this.runOfChildren(node, (n: ArenaNode) => {
        //   if ('hasText' in n) {
        //   }
        // });
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
      // if ('hasChildren' in n) {

      // }
    });
    // if (commonAncestor) {
    //   let c: ArenaCursorAncestor = {
    //     node: commonAncestor[0],
    //     offset: commonAncestor[1],
    //   };
    //   const toRemove: ArenaNodeText[] = [];
    //   toCreate.forEach((n) => {
    //     const newNode = c.node.createAndInsertNode(arena, c.offset + 1);
    //     if (newNode) {
    //       c = newNode.getParent();
    //       const cursor = newNode.insertText(n.getText(), 0, false);
    //       toRemove.push(n);
    //       newSelection.setCursor(cursor);
    //     }
    //   });
    //   toRemove.forEach((n) => n.remove());
    // }
    return newSelection;
  }

  public formatingModel(selection: ArenaSelection, formating: ArenaFormating): ArenaSelection {
    if (selection.isCollapsed()) {
      const { node, offset } = selection.getCursor();
      node.togglePromiseFormating(formating, offset);
    } else {
      this.runNodesOfSelection(
        selection,
        (node: ArenaNode, start?: number, end?: number) => {
          if ('hasText' in node) {
            node.toggleFormating(formating.name, start || 0, end || node.getTextLength());
          }
          if ('hasChildren' in node) {
            this.runOfChildren(node, (n: ArenaNode) => {
              if ('hasText' in n) {
                n.toggleFormating(formating.name, 0, n.getTextLength());
              }
            });
          }
        },
      );
    }
    return selection;
  }

  public addInlineNode(selection: ArenaSelection, arena: ArenaInline): ArenaNodeInline | undefined {
    if (selection.isSameNode() && !selection.isCollapsed()) {
      const { startNode, startOffset, endOffset } = selection;
      return startNode.addInlineNode(arena, startOffset, endOffset);
    }
    return undefined;
  }

  public getInlineNode(selection: ArenaSelection, arena: ArenaInline): ArenaNodeInline | undefined {
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
    callback: (node: ArenaNode, start?: number, end?: number) => void,
  ): [ ArenaNodeAncestor, number, number ] | undefined {
    const {
      startNode,
      startOffset,
      endNode,
      endOffset,
    } = selection;
    if (selection.isSameNode()) {
      callback(startNode, startOffset, endOffset);
      const index = startNode.getIndex();
      return [startNode.parent, index, index];
    }
    const commonAncestorCursor = this.getCommonAncestor(startNode, endNode);
    if (!commonAncestorCursor) {
      return undefined;
    }
    const [commonAncestor] = commonAncestorCursor;

    let startCursor: ArenaCursorAncestor = startNode.getParent();
    const startNodes: ArenaNode[] = [];
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
    const endNodes: ArenaNode[] = [];
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

  protected arenas: Arena[] = [];

  protected arenasByName: { [name: string]: Arena } = { };

  protected formatings: ArenaFormating[] = [];

  protected formatingsByName: ArenaFormatings = {};

  protected areanMarks: { [tag: string]: ArenaMark[] } = { };

  protected formatingMarks: { [tag: string]: FormatingMark[] } = { };

  protected rootArena: ArenaRoot;

  protected rootModel: RootNode;

  protected separateNode(
    node: ArenaNodeScion & ArenaNodeAncestor,
    offset: number,
  ): undefined | ArenaNodeAncestor {
    if (offset === 0 || offset >= node.children.length) {
      return undefined;
    }
    if (node.arena.protected) {
      return undefined;
    }
    const newNode = node.parent.createAndInsertNode(node.arena, node.getIndex() + 1);
    if (!newNode || !('hasChildren' in newNode)) {
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
      if ('parent' in parent && parent.parent === grandpaCursor.node) {
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

  protected getNextSibling(node: ArenaNode): ArenaNodeText | undefined {
    if (!('parent' in node)) {
      return undefined;
    }
    const next = node.parent.getChild(node.getIndex() + 1);
    if (next) {
      return next.getTextCursor(0).node;
    }
    return this.getNextSibling(node.parent);
  }

  protected runOfChildren(node: ArenaNode, callback: (n: ArenaNode) => void): void {
    if ('hasChildren' in node) {
      node.children.forEach((child) => {
        this.runOfChildren(child, callback);
      });
    } else {
      callback(node);
    }
  }

  protected getCommonAncestor(nodeA: ArenaNode, nodeB: ArenaNode):
    [ ArenaNodeAncestor, number, number ] | undefined {
    if (nodeA === nodeB) {
      return undefined;
    }
    const ancestorsForA = this.getAncestors(nodeA);
    const ancestorsForB = this.getAncestors(nodeB);
    const commonMaxDeep = Math.min(ancestorsForA.length, ancestorsForB.length);
    if (commonMaxDeep === 0) {
      return undefined;
    }
    let result: [ ArenaNodeAncestor, number, number ] | undefined;
    for (let i = 0; i < commonMaxDeep; i += 1) {
      if (ancestorsForA[i].node === ancestorsForB[i].node) {
        result = [ancestorsForA[i].node, ancestorsForA[i].offset, ancestorsForB[i].offset];
      } else {
        break;
      }
    }
    return result;
  }
}
