/* eslint-disable no-console */
import Arena, { ArenaWithRichText } from 'interfaces/Arena';
import RootNode from 'models/RootNode';
import { TemplateResult, html } from 'lit-html';
import Textarena from 'Textarena';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaSelection from 'ArenaSelection';
import { Direction } from 'events/RemoveEvent';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';
import RichNode from 'models/RichNode';

type TagAndAttributes = {
  tag: string,
  attributes: string[],
};

export type ArenaFormating = {
  name: string,
  tag: string,
  attributes: string[],
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
  static rootArenaName = '__ROOT__';

  arenas: Arena[] = [];

  arenasByName: { [name: string]: Arena } = { };

  formatings: ArenaFormating[] = [];

  areanMarks: { [tag: string]: ArenaMark[] } = { };

  formatingMarks: { [tag: string]: FormatingMark[] } = { };

  rootArena: Arena;

  model: RootNode;

  constructor(private textarena: Textarena) {
    const paragraph: ArenaWithRichText = {
      name: 'paragraph',
      tag: 'P',
      template: (child: TemplateResult | string, id: string) => html`<p observe-id="${id}">${child}</p>`,
      attributes: [],
      allowText: true,
      allowFormating: true,
    };
    this.rootArena = {
      name: ArenaModel.rootArenaName,
      tag: '',
      template: (child: TemplateResult | string) => child,
      attributes: [],
      arenaForText: paragraph,
      allowedArenas: [
      ],
    };
    this.registerArena(
      this.rootArena,
      [],
      [],
    );
    this.registerArena(
      paragraph,
      [
        {
          tag: 'P',
          attributes: [],
        },
        {
          tag: 'DIV',
          attributes: [],
        },
      ],
      [ArenaModel.rootArenaName],
    );
    this.model = new RootNode(this.rootArena);

    this.registerFormating(
      {
        name: 'strong',
        tag: 'STRONG',
        attributes: [],
      },
      [
        {
          tag: 'B',
          attributes: [],
        },
        {
          tag: 'STRONG',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=fontWeight:bold',
            'style=fontWeight:900',
            'style=fontWeight:800',
            'style=fontWeight:700',
            'style=fontWeight:600',
          ],
        },
      ],
    );
    this.registerFormating(
      {
        name: 'italic',
        tag: 'EM',
        attributes: [],
      },
      [
        {
          tag: 'I',
          attributes: [],
        },
        {
          tag: 'EM',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=fontStyle:italic',
          ],
        },
      ],
    );
  }

  public registerArena(
    arena: Arena,
    markers: TagAndAttributes[],
    parentArenas: string[],
  ): void {
    this.arenas.push(arena);
    this.arenasByName[arena.name] = arena;
    parentArenas.forEach((parentName) => {
      const parentArena = this.arenasByName[parentName];
      if (parentArena && 'allowedArenas' in parentArena) {
        parentArena.allowedArenas.push(arena);
      }
    });
    markers.forEach(({ tag, attributes }) => {
      if (!this.areanMarks[tag]) {
        this.areanMarks[tag] = [];
      }
      this.areanMarks[tag].push({
        attributes,
        arena,
      });
    });
  }

  public registerFormating(
    formating: ArenaFormating,
    markers: TagAndAttributes[],
  ): void {
    this.formatings.push(formating);
    markers.forEach(({ tag, attributes }) => {
      if (!this.formatingMarks[tag]) {
        this.formatingMarks[tag] = [];
      }
      this.formatingMarks[tag].push({
        attributes,
        formating,
      });
    });
  }

  public getArenaMarks(tagName: string): ArenaMark[] | undefined {
    return this.areanMarks[tagName];
  }

  public getFormatingMarks(tagName: string): FormatingMark[] | undefined {
    return this.formatingMarks[tagName];
  }

  public getTextNodeById(id: string): ArenaNodeText | undefined {
    const path = id.split('.').map((i) => parseInt(i, 10));
    let cursor: ArenaNode | undefined = this.model;
    if (path.shift() === 0) {
      path.forEach((i) => {
        if (cursor && 'hasChildren' in cursor) {
          cursor = cursor.children[i];
        } else {
          cursor = undefined;
        }
      });
      if ('hasText' in cursor) {
        return cursor;
      }
    }
    return undefined;
  }

  getAncestors(node: ArenaNode): ArenaNodeAncestor[] {
    if ('hasParent' in node) {
      return [...this.getAncestors(node.parent), node.parent];
    }
    return [];
  }

  public getCommonAncestor(nodeA: ArenaNode, nodeB: ArenaNode): ArenaNode | undefined {
    if (nodeA === nodeB) {
      return nodeA;
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

  public insertText(selection: ArenaSelection, text: string): ArenaSelection {
    let newSelection = selection;
    if (!selection.isCollapsed()) {
      newSelection = this.removeSelection(selection, 'backward');
    }
    const result = newSelection.startNode.insertText(text, newSelection.startOffset);
    if (result) {
      newSelection.startOffset += text.length;
      newSelection.endOffset = newSelection.startOffset;
    }
    return newSelection;
  }

  public removeSelection(selection: ArenaSelection, direction: Direction): ArenaSelection {
    const {
      startNode,
      startOffset,
      endNode,
      endOffset,
    } = selection;
    if (selection.isCollapsed()) {
      const newSelection = selection;
      if (direction === 'forward') {
        if (startNode.getTextLength() === startOffset) {
          const nextSibling = startNode.parent.getChild(startNode.getIndex() + 1);
          if (nextSibling && 'hasText' in nextSibling) {
            this.mergeNodes(startNode, nextSibling);
          }
        } else {
          selection.startNode.removeText(selection.startOffset, selection.startOffset + 1);
        }
      }
      if (direction === 'backward') {
        if (selection.startOffset === 0) {
          if (startNode.getIndex() > 0) {
            const prevSibling = startNode.parent.getChild(startNode.getIndex() - 1);
            if (prevSibling && 'hasText' in prevSibling) {
              newSelection.setBoth(prevSibling, prevSibling.getTextLength());
              this.mergeNodes(prevSibling, startNode);
            }
          }
        } else {
          selection.startNode.removeText(selection.startOffset - 1, selection.startOffset);
          newSelection.startOffset -= 1;
          newSelection.endOffset = selection.startOffset;
        }
      }
      return newSelection;
    }
    if (selection.isSameNode()) {
      console.log('remove text', selection.startOffset, selection.endOffset);
      selection.startNode.removeText(selection.startOffset, selection.endOffset);
      selection.collapse();
      return selection;
    }
    const commonAncestor = this.getCommonAncestor(selection.startNode, selection.endNode);
    if (!commonAncestor) {
      return selection;
    }

    if (commonAncestor === selection.startNode.parent
      && commonAncestor === selection.endNode.parent
      && 'hasChildren' in commonAncestor) {
      const startIndex = selection.startNode.getIndex();
      const endIndex = selection.endNode.getIndex();
      selection.startNode.removeText(selection.startOffset);
      selection.endNode.removeText(0, selection.endOffset);
      if (selection.endNode instanceof RichNode) {
        selection.startNode.insertText(
          selection.endNode.richTextManager,
          selection.startOffset,
        );
      } else {
        selection.startNode.insertText(
          selection.endNode.getText(),
          selection.startOffset,
        );
      }
      const removeLength = endIndex - startIndex;
      if (removeLength) {
        commonAncestor.removeChildren(startIndex + 1, removeLength);
      }
      const newSelection = selection;
      newSelection.collapseBackward();
      return newSelection;
    }
    selection.startNode.removeText(selection.startOffset);
    let startIndex = selection.startNode.getIndex();
    let startCursor:
      ArenaNodeAncestor
      | (ArenaNodeAncestor & ArenaNodeScion)
      | undefined = selection.startNode.parent;
    while (startCursor && startCursor !== commonAncestor) {
      startCursor.removeChildren(startIndex + 1);
      if ('hasParent' in startCursor) {
        startIndex = startCursor.getIndex();
        startCursor = startCursor.parent;
      } else {
        startCursor = undefined;
      }
    }

    selection.endNode.removeText(0, selection.endOffset);
    let endIndex = selection.endNode.getIndex();
    let endCursor:
      ArenaNodeAncestor
      | (ArenaNodeAncestor & ArenaNodeScion)
      | undefined = selection.endNode.parent;
    while (endCursor && endCursor !== commonAncestor) {
      endCursor.removeChildren(0, endIndex);
      if ('hasParent' in endCursor) {
        endIndex = endCursor.getIndex();
        endCursor = endCursor.parent;
      } else {
        endCursor = undefined;
      }
    }
    if (commonAncestor === startCursor
      && commonAncestor === endCursor
      && 'hasChildren' in commonAncestor) {
      const removeLength = endIndex - startIndex - 1;
      if (removeLength) {
        commonAncestor.removeChildren(startIndex + 1, removeLength);
      }
    }

    const newSelection = selection;
    newSelection.collapse();
    return newSelection;
  }

  breakSelection(selection: ArenaSelection): ArenaSelection {
    let newSelection = selection;
    if (!selection.isCollapsed()) {
      newSelection = this.removeSelection(selection, 'backward');
    }
    const { startNode } = selection;
    const text = startNode.cutText(selection.startOffset);
    const result = startNode.parent.createAndInsertNode(startNode.arena, startNode.getIndex() + 1);
    if (result && 'hasText' in result[0]) {
      const newNode = result[0];
      newNode.insertText(text, 0);
      newSelection.setStartNode(newNode, 0);
      newSelection.setEndNode(newNode, 0);
    }
    return newSelection;
  }

  mergeNodes(nodeA: ArenaNodeText, nodeB: ArenaNodeText): void {
    nodeA.insertText(nodeB.getText(), nodeA.getTextLength());
    nodeB.remove();
  }
}
