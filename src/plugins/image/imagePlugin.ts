import { ArenaSelection } from '../../helpers';
import { AnyArenaNode, ArenaPlugin, ArenaSingleInterface } from '../../interfaces';
import Textarena from '../../Textarena';
import { ArenaImage } from './ArenaImage';
import { izoUpload } from './izoUpload';
import { outputImage } from './outputImage';
import { ImagePluginOptions } from './types';

export const prepareImageSrc = (src: string, width?: number, height?: number): string => {
  if (!width && !height) {
    return src;
  }
  const arr = src.split('.');
  if (arr.length < 2) {
    return src;
  }
  const arr2 = arr[arr.length - 2].split('_');
  const [name] = arr2;
  arr[arr.length - 2] = `${name}_${width}_${height}`;
  return arr.join('.');
};

const defaultOptions: ImagePluginOptions = {
  name: 'image',
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
  title: 'Image',
  tag: 'ARENA-IMAGE',
  attributes: {},
  allowedAttributes: ['src', 'width', 'height', 'alt'],
  command: 'add-image',
  marks: [
    {
      tag: 'ARENA-IMAGE',
      attributes: [],
    },
    {
      tag: 'IMG',
      attributes: [],
    },
  ],
  component: 'arena-image',
  componentConstructor: ArenaImage,
  prepareSrc: prepareImageSrc,
  output: outputImage,
};

export const imagePlugin = (opts?: Partial<ImagePluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, allowedAttributes,
      shortcut, command, marks, component, componentConstructor,
      srcset, prepareSrc, output, upload, izoConfig,
    } = { ...defaultOptions, ...(opts || {}) };
    if (component && componentConstructor && !customElements.get(component)) {
      customElements.define(component, componentConstructor);
    }
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    let uploadFunc = upload;
    if (izoConfig) {
      uploadFunc = izoUpload(izoConfig);
    }
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes: {
          ...attributes, srcset, prepareSrc, upload: uploadFunc,
        },
        allowedAttributes,
        single: true,
        output,
      },
      marks,
      [textarena.getRootArenaName()],
    ) as ArenaSingleInterface;

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
          icon,
          title,
          shortcut,
          command,
          canShow: (node: AnyArenaNode) =>
            textarena.isAllowedNode(node, arena),
        });
      }
    }
  },
});
