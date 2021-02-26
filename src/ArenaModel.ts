/* eslint-disable no-console */
import Arena, { ArenaWithRichText } from 'interfaces/Arena';
import ArenaNodeCore from 'interfaces/ArenaNodeCore';
import RootNode from 'models/RootNode';
import { TemplateResult, html } from 'lit-html';
import Textarena from 'Textarena';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import ArenaNode from 'interfaces/ArenaNode';
import ArenaSelection from 'ArenaSelection';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import ArenaNodeScion from 'interfaces/ArenaNodeScion';

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
    this.registerArena(
      {
        name: 'header2',
        tag: 'H2',
        template: (child: TemplateResult | string, id: string) => html`<h2 observe-id="${id}">${child}</h2>`,
        attributes: [],
        allowText: true,
      },
      [
        {
          tag: 'H2',
          attributes: [],
        },
      ],
      [ArenaModel.rootArenaName],
    );
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
    let i = 0;
    let result;
    while (ancestorsForA[i] === ancestorsForB[i]) {
      result = ancestorsForA[i];
      i += 1;
    }
    return result;
  }

  public removeSelection(selection: ArenaSelection): void {
    if (selection.startNode === selection.endNode) {
      selection.startNode.removeText(selection.startOffset, selection.endOffset);
      return;
    }
    const commonAncestor = this.getCommonAncestor(selection.startNode, selection.endNode);
    if (!commonAncestor) {
      return;
    }

    if (selection.startOffset === 0) {
      selection.startNode.remove();
    } else {
      selection.startNode.removeText(selection.startOffset);
    }
    if (selection.startNode.parent === commonAncestor) {

      const endIndex = selection.endNode.getIndex();
    }
    if (selection.startNode.parent !== commonAncestor) {
      selection.startNode.parent.children
    }

    let cursor: ArenaNode = selection.startNode;
    cursor = cursor.parent;
    while (cursor !== commonAncestor) {
      if ('hasParent' in cursor) {
        cursor = cursor.parent;
      } else {
        return;
      }
    }
  }
}
