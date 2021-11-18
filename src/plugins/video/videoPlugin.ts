import Textarena from '../../Textarena';
import ArenaSelection from '../../helpers/ArenaSelection';
import ArenaPlugin from '../../interfaces/ArenaPlugin';
import { ArenaSingleInterface } from '../../interfaces/Arena';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import { izoUpload } from './izoUpload';
import { VideoPluginOptions } from './types';
import ArenaVideo from './ArenaVideo';
import outputVideo from './outputVideo';
import { UploadProcessor } from '../image/types';

const defaultOptions: VideoPluginOptions = {
  name: 'video',
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="4 4 16 16">
      <g>
        <path d="M8 4h8v1.997h2V4c1.105 0 2 .896 2 2v12c0 1.104-.895 2-2 2v-2.003h-2V20H8v-2.003H6V20c-1.105 0-2-.895-2-2V6c0-1.105.895-2 2-2v1.997h2V4zm2 11l4.5-3L10 9v6zm8 .997v-3h-2v3h2zm0-5v-3h-2v3h2zm-10 5v-3H6v3h2zm0-5v-3H6v3h2z" fill="currentColor"/>
      </g>
  </svg>`,
  title: 'Video',
  tag: 'ARENA-VIDEO',
  classes: 'video',
  attributes: {},
  allowedAttributes: ['src', 'type', 'classes'],
  command: 'add-video',
  shortcut: 'Ctrl + Alt + V',
  marks: [
    {
      tag: 'ARENA-VIDEO',
      attributes: [],
    },
    {
      tag: 'VIDEO',
      attributes: [],
    },
  ],
  component: 'arena-video',
  componentConstructor: ArenaVideo,
  output: outputVideo,
};

const videoPlugin = (opts?: Partial<VideoPluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, allowedAttributes,
      shortcut, command, marks, component, componentConstructor,
      output, upload, izoConfig, classes,
    } = { ...defaultOptions, ...(opts || {}) };
    if (component && componentConstructor && !customElements.get(component)) {
      customElements.define(component, componentConstructor);
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
          ...attributes, upload: uploadFunc, classes,
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
          const { node: textNode } = selection.getCursor();
          const replace = textNode.hasText && textNode.getText().getText().length === 0;
          const [sel] = ta.insertBeforeSelected(selection, arena, replace);
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
    textarena.registerMiddleware(
      (
        ta: Textarena,
        selection: ArenaSelection,
        data: string | DataTransfer,
      ): [boolean, ArenaSelection] => {
        if (typeof data === 'object') {
          const types: string[] = [...data.types || []];
          if (types.includes('Files') && data.items.length) {
            const file = data.files[0];
            if (file && /video\/(?:mp4)/.test(file.type)) {
              const video = textarena.getArena('video') as ArenaSingleInterface;
              const uploadProcessor = video?.getAttribute('upload') as UploadProcessor;
              if (uploadProcessor) {
                const { node: textNode } = selection.getCursor();
                const replace = textNode.hasText && textNode.getText().getText().length === 0;
                const [sel, node] = ta.insertBeforeSelected(selection, arena, replace);
                if (node) {
                  uploadProcessor(file).then(({ src, mime }) => {
                    if (src) {
                      node.setAttribute('src', src);
                      node.setAttribute('type', mime);
                      const currentSelection = ta.getCurrentSelection();
                      if (currentSelection) {
                        const history = ta.getHistory();
                        history.save(currentSelection);
                      }
                      textarena.fire('modelChanged', {
                        selection: sel,
                      });
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

export default videoPlugin;
