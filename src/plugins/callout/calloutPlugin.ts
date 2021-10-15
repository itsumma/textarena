import Textarena from '../../Textarena';
import ArenaSelection from '../../helpers/ArenaSelection';
import ArenaPlugin, { DefaulPluginOptions } from '../../interfaces/ArenaPlugin';
import { ArenaMediatorInterface, ArenaTextInterface } from '../../interfaces/Arena';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import defaultOutputCallout from './defaultOutputCallout';
import ArenaCallout from './ArenaCallout';

const defaultOptions: DefaulPluginOptions = {
  name: 'callout',
  title: 'Внимание',
  tag: 'ARENA-CALLOUT',
  attributes: {},
  // shortcut: 'Alt + KeyC',
  // hint: 'c',
  command: 'add-callout',
  component: 'arena-callout',
  componentConstructor: ArenaCallout,
  marks: [
    {
      tag: 'ARENA-CALLOUT',
      attributes: [],
    },
  ],
  output: defaultOutputCallout,
};

const calloutPlugin = (opts?: Partial<DefaulPluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, shortcut, hint, command,
      component, componentConstructor, marks, output,
    } = { ...defaultOptions, ...(opts || {}) };
    if (component && componentConstructor && !customElements.get(component)) {
      customElements.define(component, componentConstructor);
    }
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const allowedArenas = textarena.getSimpleArenas();
    const calloutBodyContainer = textarena.registerArena(
      {
        name: 'callout-body-container',
        tag: 'ARENA-CALLOUT-BODY',
        attributes: {
          slot: 'body',
        },
        hasChildren: true,
        allowedArenas,
        arenaForText: paragraph as ArenaTextInterface,
      },
      [
        {
          tag: 'ARENA-CALLOUT-BODY',
          attributes: [],
        },
      ],
      [],
    ) as ArenaMediatorInterface;
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        protectedChildren: [
          paragraph,
          calloutBodyContainer,
        ],
        arenaForText: calloutBodyContainer,
        output,
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaMediatorInterface;
    if (command) {
      textarena.registerCommand(
        command,
        (ta: Textarena, selection: ArenaSelection) => {
          const sel = ta.applyArenaToSelection(selection, arena);
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
  },
});

export default calloutPlugin;
