import Textarena from '../../Textarena';
import ArenaPlugin from '../../interfaces/ArenaPlugin';
import { ArenaInlineInterface } from '../../interfaces/Arena';
import ElementHelper from '../../helpers/ElementHelper';
import ArenaLinkbar from './ArenaLinkbar';
import linkManage from './linkManage';
import { LinkPluginOptions } from './types';
import linkCommand from './linkCommand';
import ArenaSelection from '../../helpers/ArenaSelection';
import LinkModal from './LinkModal';

const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=;]*)$/;
const htmlUrlPattern = /^<a[ _-a-zA-Z0-9="\\]* href="(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=;]*))"(?: [ _-a-zA-Z0-9="\\]*)?>.*< ?\/a>$/;

const defaultOptions: LinkPluginOptions = {
  name: 'link',
  icon: `<svg width="20px" height="10px" viewBox="0 0 20 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="Rounded" transform="translate(-748.000000, -2065.000000)">
          <g id="Editor" transform="translate(100.000000, 1960.000000)">
              <g id="-Round-/-Editor-/-insert_link" transform="translate(646.000000, 98.000000)">
                  <g>
                      <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                      <path d="M3.96,11.38 C4.24,9.91 5.62,8.9 7.12,8.9 L10.05,8.9 C10.57,8.9 11,8.47 11,7.95 C11,7.43 10.57,7 10.05,7 L7.22,7 C4.61,7 2.28,8.91 2.03,11.51 C1.74,14.49 4.08,17 7,17 L10.05,17 C10.57,17 11,16.57 11,16.05 C11,15.53 10.57,15.1 10.05,15.1 L7,15.1 C5.09,15.1 3.58,13.36 3.96,11.38 Z M9,13 L15,13 C15.55,13 16,12.55 16,12 C16,11.45 15.55,11 15,11 L9,11 C8.45,11 8,11.45 8,12 C8,12.55 8.45,13 9,13 Z M16.78,7 L13.95,7 C13.43,7 13,7.43 13,7.95 C13,8.47 13.43,8.9 13.95,8.9 L16.88,8.9 C18.38,8.9 19.76,9.91 20.04,11.38 C20.42,13.36 18.91,15.1 17,15.1 L13.95,15.1 C13.43,15.1 13,15.53 13,16.05 C13,16.57 13.43,17 13.95,17 L17,17 C19.92,17 22.26,14.49 21.98,11.51 C21.73,8.91 19.39,7 16.78,7 Z" id="🔹-Icon-Color" fill="currentColor"></path>
                  </g>
              </g>
          </g>
      </g>
  </g>
</svg>`,
  title: 'Link',
  tag: 'A',
  attributes: {
  },
  allowedAttributes: ['href', 'target'],
  shortcut: 'Ctrl + K',
  command: 'add-link',
  commandFunction: linkCommand,
  component: 'arena-linkbar',
  componentConstructor: ArenaLinkbar,
  marks: [
    {
      tag: 'A',
      attributes: [],
    },
  ],
  moveCursorHandler: linkManage,
};

const linkPlugin = (opts?: Partial<LinkPluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, allowedAttributes, shortcut,
      command, commandFunction,
      component, componentConstructor, moveCursorHandler, marks,
    } = { ...defaultOptions, ...(opts || {}) };
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        allowedAttributes,
        inline: true,
      },
      marks,
    ) as ArenaInlineInterface;
    let linkModal: ElementHelper | undefined;
    if (component && componentConstructor) {
      if (!customElements.get(component)) {
        customElements.define(component, componentConstructor);
        customElements.define('arena-link-modal', LinkModal);
      }
      const linkbar = new ElementHelper(component, 'textarena-linkbar');
      linkModal = new ElementHelper('arena-link-modal', 'textarena-link-modal');
      linkbar.setProperty('textarena', textarena);
      linkbar.setProperty('linkModal', linkModal);
      linkModal.setProperty('textarena', textarena);
      linkbar.setProperty('commandName', command);
      const container = textarena.getContainerElement();
      container.appendChild(linkbar);
      container.appendChild(linkModal);
      textarena.subscribe('moveCursor', () => {
        moveCursorHandler(textarena, arena, linkbar);
      });
    }
    if (command) {
      textarena.registerCommand(
        command,
        commandFunction(arena, linkModal),
      );
      if (shortcut) {
        textarena.registerShortcut(
          shortcut,
          command,
        );
      }
      if (icon && title) {
        textarena.registerTool({
          name,
          icon,
          title,
          command,
          shortcut,
        });
      }
    }
    // TODO register middleware for all text arenas after init all plugins
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    textarena.registerMiddleware(
      (
        ta: Textarena,
        sel: ArenaSelection,
        data: string | DataTransfer,
      ) => {
        const text = typeof data === 'string' ? data : data.getData('text/plain');
        if (text && sel.isSameNode() && !sel.isCollapsed() && sel.getCursor().node.hasText) {
          const trimmed = text.trim();
          let href = '';
          if (urlPattern.test(trimmed)) {
            href = trimmed;
          }
          const match = trimmed.match(htmlUrlPattern);
          if (match) {
            [, href] = match;
          }
          if (href) {
            const newSel = sel.clone();
            newSel.trim();
            const node = ta.addInlineNode(newSel, arena);
            if (node) {
              node.setAttribute('href', href);
              node.setAttribute('target', '_blank');
              newSel.collapse();
              return [true, newSel];
            }
          }
        }
        return [false, sel];
      },
      'before',
    );
  },
});

export default linkPlugin;
