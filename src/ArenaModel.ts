import ArenaOptions from 'interfaces/ArenaOptions';
import RootNode from 'models/RootNode';
import Textarena from 'Textarena';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaSelection from 'ArenaSelection';
import { Direction } from 'events/RemoveEvent';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import Arena from 'interfaces/Arena';
import ArenaFactory from 'arenas/ArenaFactory';
import ArenaCursor from 'interfaces/ArenaCursor';
import ArenaRoot from 'interfaces/ArenaRoot';
import ArenaCursorAncestor from 'interfaces/ArenaCursorAncestor';
import AncestorArena from 'arenas/AncestorArena';

type TagAndAttributes = {
  tag: string,
  attributes: string[],
};

export type ArenaFormating = {
  name: string,
  tag: string,
  attributes: string[],
};

export type ArenaFormatings = {
  [key: string]: ArenaFormating,
};

type ArenaMark = {
  attributes: string[],
  arena: Arena,
};

type FormatingMark = {
  attributes: string[],
  formating: ArenaFormating
};

export default class ArenaModel {
  public static rootArenaName = '__ROOT__';

  constructor(private textarena: Textarena) {
    this.rootArena = this.registerArena({
      name: ArenaModel.rootArenaName,
      tag: '',
      attributes: [],
      hasChildren: true,
    }) as ArenaRoot;
    this.rootModel = new RootNode(this.rootArena);
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

  public getAncestors(node: ArenaNode): ArenaNodeAncestor[] {
    if ('hasParent' in node) {
      return [...this.getAncestors(node.parent), node.parent];
    }
    return [];
  }

  public getCommonAncestor(nodeA: ArenaNode, nodeB: ArenaNode): ArenaNodeAncestor | undefined {
    if (nodeA === nodeB) {
      return undefined;
    }
    const ancestorsForA = this.getAncestors(nodeA);
    const ancestorsForB = this.getAncestors(nodeB);
    const commonMaxDeep = Math.min(ancestorsForA.length, ancestorsForB.length);
    if (commonMaxDeep === 0) {
      return undefined;
    }
    let result;
    for (let i = 0; i < commonMaxDeep; i += 1) {
      if (ancestorsForA[i] === ancestorsForB[i]) {
        result = ancestorsForA[i];
      } else {
        break;
      }
    }
    return result;
  }

  public insertHtml(selection: ArenaSelection, html: string): ArenaSelection {
    let newSelection = selection;
    if (!selection.isCollapsed()) {
      newSelection = this.removeSelection(selection, 'backward');
    }
    const result = this.textarena.parser.insertHtmlToModel(
      html,
      newSelection.startNode,
      newSelection.startOffset,
    );
    if (result) {
      newSelection.setBoth(result[0] as ArenaNodeText, result[1]);
    }
    this.textarena.eventManager.fire('modelChanged');
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
    this.textarena.eventManager.fire('modelChanged');
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
      this.textarena.eventManager.fire('modelChanged');
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
      startNode.insertText(
        endNode.getText(),
        startOffset,
      );
      endNode.remove();
    }
    newSelection.setBoth(startNode, startOffset);
    this.textarena.eventManager.fire('modelChanged');
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

  public transformModel(selection: ArenaSelection, arena: Arena): ArenaSelection {
    const {
      startNode,
    } = selection;
    const newSelection = selection;
    if (selection.isCollapsed() || selection.isSameNode()) {
      const newNode = startNode.parent.createAndInsertNode(arena, startNode.getIndex());
      if (newNode) {
        const cursor = newNode.insertText(startNode.getText(), 0, false);
        startNode.remove();
        newSelection.setCursor(cursor);
        return newSelection;
      }
    }
    this.textarena.eventManager.fire('modelChanged');
    return selection;
  }

  public formatingModel(selection: ArenaSelection, formating: ArenaFormating): ArenaSelection {
    const {
      startNode,
      startOffset,
      endOffset,
    } = selection;
    if (selection.isCollapsed() || selection.isSameNode()) {
      startNode.toggleFormating(formating.name, startOffset, endOffset);
    }
    this.textarena.eventManager.fire('modelChanged');
    return selection;
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

  protected runNodesOfSelection(
    selection: ArenaSelection,
    callback: (node: ArenaNode, start?: number, end?: number) => void,
  ): void {
    const {
      startNode,
      startOffset,
      endNode,
      endOffset,
    } = selection;
    if (selection.isSameNode()) {
      callback(startNode, startOffset, endOffset);
      return;
    }
    const commonAncestor = this.getCommonAncestor(startNode, endNode);
    if (!commonAncestor) {
      return;
    }

    let startCursor: ArenaCursorAncestor = startNode.getParent();
    while (startCursor.node !== commonAncestor) {
      const len = startCursor.node.children.length;
      for (let i = startCursor.offset + 1; i < len; i += 1) {
        const child = startCursor.node.getChild(i);
        if (child) {
          callback(child);
        }
      }
      startCursor = startCursor.node.getParent();
    }

    let endCursor: ArenaCursorAncestor = endNode.getParent();
    while (endCursor.node !== commonAncestor) {
      for (let i = 0; i < endCursor.offset; i += 1) {
        const child = endCursor.node.getChild(i);
        if (child) {
          callback(child);
        }
      }
      endCursor = endCursor.node.getParent();
    }

    for (let i = startCursor.offset + 1; i < endCursor.offset; i += 1) {
      const child = commonAncestor.getChild(i);
      if (child) {
        callback(child);
      }
    }

    callback(startNode, startOffset);
    callback(endNode, 0, endOffset);
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
}
