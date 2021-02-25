import { render } from 'lit-html';
import ArenaServiceInterface from 'interfaces/ArenaServiceInterface';
import Textarena from 'Textarena';

export default class ArenaView implements ArenaServiceInterface {
  constructor(private textarena: Textarena) {
  }

  render(): void {
    const result = this.textarena.model.model.getHtml();
    const container = this.textarena.editor.getElem();
    render(result, container);
  }
}
