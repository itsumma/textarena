import { TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';

import {
  AnyArenaNode, ArenaAttribute, ArenaAttributes, ArenaFormatings, ArenaMediatorInterface,
  ArenaOptions, NodeAttributes, OutputProcessor,
} from '../interfaces';
import utils from '../utils';

export abstract class AbstractArena {
  readonly name: string;

  readonly tag: string;

  readonly attributes: ArenaAttributes;

  readonly single: boolean = false;

  readonly allowedAttributes: string[] = [];

  readonly defaultParentArena: ArenaMediatorInterface | undefined;

  readonly noPseudoCursor: boolean = false;

  protected getOutputProcessor: OutputProcessor | undefined;

  constructor(options: ArenaOptions) {
    this.name = options.name;
    this.tag = options.tag;
    this.attributes = options.attributes;
    if (options.allowedAttributes) {
      this.allowedAttributes = options.allowedAttributes;
    }
    if (options.defaultParentArena) {
      this.defaultParentArena = options.defaultParentArena;
    }
    if ('noPseudoCursor' in options && options.noPseudoCursor) {
      this.noPseudoCursor = true;
    }
    this.getOutputProcessor = options.output;
  }

  public getTemplate(
    children: TemplateResult | string,
    id: string,
    attributes: NodeAttributes,
    node?: AnyArenaNode,
  ): TemplateResult | string {
    if (!this.tag) {
      return children;
    }
    const attrs = unsafeStatic(this.getAttributesString(id, attributes));
    const tag = unsafeStatic(this.tag.toLowerCase());
    const result = html`<${tag} ${attrs} .arena="${this}" .node="${node}">${children}</${tag}>`;
    if (node && node.hasParent && (node.parent.protected || node.parent.arena.noPseudoCursor)) {
      return result;
    }
    const removeButton = html`<textarena-remove node-id="${id}" contenteditable="false">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512.001 512.001" xml:space="preserve">
      <g>
        <path d="M294.111,256.001L504.109,46.003c10.523-10.524,10.523-27.586,0-38.109c-10.524-10.524-27.587-10.524-38.11,0L256,217.892
          L46.002,7.894c-10.524-10.524-27.586-10.524-38.109,0s-10.524,27.586,0,38.109l209.998,209.998L7.893,465.999
          c-10.524,10.524-10.524,27.586,0,38.109c10.524,10.524,27.586,10.523,38.109,0L256,294.11l209.997,209.998
          c10.524,10.524,27.587,10.523,38.11,0c10.523-10.524,10.523-27.586,0-38.109L294.111,256.001z" fill="currentColor"/>
      </g>
      </svg>
      </textarena-remove>`;
    const dragButton = html`<textarena-drag draggable="true" node-id="${id}" contenteditable="false">::</textarena-drag>`;
    return html`
    <textarena-node
      arena-id="${id}"
      cursor-id="${id}"
    >
      ${result}
      ${removeButton}
      ${dragButton}
    </textarena-node>
    `;
  }

  public getDataHtml(
    children: string | undefined,
    attributes: NodeAttributes,
    sigle = false,
  ): string {
    if (!this.tag) {
      return children || '';
    }
    const openTag = this.getOpenTag(attributes);
    const closeTag = this.getCloseTag();
    let content = '';
    if (children) {
      content = sigle ? children : `\n${children}\n`;
    }
    return `${openTag}${content}${closeTag}`;
  }

  public getOutput(
    type: string,
    children: string[] | string | undefined,
    attributes: NodeAttributes,
    node: AnyArenaNode,
    frms: ArenaFormatings,
  ): string {
    if (this.getOutputProcessor) {
      return this.getOutputProcessor(type, node, frms, this.attributes);
    }
    const openTag = this.getOpenTag(attributes);
    const closeTag = this.getCloseTag();
    let content = '';
    if (children) {
      content = Array.isArray(children) ? children.join('\n') : `${children}`;
    }
    return `${openTag}${content}${closeTag}`;
  }

  public getOpenTag(
    attributes: NodeAttributes,
  ): string {
    if (!this.tag) {
      return '';
    }
    const attrs = this.getAttributesString('', attributes);
    const tag = this.tag.toLowerCase();
    return `<${tag}${attrs.length > 0 ? ` ${attrs}` : ''}>`;
  }

  public getCloseTag(): string {
    if (!this.tag) {
      return '';
    }
    const tag = this.tag.toLowerCase();
    return `</${tag}>`;
  }

  public getAttribute(name: string): ArenaAttribute {
    return this.attributes[name] || '';
  }

  protected getAttributesString(id: string, attributes: NodeAttributes): string {
    let result: string[] = [];
    if (id && !this.single) {
      result.push(`arena-id="${id}"`);
    }
    result = result.concat(utils.attr.getStringsFromAttributes(this.attributes));
    result = result.concat(utils.attr.getStringsFromAttributes(attributes));
    return result.join(' ');
  }
}
