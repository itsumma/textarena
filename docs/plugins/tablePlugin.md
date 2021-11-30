# tablePlugin
The tablePlugin registers table element.

A table plugin configuration object is passed to the plugin method parameter. This object consist of the following properties:
* tableOptions
* rowOptions
* cellOptions
* commands

Properties `tableOptions`, `rowOptions` and `cellOptions` are objects that have [the default plugin options](../plugins.md#default-plugin-options).

The `commands` property is an array of objects. Each object has the following properties:

Property | Description
--- | ---
command | String with the command identifier, which will also be saved in the history and displayed in the logs. Must be unique. Required property.
action | The function that is triggered when the command is called. It receives `Textarena` and `ArenaSelection` objects with which it is possible to interact with Textarena elements. This function returns `ArenaSelection` or `boolean` or `Promise<ArenaSelection>`.
shortcut | String with keyboard shortcut that you can use call the command.
icon | HTML that defines how the element will be displayed in the bars.
<!-- checkStatus | 
canShow |  -->

The plugin registers own:  
Creator | Tool
--- | ---
no | no

This plugin has the following common default options: 
```js
{
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
      shortcut: 'Ctrl + Alt + T',
      action: (ta: Textarena, selection: ArenaSelection): ArenaSelection => {
        const arena = ta.getArena('table') as ArenaMediatorInterface;
        if (arena) {
          const [sel] = ta.insertBeforeSelected(selection, arena);
          return sel;
        }
        return selection;
      },
      icon: '/*svg tag*/',
      title: 'Таблица',
      checkStatus: (node: AnyArenaNode): boolean => node.arena.name === 'table',
      canShow: (node: AnyArenaNode) =>
        node.arena.name === '__ROOT__',
    },
    {
      command: 'add-table-column-right',
      shortcut: 'Shift + Tab',
      action: (ta: Textarena, selection: ArenaSelection): ArenaSelection => {
        // function code
      },
    },
    {
      command: 'add-table-row-bottom',
      shortcut: 'Shift + Enter',
      action: (ta: Textarena, selection: ArenaSelection): ArenaSelection => {
        // function code
      },
    },
    {
      command: 'remove-table-column',
      shortcut: 'Ctrl + Backspace',
      action: (ta: Textarena, selection: ArenaSelection): ArenaSelection => {
        // function code
      },
    },
    {
      command: 'remove-table-row',
      shortcut: 'Ctrl + Shift + Backspace',
      action: (ta: Textarena, selection: ArenaSelection): ArenaSelection => {
        // function code
      },
    },
  ],
}
```

**[Return to plugins list.](../plugins.md#list-of-standard-plugins)**