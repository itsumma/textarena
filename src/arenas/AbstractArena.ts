import { TemplateResult, html, defaultTemplateProcessor } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import ArenaOptions from 'interfaces/ArenaOptions';

export default abstract class AbstractArena {
  readonly name: string;

  readonly tag: string;

  readonly attributes: string[];

  constructor(options: ArenaOptions) {
    this.name = options.name;
    this.tag = options.tag;
    this.attributes = options.attributes;
  }

  getTemplate(children: TemplateResult | string, id: string): TemplateResult | string {
    if (!this.tag) {
      return children;
    }
    const stringArray = [
      `<${this.tag} observe-id="${id}">`,
      `</${this.tag}>`,
    ];
    // FIXME
    return new TemplateResult(
      (stringArray as TemplateStringsArray),
      [children],
      'html',
      defaultTemplateProcessor,
    );
    // return `<${this.tag} observe-id="${id}">${children}</${this.tag}>`;
    // return html`
    //   ${unsafeHTML(`<${this.tag} observe-id="${id}">${html`children`}</${this.tag}>`)}
    // `;
  }
}
