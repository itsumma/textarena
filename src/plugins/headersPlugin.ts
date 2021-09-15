import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaPlugin, { DefaulPluginOptions } from '../interfaces/ArenaPlugin';
import { ArenaTextInterface } from '../interfaces/Arena';
import { AnyArenaNode } from '../interfaces/ArenaNode';
import utils from '../utils';

type HeaderOptions = { [key: string]: DefaulPluginOptions };
type PartialHeaderOptions = { [key: string]: Partial<DefaulPluginOptions> };

const defaultOptions: HeaderOptions = {
  h2: {
    name: 'header2',
    tag: 'H2',
    attributes: {},
    title: 'Header 2',
    icon: '<b>H2</b>',
    command: 'convert-to-header2',
    shortcut: 'Alt + Digit2',
    description: 'Заголовок второго уровня',
    hint: '2',
    marks: [
      {
        tag: 'H2',
        attributes: [],
      },
    ],
  },
  h3: {
    name: 'header3',
    tag: 'H3',
    attributes: {},
    title: 'Header 3',
    icon: '<b>H3</b>',
    command: 'convert-to-header3',
    shortcut: 'Alt + Digit3',
    description: 'Заголовок третьего уровня',
    hint: '3',
    marks: [
      {
        tag: 'H3',
        attributes: [],
      },
    ],
  },
  h4: {
    name: 'header4',
    tag: 'H4',
    attributes: {},
    title: 'Header 4',
    icon: '<b>H4</b>',
    command: 'convert-to-header4',
    shortcut: 'Alt + Digit4',
    description: 'Заголовок четвёртого уровня',
    hint: '4',
    marks: [
      {
        tag: 'H4',
        attributes: [],
      },
    ],
  },
};

const headersPlugin = (opts?: PartialHeaderOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    Object.entries(opts || defaultOptions).forEach(([type, options]) => {
      const {
        name, tag, attributes, title, icon, shortcut, hint, command, marks, description,
      } = defaultOptions[type] ? { ...defaultOptions[type], ...options } : options;
      if (name && tag && attributes) {
        const arena = textarena.registerArena(
          {
            name,
            tag,
            attributes,
            hasText: true,
            nextArena: paragraph,
          },
          marks,
          [textarena.getRootArenaName()],
        ) as ArenaTextInterface;
        if (command) {
          textarena.registerCommand(
            command,
            (ta: Textarena, selection: ArenaSelection) => {
              let isApplied = true;
              utils.modelTree.runThroughSelection(
                selection,
                (node: AnyArenaNode) => {
                  isApplied = isApplied && node.arena === arena;
                },
              );
              return ta.applyArenaToSelection(selection, isApplied ? paragraph : arena);
            },
          );
          if (shortcut) {
            textarena.registerShortcut(
              shortcut,
              command,
              description,
            );
          }
          if (title && icon) {
            textarena.registerTool({
              name,
              title,
              icon,
              shortcut,
              hint,
              command,
              checkStatus: (node: AnyArenaNode): boolean =>
                node.arena === arena,
            });
          }
          if (title) {
            textarena.registerCreator({
              name,
              title,
              icon,
              shortcut,
              hint,
              command,
              canShow: (node: AnyArenaNode) =>
                textarena.isAllowedNode(node, arena),
            });
          }
        }
      }
    });
  },
});

export default headersPlugin;
