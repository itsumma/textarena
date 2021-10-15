import ArenaSelection from '../../helpers/ArenaSelection';
import { ArenaMediatorInterface, ArenaTextInterface } from '../../interfaces/Arena';
import { AnyArenaNode, ArenaNodeMediator } from '../../interfaces/ArenaNode';
import ArenaPlugin from '../../interfaces/ArenaPlugin';
import Textarena from '../../Textarena';
import ArenaTable from './ArenaTable';
import ArenaTd from './ArenaTd';
import ArenaTr from './ArenaTr';
import { tableOutput, tdOutput, trOutput } from './tableOutput';
import { TablePluginOptions } from './types';
import { initArena } from './initArena';
import { initCommand } from './initCommand';

export const defaultTableOptions: TablePluginOptions = {
  tableOptions: {
    name: 'table',
    tag: 'ARENA-TABLE',
    attributes: {},
    noPseudoCursor: true,
    output: tableOutput,
    marks: [
      {
        tag: 'ARENA-TABLE',
        attributes: [],
      },
      {
        tag: 'TABLE',
        attributes: [],
      },
    ],
    component: 'arena-table',
    componentConstructor: ArenaTable,
  },
  rowOptions: {
    name: 'table-tr',
    tag: 'ARENA-TR',
    attributes: {},
    noPseudoCursor: true,
    output: trOutput,
    marks: [
      {
        tag: 'TR',
        attributes: [],
      },
      {
        tag: 'ARENA-TR',
        attributes: [],
      },
    ],
    component: 'arena-tr',
    componentConstructor: ArenaTr,
  },
  cellOptions: {
    name: 'table-td',
    tag: 'ARENA-TD',
    attributes: {},
    noPseudoCursor: false,
    output: tdOutput,
    marks: [
      {
        tag: 'TD',
        attributes: [],
      },
      {
        tag: 'ARENA-TD',
        attributes: [],
      },
    ],
    component: 'arena-td',
    componentConstructor: ArenaTd,
  },
  commands: [
    {
      command: 'add-table',
      shortcut: 'Alt + Digit6',
      action: (ta: Textarena, selection: ArenaSelection): ArenaSelection => {
        const arena = ta.getArena('table') as ArenaMediatorInterface;
        if (arena) {
          const sel = ta.insertBeforeSelected(selection, arena);
          return sel;
        }
        return selection;
      },
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.06 13.69" fill="currentColor"><g ><g ><path d="M5.68,13.69h-5A.71.71,0,0,1,0,13V.71A.71.71,0,0,1,.71,0h5a.71.71,0,0,1,.71.71V13A.71.71,0,0,1,5.68,13.69ZM1.42,12.28H5V1.42H1.42Z"/><path d="M13.35,13.69h-5A.71.71,0,0,1,7.67,13V.71A.71.71,0,0,1,8.38,0h5a.71.71,0,0,1,.71.71V13A.71.71,0,0,1,13.35,13.69ZM9.09,12.28h3.55V1.42H9.09Z"/></g></g></svg>',
      hint: '6',
      title: 'Таблица',
      checkStatus: (node: AnyArenaNode): boolean => node.arena.name === 'table',
      canShow: (node: AnyArenaNode) =>
        node.arena.name === '__ROOT__',
    },
    {
      command: 'add-table-column-right',
      shortcut: 'Shift + Tab',
      action: (ta: Textarena, selection: ArenaSelection): ArenaSelection => {
        const model = ta.getModel();
        if (selection.isCollapsed()) {
          const tdArena = ta.getArena('table-td');
          const node = selection.startNode;
          const td = node.hasParent ? node.parent as ArenaNodeMediator : null;
          if (tdArena && td && td.arena === tdArena) {
            const newSelection = selection;
            const tr = td.parent as ArenaNodeMediator;
            const table = tr.parent as ArenaNodeMediator;
            const offset = td.getIndex() + 1;
            table.children.forEach((someTr) => {
              const newTd = model.createChildNode(tdArena) as ArenaNodeMediator;
              const cursor = model.getTextCursor(newTd, 0);
              (someTr as ArenaNodeMediator).insertNode(newTd, offset);
              if (someTr === tr && cursor) {
                newSelection.setBoth(cursor.node, cursor.offset);
              }
            });
            return newSelection;
          }
        }
        return selection;
      },
      // title: '+ колонку справа',
      // canShow: (node: AnyArenaNode) =>
      //   node.hasParent && node.parent.arena.name === 'table-td',
    },
    {
      command: 'add-table-row-bottom',
      shortcut: 'Shift + Enter',
      action: (ta: Textarena, selection: ArenaSelection): ArenaSelection => {
        const model = ta.getModel();
        if (selection.isCollapsed()) {
          const tdArena = ta.getArena('table-td') as ArenaMediatorInterface;
          const trArena = ta.getArena('table-tr') as ArenaMediatorInterface;
          const node = selection.startNode;
          const td = node.hasParent ? node.parent as ArenaNodeMediator : null;
          if (tdArena && td && td.arena === tdArena) {
            const newSelection = selection;
            const tr = td.parent as ArenaNodeMediator;
            const table = tr.parent as ArenaNodeMediator;

            const newTr = model.createChildNode(trArena) as ArenaNodeMediator;
            const offset = tr.getIndex() + 1;
            table.insertNode(newTr, offset);

            const amount = tr.children.length;
            for (let i = 0; i < amount; i += 1) {
              const newTd = model.createChildNode(tdArena) as ArenaNodeMediator;
              const cursor = model.getTextCursor(newTd, 0);
              newTr.insertNode(newTd);
              if (i === 0) {
                newSelection.setBoth(cursor.node, cursor.offset);
              }
            }
            return newSelection;
          }
        }
        return selection;
      },
      // title: '+ стркоу снизу',
      // canShow: (node: AnyArenaNode) =>
      //   node.hasParent && node.parent.arena.name === 'table-td',
    },
    {
      command: 'remove-table-column',
      shortcut: 'Ctrl + Backspace',
      action: (ta: Textarena, selection: ArenaSelection): ArenaSelection => {
        const model = ta.getModel();
        if (selection.isCollapsed()) {
          const tdArena = ta.getArena('table-td') as ArenaMediatorInterface;
          const node = selection.startNode;
          const td = node.hasParent ? node.parent as ArenaNodeMediator : null;
          if (tdArena && td && td.arena === tdArena) {
            const offset = td.getIndex();
            const newSelection = selection;
            const tr = td.parent as ArenaNodeMediator;
            const table = tr.parent as ArenaNodeMediator;
            table.children.forEach((someTr) => {
              (someTr as ArenaNodeMediator).removeChild(offset);
              if (someTr === tr) {
                const prevTd = (someTr as ArenaNodeMediator).getChild(
                  offset === 0 ? offset : offset - 1,
                );
                if (prevTd) {
                  const cursor = model.getTextCursor(prevTd, 0);
                  if (cursor) {
                    newSelection.setBoth(cursor.node, cursor.offset);
                  }
                }
              }
            });
            return newSelection;
          }
        }
        return selection;
      },
    },
    {
      command: 'remove-table-row',
      shortcut: 'Ctrl + Shift + Backspace',
      action: (ta: Textarena, selection: ArenaSelection): ArenaSelection => {
        const model = ta.getModel();
        if (selection.isCollapsed()) {
          const tdArena = ta.getArena('table-td') as ArenaMediatorInterface;
          const node = selection.startNode;
          const td = node.hasParent ? node.parent as ArenaNodeMediator : null;
          if (tdArena && td && td.arena === tdArena) {
            const newSelection = selection;
            const tr = td.parent as ArenaNodeMediator;
            const table = tr.parent as ArenaNodeMediator;

            const offset = tr.getIndex();
            const offsetColumn = td.getIndex();
            table.removeChild(offset);
            const prevTr = table.getChild(
              offset === 0 ? offset : offset - 1,
            ) as ArenaNodeMediator;
            if (prevTr) {
              const prevTd = prevTr.getChild(offsetColumn) as ArenaNodeMediator;
              if (prevTd) {
                const cursor = model.getTextCursor(prevTd, 0);
                if (cursor) {
                  newSelection.setBoth(cursor.node, cursor.offset);
                }
              }
            }
            return newSelection;
          }
        }
        return selection;
      },
    },
  ],
};

const tablePlugin = (opts?: Partial<TablePluginOptions>): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      tableOptions, rowOptions, cellOptions, commands,
    } = {
      ...defaultTableOptions,
      ...(opts || {}),
    };
    const paragraph = textarena.getDefaultTextArena() as ArenaTextInterface;
    if (!paragraph) {
      throw new Error('Default Arena for text not found');
    }
    const allowedArenas = textarena.getSimpleArenas();
    const tdArena = initArena(textarena, {
      ...cellOptions,
      allowedArenas,
      arenaForText: paragraph,
      parentArenas: [],
    });
    const trArena = initArena(textarena, {
      ...rowOptions,
      allowedArenas: [tdArena],
      arenaForText: tdArena,
      parentArenas: [],
    });
    initArena(textarena, {
      ...tableOptions,
      allowedArenas: [trArena],
      arenaForText: trArena,
      parentArenas: [textarena.getRootArenaName()],
    });

    commands.forEach((commandOptions) => initCommand(textarena, commandOptions));
  },
});

export default tablePlugin;
