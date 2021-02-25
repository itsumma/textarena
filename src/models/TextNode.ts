import { TemplateResult } from 'lit-html';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import ScionNodeAbstract from './ScionNodeAbstract';

export default class TextNode
  extends ScionNodeAbstract
  implements ArenaNodeInterface {
  protected text = '';

  insertText(text: string, offset = 0): [ArenaNodeInterface, number] | undefined {
    this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
    return [this, offset + text.length];
  }

  getText(): TemplateResult | string {
    return this.text;
  }
}
