import { ArenaSelection } from '../../helpers';
import { AnyArenaNode, ArenaMediatorInterface, ArenaPlugin } from '../../interfaces';
import Textarena from '../../Textarena';
import utils from '../../utils';
import { ArenaContents } from './ArenaContents';
import { contentsProcessor } from './contentsProcessor';
import { outputContents } from './outputContents';
import { ContentsOptions } from './types';

const defaultOptions: ContentsOptions = {
  name: 'contents',
  title: 'Contents',
  tag: 'ARENA-CONTENTS',
  attributes: {},
  allowedAttributes: ['list'],
  shortcut: 'Ctrl + Alt + C',
  command: 'add-contents',
  component: 'arena-contents',
  componentConstructor: ArenaContents,
  description: 'Contents',
  marks: [
    {
      tag: 'ARENA-CONTENTS',
      attributes: [],
    },
  ],
  output: outputContents,
  processor: contentsProcessor,
};

export const contentsPlugin = (opts?: Partial<ContentsOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, allowedAttributes, shortcut, command,
      component, componentConstructor, marks, output, processor, description,
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
          const [sel] = ta.insertBeforeSelected(selection, arena);
          return sel;
        },
      );
      if (shortcut) {
        textarena.registerShortcut(
          shortcut,
          command,
          description,
        );
      }
      if (title) {
        textarena.registerCreator({
          name,
          icon,
          title,
          shortcut,
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
