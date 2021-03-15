import Textarena from 'Textarena';
import ArenaPlugin from 'interfaces/ArenaPlugin';
import ArenaSelection from 'ArenaSelection';
import ArenaNode from 'interfaces/ArenaNode';

type MarkOptions = {
  tag: string,
  attributes: string[];
};

type FormatingsOptions = {
  name: string,
  tag: string,
  attributes: string[];
  shortcut: string,
  hint: string,
  command: string,
  marks: MarkOptions[],
  tool?: {
    icon: string;
    title: string;
  },
};

const defaultOptions: {
  formatings: FormatingsOptions[],
} = {
  formatings: [
    {
      name: 'strong',
      tag: 'STRONG',
      attributes: [],
      shortcut: 'Ctrl + KeyB',
      hint: 'b',
      command: 'format-strong',
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
      tool: {
        title: 'Strong (bold)',
        icon: '<b>B</b>',
      },
    },
    {
      name: 'emphasized',
      tag: 'EM',
      attributes: [],
      command: 'format-emphasized',
      shortcut: 'Ctrl + KeyI',
      hint: 'i',
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
      tool: {
        title: 'Italic (emphasized)',
        icon: '<i>I</i>',
      },
    },
    {
      name: 'underline',
      tag: 'U',
      attributes: [],
      shortcut: 'Ctrl + KeyU',
      hint: 'u',
      command: 'format-underline',
      marks: [
        {
          tag: 'U',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=textDecoration:underline;',
          ],
        },
      ],
      tool: {
        title: 'Underline',
        icon: '<u>U</u>',
      },
    },
    {
      name: 'strikethrough',
      tag: 'S',
      attributes: [],
      shortcut: 'Alt + KeyS',
      hint: 's',
      command: 'format-strikethrough',
      marks: [
        {
          tag: 'S',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=textDecoration:line-through;',
          ],
        },
      ],
      tool: {
        title: 'Strikethrough',
        icon: '<s>S</s>',
      },
    },
  ],
};

const formatingsPlugin: ArenaPlugin = {
  register(textarena: Textarena, opts: any): void {
    const options = { ...defaultOptions, ...(opts || {}) };
    options.formatings.forEach(({
      name,
      tag,
      attributes,
      shortcut,
      hint,
      command,
      marks,
      tool,
    }: FormatingsOptions) => {
      const formating = textarena.model.registerFormating(
        {
          name,
          tag,
          attributes,
        },
        marks,
      );
      textarena.commandManager.registerCommand(
        command,
        (ta: Textarena, selection: ArenaSelection) => ta.model.formatingModel(selection, formating),
      );
      textarena.commandManager.registerShortcut(
        shortcut,
        command,
      );
      if (tool) {
        textarena.toolbar.registerTool({
          ...tool,
          name,
          command,
          hint,
          shortcut,
          checkStatus: (node: ArenaNode, start?: number, end?: number): boolean => {
            if ('hasText' in node) {
              return node.getText().hasFormating(name, start, end);
            }
            return true;
          },
        });
      }
    });
  },
};

export default formatingsPlugin;
