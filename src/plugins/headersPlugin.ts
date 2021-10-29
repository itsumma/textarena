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
    allowedAttributes: ['id'],
    title: 'Header 2',
    icon: '<b>H2</b>',
    command: 'convert-to-header2',
    shortcut: 'Ctrl + Alt + 2',
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
    allowedAttributes: ['id'],
    title: 'Header 3',
    icon: '<b>H3</b>',
    command: 'convert-to-header3',
    shortcut: 'Ctrl + Alt + 3',
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
    allowedAttributes: ['id'],
    title: 'Header 4',
    icon: '<b>H4</b>',
    command: 'convert-to-header4',
    shortcut: 'Ctrl + Alt + 4',
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
        name, tag, attributes, allowedAttributes, title,
        icon, shortcut, hint, command, marks, description,
      } = defaultOptions[type] ? { ...defaultOptions[type], ...options } : options;
      if (name && tag && attributes) {
        const arena = textarena.registerArena(
          {
            name,
            tag,
            attributes,
            allowedAttributes,
            hasText: true,
            nextArena: paragraph,
          },
          marks,
          [textarena.getRootArenaName()],
        ) as ArenaTextInterface;
        textarena.addSimpleArenas(arena);
        textarena.registerMiddleware(
          (ta: Textarena, selection: ArenaSelection) => {
            if (selection.isCollapsed()) {
              const cursor = selection.getCursor();
              if (cursor.node.hasText) {
                const text = cursor.node.getRawText();
                const slug = utils.str.prepareForAttribute(text.toLowerCase().trim());
                cursor.node.setAttribute('id', slug);
              }
            }
            return [false, selection];
          },
          'after',
          arena,
        );
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
              const newSelection = ta.applyArenaToSelection(
                selection,
                isApplied ? paragraph : arena,
              );
              utils.modelTree.runThroughSelection(
                newSelection,
                (n: AnyArenaNode) => {
                  if (n.hasText && n.arena.name.substr(0, n.arena.name.length - 1) === 'header') {
                    let slug = n.getAttribute('id');
                    if (!slug && n.arena.allowedAttributes.includes('id')) {
                      const text = n.getRawText();
                      slug = utils.str.prepareForAttribute(text.toLowerCase().trim());
                      n.setAttribute('id', slug);
                    }
                  }
                },
              );
              return newSelection;
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
