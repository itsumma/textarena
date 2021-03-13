import { TemplateResult } from 'lit-html';
import ArenaNode from './ArenaNode';

interface ArenaCore {
  readonly name: string;

  readonly tag: string;

  readonly attributes: string[];

  getTemplate(children: TemplateResult | string | undefined, id: string): TemplateResult | string;

  init(node: ArenaNode): ArenaNode;
}

export default ArenaCore;
