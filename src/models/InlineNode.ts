import { TemplateResult } from 'lit-html';
import { ArenaInlineInterface } from '../interfaces/Arena';
import NodeAttributes from '../interfaces/NodeAttributes';
import { ArenaNodeInline } from '../interfaces/ArenaNode';
import utils from '../utils';
import ArenaAttribute from '../interfaces/ArenaAttribute';

export default class InlineNode
implements ArenaNodeInline {
  readonly hasParent: false = false;

  readonly hasChildren: false = false;

  readonly hasText: false = false;

  readonly inline: true = true;

  readonly single: false = false;

  protected attributes: NodeAttributes = {};

  constructor(
    public arena: ArenaInlineInterface,
  ) {
  }

  public getTemplate(): TemplateResult | string {
    return this.arena.getTemplate(undefined, '', this.attributes);
  }

  protected getAttributesString(): string {
    let result = utils.attr.getStringsFromAttributes(this.attributes);
    result = result.concat(utils.attr.getStringsFromAttributes(this.arena.attributes));
    return result.join(' ');
  }

  public getTags(): [string, string] {
    const attrs = this.getAttributesString();
    const tag = this.arena.tag.toLowerCase();
    return [`<${tag.toLowerCase()}${attrs}>`, `</${tag.toLowerCase()}>`];
  }

  public getDataHtml(): string {
    return this.arena.getDataHtml('', this.attributes);
  }

  public setAttribute(name: string, value: ArenaAttribute): void {
    this.attributes[name] = value;
  }

  public getAttribute(name: string): ArenaAttribute {
    return this.attributes[name] || '';
  }

  public clone(): ArenaNodeInline {
    const newNode = new InlineNode(this.arena);
    Object.entries(this.attributes).forEach(([name, value]) => {
      newNode.setAttribute(name, value);
    });
    return newNode;
  }
}
