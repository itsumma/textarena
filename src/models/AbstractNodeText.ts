import { ArenaWithText, ArenaWithRichText } from 'interfaces/Arena';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import { TemplateResult } from 'lit-html';
import AbstractNodeScion from './AbstractNodeScion';

export default abstract class AbstractNodeText
  extends AbstractNodeScion {
  hasText: true = true;

  constructor(
    public arena: ArenaWithText | ArenaWithRichText,
    public parent: ArenaNodeAncestor,
  ) {
    super(arena, parent);
  }

  getTemplate(): TemplateResult | string {
    let { text } = this;
    if (text === '') {
      return html`<br/>`;
    }
    text = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/^\s/, '&nbsp;')
      .replace(/\s&/, '&nbsp;')
      .replace(/\s\s/g, ' &nbsp;');
    return html`${unsafeHTML(text)}`;
  }
}
