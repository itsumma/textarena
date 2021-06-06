import { TemplateResult } from 'lit-html';
import NodeAttributes from '../NodeAttributes';
import { ArenaFormatings } from '../ArenaFormating';
import { AnyArenaNode } from '../ArenaNode';
import ArenaAttributes from '../ArenaAttributes';
import ArenaAttribute from '../ArenaAttribute';

interface ArenaCore {
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

export default ArenaCore;
