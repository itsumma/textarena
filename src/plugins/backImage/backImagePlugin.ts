import ArenaSelection from '../../helpers/ArenaSelection';
import { ArenaMediatorInterface, ArenaSingleInterface, ArenaTextInterface } from '../../interfaces/Arena';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import ArenaPlugin from '../../interfaces/ArenaPlugin';
import Textarena from '../../Textarena';
import { izoUpload } from '../image/izoUpload';
import ArenaBackImage from './ArenaBackImage';
import backImageOutput from './backImageOutput';
import { BackImagePluginOptions } from './types';

const defaultOptions: BackImagePluginOptions = {
  name: 'back-image',
  title: 'Картинка фоном',
  tag: 'ARENA-BACK-IMAGE',
  attributes: {},
  allowedAttributes: ['src'],
  command: 'add-back-image',
  component: 'arena-back-image',
  componentConstructor: ArenaBackImage,
  marks: [
    {
      tag: 'ARENA-BACK-IMAGE',
      attributes: [],
    },
    {
      tag: 'DIV',
      attributes: ['class="arena-back-image"'],
    },
  ],
  output: backImageOutput,
};

const backImagePlugin = (opts?: Partial<BackImagePluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, shortcut, hint, command,
      component, componentConstructor, marks, output, allowedAttributes,
      srcset, prepareSrc, upload, izoConfig,
    } = {
      ...defaultOptions,
      ...(opts || {}),
    };
    if (component && componentConstructor && !customElements.get(component)) {
      customElements.define(component, componentConstructor);
    }
    const paragraph = textarena.getDefaultTextArena() as ArenaTextInterface;
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const image = textarena.getArena('image') as ArenaSingleInterface;
    let uploadFunc = (image ? image.getAttribute('upload') : undefined) || upload;
    if (izoConfig) {
      uploadFunc = izoUpload(izoConfig);
    }
    const allowedArenas = textarena.getSimpleArenas();
    const middleArenas = textarena.getMiddleArenas();
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes: {
          ...attributes,
          srcset: (image ? image.getAttribute('srcset') : undefined) || srcset,
          prepareSrc: (image ? image.getAttribute('prepareSrc') : undefined) || prepareSrc,
          upload: uploadFunc,
        },
        allowedAttributes,
        allowedArenas,
        group: true,
        arenaForText: paragraph as ArenaTextInterface,
        output,
      },
      marks,
      [textarena.getRootArenaName(), ...middleArenas.map((a) => a.name)],
    ) as ArenaMediatorInterface;

    if (command) {
      textarena.registerCommand(command, (ta: Textarena, selection: ArenaSelection) => {
        const sel = ta.insertBeforeSelected(selection, arena);
        return sel;
      });
      if (shortcut) {
        textarena.registerShortcut(
          shortcut,
          command,
        );
      }
      if (title) {
        if (icon) {
          textarena.registerTool({
            name,
            title,
            icon,
            shortcut,
            hint,
            command,
            checkStatus: (node: AnyArenaNode):
              boolean => node.arena === arena,
          });
        }
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

export default backImagePlugin;
