import { TemplateResult } from 'lit-html';

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
    attributes: { [key: string] :string },
  ): TemplateResult | string;

  getOutputTemplate(
    children: string | undefined,
    deep: number,
    attributes: { [key: string] :string },
  ): string;
}

export default ArenaCore;
