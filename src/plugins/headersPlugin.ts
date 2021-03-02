import { TemplateResult, html } from 'lit-html';
import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';
import ArenaSelection from 'ArenaSelection';

const posibleTags = ['h1', 'h2', 'h3', 'h4'];

const defaultOptions = {
  tags: ['h2', 'h3', 'h4'],
};

const headersPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: any): void {
    const options = { ...defaultOptions, ...(opts || {}) };
    options.tags.forEach((type: string) => {
      if (posibleTags.includes(type)) {
        const number = parseInt(type[1], 10);
        const arena = textarena.model.registerArena(
          {
            name: `header${number}`,
            tag: `H${number}`,
            template: (child: TemplateResult | string, id: string) => html`<h2 observe-id="${id}">${child}</h2>`,
            attributes: [],
            allowText: true,
          },
          [
            {
              tag: `H${number}`,
              attributes: [],
            },
          ],
          [ArenaModel.rootArenaName],
        );
        textarena.commandManager.registerCommand(
          `Alt + Digit${number}`,
          (ta: Textarena, selection: ArenaSelection) => ta.model.transformModel(selection, arena),
        );
      }
    });
  },
};

export default headersPlugin;
