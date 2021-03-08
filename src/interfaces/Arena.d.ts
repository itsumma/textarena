import { TemplateResult } from 'lit-html';

interface ArenaCore {
  readonly name: string;

  readonly tag: string;

  readonly attributes: string[];

  getTemplate(children: TemplateResult | string, id: string): TemplateResult | string;
}

export interface ArenaSingle extends ArenaCore {
  readonly single: true;
}

export interface ArenaWithText extends ArenaCore {
  readonly allowText: true;
}

export interface ArenaAncestor extends ArenaCore {
  readonly hasChildren: true;
  readonly arenaForText: ArenaAncestor | ArenaWithText | undefined
  readonly allowedArenas: (ArenaSingle | ArenaAncestor | ArenaWithText)[];
  addAllowedChild(arena: ArenaSingle | ArenaAncestor | ArenaWithText): void;
  setArenaForText(arena: ArenaAncestor | ArenaWithText): void;
}

export interface ArenaRoot extends ArenaAncestor {
  readonly root: true;
}

type Arena = ArenaSingle | ArenaAncestor | ArenaWithText;

export default Arena;
