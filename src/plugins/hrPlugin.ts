import { TemplateResult, html } from 'lit-html';
import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaModel from 'ArenaModel';
import ArenaSelection from 'ArenaSelection';

const defaultOptions = {
  name: 'hr',
  icon: '<b>–</b>',
  title: 'Horizontal rule',
  tag: 'HR',
  attributes: [],
  shortcut: 'Alt + KeyH',
  hint: 'h',
  command: 'add-hr',
};

const hrPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: typeof defaultOptions): void {
    const {
      name, icon, title, tag, attributes, shortcut, hint, command,
    } = { ...defaultOptions, ...(opts || {}) };
    const arena = textarena.model.registerArena(
      {
        name,
        tag,
        attributes,
        single: true,
      },
      [
        {
          tag: 'HR',
          attributes: [],
        },
      ],
      [ArenaModel.rootArenaName],
    );
    textarena.commandManager.registerCommand(
      command,
      (ta: Textarena, selection: ArenaSelection) => ta.model.transformModel(selection, arena),
    );

    textarena.commandManager.registerShortcut(
      shortcut,
      command,
    );
    textarena.creatorBar.registerCreator({
      name,
      icon,
      title,
      shortcut,
      hint,
      command,
    });
  },
};

export default hrPlugin;
