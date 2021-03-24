import { TemplateResult } from 'lit-html';
import { ArenaInlineInterface } from '../interfaces/Arena';
import ArenaAttributes from '../interfaces/ArenaAttributes';
import { ArenaFormatings } from '../interfaces/ArenaFormating';
import { ArenaNodeInline } from '../interfaces/ArenaNode';

export default class InlineNode
implements ArenaNodeInline {
  readonly hasParent: false = false;

  readonly hasChildren: false = false;

  readonly hasText: false = false;

  readonly inline: true = true;

  readonly single: false = false;

  protected attributes: ArenaAttributes = {};

  constructor(
    public arena: ArenaInlineInterface,
  ) {
  }

  public getHtml(): TemplateResult | string {
    return this.arena.getTemplate(undefined, '', this.attributes);
  }

  protected getAttributesString(): string {
    let str = '';
    this.arena.attributes.forEach((attr) => {
      str += ` ${attr}`;
    });
    Object.entries(this.attributes).forEach(([name, value]) => {
      const escapedValue = value.replace(/&/g, '&amp;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      str += ` ${name}="${escapedValue}"`;
    });
    return str;
  }

  public getTags(): [string, string] {
    const attrs = this.getAttributesString();
    const tag = this.arena.tag.toLowerCase();
    return [`<${tag.toLowerCase()}${attrs}>`, `</${tag.toLowerCase()}>`];
  }

  public getOutputHtml(_frms: ArenaFormatings, deep = 0): string {
    return this.arena.getOutputTemplate('', deep, this.attributes);
  }

  public setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  public getAttribute(name: string): string {
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
