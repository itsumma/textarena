import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaSelection from 'ArenaSelection';

const defaultOptions = {
  tags: [],
};

const formatingsPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: any): void {
    const options = { ...defaultOptions, ...(opts || {}) };
    const formatingB = textarena.model.registerFormating(
      {
        name: 'strong',
        tag: 'STRONG',
        attributes: [],
      },
      [
        {
          tag: 'B',
          attributes: [],
        },
        {
          tag: 'STRONG',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=fontWeight:bold',
            'style=fontWeight:900',
            'style=fontWeight:800',
            'style=fontWeight:700',
            'style=fontWeight:600',
          ],
        },
      ],
    );
    textarena.commandManager.registerCommand(
      'Ctrl + KeyB',
      (ta: Textarena, selection: ArenaSelection) => ta.model.formatingModel(selection, formatingB),
    );
    const formatingI = textarena.model.registerFormating(
      {
        name: 'italic',
        tag: 'EM',
        attributes: [],
      },
      [
        {
          tag: 'I',
          attributes: [],
        },
        {
          tag: 'EM',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=fontStyle:italic',
          ],
        },
      ],
    );
    textarena.commandManager.registerCommand(
      'Ctrl + KeyI',
      (ta: Textarena, selection: ArenaSelection) => ta.model.formatingModel(selection, formatingI),
    );
  },
};

export default formatingsPlugin;
