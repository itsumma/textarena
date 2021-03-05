import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaSelection from 'ArenaSelection';

type MarkOptions = {
  tag: string,
  attributes: string[];
};

type FormatingsOptions = {
  name: string,
  tag: string,
  attributes: string[];
  keys: string,
  marks: MarkOptions[],
};

const defaultOptions: {
  formatings: FormatingsOptions[],
} = {
  formatings: [
    {
      name: 'strong',
      tag: 'STRONG',
      attributes: [],
      keys: 'Ctrl + KeyB',
      marks: [
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
    },
    {
      name: 'italic',
      tag: 'EM',
      attributes: [],
      keys: 'Ctrl + KeyI',
      marks: [
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
    },
  ],
};

const formatingsPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: any): void {
    const options = { ...defaultOptions, ...(opts || {}) };
    options.formatings.forEach((frm: FormatingsOptions) => {
      const formating = textarena.model.registerFormating(
        {
          name: frm.name,
          tag: frm.tag,
          attributes: frm.attributes,
        },
        frm.marks,
      );
      textarena.commandManager.registerCommand(
        frm.keys,
        (ta: Textarena, selection: ArenaSelection) => ta.model.formatingModel(selection, formating),
      );
      textarena.toolbar.registerTool(
        frm.name,
      );
    });
  },
};

export default formatingsPlugin;
