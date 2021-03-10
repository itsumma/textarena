import { TemplateResult } from 'lit-html';
import ArenaNode from './ArenaNode';
import ArenaCursor from './ArenaCursor';

export type Middleware = (cursor: ArenaCursor) => ArenaCursor;

interface ArenaCore {
  readonly name: string;

  readonly tag: string;

  readonly attributes: string[];

  getTemplate(children: TemplateResult | string, id: string): TemplateResult | string;

  init(node: ArenaNode): ArenaNode;
}

export interface ArenaSingle extends ArenaCore {
  readonly single: true;
}

export interface ArenaWithText extends ArenaCore {
  readonly allowText: true;
  readonly nextArena: ArenaWithText | undefined;
  middlewares: Middleware[];
  registerMiddleware: (middleware: Middleware) => void;
}

export interface ArenaAncestor extends ArenaCore {
  readonly hasChildren: true;
  readonly protected: boolean;
  readonly protectedChildren: (ArenaSingle | ArenaAncestor | ArenaWithText)[];
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
