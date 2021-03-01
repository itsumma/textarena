import { TemplateResult, html } from 'lit-html';
import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';

const posibleTags = ['h1', 'h2', 'h3', 'h4'];

const defaultOptions = {
  tags: ['h2', 'h3', 'h4'],
};

const headersPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: any): void {
    const options = { ...defaultOptions, ...(opts || {}) };
    options.tags.forEach((type: string) => {
      if (posibleTags.includes(type)) {
        textarena.model.registerArena(
          {
            name: 'header2',
            tag: 'H2',
            template: (child: TemplateResult | string, id: string) => html`<h2 observe-id="${id}">${child}</h2>`,
            attributes: [],
            allowText: true,
          },
          [
            {
              tag: 'H2',
              attributes: [],
            },
          ],
          [ArenaModel.rootArenaName],
        );
      }
    });
  },
};

export default headersPlugin;
