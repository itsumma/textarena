import { TemplateResult } from 'lit-html';
import ArenaNodeCore from 'interfaces/ArenaNodeCore';
import ArenaNodeText from 'interfaces/ArenaNodeText';
import AbstractNodeText from './AbstractNodeText';

export default class TextNode
  extends AbstractNodeText
  implements ArenaNodeText {
  protected text = '';

  insertText(
    text: string,
    offset = 0,
  ): [ArenaNodeCore, number] | undefined {
    this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
    return [this, offset + text.length];
  }

  getText(): TemplateResult | string {
    return this.text;
  }
}
