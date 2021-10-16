import { TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import NodeAttributes from '../interfaces/NodeAttributes';
import { ArenaFormatings } from '../interfaces/ArenaFormating';
import { AnyArenaNode } from '../interfaces/ArenaNode';
import { ArenaMediatorInterface } from '../interfaces/Arena';
import ArenaOptions, { OutputProcessor } from '../interfaces/ArenaOptions';
import ArenaAttributes from '../interfaces/ArenaAttributes';
import utils from '../utils';
import ArenaAttribute from '../interfaces/ArenaAttribute';

export default abstract class AbstractArena {
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
    if (this.tag) {
      const attrs = unsafeStatic(this.getAttributesString(id, attributes));
      const tag = unsafeStatic(this.tag.toLowerCase());
      return html`<${tag} ${attrs} .arena="${this}" .node="${node}">${children}</${tag}>`;
    }
    return html`${children}`;
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

  public getCloseTag(
  ): string {
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
