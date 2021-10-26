import Textarena from '../../Textarena';
import ArenaSelection from '../../helpers/ArenaSelection';
import ArenaPlugin from '../../interfaces/ArenaPlugin';
import { ArenaMediatorInterface } from '../../interfaces/Arena';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import outputContents from './outputContents';
import ArenaContents from './ArenaContents';
import contentsProcessor from './contentsProcessor';
import { ContentsOptions } from './types';
import utils from '../../utils';

const defaultOptions: ContentsOptions = {
  name: 'contents',
  title: 'Содержание',
  tag: 'ARENA-CONTENTS',
  attributes: {},
  allowedAttributes: ['list'],
  shortcut: 'Alt + KeyU',
  hint: 'u',
  command: 'add-contents',
  component: 'arena-contents',
  componentConstructor: ArenaContents,
  marks: [
    {
      tag: 'ARENA-CONTENTS',
      attributes: [],
    },
  ],
  output: outputContents,
  processor: contentsProcessor,
};

const contentsPlugin = (opts?: Partial<ContentsOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, allowedAttributes, shortcut, hint, command,
      component, componentConstructor, marks, output, processor,
    } = { ...defaultOptions, ...(opts || {}) };
    if (component && componentConstructor && !customElements.get(component)) {
      customElements.define(component, componentConstructor);
    }
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes: {
          ...attributes,
          processor: (node: AnyArenaNode) => processor(textarena, node),
        },
        allowedAttributes,
        single: true,
        output,
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaMediatorInterface;
    if (command) {
      textarena.registerCommand(
        command,
        (ta: Textarena, selection: ArenaSelection) => {
          const sel = ta.insertBeforeSelected(selection, arena);
          return sel;
        },
      );
      if (shortcut) {
        textarena.registerShortcut(
          shortcut,
          command,
        );
      }
      if (title) {
        textarena.registerCreator({
          name,
          icon,
          title,
          shortcut,
          hint,
          command,
          canShow: (node: AnyArenaNode) =>
            textarena.isAllowedNode(node, arena),
        });
      }
    }
    const updateAllContents = () => {
      utils.modelTree.runOfChildren(textarena.getRootModel(), (n: AnyArenaNode) => {
        if (n.arena === arena) {
          contentsProcessor(textarena, n);
        }
      });
    };
    textarena.subscribe('ready', updateAllContents);
    textarena.subscribe('modelChanged', updateAllContents);
  },
});

export default contentsPlugin;
