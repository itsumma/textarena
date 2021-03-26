import { TemplateResult } from 'lit-html';
import ArenaAttributes from '../ArenaAttributes';

interface ArenaCore {
  readonly name: string;
  readonly tag: string;
  readonly attributes: string[];
  readonly allowedAttributes: string[];

  readonly hasParent: boolean;
  readonly hasChildren: boolean;
  readonly hasText: boolean;
  readonly inline: boolean;
  readonly single: boolean;

  getTemplate(
    children: TemplateResult | string | undefined,
    id: string,
    attributes: ArenaAttributes,
  ): TemplateResult | string;

  getOutputTemplate(
    children: string | undefined,
    deep: number,
    attributes: ArenaAttributes,
    single?: boolean,
  ): string;
}

export default ArenaCore;
