import { TemplateResult, defaultTemplateProcessor } from 'lit-html';
import ArenaAttributes from '../interfaces/ArenaAttributes';
import ArenaOptions from '../interfaces/ArenaOptions';

export default abstract class AbstractArena {
  readonly name: string;

  readonly tag: string;

  readonly attributes: string[];

  readonly allowedAttributes: string[] = [];

  constructor(options: ArenaOptions) {
    this.name = options.name;
    this.tag = options.tag;
    this.attributes = options.attributes;
    if (options.allowedAttributes) {
      this.allowedAttributes = options.allowedAttributes;
    }
  }

  protected getAttributesString(id: string, attributes: ArenaAttributes): string {
    let str = '';
    if (id) {
      str += ` arena-id="${id}"`;
    }
    this.attributes.forEach((attr) => {
      str += ` ${attr}`;
    });
    Object.entries(attributes).forEach(([name, value]) => {
      if (typeof value === 'boolean' && value) {
        str += ` ${name}`;
      } else {
        const escapedValue = value.toString()
          .replace(/&/g, '&amp;')
          .replace(/'/g, '&apos;')
          .replace(/"/g, '&quot;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        str += ` ${name}="${escapedValue}"`;
      }
    });
    return str;
  }

  public getTemplate(
    children: TemplateResult | string,
    id: string,
    attributes: ArenaAttributes,
  ): TemplateResult | string {
    if (!this.tag) {
      return children;
    }
    const attrs = this.getAttributesString(id, attributes);
    const stringArray = [
      `<${this.tag} ${attrs}>`,
      `</${this.tag}>`,
    ];
    // FIXME
    return new TemplateResult(
      (stringArray as unknown as TemplateStringsArray),
      [children],
      'html',
      defaultTemplateProcessor,
    );
    // return `<${this.tag} observe-id="${id}">${children}</${this.tag}>`;
    // return html`
    //   ${unsafeHTML(`<${this.tag} observe-id="${id}">${html`children`}</${this.tag}>`)}
    // `;
  }

  public getOutputTemplate(
    children: string | undefined,
    deep: number,
    attributes: ArenaAttributes,
    sigle = false,
  ): string {
    if (!this.tag) {
      return children || '';
    }
    const attrs = this.getAttributesString('', attributes);
    const tab = '  '.repeat(deep);
    const tag = this.tag.toLowerCase();
    let content = '';
    if (children) {
      content = sigle ? children : `\n${children}\n${tab}`;
    }
    return `${tab}<${tag.toLowerCase()}${attrs}>${content}</${tag.toLowerCase()}>`;
  }

  public getOpenTag(
    attributes: ArenaAttributes,
  ): string {
    if (!this.tag) {
      return '';
    }
    const attrs = this.getAttributesString('', attributes);
    const tag = this.tag.toLowerCase();
    return `<${tag.toLowerCase()}${attrs}>`;
  }

  public getCloseTag(
  ): string {
    if (!this.tag) {
      return '';
    }
    const tag = this.tag.toLowerCase();
    return `</${tag.toLowerCase()}>`;
  }
}
