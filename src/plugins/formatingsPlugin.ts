import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import { AnyArenaNode } from '../interfaces/ArenaNode';

type MarkOptions = {
  tag: string,
  attributes: string[];
};

type FormatingOptions = {
  name: string,
  tag: string,
  attributes: string[];
  shortcut?: string,
  hint?: string,
  command: string,
  marks: MarkOptions[],
  tool?: {
    icon: string;
    title: string;
  },
};

type FormatingsOptions = {
  formatings: FormatingOptions[],
};

const defaultOptions: FormatingsOptions = {
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
      shortcut: 'Ctrl + KeyD',
      hint: 'd',
      command: 'format-strikethrough',
      marks: [
        {
          tag: 'S',
          attributes: [],
        },
        {
          tag: 'DEL',
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
    {
      name: 'subscript',
      tag: 'SUB',
      attributes: [],
      command: 'format-subscript',
      marks: [
        {
          tag: 'SUB',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=verticalAlign:sub;',
          ],
        },
      ],
      tool: {
        title: 'Subscript',
        icon: '<sub>sub</sub>',
      },
    },
    {
      name: 'superscript',
      tag: 'SUP',
      attributes: [],
      command: 'format-superscript',
      marks: [
        {
          tag: 'SUP',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=verticalAlign:sup;',
          ],
        },
      ],
      tool: {
        title: 'Superscript',
        icon: '<sup>sup</sip>',
      },
    },
  ],
};

const formatingsPlugin = (opts?: FormatingsOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
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
    }: FormatingOptions) => {
      const formating = textarena.registerFormating(
        {
          name,
          tag,
          attributes,
        },
        marks,
      );
      textarena.registerCommand(
        command,
        (ta: Textarena, selection: ArenaSelection) => {
          selection.trim();
          return ta.applyFormationToSelection(selection, formating);
        },
      );
      if (shortcut) {
        textarena.registerShortcut(
          shortcut,
          command,
        );
      }
      if (tool) {
        textarena.registerTool({
          ...tool,
          name,
          command,
          hint,
          shortcut,
          checkStatus: (node: AnyArenaNode, start?: number, end?: number): boolean => {
            if (node.hasText) {
              return node.getText().hasFormating(name, start, end);
            }
            return true;
          },
        });
      }
    });
    textarena.registerCommand(
      'clearFormatings',
      (ta: Textarena, selection: ArenaSelection) => {
        selection.trim();
        return ta.clearFormationInSelection(selection);
      },
    );
    textarena.registerShortcut(
      'Ctrl + Slash',
      'clearFormatings',
    );
    textarena.registerShortcut(
      'Ctrl + Backslash',
      'clearFormatings',
    );
    textarena.registerTool({
      name: 'clearFormatings',
      icon: `<svg width="18px" height="16px" viewBox="0 0 18 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Rounded" transform="translate(-102.000000, -2107.000000)">
                  <g id="Editor" transform="translate(100.000000, 1960.000000)">
                      <g id="-Round-/-Editor-/-format_clear" transform="translate(0.000000, 142.000000)">
                          <g>
                              <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                              <path d="M18.5,8 C19.33,8 20,7.33 20,6.5 C20,5.67 19.33,5 18.5,5 L6.39,5 L9.39,8 L11.22,8 L10.67,9.28 L12.76,11.37 L14.21,8 L18.5,8 Z M17.44,18.88 L4.12,5.56 C3.73,5.17 3.1,5.17 2.71,5.56 C2.32,5.95 2.32,6.58 2.71,6.97 L8.97,13.23 L7.32,17.07 C6.93,17.99 7.6,19 8.59,19 C9.14,19 9.64,18.67 9.86,18.16 L11.07,15.33 L16.02,20.28 C16.41,20.67 17.04,20.67 17.43,20.28 C17.83,19.9 17.83,19.27 17.44,18.88 Z" fill="currentColor"></path>
                          </g>
                      </g>
                  </g>
              </g>
          </g>
      </svg>`,
      title: 'Clear formatings',
      command: 'clearFormatings',
      hint: '/',
      shortcut: 'Ctrl + Slash',
    });
  },
});

export default formatingsPlugin;
