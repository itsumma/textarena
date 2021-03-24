import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaCursorText from '../interfaces/ArenaCursorText';
import { ArenaMediatorInterface, ArenaTextInterface } from '../interfaces/Arena';
import { ArenaNodeText, ChildArenaNode } from '../interfaces/ArenaNode';

// Icons https://freeicons.io/icon-list/material-icons-editor-2

type ListOptions = {
  name: string,
  tag: string,
  attributes: string[],
  title: string,
  icon: string;
  shortcut: string,
  command: string,
  hint: string,
  pattern: RegExp,
};

type ListsOptions = {
  item: {
    name: string,
    tag: string,
    attributes: string[],
  },
  lists: ListOptions[],
};

const defaultOptions: ListsOptions = {
  item: {
    name: 'li',
    tag: 'LI',
    attributes: [],
  },
  lists: [
    {
      name: 'unordered-list',
      tag: 'UL',
      attributes: [],
      title: 'List',
      icon: `<svg width="19px" height="16px" viewBox="0 0 19 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Rounded" transform="translate(-612.000000, -2106.000000)">
              <g id="Editor" transform="translate(100.000000, 1960.000000)">
                  <g id="-Round-/-Editor-/-format_list_bulleted" transform="translate(510.000000, 142.000000)">
                      <g>
                          <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                          <path d="M4,10.5 C3.17,10.5 2.5,11.17 2.5,12 C2.5,12.83 3.17,13.5 4,13.5 C4.83,13.5 5.5,12.83 5.5,12 C5.5,11.17 4.83,10.5 4,10.5 Z M4,4.5 C3.17,4.5 2.5,5.17 2.5,6 C2.5,6.83 3.17,7.5 4,7.5 C4.83,7.5 5.5,6.83 5.5,6 C5.5,5.17 4.83,4.5 4,4.5 Z M4,16.5 C3.17,16.5 2.5,17.18 2.5,18 C2.5,18.82 3.18,19.5 4,19.5 C4.82,19.5 5.5,18.82 5.5,18 C5.5,17.18 4.83,16.5 4,16.5 Z M8,19 L20,19 C20.55,19 21,18.55 21,18 C21,17.45 20.55,17 20,17 L8,17 C7.45,17 7,17.45 7,18 C7,18.55 7.45,19 8,19 Z M8,13 L20,13 C20.55,13 21,12.55 21,12 C21,11.45 20.55,11 20,11 L8,11 C7.45,11 7,11.45 7,12 C7,12.55 7.45,13 8,13 Z M7,6 C7,6.55 7.45,7 8,7 L20,7 C20.55,7 21,6.55 21,6 C21,5.45 20.55,5 20,5 L8,5 C7.45,5 7,5.45 7,6 Z" id="🔹-Icon-Color" fill="currentColor"></path>
                      </g>
                  </g>
              </g>
          </g>
      </g>
  </svg>`,
      shortcut: 'Alt + KeyL',
      command: 'convert-to-unordered-list',
      hint: 'l',
      pattern: /^(-\s+).*$/,
    },
    {
      name: 'ordered-list',
      tag: 'OL',
      attributes: [],
      title: 'Ordered list',
      icon: `<svg width="19px" height="16px" viewBox="0 0 19 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Rounded" transform="translate(-578.000000, -2106.000000)">
              <g id="Editor" transform="translate(100.000000, 1960.000000)">
                  <g id="-Round-/-Editor-/-format_list_numbered" transform="translate(476.000000, 142.000000)">
                      <g>
                          <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                          <path d="M8,7 L20,7 C20.55,7 21,6.55 21,6 C21,5.45 20.55,5 20,5 L8,5 C7.45,5 7,5.45 7,6 C7,6.55 7.45,7 8,7 Z M20,17 L8,17 C7.45,17 7,17.45 7,18 C7,18.55 7.45,19 8,19 L20,19 C20.55,19 21,18.55 21,18 C21,17.45 20.55,17 20,17 Z M20,11 L8,11 C7.45,11 7,11.45 7,12 C7,12.55 7.45,13 8,13 L20,13 C20.55,13 21,12.55 21,12 C21,11.45 20.55,11 20,11 Z M4.5,16 L2.5,16 C2.22,16 2,16.22 2,16.5 C2,16.78 2.22,17 2.5,17 L4,17 L4,17.5 L3.5,17.5 C3.22,17.5 3,17.72 3,18 C3,18.28 3.22,18.5 3.5,18.5 L4,18.5 L4,19 L2.5,19 C2.22,19 2,19.22 2,19.5 C2,19.78 2.22,20 2.5,20 L4.5,20 C4.78,20 5,19.78 5,19.5 L5,16.5 C5,16.22 4.78,16 4.5,16 Z M2.5,5 L3,5 L3,7.5 C3,7.78 3.22,8 3.5,8 C3.78,8 4,7.78 4,7.5 L4,4.5 C4,4.22 3.78,4 3.5,4 L2.5,4 C2.22,4 2,4.22 2,4.5 C2,4.78 2.22,5 2.5,5 Z M4.5,10 L2.5,10 C2.22,10 2,10.22 2,10.5 C2,10.78 2.22,11 2.5,11 L3.8,11 L2.12,12.96 C2.04,13.05 2,13.17 2,13.28 L2,13.5 C2,13.78 2.22,14 2.5,14 L4.5,14 C4.78,14 5,13.78 5,13.5 C5,13.22 4.78,13 4.5,13 L3.2,13 L4.88,11.04 C4.96,10.95 5,10.83 5,10.72 L5,10.5 C5,10.22 4.78,10 4.5,10 Z" id="🔹-Icon-Color" fill="currentColor"></path>
                      </g>
                  </g>
              </g>
          </g>
      </g>
  </svg>`,
      shortcut: 'Alt + KeyO',
      command: 'convert-to-ordered-list',
      hint: 'o',
      pattern: /^(\d+(?:\.|\))\s+).*$/,
    },
  ],
};

const listsPlugin = (opts?: ListsOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const paragraph = textarena.getDefaultTextArena();
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const {
      item,
      lists,
    } = { ...defaultOptions, ...(opts || {}) };
    const li = textarena.registerArena(
      {
        ...item,
        hasText: true,
        nextArena: undefined,
      },
      [
        {
          tag: item.tag,
          attributes: item.attributes,
        },
      ],
    ) as ArenaTextInterface;
    lists.forEach(({
      name,
      tag,
      attributes,
      title,
      icon,
      shortcut,
      command,
      hint,
      pattern,
    }) => {
      const listArena = textarena.registerArena(
        {
          name,
          tag,
          attributes,
          allowedArenas: [li],
          arenaForText: li,
          automerge: true,
          group: true,
        },
        [
          {
            tag,
            attributes,
          },
        ],
        [textarena.getRootArenaName()],
      ) as ArenaMediatorInterface;
      textarena.registerCommand(
        command,
        (ta: Textarena, selection: ArenaSelection) =>
          ta.applyArenaToSelection(selection, listArena),
      );
      textarena.registerShortcut(
        shortcut,
        command,
      );
      textarena.registerTool({
        name,
        title,
        icon,
        shortcut,
        command,
        hint,
        checkStatus: (node: ChildArenaNode):
          boolean => 'parent' in node && node.parent.arena === listArena,
      });
      textarena.registerCreator({
        name,
        title,
        icon,
        shortcut,
        command,
        hint,
        canShow: (node: ArenaNodeText) =>
          node.parent.arena.allowedArenas.includes(listArena),
      });
      if (paragraph.hasText) {
        paragraph.registerMiddleware((ta: Textarena, cursor: ArenaCursorText) => {
          const text = cursor.node.getRawText();
          const match = text.match(pattern);
          if (match) {
            const sel = new ArenaSelection(
              cursor.node,
              cursor.offset,
              cursor.node,
              cursor.offset,
              'forward',
            );
            const newSel = ta.applyArenaToSelection(sel, listArena);
            const cursor2 = newSel.getCursor();
            cursor2.node.cutText(0, match[1].length);
            cursor2.offset = 0;
            return cursor2;
          }
          return cursor;
        });
      }
      textarena.addSimpleArenas(listArena);
    });
  },
});

export default listsPlugin;
