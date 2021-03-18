import { TemplateResult } from 'lit-html';
import ArenaNode from './ArenaNode';

interface ArenaCore {
  readonly name: string;

  readonly tag: string;

  readonly attributes: string[];

  readonly allowedAttributes: string[];

  automerge: boolean;

  getTemplate(
    children: TemplateResult | string | undefined,
    id: string,
    attributes: { [key: string] :string },
  ): TemplateResult | string;

  getOutputTemplate(
    children: string | undefined,
    deep: number,
    attributes: { [key: string] :string },
  ): string;

  init(node: ArenaNode): ArenaNode;
}

export default ArenaCore;
