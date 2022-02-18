import { TemplateResult } from 'lit';

import { ArenaAttribute } from '../ArenaAttribute';
import { ArenaAttributes } from '../ArenaAttributes';
import { ArenaFormatings } from '../ArenaFormating';
import { AnyArenaNode } from '../ArenaNode';
import { NodeAttributes } from '../NodeAttributes';

export interface ArenaCore {
  readonly name: string;
  readonly tag: string;
  readonly attributes: ArenaAttributes;
  readonly allowedAttributes: string[];

  readonly hasParent: boolean;
  readonly hasChildren: boolean;
  readonly hasText: boolean;
  readonly inline: boolean;
  readonly single: boolean;

  getTemplate(
    children: TemplateResult | string | undefined,
    id: string,
    attributes: NodeAttributes,
    node?: AnyArenaNode,
  ): TemplateResult | string;

  getDataHtml(
    children: string | undefined,
    attributes: NodeAttributes,
    single?: boolean,
  ): string;

  getOutput(
    type: string,
    children: string[] | string | undefined,
    attributes: NodeAttributes,
    node: AnyArenaNode,
    frms: ArenaFormatings,
  ): string;

  getOpenTag(
    attributes: NodeAttributes,
  ): string;

  getCloseTag(): string

  getAttribute(name: string): ArenaAttribute;
}
