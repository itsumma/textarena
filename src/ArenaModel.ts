/* eslint-disable no-console */
import Arena, { ArenaWithRichText } from 'interfaces/Arena';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import RootNode from 'models/RootNode';
import { TemplateResult, html } from 'lit-html';
import AncestorNodeAbstract from 'models/AncestorNodeAbstract';
import Textarena from 'Textarena';

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

  public getModelById(id: string): ArenaNodeInterface | undefined {
    const path = id.split('.').map((i) => parseInt(i, 10));
    let result: ArenaNodeInterface | undefined;
    if (path.shift() === 0) {
      result = this.model;
      path.forEach((i) => {
        if (result instanceof AncestorNodeAbstract) {
          result = result.children[i];
        } else {
          result = undefined;
        }
      });
    }
    return result;
  }
}
