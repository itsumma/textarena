import { TemplateResult, defaultTemplateProcessor } from 'lit-html';
import ArenaOptions from '../interfaces/ArenaOptions';
import ArenaNode from '../interfaces/ArenaNode';

export default abstract class AbstractArena {
  readonly name: string;

  readonly tag: string;

  readonly attributes: string[];

  readonly automerge: boolean = false;

  readonly initCallback: ((node: ArenaNode) => ArenaNode) | undefined;

  constructor(options: ArenaOptions) {
    this.name = options.name;
    this.tag = options.tag;
    this.attributes = options.attributes;
    if (options.automerge) {
      this.automerge = true;
    }
    this.initCallback = options.init;
  }

  protected getAttributesString(id: string, attributes: { [key: string] :string }): string {
    let str = '';
    if (id) {
      str += ` observe-id="${id}"`;
    }
    this.attributes.forEach((attr) => {
      str += ` ${attr}`;
    });
    Object.entries(attributes).forEach(([name, value]) => {
      const escapedValue = value.replace(/&/g, '&amp;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      str += ` ${name}="${escapedValue}"`;
    });
    return str;
  }

  public getTemplate(
    children: TemplateResult | string,
    id: string,
    attributes: { [key: string] :string },
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
    attributes: { [key: string] :string },
  ): string {
    const attrs = this.getAttributesString('', attributes);
    const tab = '  '.repeat(deep);
    const tag = this.tag.toLowerCase();
    const content = children ? `\n${children}\n` : '';
    return `${tab}<${tag.toLowerCase()}${attrs}>${content}${tab}</${tag.toLowerCase()}>`;
  }

  public init(node: ArenaNode): ArenaNode {
    if (this.initCallback) {
      return this.initCallback(node);
    }
    return node;
  }
}
