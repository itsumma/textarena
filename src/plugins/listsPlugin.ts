import { TemplateResult, html } from 'lit-html';
import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';
import ArenaSelection from 'ArenaSelection';
import { ArenaWithText } from 'interfaces/Arena';

const defaultOptions = {
};

const listsPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: any): void {
    const options = { ...defaultOptions, ...(opts || {}) };
    const li = textarena.model.registerArena(
      {
        name: 'li',
        tag: 'LI',
        template: (child: TemplateResult | string, id: string) => html`<li observe-id="${id}">${child}</li>`,
        attributes: [],
        allowText: true,
        allowFormating: true,
      },
      [
        {
          tag: 'li',
          attributes: [],
        },
      ],
      [ArenaModel.rootArenaName],
    );
    const ul = textarena.model.registerArena(
      {
        name: 'ul',
        tag: 'UL',
        template: (child: TemplateResult | string, id: string) => html`<ul observe-id="${id}">${child}</ul>`,
        attributes: [],
        allowedArenas: [li],
        arenaForText: li as ArenaWithText,
      },
      [
        {
          tag: 'UL',
          attributes: [],
        },
      ],
      [ArenaModel.rootArenaName],
    );
    textarena.commandManager.registerCommand(
      'convert-to-list',
      (ta: Textarena, selection: ArenaSelection) => ta.model.transformModel(selection, ul),
    );
    textarena.commandManager.registerShortcut(
      'Alt + KeyL',
      'convert-to-list',
    );
    textarena.toolbar.registerTool({
      name: 'list',
      title: 'List',
      icon: '≣',
      shortcut: 'Alt + KeyL',
      command: 'convert-to-list',
      hint: 'l',
    });
  },
};

export default listsPlugin;
