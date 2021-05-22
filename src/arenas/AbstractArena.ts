import { TemplateResult, defaultTemplateProcessor } from 'lit-html';
import ArenaAttributes from '../interfaces/ArenaAttributes';
import { ArenaFormatings } from '../interfaces/ArenaFormating';
import { AnyArenaNode } from '../interfaces/ArenaNode';
import ArenaOptions, { HtmlProcessor } from '../interfaces/ArenaOptions';

export default abstract class AbstractArena {
  readonly name: string;

  readonly tag: string;

  readonly attributes: string[];

  readonly allowedAttributes: string[] = [];

  protected getPublicProcessor: HtmlProcessor | undefined;

  constructor(options: ArenaOptions) {
    this.name = options.name;
    this.tag = options.tag;
    this.attributes = options.attributes;
    if (options.allowedAttributes) {
      this.allowedAttributes = options.allowedAttributes;
    }
    this.getPublicProcessor = options.getPublic;
  }

  public getTemplate(
    children: TemplateResult | string,
    id: string,
    attributes: ArenaAttributes,
  ): TemplateResult | string {
    if (!this.tag) {
      return children;
    }
    const openTag = this.getOpenTag({ ...attributes, 'arena-id': id });
    const closeTag = this.getCloseTag();
    const stringArray = [
      openTag,
      closeTag,
    ];
    // FIXME
    return new TemplateResult(
      (stringArray as unknown as TemplateStringsArray),
      [children],
      'html',
      defaultTemplateProcessor,
    );
  }

  public getOutputTemplate(
    children: string | undefined,
    attributes: ArenaAttributes,
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

  public getPublicHtml(
    children: string[] | string | undefined,
    attributes: ArenaAttributes,
    node: AnyArenaNode,
    frms: ArenaFormatings,
  ): string {
    if (this.getPublicProcessor) {
      return this.getPublicProcessor(node, frms, this.attributes);
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

  protected getAttributesString(id: string, attributes: ArenaAttributes): string {
    let str = '';
    if (id) {
      str += ` arena-id="${id}"`;
    }
    this.attributes.forEach((attr) => {
      str += ` ${attr}`;
    });
    Object.entries(attributes).forEach(([name, value]) => {
      if (typeof value === 'boolean') {
        if (value) {
          str += ` ${name}`;
        }
      } else {
        if (value !== null && value !== undefined) {
          const escapedValue = value.toString()
            .replace(/&/g, '&amp;')
            .replace(/'/g, '&apos;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          str += ` ${name}="${escapedValue}"`;
        } else {
          str += ` ${name}=""`
        }
      }
    });
    return str;
  }
}
