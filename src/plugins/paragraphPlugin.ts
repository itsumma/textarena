import { TemplateResult, html } from 'lit-html';
import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';
import ArenaSelection from 'ArenaSelection';

const defaultOptions = {
};

const paragraphPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: any): void {
    const options = { ...defaultOptions, ...(opts || {}) };
    const arena = textarena.model.registerArena(
      {
        name: 'paragraph',
        tag: 'P',
        template: (child: TemplateResult | string, id: string) => html`<p observe-id="${id}">${child}</p>`,
        attributes: [],
        allowText: true,
        allowFormating: true,
      },
      [
        {
          tag: 'P',
          attributes: [],
        },
        {
          tag: 'DIV',
          attributes: [],
        },
      ],
      [ArenaModel.rootArenaName],
    );
    // TODO convert arena to class
    textarena.model.rootArena.arenaForText = arena;
    textarena.commandManager.registerCommand(
      'Alt + Digit0',
      (ta: Textarena, selection: ArenaSelection) => ta.model.transformModel(selection, arena),
    );
    textarena.toolbar.registerTool({
      name: 'paragraph',
      title: 'Paragraph',
      icon: '<b>¶</b>',
      altKey: '0',
    });
  },
};

export default paragraphPlugin;
