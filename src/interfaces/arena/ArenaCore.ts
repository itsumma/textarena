import { TemplateResult } from 'lit-html';
import ArenaAttributes from '../ArenaAttributes';
import { ArenaFormatings } from '../ArenaFormating';
import { AnyArenaNode } from '../ArenaNode';

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
    attributes: ArenaAttributes,
    single?: boolean,
  ): string;

  getPublicHtml(
    children: string[] | string | undefined,
    attributes: ArenaAttributes,
    node: AnyArenaNode,
    frms: ArenaFormatings,
  ): string;

  getOpenTag(
    attributes: ArenaAttributes,
  ): string;

  getCloseTag(): string
}

export default ArenaCore;
