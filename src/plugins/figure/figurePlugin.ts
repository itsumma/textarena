import Textarena from '../../Textarena';
import ArenaSelection from '../../helpers/ArenaSelection';
import ArenaPlugin from '../../interfaces/ArenaPlugin';
import { ArenaMediatorInterface, ArenaSingleInterface, ArenaTextInterface } from '../../interfaces/Arena';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import ArenaFigure from './ArenaFigure';
import outputFigure from './outputFigure';
import { FigurePluginOptions } from './types';
import ArenaSingle from '../../arenas/ArenaSingle';
import { UploadProcessor } from '../image/types';

const defaultOptions: FigurePluginOptions = {
  name: 'figure',
  icon: `<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Rounded" transform="translate(-851.000000, -2061.000000)">
            <g id="Editor" transform="translate(100.000000, 1960.000000)">
                <g id="-Round-/-Editor-/-nsert_photo" transform="translate(748.000000, 98.000000)">
                    <g>
                        <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                        <path d="M21,19 L21,5 C21,3.9 20.1,3 19,3 L5,3 C3.9,3 3,3.9 3,5 L3,19 C3,20.1 3.9,21 5,21 L19,21 C20.1,21 21,20.1 21,19 Z M8.9,13.98 L11,16.51 L14.1,12.52 C14.3,12.26 14.7,12.26 14.9,12.53 L18.41,17.21 C18.66,17.54 18.42,18.01 18.01,18.01 L6.02,18.01 C5.6,18.01 5.37,17.53 5.63,17.2 L8.12,14 C8.31,13.74 8.69,13.73 8.9,13.98 Z" id="🔹-Icon-Color" fill="currentColor"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`,
  title: 'Image with caption',
  tag: 'ARENA-FIGURE',
  attributes: {},
  allowedAttributes: ['src', 'width', 'height', 'class'],
  shortcut: 'Alt + KeyI',
  hint: 'i',
  command: 'add-figure',
  marks: [
    {
      tag: 'ARENA-FIGURE',
      attributes: [],
    },
    {
      tag: 'FIGURE',
      attributes: [],
    },
  ],
  component: 'arena-figure',
  componentConstructor: ArenaFigure,
  placeholder: '',
};

const figurePlugin = (opts?: Partial<FigurePluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, allowedAttributes, classes, shortcut, hint,
      command, marks, component, componentConstructor, srcset, placeholder,
    } = { ...defaultOptions, ...(opts || {}) };
    if (component && componentConstructor && !customElements.get(component)) {
      customElements.define(component, componentConstructor);
    }
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const imageArena = textarena.getArena('image') as ArenaSingle;
    if (!imageArena) {
      throw new Error('Image Arena not found');
    }
    const imageCaptionParagraph = textarena.registerArena(
      {
        name: 'image-caption-paragraph',
        tag: 'FIGCAPTION',
        attributes: {
          slot: 'image-caption',
        },
        hasText: true,
        nextArena: paragraph,
      },
      [
        {
          tag: 'FIGCAPTION',
          attributes: [
          ],
        },
      ],
      [],
    ) as ArenaTextInterface;
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes: { ...attributes, classes },
        allowedAttributes,
        hasChildren: true,
        protectedChildren: [
          [imageArena, { slot: 'image', srcset }, ''],
          [imageCaptionParagraph, {}, placeholder],
        ],
        arenaForText: imageCaptionParagraph,
        output: outputFigure,
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaMediatorInterface;
    textarena.addSimpleArenas(arena);
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
        );
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
    textarena.registerMiddleware(
      (
        ta: Textarena,
        selection: ArenaSelection,
        data: string | DataTransfer,
      ): [boolean, ArenaSelection] => {
        if (typeof data === 'object') {
          const types: string[] = [...data.types || []];
          if (types.includes('Files')) {
            const file = data.files[0];
            if (file) {
              const image = textarena.getArena('image') as ArenaSingleInterface;
              const upload = image?.getAttribute('upload') as UploadProcessor;
              if (upload) {
                const [sel, node] = ta.insertBeforeSelected(selection, arena);
                if (node) {
                  upload(file).then(({ src }) => {
                    if (src && node?.hasChildren) {
                      const imageNode = node.getChild(0);
                      if (imageNode) {
                        imageNode?.setAttribute('src', src);
                        const currentSelection = ta.getCurrentSelection();
                        if (currentSelection) {
                          const history = ta.getHistory();
                          history.save(currentSelection);
                        }
                        textarena.fire('modelChanged', {
                          selection: sel,
                        });
                      }
                    }
                  });
                }
                return [true, sel];
              }
            }
          }
        }
        return [false, selection];
      },
      'before',
    );
  },
});

export default figurePlugin;
