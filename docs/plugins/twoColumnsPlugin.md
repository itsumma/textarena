# twoColumnsPlugin
The twoColumnsPlugin registers a two cloumn block. Inside each column you can add other elements of the Textarena.

A default plugin configuration object is passed to the plugin method parameter. You can view all the properties at [the table of default plugin options](../plugins.md#default-plugin-options).

The plugin registers own:  
Creator | Tool
--- | ---
yes | yes

This plugin has the following common default options: 
```js
{
  name: 'two-columns',
  icon: '/*svg tag*/',
  title: 'Two columns',
  tag: 'ARENA-TWO-COLUMNS',
  attributes: {},
  command: 'add-two-columns',
  shortcut: 'Alt + Digit5',
  hint: '5',
  component: 'arena-two-columns',
  componentConstructor: ArenaTwoColumns,
  marks: [
    {
      tag: 'ARENA-TWO-COLUMNS',
      attributes: [],
    },
    {
      tag: 'DIV',
      attributes: ['class="arena-two-col"'],
    },
  ],
  output: twoColumnsOutput,
}
```

**[Return to plugins list.](../plugins.md#list-of-standard-plugins)**