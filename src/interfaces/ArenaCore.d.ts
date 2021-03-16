import { TemplateResult } from 'lit-html';
import ArenaNode from './ArenaNode';

interface ArenaCore {
  readonly name: string;

  readonly tag: string;

  readonly attributes: string[];

  automerge: boolean;

  getTemplate(children: TemplateResult | string | undefined, id: string): TemplateResult | string;

  getOutputTemplate(children: string | undefined, deep: number): string;

  init(node: ArenaNode): ArenaNode;
}

export default ArenaCore;
